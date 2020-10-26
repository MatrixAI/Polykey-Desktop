import App from "@typescript-demo-spa/App.vue";
import { mount } from '@vue/test-utils'

describe('index', () => {
  test('Test the App', () => {
    const wrapper = mount(App)
    expect(wrapper.html()).toContain('Welcome to Typescript-Demo-Spa');
  });

});
