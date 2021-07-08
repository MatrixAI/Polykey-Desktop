window.require = require;
import type { Config } from '@/renderer/config';

import { mount } from '@vue/test-utils';
import { mocked } from 'ts-jest/utils';
import App from '@/renderer/App.vue';
import store from '@/renderer/store';
import createRouter from '@/renderer/router';

jest.mock('electron', () => {
  return jest.fn();
});

const config: Config = {
  BASE_PATH: '',
  TMPDIR: '',
};

const STATUS = {
  PENDING: 'a',
};

const router = createRouter(config);

describe('index', () => {
  test('Test the App', async () => {
    // await router.push('/');
    // await router.isReady();
    const wrapper = mount(App, {
      global: {
        plugins: [store, router],
      },
      props: {
        config: config,
      },
    });
    // await wrapper.get('[data-test=submit]').trigger('click');
    expect(wrapper.html()).toContain('My Vaults');
  });
});
