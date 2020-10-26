/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue'

import Alert from '../templates/alerts/Alert.vue'

storiesOf('Standard Vuetify Alert', module)
  .add('timed-out-alert', () => ({
    components: { Alert },
    template: '<Alert />',
  }))
