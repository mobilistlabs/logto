import type Provider from 'oidc-provider';

import type { EnvSet } from '#src/env-set/index.js';
import type { ConnectorLibrary } from '#src/libraries/connector.js';

import type Libraries from './Libraries.js';
import type Queries from './Queries.js';

export default abstract class TenantContext {
  public abstract readonly id: string;
  public abstract readonly envSet: EnvSet;
  public abstract readonly provider: Provider;
  public abstract readonly queries: Queries;
  public abstract readonly connectors: ConnectorLibrary;
  public abstract readonly libraries: Libraries;
}
