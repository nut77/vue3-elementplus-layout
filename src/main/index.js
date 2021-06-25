import Vue from 'vue';
import App from '@l/Wrapper.vue';
import router from '@/router';
import store from '@/store';
import ElementUI from 'element-ui';
import GlobalOperation from './globalOperation';
import 'element-ui/lib/theme-chalk/index.css';
import '@a/styles/index.less';

Vue.config.productionTip = false;
Vue.use(ElementUI, {size: 'medium'});
// 注册全局引用的组件、过滤器、指令、混入、工具方法等
Vue.use(GlobalOperation);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
