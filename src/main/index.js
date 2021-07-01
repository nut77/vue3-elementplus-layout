import {createApp} from 'vue';
import ElementPlus from 'element-plus';
import store from '@/store';
import router from '@/router';
import '@a/styles/index.less';
import App from '@l/Wrapper.vue';
import GlobalOperation from '@/main/globalOperation';

const app = createApp(App);
app.use(ElementPlus, {size: 'medium'}).use(store).use(router).use(GlobalOperation).mount('#app');
