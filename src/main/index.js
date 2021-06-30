import {createApp} from 'vue';
import ElementPlus from 'element-plus';
import store from '@/store';
import router from '@/store';
import '@a/styles/index.less';
import App from '@p/login/Index.vue';
// import GlobalOperation from './main/globalOperation';

const app = createApp(App);
function getModules(name) {
  let modulesFiles = import.meta.globEager('/src/test/*.js');
  if (name === 'directives') modulesFiles = import.meta.globEager('/src/directives/*.js');
  if (name === 'utils') modulesFiles = import.meta.globEager('/src/utils/*.js');
  if (name === 'api') modulesFiles = import.meta.globEager('/src/api/*.js');
  // if (name === 'components') modulesFiles = import.meta.globEager('/src/components/*.vue');

  app.config.globalProperties['$' + name] = Object.keys(modulesFiles).reduce((modules, path) => {
    const key = path.replace(/.+\/(\w+)\.(js|vue)$/g, '$1');
    const mod = modulesFiles[path];
    modules[key] = mod.default || mod || {};
    return modules;
  }, {});
}
getModules('api');
app.use(ElementPlus, {size: 'medium'}).use(store).use(router).mount('#app');
