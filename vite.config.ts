import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

//import Markdown from 'vite-plugin-md'
//import Markdown from 'vite-plugin-vue-markdown'

//import vitePluginDoc from "./plugins/doc"
import vitePluginDoc from './plugins/markedDoc'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({include: [/\.vue$/, /\.md$/]}),
    //Markdown(),
    vitePluginDoc()
  ],
  base: './',
  build: {
    outDir: 'docs'
  },
  server: {
    // 是否开启 https
    https: false,
    port: 5174,
    host: '0.0.0.0',
    open: false
  }
})
