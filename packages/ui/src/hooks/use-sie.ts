import { SignInIdentifier } from '@logto/schemas';
import { useContext } from 'react';

import type { VerificationCodeIdentifier } from '@/types';

import { PageContext } from './use-page-context';

export const useSieMethods = () => {
  const { experienceSettings } = useContext(PageContext);
  const { identifiers, password, verify } = experienceSettings?.signUp ?? {};

  return {
    signUpMethods: identifiers ?? [],
    signUpSettings: { password, verify },
    signInMethods:
      experienceSettings?.signIn.methods.filter(
        // Filter out empty settings
        ({ password, verificationCode }) => password || verificationCode
      ) ?? [],
    socialConnectors: experienceSettings?.socialConnectors ?? [],
    signInMode: experienceSettings?.signInMode,
    forgotPassword: experienceSettings?.forgotPassword,
    customCss: experienceSettings?.customCss,
    customContent: experienceSettings?.customContent,
  };
};

export const useForgotPasswordSettings = () => {
  const { experienceSettings } = useContext(PageContext);
  const { forgotPassword } = experienceSettings ?? {};

  const enabledMethodSet = new Set<VerificationCodeIdentifier>();

  if (forgotPassword?.email) {
    enabledMethodSet.add(SignInIdentifier.Email);
  }

  if (forgotPassword?.phone) {
    enabledMethodSet.add(SignInIdentifier.Phone);
  }

  return {
    isForgotPasswordEnabled: enabledMethodSet.size > 0,
    enabledMethodSet,
  };
};
