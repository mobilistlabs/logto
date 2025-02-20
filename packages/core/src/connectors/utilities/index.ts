import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';

import type { BaseConnector } from '@logto/connector-kit';
import { ConnectorError, ConnectorErrorCodes, ConnectorType } from '@logto/connector-kit';

import RequestError from '#src/errors/RequestError/index.js';
import { findAllConnectors } from '#src/queries/connector.js';
import assertThat from '#src/utils/assert-that.js';

export const getConnectorConfig = async (id: string): Promise<unknown> => {
  const connectors = await findAllConnectors();
  const connector = connectors.find((connector) => connector.id === id);

  assertThat(connector, new RequestError({ code: 'entity.not_found', id, status: 404 }));

  return connector.config;
};

export function validateConnectorModule(
  connector: Partial<BaseConnector<ConnectorType>>
): asserts connector is BaseConnector<ConnectorType> {
  if (!connector.metadata) {
    throw new ConnectorError(ConnectorErrorCodes.InvalidMetadata);
  }

  if (!connector.configGuard) {
    throw new ConnectorError(ConnectorErrorCodes.InvalidConfigGuard);
  }

  if (!connector.type || !Object.values(ConnectorType).includes(connector.type)) {
    throw new ConnectorError(ConnectorErrorCodes.UnexpectedType);
  }
}

export const readUrl = async (
  url: string,
  baseUrl: string,
  type: 'text' | 'svg'
): Promise<string> => {
  if (!url) {
    return url;
  }

  if (type !== 'text' && url.startsWith('http')) {
    return url;
  }

  if (!existsSync(path.join(baseUrl, url))) {
    return url;
  }

  if (type === 'svg') {
    const data = await readFile(path.join(baseUrl, url));

    return `data:image/svg+xml;base64,${data.toString('base64')}`;
  }

  return readFile(path.join(baseUrl, url), 'utf8');
};
