import {createApp} from 'vue';
import ElementPlus from 'element-plus';
import store from '@/store';
import router from '@/store';
import '@a/styles/index.less';
import App from '@p/login/Index';
// import GlobalOperation from './main/globalOperation';

const app = createApp(App);
async function getModules(name) {
  let modulesFiles = import.meta.glob('/src/test/*.js');
  if (name === 'directives') modulesFiles = import.meta.glob('/src/directives/*.js');
  if (name === 'utils') modulesFiles = import.meta.glob('/src/utils/*.js');
  if (name === 'api') modulesFiles = import.meta.glob('/src/api/*.js');
  if (name === 'components') modulesFiles = import.meta.glob('/src/components/*.vue');

  const modules = {};
  app.config.globalProperties['$' + name] = {};
  for (const path in modulesFiles) {
    const key = path.replace(/.+\/(\w+)\.(js|vue)$/g, '$1');
    modules[key] = await modulesFiles[path]().then(mod => mod.default || mod || {});
    app.config.globalProperties['$' + name][key] = modules[key];
  }
}
getModules('api');
app.use(ElementPlus, {size: 'medium'}).use(store).use(router).mount('#app');
