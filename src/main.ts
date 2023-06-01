import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import CodePreview from './components/codePreview.vue'
import Button from "./components/button.vue";

createApp(App).component('CodePreview', CodePreview).component('ak-button', Button).use(router).mount('#app')
