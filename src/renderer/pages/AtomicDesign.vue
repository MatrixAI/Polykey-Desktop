<template>
  <h1>Text</h1>
  <div class="font-nunito text-grey1">Hello</div>
  <div class="font-opensans text-content1">Hello</div>
  <div class="font-robotomono text-primary4">Hello</div>
  <h1>Buttons</h1>
  <PKButton class="bg-primary3 text-grey1 rounded-p2 font-opensans text-sm font-bold">
    DISABLED BUTTON
  </PKButton>
  <PKButton
    type="default"
    class="
  bg-primary1
  text-grey1
  border-primary1b
  rounded-p2
  font-opensans
  text-sm
  font-bold
  hover:bg-primary1b
  hover:text-grey1
  hover:border-white
  focus:bg-primary1b
  focus:text-grey1
  focus:outline-none
  focus:border-bg-primary1
  focus:border-white"
  >
    PRIMARY BUTTON
  </PKButton>
  <PKButton
    type="default"
    class="
  bg-grey2
  text-content1
  border-content1
  rounded-p2
  font-opensans
  text-sm
  font-bold
  hover:bg-grey3
  hover:text-content1
  hover:border-content2

  focus:bg-grey3
  focus:text-content1
  focus:outline-none
  focus:border-bg-primary1
  focus:border-content2"
  >
    SECONDARY BUTTON
  </PKButton>
  <PKButton
    type="default"
    class="
  bg-sematic1b
  text-sematic1
  border-sematic1
  rounded-p2
  font-opensans
  text-sm
  font-bold
  hover:bg-sematic1b
  hover:text-sematic1
  hover:border-sematic1

  focus:bg-sematic1b
  focus:text-sematic1
  focus:outline-none
  focus:border-bg-primary1
  focus:border-sematic1"
  >
    NEGATIVE BUTTON
  </PKButton>

  <div class="inline-flex items-center px-4 py-2 bg-primary4 text-primary1 font-opensans font-bold rounded-full">
    <div class="mr-2">
      Option
    </div>
    <div class="cursor-pointer">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.41425 6.00001L11.7072 1.70701C12.0982 1.31601 12.0982 0.684006 11.7072 0.293006C11.3162 -0.0979941 10.6842 -0.0979941 10.2933 0.293006L6.00025 4.58601L1.70725 0.293006C1.31625 -0.0979941 0.68425 -0.0979941 0.29325 0.293006C-0.09775 0.684006 -0.09775 1.31601 0.29325 1.70701L4.58625 6.00001L0.29325 10.293C-0.09775 10.684 -0.09775 11.316 0.29325 11.707C0.48825 11.902 0.74425 12 1.00025 12C1.25625 12 1.51225 11.902 1.70725 11.707L6.00025 7.41401L10.2933 11.707C10.4882 11.902 10.7443 12 11.0002 12C11.2562 12 11.5122 11.902 11.7072 11.707C12.0982 11.316 12.0982 10.684 11.7072 10.293L7.41425 6.00001Z"
          fill="#116466"
        />
      </svg>
    </div>
  </div>

  <div class="bg-content3 inline-block p-1 rounded-sm">
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.98941 3.75452C5.55378 3.75452 3.05534 5.1642 1.08847 7.98358C1.03233 8.06494 1.00156 8.16112 1.00006 8.25996C0.998556 8.3588 1.02639 8.45586 1.08003 8.53889C2.59128 10.9045 5.05628 12.7545 7.98941 12.7545C10.8907 12.7545 13.4063 10.8989 14.9203 8.52795C14.9727 8.44655 15.0006 8.35179 15.0006 8.25499C15.0006 8.15818 14.9727 8.06342 14.9203 7.98202C13.4028 5.63827 10.8688 3.75452 7.98941 3.75452Z"
        stroke="#1F211B"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8 10.7545C9.38071 10.7545 10.5 9.63523 10.5 8.25452C10.5 6.8738 9.38071 5.75452 8 5.75452C6.61929 5.75452 5.5 6.8738 5.5 8.25452C5.5 9.63523 6.61929 10.7545 8 10.7545Z"
        stroke="#1F211B"
        stroke-miterlimit="10"
      />
    </svg>
  </div>
</template>
<script>
import PKButton from '@/renderer/atoms/button/Button.vue'
import { DownloadOutlined } from '@ant-design/icons-vue'

export default {
  components: {
    PKButton,
    DownloadOutlined
  }
}
</script>

<style scoped></style>
