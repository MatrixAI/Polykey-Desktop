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
      data: "No Value",
    },
  });
  test('Exists.', async () => {
    expect(wrapper.exists()).toBe(true);
  });
  test('Change to input.', async () => {
    //FIXME Need to sleep on this, work out why it's not working.
    const input = wrapper.get('input');
    expect(input.element.value).toBe('No Value');
    expect(wrapper.vm.data).toBe('No Value');
    // await input.setValue('New Value'); //Changing the value.
    // input.element.value = 'New Value';
    // await input.trigger('change');
    expect(wrapper.vm.data).toBe('New Value'); //Expect update to data.
  });
});
