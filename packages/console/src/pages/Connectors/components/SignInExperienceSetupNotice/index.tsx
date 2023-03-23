import type { ConnectorResponse } from '@logto/schemas';
import { Trans, useTranslation } from 'react-i18next';
import useSWR from 'swr';

import Alert from '@/components/Alert';
import TextLink from '@/components/TextLink';
import useUserPreferences from '@/hooks/use-user-preferences';

import * as styles from './index.module.scss';

function SignInExperienceSetupNotice() {
  const { t } = useTranslation(undefined, { keyPrefix: 'admin_console' });
  const { data: connectors } = useSWR<ConnectorResponse[]>('api/connectors');
  const {
    data: { connectorSieNoticeConfirmed },
    update,
  } = useUserPreferences();

  if (!connectors || connectors.length === 0 || connectorSieNoticeConfirmed) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Alert
        action="general.got_it"
        className={styles.notice}
        onClick={() => {
          void update({ connectorSieNoticeConfirmed: true });
        }}
      >
        <Trans
          components={{
            a: <TextLink to="/sign-in-experience/sign-up-and-sign-in" />,
          }}
        >
          {t('connectors.config_sie_notice', { link: t('connectors.config_sie_link_text') })}
        </Trans>
      </Alert>
    </div>
  );
}

export default SignInExperienceSetupNotice;
