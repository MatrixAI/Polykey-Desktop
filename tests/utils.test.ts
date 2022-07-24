import * as utils from '@/utils';

describe('utils', () => {
  test('sleep for 1 second', async () => {
    const now1 = new Date();
    await utils.sleep(1000);
    const now2 = new Date();
    expect(now2 > now1).toBe(true);
    expect(now2.getTime() - now1.getTime()).toBeGreaterThanOrEqual(1000);
  });
});
