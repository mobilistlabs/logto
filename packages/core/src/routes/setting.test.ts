import type { Setting, CreateSetting } from '@logto/schemas';

import { mockSetting } from '#src/__mocks__/index.js';
import { createRequester } from '#src/utils/test-utils.js';

import settingRoutes from './setting.js';

jest.mock('#src/queries/setting.js', () => ({
  getSetting: jest.fn(async (): Promise<Setting> => mockSetting),
  updateSetting: jest.fn(
    async (data: Partial<CreateSetting>): Promise<Setting> => ({
      ...mockSetting,
      ...data,
    })
  ),
}));

describe('settings routes', () => {
  const roleRequester = createRequester({ authedRoutes: settingRoutes });

  it('GET /settings', async () => {
    const response = await roleRequester.get('/settings');
    expect(response.status).toEqual(200);
    const { id, ...rest } = mockSetting;
    expect(response.body).toEqual(rest);
  });

  it('PATCH /settings', async () => {
    const { adminConsole } = mockSetting;

    const response = await roleRequester.patch('/settings').send({
      adminConsole,
    });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      adminConsole,
    });
  });
});
