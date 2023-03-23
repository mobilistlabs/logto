import { SignInMode } from '@logto/schemas';
import { useTranslation } from 'react-i18next';

import LandingPageLayout from '@/Layout/LandingPageLayout';
import Divider from '@/components/Divider';
import TextLink from '@/components/TextLink';
import SocialSignInList from '@/containers/SocialSignInList';
import TermsAndPrivacyLinks from '@/containers/TermsAndPrivacyLinks';
import { useSieMethods } from '@/hooks/use-sie';

import ErrorPage from '../ErrorPage';
import Main from './Main';
import * as styles from './index.module.scss';

const SignIn = () => {
  const { signInMethods, signUpMethods, socialConnectors, signInMode } = useSieMethods();
  const { t } = useTranslation();

  if (!signInMode || signInMode === SignInMode.Register) {
    return <ErrorPage />;
  }

  return (
    <LandingPageLayout title="description.sign_in_to_your_account">
      <Main signInMethods={signInMethods} socialConnectors={socialConnectors} />
      {
        // Create Account footer
        signInMode === SignInMode.SignInAndRegister && signUpMethods.length > 0 && (
          <div className={styles.createAccount}>
            {t('description.no_account')}{' '}
            <TextLink replace to="/register" text="action.create_account" />
          </div>
        )
      }
      {
        // Social sign-in methods
        signInMethods.length > 0 && socialConnectors.length > 0 && (
          <>
            <Divider label="description.or" className={styles.divider} />
            <SocialSignInList socialConnectors={socialConnectors} className={styles.main} />
          </>
        )
      }
      <TermsAndPrivacyLinks className={styles.terms} />
    </LandingPageLayout>
  );
};

export default SignIn;
