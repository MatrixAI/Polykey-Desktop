import { mount } from '@vue/test-utils';
import Antd from 'ant-design-vue';
import SmallDefaultButton from '@/renderer/atoms/button/SmallDefaultButton.vue';

describe('SmallDefaultButton component', () => {
  const wrapper = mount(SmallDefaultButton, {
    global: {
      plugins: [Antd],
    },
    props: {},
  });
  test('Exists.', async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
