<template>
  <el-container class="app-container">
    <wrapper-top
      v-if="hasWrapperTop"
      :navList="menuTop"
      :path="path"
      @setEnableSetMenuLeft="setEnableSetMenuLeft"
      @toggleCollapse="toggleCollapse">
    </wrapper-top>
    <el-container v-if="(hasWrapperLeft && !isOnlyNavTop) || (isOnlyNavLeft && $route.meta.isNav)">
      <wrapper-left
        :key="menuLeftKey"
        :navList="menuLeft"
        :path="path"
        :isCollapse="isCollapse">
      </wrapper-left>
      <wrapper-content :class="wrapperContentClass"></wrapper-content>
    </el-container>
    <wrapper-content v-else :class="wrapperContentClass"></wrapper-content>
  </el-container>
</template>

<script>
import WrapperLeft from './WrapperLeft';
import WrapperTop from './WrapperTop';
import WrapperContent from './WrapperContent';
import mixins from '@/mixins';
export default {
  name: 'Wrapper',
  components: {WrapperLeft, WrapperTop, WrapperContent},
  mixins: [mixins.userInfo],
  data() {
    return {
      hasWrapperTop: true,
      hasWrapperLeft: true,
      routes: null,
      menuLeft: [],
      menuLeftKey: Date.now(),
      isEnableSetMenuLeft: true,
      isCollapse: false,
      path: ['/home'],
      operationTime: {
        action: ['mousemove', 'keyup', 'click'],
        timeoutInterval: process.env.VUE_APP_TIMEOUT_INTERVAL * 60 * 1000,
        timeId: 0
      }
    };
  },
  computed: {
    menuTop() {
      return this.routes.filter(item => item.meta.index === 1 && item.meta.isNav);
    },
    isOnlyNavTop() {
      return this.$store.state.isOnlyNavTop;
    },
    isOnlyNavLeft() {
      return !this.$store.state.isOnlyNavTop && this.$store.state.isOnlyNavLeft;
    },
    wrapperContentClass() {
      if (!this.hasWrapperTop && !this.hasWrapperLeft) return 'pd0';
      if (!this.hasWrapperLeft) return 'pd30';
      return 'pd20';
    }
  },
  methods: {
    setEnableSetMenuLeft(enable) {
      this.isEnableSetMenuLeft = enable;
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    refreshWrapper(route) {
      this.hasWrapperTop = route.meta.hasWrapperTop;
      this.hasWrapperLeft = route.meta.hasWrapperLeft;
    },
    setMenuLeft(route) {
      if (this.isOnlyNavTop) return;
      if (this.isOnlyNavLeft) {
        this.menuLeft = this.menuTop;
        return;
      }
      if (!this.routes || !route.matched.length) return;
      const parentPath = route.matched[0].path;
      const parentRouteConfig = this.routes.find(item => item.path === parentPath);
      this.menuLeft = parentRouteConfig && parentRouteConfig.children ? parentRouteConfig.children.filter(item => item.meta.isNav) : [];
      // 顶部 + 左侧 这种导航结构，当点击顶部菜单时，才去更新左侧导航菜单，要给左侧导航菜单设置key不然多级导航展开的不会收缩
      this.menuLeftKey = Date.now();
      this.setEnableSetMenuLeft(false);
    },
    setPath(route) {
      this.path = route.matched.length ? route.matched.map(item => item.path) : [route.path || '/home'];
    },
    initLayout(route) {
      route = route || this.$route;
      this.refreshWrapper(route);
      this.setPath(route);
      (this.isEnableSetMenuLeft || !this.menuLeft.length) && this.setMenuLeft(route);
    },
    updateOperationTime() {
      if (this.operationTime.timeId) clearTimeout(this.operationTime.timeId);
      this.operationTime.timeId = setTimeout(() => {
        if (location.pathname !== '/login') this.logout();
        this.operationTime.timeId = 0;
      }, this.operationTime.timeoutInterval);
    }
  },
  watch: {
    $route(toRoute) {
      this.initLayout(toRoute);
      // 若当前页面被内嵌则修改浏览器访问地址为实际访问地址
      (window.self !== window.top) && (top.location.href = window.location.href);
    }
  },
  created() {
    this.routes = this.$router.options.routes;
    this.initLayout();
    this.updateOperationTime();
    this.operationTime.action.map(type => document.addEventListener(type, this.updateOperationTime));
  },
  destroyed() {
    this.operationTime.action.map(type => document.removeEventListener(type, this.updateOperationTime));
  }
};
</script>

<style lang="less" scoped>
  body,
  .app-container {
    width: 100%;
    height: 100%;
    flex-direction: column;
  }
  .el-container {
    overflow: hidden;
  }
</style>
