import {createApp} from 'vue';
import ElementPlus from 'element-plus';
import '@a/styles/index.less';
import App from './App.vue';
// import GlobalOperation from './main/globalOperation';

createApp(App).use(ElementPlus, {size: 'medium'}).mount('#app');
