import Vue from "vue";
import path from 'path';
import Vuetify from "vuetify";
import 'vuetify/dist/vuetify.min.css';
import "@fortawesome/fontawesome-free/css/all.css"; // Ensure you are using css-loader
import MatrixAIIcon from "./MatrixAIIcon.vue";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
      themes: {
        light: {
          primary: "#02243E",
          secondary: "#00CBD8"
        },
        dark: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        }
      }
    },
    icons: {
      iconfont: "fa",
      values: {
        MatrixAIIcon: {
          component: MatrixAIIcon
        }
      }
    }
  });
