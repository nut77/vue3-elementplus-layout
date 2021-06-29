<template>
  <el-aside :style="{width: `${isCollapse ? 63 : 240}px !important`}">
    <el-menu
      :collapse="isCollapse"
      :router="true"
      :default-active="activePath"
      class="el-menu-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <wrapper-menu-item :navList="navList"></wrapper-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
import WrapperMenuItem from './WrapperMenuItem';
export default {
  name: 'WrapperLeft',
  props: ['navList', 'path', 'isCollapse'],
  components: {WrapperMenuItem},
  data() {
    return {
      activePath: this.path[this.path.length - 1]
    };
  },
  watch: {
    path() {
      this.activePath = this.path[this.path.length - 1];
    }
  }
};
</script>

<style lang="less" scoped>
  .el-aside {
    background-color: @background-color-lighter;
    text-align: center;
    line-height: 200px;
  }
  /deep/ .el-menu-item,
  /deep/ .el-submenu__title {
    background-color: @background-color-lighter !important;
    color: @color-text-regular !important;
    text-align: left;
    &:hover,
    &:hover * {
      color: rgba(65, 178, 255, 0.8) !important;
    }
  }
  /deep/ .el-menu-item.is-active,
  /deep/ .el-submenu.is-active .el-submenu__title * {
    color: @color-primary !important;
  }
</style>
