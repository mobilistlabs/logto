/* eslint-disable max-lines */
import { buildRawConnector } from '@logto/cli/lib/connector/index.js';
import type { ConnectorFactory } from '@logto/cli/lib/connector/index.js';
import type { SmsConnector, EmailConnector } from '@logto/connector-kit';
import { VerificationCodeType, validateConfig } from '@logto/connector-kit';
import { emailRegEx, phoneRegEx, buildIdGenerator } from '@logto/core-kit';
import { arbitraryObjectGuard, Connectors, ConnectorType } from '@logto/schemas';
import { demoConnectorIds } from '@logto/shared';
import cleanDeep from 'clean-deep';
import { string, object } from 'zod';

import RequestError from '#src/errors/RequestError/index.js';
import koaGuard from '#src/middleware/koa-guard.js';
import assertThat from '#src/utils/assert-that.js';
import {
  loadConnectorFactories,
  transpileConnectorFactory,
  transpileLogtoConnector,
} from '#src/utils/connectors/index.js';
import { checkSocialConnectorTargetAndPlatformUniqueness } from '#src/utils/connectors/platform.js';

import type { AuthedRouter, RouterInitArgs } from './types.js';

const generateConnectorId = buildIdGenerator(12);

export default function connectorRoutes<T extends AuthedRouter>(
  ...[router, { queries, connectors, libraries }]: RouterInitArgs<T>
) {
  const {
    findConnectorById,
    countConnectorByConnectorId,
    deleteConnectorById,
    deleteConnectorByIds,
    insertConnector,
    updateConnector,
  } = queries.connectors;
  const { getLogtoConnectorById, getLogtoConnectors } = connectors;
  const {
    signInExperiences: { removeUnavailableSocialConnectorTargets },
  } = libraries;

  router.get(
    '/connectors',
    koaGuard({
      query: object({
        target: string().optional(),
      }),
    }),
    async (ctx, next) => {
      const { target: filterTarget } = ctx.query;
      const connectors = await getLogtoConnectors();

      checkSocialConnectorTargetAndPlatformUniqueness(connectors);

      assertThat(
        connectors.filter((connector) => connector.type === ConnectorType.Email).length <= 1,
        'connector.more_than_one_email'
      );
      assertThat(
        connectors.filter((connector) => connector.type === ConnectorType.Sms).length <= 1,
        'connector.more_than_one_sms'
      );

      const filteredConnectors = filterTarget
        ? connectors.filter(({ metadata: { target } }) => target === filterTarget)
        : connectors;

      ctx.body = filteredConnectors.map((connector) => transpileLogtoConnector(connector));

      return next();
    }
  );

  router.get('/connector-factories', async (ctx, next) => {
    const connectorFactories = await loadConnectorFactories();
    ctx.body = connectorFactories.map((connectorFactory) =>
      transpileConnectorFactory(connectorFactory)
    );

    return next();
  });

  router.get(
    '/connector-factories/:id',
    koaGuard({ params: object({ id: string().min(1) }) }),
    async (ctx, next) => {
      const {
        params: { id },
      } = ctx.guard;
      const connectorFactories = await loadConnectorFactories();

      const connectorFactory = connectorFactories.find((factory) => factory.metadata.id === id);
      assertThat(connectorFactory, 'entity.not_found');

      ctx.body = transpileConnectorFactory(connectorFactory);

      return next();
    }
  );

  router.get(
    '/connectors/:id',
    koaGuard({ params: object({ id: string().min(1) }) }),
    async (ctx, next) => {
      const {
        params: { id },
      } = ctx.guard;
      const connector = await getLogtoConnectorById(id);

      // Hide demo connector
      assertThat(!demoConnectorIds.includes(connector.metadata.id), 'connector.not_found');

      ctx.body = transpileLogtoConnector(connector);

      return next();
    }
  );

  router.post(
    '/connectors',
    koaGuard({
      body: Connectors.createGuard
        .pick({
          config: true,
          connectorId: true,
          metadata: true,
          syncProfile: true,
        })
        .merge(Connectors.createGuard.pick({ id: true }).partial()), // `id` is optional
    }),
    async (ctx, next) => {
      const {
        body: { id: proposedId, connectorId, metadata, config, syncProfile },
      } = ctx.guard;

      const connectorFactories = await loadConnectorFactories();

      const connectorFactory = connectorFactories.find(
        ({ metadata: { id } }) => id === connectorId && !demoConnectorIds.includes(id)
      );

      if (!connectorFactory) {
        throw new RequestError({
          code: 'connector.not_found_with_connector_id',
          status: 422,
        });
      }

      assertThat(
        connectorFactory.metadata.isStandard !== true || Boolean(metadata?.target),
        'connector.should_specify_target'
      );
      assertThat(
        connectorFactory.metadata.isStandard === true || metadata === undefined,
        'connector.cannot_overwrite_metadata_for_non_standard_connector'
      );

      const { count } = await countConnectorByConnectorId(connectorId);
      assertThat(
        count === 0 || connectorFactory.metadata.isStandard === true,
        new RequestError({
          code: 'connector.multiple_instances_not_supported',
          status: 422,
        })
      );

      if (connectorFactory.type === ConnectorType.Social) {
        const connectors = await getLogtoConnectors();
        const duplicateConnector = connectors
          .filter(({ type }) => type === ConnectorType.Social)
          .find(
            ({ metadata: { target, platform } }) =>
              target ===
                (metadata ? cleanDeep(metadata).target : connectorFactory.metadata.target) &&
              platform === connectorFactory.metadata.platform
          );
        assertThat(
          !duplicateConnector,
          new RequestError(
            {
              code: 'connector.multiple_target_with_same_platform',
              status: 422,
            },
            {
              connectorId: duplicateConnector?.metadata.id,
              connectorName: duplicateConnector?.metadata.name,
            }
          )
        );
      }

      if (config) {
        const { rawConnector } = await buildRawConnector(connectorFactory);
        validateConfig(config, rawConnector.configGuard);
      }

      const insertConnectorId = proposedId ?? generateConnectorId();
      await insertConnector({
        id: insertConnectorId,
        connectorId,
        ...cleanDeep({ syncProfile, config, metadata }),
      });

      /**
       * We can have only one working email/sms connector:
       * once we insert a new one, old connectors with same type should be deleted.
       */
      if (
        connectorFactory.type === ConnectorType.Sms ||
        connectorFactory.type === ConnectorType.Email
      ) {
        const logtoConnectors = await getLogtoConnectors();
        const conflictingConnectorIds = logtoConnectors
          .filter(
            ({ dbEntry: { id }, type }) =>
              type === connectorFactory.type && id !== insertConnectorId
          )
          .map(({ dbEntry: { id } }) => id);

        if (conflictingConnectorIds.length > 0) {
          await deleteConnectorByIds(conflictingConnectorIds);
        }
      }

      const connector = await getLogtoConnectorById(insertConnectorId);
      ctx.body = transpileLogtoConnector(connector);

      return next();
    }
  );

  router.patch(
    '/connectors/:id',
    koaGuard({
      params: object({ id: string().min(1) }),
      body: Connectors.createGuard
        .pick({ config: true, metadata: true, syncProfile: true })
        .partial(),
    }),
    async (ctx, next) => {
      const {
        params: { id },
        body: { config, metadata, syncProfile },
      } = ctx.guard;

      const { type, validateConfig, metadata: originalMetadata } = await getLogtoConnectorById(id);

      // Cannot modify demo connector
      assertThat(!demoConnectorIds.includes(originalMetadata.id), 'connector.not_found');

      assertThat(
        originalMetadata.isStandard !== true ||
          !metadata ||
          metadata.target === originalMetadata.target,
        'connector.can_not_modify_target'
      );

      assertThat(
        originalMetadata.isStandard === true || !metadata,
        'connector.cannot_overwrite_metadata_for_non_standard_connector'
      );

      if (syncProfile) {
        assertThat(
          type === ConnectorType.Social,
          new RequestError({ code: 'connector.invalid_type_for_syncing_profile', status: 422 })
        );
      }

      if (config) {
        validateConfig(config);
      }

      await updateConnector({
        set: cleanDeep({ config, metadata, syncProfile }),
        where: { id },
        jsonbMode: 'replace',
      });
      const connector = await getLogtoConnectorById(id);
      ctx.body = transpileLogtoConnector(connector);

      return next();
    }
  );

  router.post(
    '/connectors/:factoryId/test',
    koaGuard({
      params: object({ factoryId: string().min(1) }),
      body: object({
        phone: string().regex(phoneRegEx).optional(),
        email: string().regex(emailRegEx).optional(),
        config: arbitraryObjectGuard,
      }),
    }),
    async (ctx, next) => {
      const {
        params: { factoryId },
        body,
      } = ctx.guard;
      const { phone, email, config } = body;

      const subject = phone ?? email;
      assertThat(subject, new RequestError({ code: 'guard.invalid_input' }));

      const connectorFactories = await loadConnectorFactories();
      const connectorFactory = connectorFactories
        .filter(
          (factory): factory is ConnectorFactory<SmsConnector> | ConnectorFactory<EmailConnector> =>
            factory.type === ConnectorType.Email || factory.type === ConnectorType.Sms
        )
        .find(({ metadata: { id } }) => id === factoryId && !demoConnectorIds.includes(id));
      const expectType = phone ? ConnectorType.Sms : ConnectorType.Email;

      assertThat(
        connectorFactory,
        new RequestError({
          code: 'connector.not_found',
          type: expectType,
          factoryId,
        })
      );

      assertThat(connectorFactory.type === expectType, 'connector.unexpected_type');

      const {
        rawConnector: { sendMessage },
      } = await buildRawConnector<SmsConnector | EmailConnector>(connectorFactory);

      await sendMessage(
        {
          to: subject,
          type: VerificationCodeType.Generic,
          payload: {
            code: '000000',
          },
        },
        config
      );

      ctx.status = 204;

      return next();
    }
  );

  router.delete(
    '/connectors/:id',
    koaGuard({ params: object({ id: string().min(1) }) }),
    async (ctx, next) => {
      const {
        params: { id },
      } = ctx.guard;

      const { connectorId } = await findConnectorById(id);
      const connectorFactories = await loadConnectorFactories();

      const connectorFactory = connectorFactories.find(
        ({ metadata }) => metadata.id === connectorId
      );

      await deleteConnectorById(id);

      if (connectorFactory?.type === ConnectorType.Social) {
        await removeUnavailableSocialConnectorTargets();
      }

      ctx.status = 204;

      return next();
    }
  );
}
/* eslint-enable max-lines */
