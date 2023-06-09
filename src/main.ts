import {createApp} from 'vue'
import './style.scss'
import App from './App.vue'
import router from './router'
import Button from "./components/button.vue";

createApp(App).component('ak-button', Button).use(router).mount('#app')
