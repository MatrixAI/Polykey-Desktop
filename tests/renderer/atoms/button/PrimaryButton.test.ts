import { mount } from '@vue/test-utils';
import Antd from 'ant-design-vue';
import PrimaryButton from '@/renderer/atoms/button/PrimaryButton.vue';

describe('PrimaryButton component', () => {
  const wrapper = mount(PrimaryButton, {
    global: {
      plugins: [Antd],
    },
    props: { full: true },
  });
  test('Exists.', async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
