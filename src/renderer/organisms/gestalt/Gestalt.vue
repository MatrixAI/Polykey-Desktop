<template>
  <div class="mt-8">
    <!-- Sample container  #1-->
    <div class="flex">
      <!-- Line breaker -->
      <div class="line flex flex-row">
        <div class="w-1/12 border-dashed border-r-2"></div>
        <div class="w-11/12 flex flex-col-reverse line-padding">
          <template v-for='keynode in gestalt.keynodes' :key='keynode.name' >
            <div class="line-breaker flex items-center"><div class="w-full border-dashed border-t-2"></div></div>
          </template>
        </div>
      </div>
      <!-- Contents here -->
      <div class="content-body border-content3 border-2 rounded-lg pb-3">
        <!-- Header -->
        <div @click="gotoProfile(gestalt.id)" class="flex justify-between p-2 border-b-2 border-content3 cursor-pointer hover:bg-content4">
          <div class="flex justify-between text-content1 text-sm font-bold items-center">
            <template v-for='digitalIdentity in gestalt.digitalIdentities' :key='digitalIdentity' >
              <div class="mr-2">@{{ digitalIdentity }}</div>
            </template>

            <div v-if="gestalt.trusted" class="flex bg-grey6 text-content2 font-normal items-center py-1 px-2 text-xs">
              <div class="mr-2"><Trust /></div>
              <div>Trusted</div>
            </div>
          </div>
        </div>
        <!-- Labels -->
        <div class="flex justify-between bg-grey6 text-content2 text-xs px-2 py-1 mb-3">
          <div class="w-4/5">Digital Identities</div>
          <div class="w-4/5">Keynode Identities</div>
          <div>Actions</div>
        </div>

        <!-- Content -->
        <template v-for='keynode in gestalt.keynodes' :key='keynode.name' >
          <div class="flex justify-between p-2">
            <!-- DI -->
            <div class="w-4/5 flex items-center">
              <template v-for='digitalIdentity in keynode.digitalIdentity' :key='digitalIdentity.username' >
                <div class="h-7 bg-content4 flex items-center px-2 py-1 mr-2">
                  <div class="mr-2"><Github class="h-3"/></div>
                  <div class="text-content1 text-xs font-bold">@{{ digitalIdentity.username }}</div>
                </div>
              </template>
            </div>
            <!-- Keynode Identities -->
            <div v-if="keynode.id" class="w-4/5 text-xs flex items-center">
              <div class="mr-1 relative">
                <div v-html="icon"></div>
                <Online v-if="keynode.online" class="absolute bottom-0 right-0"/>
                <Offline v-else class="absolute bottom-0 right-0"/>
              </div>
              <div>{{ keynode.name }}</div>
            </div>

            <!-- Actions -->
            <div class="flex items-center">
              <div v-if="keynode.id" class="mr-2"><DefaultButton size="small" @click="pullVaultDrawer(keynode.id)">Pull</DefaultButton></div>
              <!-- <div v-if="keynode.id" class="mr-2"><DefaultButton size="small">SCAN</DefaultButton></div> -->
              <div class="mr-2"><DefaultButton size="small" @click="discoverIdenity(keynode.digitalIdentity[0].username)">Discover</DefaultButton></div>
              <!-- <div>
                <a-button size="small" class="flex items-center justify-center">
                  <template #icon><MoreOutlined /></template>
                </a-button>
              </div> -->
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
/** Libs */
import { toSvg } from 'jdenticon';
import { defineComponent, computed } from 'vue';
import { MoreOutlined } from '@ant-design/icons-vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

/** Components */
import DefaultButton from '@/renderer/atoms/button/SmallDefaultButton.vue';

/** Assets */
import Twitter from '@/renderer/assets/twitter.svg';
import Trust from '@/renderer/assets/trust.svg';
import Github from '@/renderer/assets/github.svg';
import FB from '@/renderer/assets/fb.svg';
import Online from '@/renderer/assets/online.svg';
import Offline from '@/renderer/assets/offline.svg';

/** Store */
import { actions } from '@/renderer/store/modules/Gestalt';

export default defineComponent({
  components: {
    Twitter,
    Trust,
    FB,
    Github,
    MoreOutlined,
    DefaultButton,
    Online,
    Offline
  },
  props: {
    gestalt : {
      type : Object
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const gestalt = computed(() => props.gestalt);

    const pullVaultDrawer = (keynodeId) => {
      store.dispatch(actions.ActiveKeynodeVaults, keynodeId);
      store.dispatch(actions.PullVaultDrawer, true);
    }

    return {
      gestalt,
      pullVaultDrawer,
      gotoProfile: (id) => {
        router.replace(`/gestalt-profile/${id}`);
      },
      icon: toSvg('test', 30),
      discoverIdenity: (identity) => {
        store.dispatch(actions.DiscoverGestaltIdentity, identity);
      }
    };

  }
});
</script>
<style scoped>
.line {
  width: 40px;
}
.content-body {
  width: calc(100vw - 40px);
}
.line-breaker {
  height: 48px;
}
.line-padding {
  padding-bottom: 14px;
}
</style>
