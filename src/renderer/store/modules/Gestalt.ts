import PolykeyClient from '@/renderer/resources/client'
import * as pb from '@matrixai/polykey/dist/proto/js/Agent_pb'
import { makeIdentifiers } from '@/renderer/store/utils'

const [actionsInt, actionsExt] = makeIdentifiers('Gestalt', [
  'SearchMode',
  'PullVaultDrawer',
  'ToggleAddKeyNode',
  'ActiveKeynodeVaults',
  'SearchDI',
  'PingNodes',

  'GetGestalts',
  'DiscoverGestaltIdentity',
])

const enum mutations {
  SetSearchMode = 'SetSearchMode',
  SetPullVaultDrawer = 'SetPullVaultDrawer',
  SetAddKeynode = 'SetAddKeynode',
  SetActiveKeynodeVaults = 'SetActiveKeynodeVaults',
  SetSearchDI = 'SetSearchDI',
  SetFoundDI = 'SetFoundDI',
  SetGestalt = 'SetGestalt',
}

type ActiveKeynode = {
  activeVaults: string[]
  activeKeynode: string
}

/** this can still be updated */
type DigitalIdentity = {
  type: string
  username: string
}

type FoundKeynode = {
  key: string
  identity: string
  provider: string
}

type FoundDigitalIdentity = {
  provider: string
  key: string
  keynodes: FoundKeynode[]
}

type Keynode = {
  id: string
  name: string
  digitalIdentity: DigitalIdentity[]
  vaults?: string[]
  online?: boolean
}

type Gestalt = {
  id: string
  digitalIdentities: string[]
  trusted: boolean
  keynodes: Keynode[]
}

type State = {
  searchMode: boolean
  pullVaultDrawer: boolean
  addKeynodeDrawer: boolean
  activeVaults: string[]
  activeKeynode: string
  gestalts: Gestalt[]
  searchQueryDI: string
  foundDI: FoundDigitalIdentity[]
}

const state: State = {
  searchMode: false,
  pullVaultDrawer: false,
  addKeynodeDrawer: false,
  activeVaults: [],
  activeKeynode: '',
  searchQueryDI: '',
  foundDI: [],
  gestalts: [],
  // gestalts: [
  //   {
  //     id: '1',
  //     digitalIdentities: ['gideonairex'],
  //     trusted: true,
  //     keynodes: [
  //       {
  //         id: '10',
  //         name: 'Desktop Laptop',
  //         digitalIdentity: [
  //           {
  //             type: 'github',
  //             username: 'gideonairex'
  //           }
  //         ],
  //         vaults: ['Work', 'Accounting']
  //       },
  //       {
  //         id: '11',
  //         name: 'IPhone',
  //         digitalIdentity: [
  //           {
  //             type: 'github',
  //             username: 'gideonairex'
  //           }
  //         ],
  //         vaults: ['Personal']
  //       }
  //     ]
  //   },
  //   {
  //     id: '2',
  //     digitalIdentities: ['faith'],
  //     trusted: false,
  //     keynodes: [
  //       {
  //         id: '20',
  //         name: 'Desktop Laptop',
  //         digitalIdentity: [
  //           {
  //             type: 'github',
  //             username: 'faith'
  //           }
  //         ],
  //         vaults: ['Secret']
  //       }
  //     ]
  //   },
  //   {
  //     id: '3',
  //     digitalIdentities: ['robbie'],
  //     trusted: false,
  //     keynodes: []
  //   },
  //   {
  //     id: '4',
  //     digitalIdentities: ['lucas'],
  //     trusted: true,
  //     keynodes: [
  //       {
  //         id: '40',
  //         name: 'Desktop Laptop',
  //         digitalIdentity: [
  //           {
  //             type: 'github',
  //             username: 'lucas'
  //           }
  //         ],
  //         vaults: []
  //       }
  //     ]
  //   }
  // ]
}

export { actionsExt as actions }

export default {
  namespaced: true,
  state,
  actions: {
    async [actionsInt.DiscoverGestaltIdentity](
      { dispatch, commit },
      identity: string,
    ) {
      PolykeyClient.DiscoverGestaltIdentity(
        {
          key: identity,
          providerKey: 'github.com',
        },
        (error, result) => {
          console.log('--- discovery --- ')
          console.log(result)
        },
      )
      // setInterval(()=>{
      //   dispatch(actionsInt.GetGestalts)
      // }, 2000 )
    },
    async [actionsInt.SearchMode]({ commit }, searchMode: boolean) {
      commit(mutations.SetSearchMode, searchMode)
    },
    async [actionsInt.ToggleAddKeyNode]({ commit }, close?: boolean) {
      commit(mutations.SetAddKeynode, close)
    },
    async [actionsInt.PullVaultDrawer]({ commit }, pullVaultDrawer: boolean) {
      if (pullVaultDrawer) {
        commit(mutations.SetAddKeynode, false)
      }
      commit(mutations.SetPullVaultDrawer, pullVaultDrawer)
    },
    async [actionsInt.ActiveKeynodeVaults](
      { commit, state },
      keynodeId: number,
    ) {
      let activeVaults = []
      for (let i = 0; i < state.gestalts.length; ++i) {
        const gestalt = state.gestalts[i]
        for (let k = 0; k < gestalt.keynodes.length; ++k) {
          const currentKeynode = gestalt.keynodes[k]
          if (currentKeynode.id === keynodeId) {
            activeVaults = currentKeynode.vaults
          }
        }
      }
      commit(mutations.SetActiveKeynodeVaults, {
        activeVaults,
        activeKeynode: keynodeId,
      })
    },
    async [actionsInt.SearchDI]({ commit, state }, searchQueryDI: string) {
      console.log('--- searching ---')
      /** Reset everytime there is new search */
      commit(mutations.SetFoundDI, [])
      commit(mutations.SetSearchDI, searchQueryDI)

      await PolykeyClient.GetConnectedIdentityInfos(
        {
          providerKey: 'github.com',
          searchTermList: [searchQueryDI],
        },
        (error, key) => {
          console.log('key:', key)
          const foundDI = state.foundDI
          let newFoundDI = [...foundDI]
          if (newFoundDI.indexOf(key) < 0) {
            //if (key.toLowerCase().match(searchQueryDI.toLowerCase())) {
            newFoundDI = [...newFoundDI, key]
            //}
            commit(mutations.SetFoundDI, newFoundDI)
          }
        },
      )

      // try {
      //   const gestaltsByIdentity = await PolykeyClient.GetGestaltByIdentity({
      //     providerKey : 'github.com',
      //     key : searchQueryDI
      //   });

      //   const foundGestalts = gestaltsByIdentity.matrix;

      //   if(foundGestalts) {
      //     const gestaltProfile = Object.keys(foundGestalts);
      //     for(let i = 0; i < gestaltProfile.length; ++i) {
      //       const rawKey = gestaltProfile[i];
      //       console.log(rawKey)
      //       const key = JSON.parse(rawKey);
      //       if(key.p) {
      //         let gestaltIdentity: FoundDigitalIdentity = {
      //           provider: '',
      //           key: '',
      //           keynodes : []
      //         };
      //         gestaltIdentity.provider = key.p;
      //         gestaltIdentity.key = key.key;
      //         const keynodes = Object.keys(foundGestalts[rawKey]);

      //         for( let k = 0; k < keynodes.length; ++k) {
      //           const rawKeynode = keynodes[k];
      //           const keynode = JSON.parse(keynodes[k])
      //           let foundKeynode:FoundKeynode = {
      //             key: keynode.key,
      //             identity: foundGestalts[rawKey][rawKeynode].identity,
      //             provider: foundGestalts[rawKey][rawKeynode].provider
      //           }
      //           gestaltIdentity.keynodes.push(foundKeynode)
      //         }
      //         commit(mutations.SetFoundDI, [gestaltIdentity]);
      //       }
      //     }
      //   }
      // } catch (e) {
      //   console.log(e)
      // }
    },
    async [actionsInt.PingNodes]({ commit, state }) {
      state.gestalts.forEach(async (gestalt) => {
        gestalt.keynodes.forEach(async (keynode) => {
          if (keynode.id) {
            try {
              await PolykeyClient.PingPeer({
                publicKeyOrHandle: keynode.id,
                timeout: 300,
              })
              keynode.online = true
            } catch (e) {
              keynode.online = false
            }
          }
        })
      })
      commit(mutations.SetGestalt, state.gestalts)
    },
    /**
     * GetGestalts
     */
    async [actionsInt.GetGestalts]({ commit }) {
      const gestalts = await PolykeyClient.GetGestalts({})
      const toArrayGestalts = Object.keys(gestalts).map((gestaltId) => {
        return gestalts[gestaltId]
      })
      //     peers.push({
      //       id: node.id,
      //       digitalIdentities: [identity.key],
      //       trusted: false,
      //       keynodes: [
      //         {
      //           id: node.id,
      //           name: node.id,
      //           digitalIdentity: [
      //             {
      //               type: 'github',
      //               username: identity.key
      //             }
      //           ],
      //           vaults: []
      //         }
      //       ]
      //     });
      commit(mutations.SetGestalt, toArrayGestalts)
    },
  },
  mutations: {
    [mutations.SetSearchMode]: function (state: State, searchMode: boolean) {
      state.searchMode = searchMode
    },
    [mutations.SetPullVaultDrawer]: function (
      state: State,
      pullVaultDrawer: boolean,
    ) {
      state.pullVaultDrawer = pullVaultDrawer
    },
    [mutations.SetAddKeynode](state, close?: boolean) {
      console.log('toggle', state.addKeynodeDrawer)
      state.pullVaultDrawer = false
      if (close === false || close === true) {
        state.addKeynodeDrawer = close
      } else {
        state.addKeynodeDrawer = !state.addKeynodeDrawer
      }
    },
    [mutations.SetActiveKeynodeVaults]: function (
      state: State,
      activeKeynode: ActiveKeynode,
    ) {
      state.activeVaults = activeKeynode.activeVaults
      state.activeKeynode = activeKeynode.activeKeynode
    },
    [mutations.SetSearchDI]: function (state: State, searchQueryDI: string) {
      state.searchQueryDI = searchQueryDI
    },
    [mutations.SetFoundDI]: function (
      state: State,
      foundDI: FoundDigitalIdentity[],
    ) {
      state.foundDI = foundDI
    },
    /**
     * Temporary
     */
    [mutations.SetGestalt]: function (state: State, gestalts: Gestalt[]) {
      state.gestalts = gestalts
    },
  },
  getters: {},
}
