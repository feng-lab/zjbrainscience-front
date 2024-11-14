import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import ElementPlus from "unplugin-element-plus/vite";
import { viteMockServe } from "vite-plugin-mock";
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default ({ command }) => {
  console.log('command', command)
  return defineConfig({
    envDir: "./env",
    server: {
      host: "0.0.0.0",
      port: 8090,
      disableHostCheck: true,
      proxy: {
        "/api": {
          // target: "http://127.0.0.1:8000/"
          // target: "http://10.15.57.134:8000/"
          target: "http://10.11.140.35:1919/"
          // target: "http://biodata-platform.biodata.svc.cluster.local/"
        },
        // "/api": {
        //   target: "http://10.11.140.35/",
        //   rewrite: (path) => path.replace(/^\/api1/, '/'), // 路径重写
        //   changeOrigin: true
        //   // secure: true, // target是否https接口
        //   // ws: true, // target是否代理websockets   
        // },
        "/atlas_data": {
          target: "http://10.11.140.35:2000/"
        }
      }
    },
    build: {
      sourcemap: "inline"
    },
    plugins: [
      vue(),
      ElementPlus({ useSource: true }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      viteMockServe({
        mockPath: "mock",
        localEnabled: true,
        watchFiles: true
      }),
      viteStaticCopy({
        targets: [
          {
            src: "../neuroglancer/dist/module/*.bundle.*",
            dest: ''
          }
        ]
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/css/theme.scss" as *;`,
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      dedupe: ['vue']
    }
  })
}
