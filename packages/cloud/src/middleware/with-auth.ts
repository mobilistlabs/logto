import assert from 'node:assert';
import type { IncomingHttpHeaders } from 'node:http';

import { appendPath, tryThat } from '@silverhand/essentials';
import type { NextFunction, RequestContext } from '@withtyped/server';
import { RequestError } from '@withtyped/server';
import fetchRetry from 'fetch-retry';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { z } from 'zod';

import { EnvSet } from '#src/env-set/index.js';

const bearerTokenIdentifier = 'Bearer';

export const extractBearerTokenFromHeaders = ({ authorization }: IncomingHttpHeaders) => {
  assert(authorization, new RequestError('Authorization header is missing.', 401));
  assert(
    authorization.startsWith(bearerTokenIdentifier),
    new RequestError(
      `Authorization token type is not supported. Valid type: "${bearerTokenIdentifier}".`,
      401
    )
  );

  return authorization.slice(bearerTokenIdentifier.length + 1);
};

export type WithAuthContext<Context = RequestContext> = Context & {
  auth: {
    id: string;
    scopes: string[];
  };
};

export type WithAuthConfig = {
  /** The Logto admin tenant endpoint. */
  endpoint: URL;
  /** The audience (i.e. Resource Indicator) to expect. */
  audience: string;
  /** The scopes (i.e. permissions) to expect. */
  scopes?: string[];
};

export default function withAuth<InputContext extends RequestContext>({
  endpoint,
  audience,
  scopes: expectScopes = [],
}: WithAuthConfig) {
  const fetch = fetchRetry(global.fetch);
  const getJwkSet = (async () => {
    const fetched = await fetch(
      new Request(appendPath(endpoint, 'oidc/.well-known/openid-configuration')),
      { retries: 5, retryDelay: (attempt) => 2 ** attempt * 1000 }
    );
    const { jwks_uri: jwksUri, issuer } = z
      .object({ jwks_uri: z.string(), issuer: z.string() })
      .parse(await fetched.json());

    return Object.freeze([createRemoteJWKSet(new URL(jwksUri)), issuer] as const);
  })();

  return async (context: InputContext, next: NextFunction<WithAuthContext<InputContext>>) => {
    const userId = context.request.headers['development-user-id']?.toString();

    if (!EnvSet.isProduction && userId) {
      console.log(`Found dev user ID ${userId}, skip token validation.`);

      return next({ ...context, auth: { id: userId, scopes: expectScopes } });
    }

    const [getKey, issuer] = await getJwkSet;

    const {
      payload: { sub, scope },
    } = await tryThat(
      jwtVerify(extractBearerTokenFromHeaders(context.request.headers), getKey, {
        issuer,
        audience,
      }),
      (error) => {
        console.error(error);
        throw new RequestError('JWT verification failed.', 401);
      }
    );

    assert(sub, new RequestError('"sub" is missing in JWT.', 401));

    const scopes = typeof scope === 'string' ? scope.split(' ') : [];
    assert(
      expectScopes.every((scope) => scopes.includes(scope)),
      new RequestError('Forbidden. Please check your permissions.', 403)
    );

    return next({ ...context, auth: { id: sub, scopes } });
  };
}
