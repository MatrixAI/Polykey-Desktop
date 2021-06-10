import { createStore } from 'vuex';
import comments from './comments';

const store = createStore({
  modules: {
    comments,
  },
});

type Store = typeof store;

export type { Store };

export default store;
