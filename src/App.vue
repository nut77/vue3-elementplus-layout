<template>
  <el-button type="primary" @click="inc">{{ count }}</el-button>
  <span></span>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + Vite" />
</template>

<script setup>
import HelloWorld from './components/HelloWorld.vue';
import { ref } from 'vue';

const count = ref(0);
const inc = () => {
  count.value++;
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: @color-text-primary !important;
  margin-top: 60px;
}
</style>
