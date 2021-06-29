<template>
  <el-main>
    <router-view class="full"></router-view>
  </el-main>
</template>

<script>
export default {
  name: 'WrapperContent'
};
</script>

<style lang="less" scoped>
  .el-main {
    background-color: @background-color-light;
  }
</style>
