import { mount } from '@vue/test-utils';
import Antd from 'ant-design-vue';
import ClearButton from '@/renderer/atoms/button/ClearButton.vue';

describe('ClearButton component', () => {
  const wrapper = mount(ClearButton, {
    global: {
      plugins: [Antd],
    },
    props: {},
  });
  test('Exists.', async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
