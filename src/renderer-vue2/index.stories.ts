import Vue from 'vue';
import Alert from './templates/alerts/Alert.vue';

export default { title: 'Button' };

export const withText = () => '<my-button>with text</my-button>';

export const withEmoji = () => '<my-button>😀 😎 👍 💯</my-button>';

export const asAComponent = () => ({
  components: { Alert },
  template: '<Alert />'
});
