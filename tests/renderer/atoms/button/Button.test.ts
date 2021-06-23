import { mount } from '@vue/test-utils';
import Antd from 'ant-design-vue';
import Button from '@/renderer/atoms/button/Button.vue'

describe('Button component', () => {
  const wrapper = mount(Button, {
    global: {
      plugins: [Antd],
    },
    props: {
      type: 'default',
    },
  });
  test('Exists.', async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
