import { ConnectorPlatform } from '@logto/schemas';
import { conditionalString } from '@silverhand/essentials';
import { useEffect, useState } from 'react';

import * as styles from '@/Layout/AppLayout/index.module.scss';
import type { Context } from '@/hooks/use-page-context';
import initI18n from '@/i18n/init';
import { changeLanguage } from '@/i18n/utils';
import type { SignInExperienceResponse, PreviewConfig } from '@/types';
import { filterPreviewSocialConnectors } from '@/utils/social-connectors';

const usePreview = (context: Context): [boolean, PreviewConfig?] => {
  const [previewConfig, setPreviewConfig] = useState<PreviewConfig>();
  const { isPreview, setExperienceSettings, setPlatform, setTheme } = context;

  useEffect(() => {
    if (!isPreview) {
      return;
    }

    // Init i18n
    const i18nInit = initI18n();

    // Block pointer event
    document.body.classList.add(conditionalString(styles.preview));

    const previewMessageHandler = async (event: MessageEvent) => {
      // TODO: @simeng: we can check allowed origins via `/.well-known/endpoints`
      // if (event.origin !== window.location.origin) {
      //   return;
      // }

      if (event.data.sender === 'ac_preview') {
        // #event.data should be guarded at the provider's side
        await i18nInit;

        // eslint-disable-next-line no-restricted-syntax
        setPreviewConfig(event.data.config as PreviewConfig);
      }
    };

    window.addEventListener('message', previewMessageHandler);

    return () => {
      window.removeEventListener('message', previewMessageHandler);
    };
  }, [isPreview]);

  useEffect(() => {
    if (!isPreview || !previewConfig) {
      return;
    }

    const {
      signInExperience: { socialConnectors, ...rest },
      mode,
      platform,
      isNative,
    } = previewConfig;

    const experienceSettings: SignInExperienceResponse = {
      ...rest,
      socialConnectors: filterPreviewSocialConnectors(
        isNative ? ConnectorPlatform.Native : ConnectorPlatform.Web,
        socialConnectors
      ),
    };

    (async () => {
      setTheme(mode);

      setPlatform(platform);

      setExperienceSettings(experienceSettings);
    })();
  }, [isPreview, previewConfig, setExperienceSettings, setPlatform, setTheme]);

  useEffect(() => {
    if (!isPreview || !previewConfig?.language) {
      return;
    }

    (async () => {
      await changeLanguage(previewConfig.language);
    })();
  }, [previewConfig?.language, isPreview]);

  return [isPreview, previewConfig];
};

export default usePreview;
