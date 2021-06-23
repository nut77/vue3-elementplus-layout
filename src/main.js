import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import '@a/styles/index.less';
import App from './App.vue';

const app = createApp(App);
app.use(ElementPlus, { size: 'medium' });
console.log(import.meta.env.MODE);
console.log(import.meta.env.VITE_AXIOS_BASE_URL);
app.mount('#app');
