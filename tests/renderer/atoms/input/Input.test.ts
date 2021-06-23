import { mount } from '@vue/test-utils';
import Antd from 'ant-design-vue';
import Input from '@/renderer/atoms/input/Input.vue'
import { ref } from "vue";

describe('Input component', () => {
  const wrapper = mount(Input, {
    global: {
      plugins: [Antd],
    },
    props: {
      value: "val1",
      data: "Val2",
    },
  });
  test('Exists.', async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
