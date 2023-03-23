import { conditional } from '@silverhand/essentials';
import { useEffect, useContext, useState } from 'react';

import { consent } from '@/apis/consent';
import { LoadingIcon } from '@/components/LoadingLayer';
import useApi from '@/hooks/use-api';
import useErrorHandler from '@/hooks/use-error-handler';
import { PageContext } from '@/hooks/use-page-context';
import { getBrandingLogoUrl } from '@/utils/logo';

import * as styles from './index.module.scss';

const Consent = () => {
  const { experienceSettings, theme } = useContext(PageContext);
  const handleError = useErrorHandler();
  const asyncConsent = useApi(consent);
  const { branding, color } = experienceSettings ?? {};
  const brandingLogo = conditional(
    branding &&
      color &&
      getBrandingLogoUrl({ theme, branding, isDarkModeEnabled: color.isDarkModeEnabled })
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [error, result] = await asyncConsent();
      setLoading(false);

      if (error) {
        await handleError(error);

        return;
      }

      if (result?.redirectTo) {
        window.location.replace(result.redirectTo);
      }
    })();
  }, [asyncConsent, handleError]);

  return (
    <div className={styles.viewBox}>
      <div className={styles.container}>
        {brandingLogo && <img alt="logo" className={styles.img} src={brandingLogo} />}
        <div className={styles.loadingWrapper}>{loading && <LoadingIcon />}</div>
      </div>
    </div>
  );
};

export default Consent;
