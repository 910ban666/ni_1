import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vueSetupExtendPlugin from 'vite-plugin-vue-setup-extend'

// https://vite.dev/config/
// GitHub Pages 部署在子路径：https://910ban666.github.io/ni_1/
// 生产打包必须用 '/ni_1/'，否则 css/js 会 404；本地开发仍用 '/' 方便访问。
export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    vueDevTools(),
    vueSetupExtendPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: command === 'build' ? '/ni_1/' : '/',
}))