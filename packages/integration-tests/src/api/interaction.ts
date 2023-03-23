import type {
  InteractionEvent,
  IdentifierPayload,
  Profile,
  RequestVerificationCodePayload,
} from '@logto/schemas';
import type { Got } from 'got';

import api from './api.js';

export type RedirectResponse = {
  redirectTo: string;
};

export type InteractionPayload = {
  event: InteractionEvent;
  identifier?: IdentifierPayload;
  profile?: Profile;
};

export const putInteraction = async (cookie: string, payload: InteractionPayload) =>
  api
    .put('interaction', {
      headers: { cookie },
      json: payload,
      followRedirect: false,
    })
    .json();

export const putInteractionEvent = async (cookie: string, payload: { event: InteractionEvent }) =>
  api
    .put('interaction/event', { headers: { cookie }, json: payload, followRedirect: false })
    .json();

export const patchInteractionIdentifiers = async (cookie: string, payload: IdentifierPayload) =>
  api
    .patch('interaction/identifiers', {
      headers: { cookie },
      json: payload,
      followRedirect: false,
    })
    .json();

export const patchInteractionProfile = async (cookie: string, payload: Profile) =>
  api
    .patch('interaction/profile', {
      headers: { cookie },
      json: payload,
      followRedirect: false,
    })
    .json();

export const putInteractionProfile = async (cookie: string, payload: Profile) =>
  api
    .put('interaction/profile', {
      headers: { cookie },
      json: payload,
      followRedirect: false,
    })
    .json();

export const deleteInteractionProfile = async (cookie: string) =>
  api
    .delete('interaction/profile', {
      headers: { cookie },
      followRedirect: false,
    })
    .json();

export const submitInteraction = async (api: Got, cookie: string) =>
  api
    .post('interaction/submit', { headers: { cookie }, followRedirect: false })
    .json<RedirectResponse>();

export const sendVerificationCode = async (
  cookie: string,
  payload: RequestVerificationCodePayload
) =>
  api.post('interaction/verification/verification-code', {
    headers: { cookie },
    json: payload,
    followRedirect: false,
  });

export type SocialAuthorizationUriPayload = {
  connectorId: string;
  state: string;
  redirectUri: string;
};

export const createSocialAuthorizationUri = async (
  cookie: string,
  payload: SocialAuthorizationUriPayload
) =>
  api.post('interaction/verification/social-authorization-uri', {
    headers: { cookie },
    json: payload,
    followRedirect: false,
  });

export const consent = async (api: Got, cookie: string) =>
  api
    .post('interaction/consent', {
      headers: {
        cookie,
      },
      followRedirect: false,
    })
    .json<RedirectResponse>();
