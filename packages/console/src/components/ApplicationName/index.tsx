import type { Application } from '@logto/schemas';
import { adminConsoleApplicationId } from '@logto/schemas';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

import * as styles from './index.module.scss';

type Props = {
  applicationId: string;
  isLink?: boolean;
};

function ApplicationName({ applicationId, isLink = false }: Props) {
  const isAdminConsole = applicationId === adminConsoleApplicationId;

  const { data } = useSWR<Application>(!isAdminConsole && `api/applications/${applicationId}`);
  const { t } = useTranslation(undefined, { keyPrefix: 'admin_console' });

  const name = (isAdminConsole ? <>Admin Console ({t('system_app')})</> : data?.name) ?? '-';

  if (isLink && !isAdminConsole) {
    return (
      <Link className={styles.link} to={`/applications/${applicationId}`}>
        {name}
      </Link>
    );
  }

  return <span>{name}</span>;
}

export default ApplicationName;
