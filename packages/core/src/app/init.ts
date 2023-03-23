import fs from 'fs/promises';
import http2 from 'http2';

import { appInsights } from '@logto/shared/app-insights';
import { toTitle, trySafe } from '@silverhand/essentials';
import chalk from 'chalk';
import type Koa from 'koa';

import { EnvSet } from '#src/env-set/index.js';
import { TenantNotFoundError, tenantPool } from '#src/tenants/index.js';
import { getTenantId } from '#src/utils/tenant.js';

const logListening = (type: 'core' | 'admin' = 'core') => {
  const urlSet = type === 'core' ? EnvSet.values.urlSet : EnvSet.values.adminUrlSet;

  for (const url of urlSet.deduplicated()) {
    console.log(chalk.bold(chalk.green(`${toTitle(type)} app is running at ${url.toString()}`)));
  }
};

const serverTimeout = 120_000;

export default async function initApp(app: Koa): Promise<void> {
  app.use(async (ctx, next) => {
    if (EnvSet.values.isDomainBasedMultiTenancy && ['/status', '/'].includes(ctx.URL.pathname)) {
      ctx.status = 204;

      return next();
    }

    const tenantId = getTenantId(ctx.URL);

    if (!tenantId) {
      ctx.status = 404;

      return next();
    }

    const tenant = await trySafe(tenantPool.get(tenantId), (error) => {
      ctx.status = error instanceof TenantNotFoundError ? 404 : 500;
      appInsights.trackException(error);
    });

    if (!tenant) {
      return next();
    }

    try {
      tenant.requestStart();
      await tenant.run(ctx, next);
      tenant.requestEnd();
    } catch (error: unknown) {
      tenant.requestEnd();
      appInsights.trackException(error);

      throw error;
    }
  });

  const { isHttpsEnabled, httpsCert, httpsKey, urlSet, adminUrlSet } = EnvSet.values;

  if (isHttpsEnabled && httpsCert && httpsKey) {
    const createHttp2Server = async () =>
      http2.createSecureServer(
        { cert: await fs.readFile(httpsCert), key: await fs.readFile(httpsKey) },
        app.callback()
      );

    const coreServer = await createHttp2Server();
    coreServer.listen(urlSet.port, () => {
      logListening();
    });
    coreServer.setTimeout(serverTimeout);

    // Create another server if admin localhost enabled
    if (!adminUrlSet.isLocalhostDisabled) {
      const adminServer = await createHttp2Server();
      adminServer.listen(adminUrlSet.port, () => {
        logListening('admin');
      });
      adminServer.setTimeout(serverTimeout);
    }

    return;
  }

  // Chrome doesn't allow insecure HTTP/2 servers, stick with HTTP for localhost.
  const coreServer = app.listen(urlSet.port, () => {
    logListening();
  });
  coreServer.setTimeout(serverTimeout);

  // Create another server if admin localhost enabled
  if (!adminUrlSet.isLocalhostDisabled) {
    const adminServer = app.listen(adminUrlSet.port, () => {
      logListening('admin');
    });
    adminServer.setTimeout(serverTimeout);
  }
}
