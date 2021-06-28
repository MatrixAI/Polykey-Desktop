import { useStore } from 'vuex';describe('Agent Store', () => {
  test('Sanity.', async () => {
    expect(1+1).toBe(2);
  });

  // test('Sanity.', async () => {
  //   const store = useStore();
  //   const localState = store.state.Agent;
  //   store.commit('Agent/SetIsUnlocked', true);
  //   expect(localState).toBe(true);
  // });
});
// import { STATUS, actions } from '@/renderer/store/modules/Agent';
// import { default as store } from '@/renderer/store'

describe('Agent Store', () => {
  test('Sanity.', async () => {
    expect(1+1).toBe(2);
    fail("No tests created.");
  });

  // test('Sanity.', async () => {
  //   const store = useStore();
  //   const localState = store.state.Agent;
  //   store.commit('Agent/SetIsUnlocked', true);
  //   expect(localState).toBe(true);
  // });
});
