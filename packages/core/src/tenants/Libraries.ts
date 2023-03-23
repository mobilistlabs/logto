import { createApplicationLibrary } from '#src/libraries/application.js';
import type { ConnectorLibrary } from '#src/libraries/connector.js';
import { createHookLibrary } from '#src/libraries/hook.js';
import { createPasscodeLibrary } from '#src/libraries/passcode.js';
import { createPhraseLibrary } from '#src/libraries/phrase.js';
import { createResourceLibrary } from '#src/libraries/resource.js';
import { createSignInExperienceLibrary } from '#src/libraries/sign-in-experience/index.js';
import { createSocialLibrary } from '#src/libraries/social.js';
import { createUserLibrary } from '#src/libraries/user.js';
import { createVerificationStatusLibrary } from '#src/libraries/verification-status.js';

import type Queries from './Queries.js';

export default class Libraries {
  users = createUserLibrary(this.queries);
  signInExperiences = createSignInExperienceLibrary(this.queries, this.connectors, this.tenantId);
  phrases = createPhraseLibrary(this.queries, this.tenantId);
  resources = createResourceLibrary(this.queries);
  hooks = createHookLibrary(this.queries);
  socials = createSocialLibrary(this.queries, this.connectors);
  passcodes = createPasscodeLibrary(this.queries, this.connectors);
  applications = createApplicationLibrary(this.queries);
  verificationStatuses = createVerificationStatusLibrary(this.queries);

  constructor(
    public readonly tenantId: string,
    private readonly queries: Queries,
    // Explicitly passing connector library to eliminate dependency issue
    private readonly connectors: ConnectorLibrary
  ) {}
}
