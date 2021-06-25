import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import store from '@/store';

Vue.use(VueRouter);

// 处理路由重复（点击）报错问题
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};

const router = new VueRouter({
  mode: 'history',
  // base: '/pro/',
  routes
});

router.beforeEach((to, from, next) => {
  // 验证是否登录
  const token = store.state.userInfo.token;
  if (to.path !== '/login' && (token === 'null' || !token)) {
    next('/login');
    return false;
  }

  // token存在 访问不存在的页面、登录页、不属于自己权限内的页面 默认跳转首页 普通用户：任务中心 管理员：系统管理-用户管理
  const role = store.state.userInfo.role || '普通用户';
  const pageHomePath = role === '管理员' ? '/system-manage/user' : '/home';
  if ((token !== 'null' && token) && (to.path === '/login' || to.matched.length === 0 || !to.meta.authority.includes(role))) {
    next(pageHomePath);
    return false;
  }

  // 任务详情页-始终添加taskId（任务id）
  if (to.fullPath.includes('/task-detail')) {
    if (to.query.taskId) {
      next();
    } else if (from.query.taskId) {
      to.query.taskId = from.query.taskId;
      next({path: to.path, query: to.query, params: to.params});
    } else {
      next('/task-center');
    }
    return false;
  }

  next();
});

export default router;
