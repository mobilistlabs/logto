import type { Resource, ResourceResponse } from '@logto/schemas';

import type Queries from '#src/tenants/Queries.js';

export const createResourceLibrary = (queries: Queries) => {
  const { findScopesByResourceIds } = queries.scopes;

  const attachScopesToResources = async (
    resources: readonly Resource[]
  ): Promise<ResourceResponse[]> => {
    const resourceIds = resources.map(({ id }) => id);
    const scopes = await findScopesByResourceIds(resourceIds);

    return resources.map((resource) => ({
      ...resource,
      scopes: scopes.filter(({ resourceId }) => resourceId === resource.id),
    }));
  };

  return { attachScopesToResources };
};
