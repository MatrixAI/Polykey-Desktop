<template>
  <div class="flex">
    <!-- div class="w-3/4" -->
    <div class="w-full">
      <Control />
      <div class="h-body">
        <EmptyVault v-show="empty" />
        <div v-show="!empty">
          <div class="mt-5">
            <!-- Breadcrumbs, Filters and Sort -->
            <div class="flex justify-between align-middle items-center">
              <!-- Need to clarify this at vault level list-->
              <div>/</div>
              <div class="flex">
                <div class="border-r border-content2 border-opacity-10 pr-3">Filters</div>
                <div class="pl-3">Sort by: Secret Name A -> Z</div>
              </div>
            </div>

            <!-- Content -->
            <div class="mt-3">
              <div class="flex bg-grey6 font-bold text-content2 py-3 px-3">
                <div class="w-1/12"><CheckBox /></div>
                <div class="w-4/12">Vault</div>
                <div class="w-1/12">Files</div>
                <div class="w-1/12">History</div>
                <div class="w-2/12">Shared with</div>
                <div class="w-2/12">Date Created</div>
                <div class="w-1/12 text-right">Actions</div>
              </div>

              <!-- Sample Content -->
              <div class="flex py-4 pl-3 border-b border-content4 border-opacity-50">
                <div class="w-1/12 flex items-center"><CheckBox /></div>
                <div class="w-4/12 flex">
                  <div class="flex items-center">
                    <div v-html="vault" class="mr-1"></div>
                  </div>
                  <div class="flex flex-col">
                    <div class="text-primary1 font-bold opacity-90 mr-3">Vault 1</div>
                    <div class="text-content1 text-xxs flex">
                      <div class="font-bold">You&nbsp;</div>
                      <div>commited 2 days</div>
                    </div>
                  </div>
                </div>
                <div class="w-1/12 flex items-center">3</div>
                <div class="w-1/12 flex items-center">5</div>
                <div class="w-2/12 flex items-center">
                  <div v-html="share1" class="mr-1 border border-content4"></div>
                  <div v-html="share2" class="mr-1 border border-content4"></div>
                  +22
                </div>
                <div class="w-2/12 flex items-center">25/11/2020 11:30AM</div>
                <div class="w-1/12 flex flex-row justify-end items-center">
                  <Download class="mr-2" />
                  <Copy class="mr-2" />
                  <More />
                </div>
              </div>

              <div class="flex py-4 pl-3 border-b border-content4 border-opacity-50">
                <div class="w-1/12 flex items-center"><CheckBox /></div>
                <div class="w-4/12 flex">
                  <div class="flex items-center">
                    <div v-html="vault1" class="mr-1"></div>
                  </div>
                  <div class="flex flex-col">
                    <div class="text-primary1 font-bold opacity-90 mr-3">Personal</div>
                    <div class="text-content1 text-xxs flex">
                      <div class="font-bold">You&nbsp;</div>
                      <div>commited 10 days</div>
                    </div>
                  </div>
                </div>
                <div class="w-1/12 flex items-center">2</div>
                <div class="w-1/12 flex items-center">1</div>
                <div class="w-2/12 flex items-center">
                  <div v-html="share3" class="mr-1 border border-content4"></div>
                  <div v-html="share4" class="mr-1 border border-content4"></div>
                  +3
                </div>
                <div class="w-2/12 flex items-center">01/02/2020 5:30AM</div>
                <div class="w-1/12 flex flex-row justify-end items-center">
                  <Download class="mr-2" />
                  <Copy class="mr-2" />
                  <More />
                </div>
              </div>

            </div>

            <div>Pagination</div>
          </div>
        </div>
      </div>
    </div>
    <!-- div class="w-1/4">
      Slider
    </div -->
  </div>
</template>
<script>
import { toSvg } from 'jdenticon'
import Control from '@/renderer/molecules/control/Control.vue'
import EmptyVault from '@/renderer/molecules/empty-vault/EmptyVault.vue'
import CheckBox from '@/renderer/assets/checkbox.svg'
import Download from '@/renderer/assets/download.svg'
import Copy from '@/renderer/assets/copy.svg'
import More from '@/renderer/assets/more.svg'

import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    Control,
    EmptyVault,
    CheckBox,
    Download,
    Copy,
    More
  },
  data() {
    return {
      empty: true,
      vault: toSvg('vault', 34),
      vault1: toSvg('vault1', 34),
      share1: toSvg('share1', 22),
      share2: toSvg('share2', 22),
      share3: toSvg('share3', 22),
      share4: toSvg('share4', 22)
    }
  }
})
</script>
<style scoped>
.h-body {
  height: calc(100vh - 42px - 75px);
}
</style>
