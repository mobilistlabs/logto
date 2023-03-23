import type { ConnectorResponse } from '@logto/schemas';

export type ConnectorGroup<T = ConnectorResponse> = Pick<
  ConnectorResponse,
  'name' | 'logo' | 'logoDark' | 'target' | 'type' | 'description' | 'isStandard' | 'isDemo'
> & {
  id: string;
  connectors: T[];
};
