import { createApp } from "vue";
import App from "./App.vue";

console.log(import.meta.env.MODE);
console.log(import.meta.env.VITE_AXIOS_BASE_URL);
createApp(App).mount("#app");
