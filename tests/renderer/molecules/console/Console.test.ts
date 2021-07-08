import { mount } from '@vue/test-utils';
import Antd from 'ant-design-vue';
import Console from '@/renderer/molecules/console/Console.vue';

describe('Console component', () => {
  const wrapper = mount(Console, {
    global: {
      plugins: [Antd],
    },
  });
  test('Exists.', async () => {
    expect(wrapper.exists()).toBeTruthy();
  });
  test('progress bar', async () => {
    wrapper.get('.ant-progress'); // error if none found.
  });
  test('Text exists', async () => {
    expect(wrapper.text()).toContain('Initializing...');
  });
});
