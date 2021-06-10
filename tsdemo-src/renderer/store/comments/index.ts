import { makeIdentifiers } from '@/renderer/store/utils';

const [actionsInt, actionsExt] = makeIdentifiers('comments', ['FetchComment']);

enum mutations {
  CommentFetch = 'CommentFetch',
}

type State = {
  comments: { [key: number]: string };
};

const state: State = {
  comments: {},
};

const commentsModule = {
  namespaced: true,
  state: state,
  actions: {
    async [actionsInt.FetchComment]({ commit }, { id }: { id: number }) {
      commit(mutations.CommentFetch, { id });
    },
  },
  mutations: {
    [mutations.CommentFetch](state: State, { id }: { id: number }) {
      state.comments[id] = 'abc';
    },
  },
};

export default commentsModule;

export { actionsExt as actions };
