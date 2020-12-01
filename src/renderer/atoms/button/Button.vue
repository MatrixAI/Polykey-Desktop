<template>
  <a-button v-bind="$props" >
    <template v-for="(_, name) in $slots" v-slot:[name]="slotData"><slot :name="name" v-bind="slotData" /></template>
  </a-button>
</template>
