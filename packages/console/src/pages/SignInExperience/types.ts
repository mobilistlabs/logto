import type { SignInExperience, SignInIdentifier, SignUp } from '@logto/schemas';

export enum SignUpIdentifier {
  Email = 'email',
  Phone = 'phone',
  Username = 'username',
  EmailOrSms = 'emailOrSms',
  None = 'none',
}

export type SignUpForm = Omit<SignUp, 'identifiers'> & {
  identifier: SignUpIdentifier;
};

export type SignInExperienceForm = Omit<SignInExperience, 'signUp' | 'customCss'> & {
  customCss?: string; // Code editor components can not properly handle null value, manually transform null to undefined instead.
  signUp?: SignUpForm;
  createAccountEnabled: boolean;
};

export type SignInMethod = SignInExperience['signIn']['methods'][number];

export type SignInMethodsObject = Record<
  SignInIdentifier,
  { password: boolean; verificationCode: boolean }
>;
