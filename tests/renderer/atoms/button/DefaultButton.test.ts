import { mount } from '@vue/test-utils';
import Antd from 'ant-design-vue';
import DefaultButton from '@/renderer/atoms/button/DefaultButton.vue'

describe('DefaultButton component', () => {
  const wrapper = mount(DefaultButton, {
    global: {
      plugins: [Antd],
    },
    props: {},
  });
  test('Exists.', async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
