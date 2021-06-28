window.require = require;
import type { Config } from '@/renderer/config';
import { mount } from '@vue/test-utils';
import { mocked } from 'ts-jest/utils';
import Antd from 'ant-design-vue';
import store from '@/renderer/store';
import createRouter from '@/renderer/router';
import CreateVault from '@/renderer/molecules/create-vault/CreateVault.vue';

jest.mock('electron', () => {
  return jest.fn();
});

const config: Config = {
  BASE_PATH: './dist/index.html',
  TMPDIR: '/tmp',
};

const router = createRouter(config)

describe('Console component', () => {
  const wrapper = mount(CreateVault, {
    global: {
      plugins: [Antd, store, router],
    },
  });
  test('Exists.', async () => {
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.findComponent({name: 'Input'}).exists()).toBeTruthy();
    expect(wrapper.findComponent({name: 'PrimaryButton'}).exists()).toBeTruthy();
    fail("Test is not complete.");
  });
  //TODO add more tests.
});
