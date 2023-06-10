import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import DocPreview from './packages/src'
//import DocPreview from 'vite-plugin-doc-preview'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({include: [/\.vue$/, /\.md$/]}),
    DocPreview({})
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
