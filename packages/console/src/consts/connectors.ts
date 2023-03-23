import type { AdminConsoleKey } from '@logto/phrases';
import { ConnectorPlatform, ConnectorType } from '@logto/schemas';

import EmailConnector from '@/assets/images/connector-email.svg';
import SmsConnectorIcon from '@/assets/images/connector-sms.svg';
import type { ConnectorGroup } from '@/types/connector';

type TitlePlaceHolder = {
  [key in ConnectorType]: AdminConsoleKey;
};

export const connectorTitlePlaceHolder: TitlePlaceHolder = Object.freeze({
  [ConnectorType.Sms]: 'connectors.type.sms',
  [ConnectorType.Email]: 'connectors.type.email',
  [ConnectorType.Social]: 'connectors.type.social',
});

type ConnectorPlatformLabel = {
  [key in ConnectorPlatform]: AdminConsoleKey;
};

export const connectorPlatformLabel: ConnectorPlatformLabel = Object.freeze({
  [ConnectorPlatform.Native]: 'connectors.platform.native',
  [ConnectorPlatform.Universal]: 'connectors.platform.universal',
  [ConnectorPlatform.Web]: 'connectors.platform.web',
});

type ConnectorPlaceholderIcon = {
  [key in ConnectorType]?: SvgComponent;
};

export const connectorPlaceholderIcon: ConnectorPlaceholderIcon = Object.freeze({
  [ConnectorType.Sms]: SmsConnectorIcon,
  [ConnectorType.Email]: EmailConnector,
} as const);

export const defaultSmsConnectorGroup: ConnectorGroup = {
  id: 'default-sms-connector',
  type: ConnectorType.Sms,
  connectors: [],
  name: { en: '' },
  description: { en: '' },
  logo: '',
  logoDark: null,
  target: '',
};

export const defaultEmailConnectorGroup: ConnectorGroup = {
  id: 'default-email-connector',
  type: ConnectorType.Email,
  connectors: [],
  name: { en: '' },
  description: { en: '' },
  logo: '',
  logoDark: null,
  target: '',
};
