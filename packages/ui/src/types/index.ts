import type { SignInExperience, ConnectorMetadata, SignInIdentifier, Theme } from '@logto/schemas';

export enum UserFlow {
  signIn = 'sign-in',
  register = 'register',
  forgotPassword = 'forgot-password',
  continue = 'continue',
}

export enum SearchParameters {
  nativeCallbackLink = 'native_callback',
  redirectTo = 'redirect_to',
  linkSocial = 'link_social',
}

export type Platform = 'web' | 'mobile';

export type VerificationCodeIdentifier = SignInIdentifier.Email | SignInIdentifier.Phone;

// Omit socialSignInConnectorTargets since it is being translated into socialConnectors
export type SignInExperienceResponse = Omit<SignInExperience, 'socialSignInConnectorTargets'> & {
  socialConnectors: ConnectorMetadata[];
  notification?: string;
  forgotPassword: {
    phone: boolean;
    email: boolean;
  };
};

export enum ConfirmModalMessage {
  SHOW_TERMS_DETAIL_MODAL = 'SHOW_TERMS_DETAIL_MODAL',
}

export type PreviewConfig = {
  signInExperience: SignInExperienceResponse;
  language: string;
  mode: Theme;
  platform: Platform;
  isNative: boolean;
};

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;
