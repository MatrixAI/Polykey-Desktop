<template>
  <div class="flex px-5">
    <!-- div class="w-3/4" -->
    <div class="w-full h-body">
      <div class="text-lg text-content1 font-bold mt-8">Gestalt Profile</div>
      <div class="text-sm">List of Keynodes</div>
      <!-- Keynodes -->
      <div class="mt-8">
        <!-- Sample container  #1-->
        <div class="flex">
          <!-- Line breaker -->
          <div class="line flex flex-row">
            <div class="w-1/12 border-dashed border-r-2"></div>
            <div class="w-11/12 flex flex-col line-padding">
              <div class="line-breaker flex items-center"><div class="w-full border-dashed border-t-2"></div></div>
            </div>
          </div>
          <!-- Contents here -->
          <div class="content-body border-content3 border-2 rounded-lg pb-3">
            <!-- Header -->
            <div class="flex justify-between p-2 border-b-2 border-content3">
              <div class="flex justify-between text-content1 text-sm font-bold items-center">
                <div class="mr-2">{{ profile.peerId }}-</div>
              </div>
            </div>

            <!-- Content -->
            <div class="flex p-6">
              <!-- DI -->
              <div class="flex flex-col w-36 justify-start items-center">
                <div v-html="icon" class="pr-6"></div>
              </div>

              <div class="flex flex-col flex-1">
                <div class="font-bold text-base">ALIAS NAME</div>
                <div class="mt-2 w-full pr-4">
                  <a-input :value="profile.alias" class="rounded" placeholder="Enter Alias" />
                </div>
                <div class="mt-6 font-bold text-base">BIO</div>
                <div class="mt-2 w-full pr-4">
                  <a-textarea class="rounded" />
                </div>
              </div>

              <div class="flex flex-col flex-1">
                <div class="font-bold text-base">PUBLIC KEY</div>
                <div class="pr-2 mt-2">
                  <a-textarea :value="profile.publicKey" class="rounded" />
                </div>
                <div class="font-bold text-base mt-4">DIGITAL IDENTITY PROOF</div>
                <div class="mb-3">List of Digital Identites.</div>

                <div
                  :class="[
                    authCode ? 'rounded-t-md' : 'rounded',
                    'flex justify-between items-center border border-content2 pl-2 pr-1 py-1'
                  ]"
                >
                  <div class="flex items-center">
                    <Github class="mr-1 h-5" />
                    <div v-if="!profile.linkInfoList.length" class="text-content2 font-bold">Github</div>
                    <div v-else class="text-content2 font-bold">{{ profile.linkInfoList[0].identity}}</div>
                  </div>

                  <div v-if="!profile.linkInfoList.length" @click="authenticate" class="flex items-center border-2 px-2 bg-grey4 cursor-pointer">
                    <div class="text-primary2 font-bold">Authenticate</div>
                  </div>
                  <div v-else class="flex items-center border-2 px-2 bg-grey4">
                    <Augment class="mr-2 h-5" />
                    <div class="text-primary2 font-bold">Augmented</div>
                  </div>
                </div>
                <div v-if="authCode" class="flex flex-col border border-content2 rounded-b-md p-2">
                  <div class="text-center text-lg font-bold mt-2 mb-2">{{ authCode }}</div>
                  <div class="text-xs mb-1">
                    Copy paste this code to authenticate. After authenticating enter your username and augment.
                  </div>
                  <div class="flex flex-row">
                    <a-input @input="updateUsername" class="rounded" placeholder="Enter username" />
                    <PrimaryButton @click="augment">Augment</PrimaryButton>
                  </div>
                  <div v-if="error" class="text-xs text-red-400 mt-1">{{ error }}</div>
                </div>

                <div class="mt-2">Augmentation of other digital identities will be made available soon.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/** Libs */
import PolykeyClient from '@/renderer/resources/client';
import { defineComponent, onMounted, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { toSvg } from 'jdenticon';
import { useRouter } from 'vue-router';

/** Components */
import Search from '@/renderer/molecules/search/Search.vue';
import PrimaryButton from '@/renderer/atoms/button/PrimaryButton.vue';

/** Assets */
import Github from '@/renderer/assets/github.svg';
import Augment from '@/renderer/assets/augment.svg';

/** Store */
import { actions } from '@/renderer/store/modules/User';
import { actions as actionsGestalt } from '@/renderer/store/modules/Gestalt';

export default defineComponent({
  components: {
    Search,
    Github,
    Augment,
    PrimaryButton
  },
  setup() {
    const error = ref('');
    const authCode = ref('');
    const username = ref('');
    const store = useStore();
    const router = useRouter();
    const profile = computed(() => store.state.User.localPeerInfo);

    /** Use this later for viewing of profile from identities */
    const id = router.currentRoute.value.params.id;

    onMounted(async () => {
      store.dispatch(actions.GetLocalPeerInfo);
      /** Getting info */
      // const identity = await PolykeyClient.GetIdentityInfo();
      //console.log(identity)
    });

    console.log(profile);


    return {
      error,
      authCode,
      profile,
      updateUsername: e => {
        username.value = e.target.value;
      },
      authenticate: async () => {
        try {
          const result = await PolykeyClient.AuthenticateProvider({
            providerKey: 'github.com'
          });
          authCode.value = result;
        } catch (e) {
          console.log(e);
        }
      },
      augment: async () => {
        if(!username.value) {
          return error.value = 'Please input username';
        }
        try {
          const result = await PolykeyClient.AugmentKeynode({
            identityKey: username.value,
            providerKey: 'github.com'
          });


          store.dispatch(actions.GetLocalPeerInfo);
          authCode.value = '';
        } catch (e) {
          error.value = 'Please authenticate with Github';
        }
      },
      icon: toSvg(profile.peerId, 100),
      updateFilter: () => {}
    };
  }
});
</script>
<style scoped>
.h-body {
  height: calc(100vh - 42px - 75px);
}
.line {
  width: 40px;
}
.content-body {
  width: calc(100vw - 40px);
}
.line-breaker {
  height: 40px;
}
.line-padding {
  padding-bottom: 14px;
}
</style>
