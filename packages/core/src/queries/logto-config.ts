import type { AdminConsoleData, LogtoConfig, LogtoConfigKey } from '@logto/schemas';
import { LogtoTenantConfigKey, LogtoConfigs } from '@logto/schemas';
import { convertToIdentifiers } from '@logto/shared';
import type { CommonQueryMethods } from 'slonik';
import { sql } from 'slonik';

const { table, fields } = convertToIdentifiers(LogtoConfigs);

export const createLogtoConfigQueries = (pool: CommonQueryMethods) => {
  const getAdminConsoleConfig = async () =>
    pool.one<Record<string, unknown>>(sql`
      select ${fields.value} from ${table}
      where ${fields.key} = ${LogtoTenantConfigKey.AdminConsole}
    `);

  const updateAdminConsoleConfig = async (value: Partial<AdminConsoleData>) =>
    pool.one<Record<string, unknown>>(sql`
      update ${table}
      set ${fields.value} = coalesce(${fields.value},'{}'::jsonb) || ${sql.jsonb(value)}
      where ${fields.key} = ${LogtoTenantConfigKey.AdminConsole}
      returning ${fields.value}
    `);

  const getRowsByKeys = async (keys: LogtoConfigKey[]) =>
    pool.query<LogtoConfig>(sql`
      select ${sql.join([fields.key, fields.value], sql`,`)} from ${table}
        where ${fields.key} in (${sql.join(keys, sql`,`)})
    `);

  return { getAdminConsoleConfig, updateAdminConsoleConfig, getRowsByKeys };
};
