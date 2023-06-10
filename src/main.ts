import {createApp} from 'vue'
import '../packages/style/style.css'
import App from './App.vue'
import router from './router'
import Button from "./components/button.vue";

createApp(App).component('ak-button', Button).use(router).mount('#app')
