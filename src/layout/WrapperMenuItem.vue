<template>
  <div class="el-menu-item-box">
    <template v-for="item of list">
      <el-menu-item
        v-if="!item.children || (item.children && !isRecursive)"
        :index="item.meta.fullPath"
        :key="item.meta.fullPath">
        <template #title>
          <i :class="item.meta.iconClass"></i>
          <span>{{item.name}}</span>
        </template>
      </el-menu-item>
      <el-submenu v-else :key="item.meta.fullPath" :index="item.meta.fullPath">
        <template #title>
          <i :class="item.meta.iconClass"></i>
          <span>{{item.name}}</span>
        </template>
        <wrapper-menu-item :navList="item.children"></wrapper-menu-item>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'WrapperMenuItem',
  props: {
    navList: Array,
    // 是否需要递归显示导航菜单
    isRecursive: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    list() {
      return this.navList.filter(item => item.meta.isNav && item.meta.authority.includes(this.$store.state.userInfo.role));
    }
  }
};
</script>

<style scoped>

</style>
