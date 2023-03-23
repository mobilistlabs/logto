import type { SocialUserInfo } from '@logto/connector-kit';
import type {
  UsernamePasswordPayload,
  EmailPasswordPayload,
  PhonePasswordPayload,
  InteractionEvent,
  SocialEmailPayload,
  SocialPhonePayload,
} from '@logto/schemas';
import type { z } from 'zod';

import type {
  socialAuthorizationUrlPayloadGuard,
  accountIdIdentifierGuard,
  verifiedEmailIdentifierGuard,
  verifiedPhoneIdentifierGuard,
  socialIdentifierGuard,
  identifierGuard,
  anonymousInteractionResultGuard,
  verifiedRegisterInteractionResultGuard,
  verifiedSignInteractionResultGuard,
  verifiedForgotPasswordInteractionResultGuard,
  forgotPasswordProfileGuard,
} from './guard.js';

/* Payload Types */
export type PasswordIdentifierPayload =
  | UsernamePasswordPayload
  | EmailPasswordPayload
  | PhonePasswordPayload;

export type SocialVerifiedIdentifierPayload = SocialEmailPayload | SocialPhonePayload;

export type SocialAuthorizationUrlPayload = z.infer<typeof socialAuthorizationUrlPayloadGuard>;

/* Interaction Types */
// Identifier
export type AccountIdIdentifier = z.infer<typeof accountIdIdentifierGuard>;

export type VerifiedEmailIdentifier = z.infer<typeof verifiedEmailIdentifierGuard>;

export type VerifiedPhoneIdentifier = z.infer<typeof verifiedPhoneIdentifierGuard>;

export type SocialIdentifier = z.infer<typeof socialIdentifierGuard>;

export type Identifier = z.infer<typeof identifierGuard>;

// Profile
export type ForgotPasswordProfile = z.infer<typeof forgotPasswordProfileGuard>;

// Interaction
export type AnonymousInteractionResult = z.infer<typeof anonymousInteractionResultGuard>;

export type RegisterInteractionResult = Omit<AnonymousInteractionResult, 'event'> & {
  event: InteractionEvent.Register;
};

export type SignInInteractionResult = Omit<AnonymousInteractionResult, 'event'> & {
  event: InteractionEvent.SignIn;
};

export type ForgotPasswordInteractionResult = Omit<AnonymousInteractionResult, 'event'> & {
  event: InteractionEvent.ForgotPassword;
};

export type AccountVerifiedInteractionResult =
  | (Omit<SignInInteractionResult, 'accountId' | 'identifiers'> & {
      accountId: string;
      identifiers: Identifier[];
    })
  | (Omit<ForgotPasswordInteractionResult, 'accountId' | 'identifiers'> & {
      accountId: string;
      identifiers: Identifier[];
    });

export type IdentifierVerifiedInteractionResult =
  | RegisterInteractionResult
  | AccountVerifiedInteractionResult;

export type VerifiedRegisterInteractionResult = z.infer<
  typeof verifiedRegisterInteractionResultGuard
>;

export type VerifiedSignInInteractionResult = z.infer<typeof verifiedSignInteractionResultGuard>;

export type VerifiedForgotPasswordInteractionResult = z.infer<
  typeof verifiedForgotPasswordInteractionResultGuard
>;

export type VerifiedInteractionResult =
  | VerifiedRegisterInteractionResult
  | VerifiedSignInInteractionResult
  | VerifiedForgotPasswordInteractionResult;

export type UserIdentity =
  | { username: string }
  | { email: string }
  | { phone: string }
  | { connectorId: string; userInfo: SocialUserInfo };
