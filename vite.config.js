import { fileURLToPath, URL } from "node:url";

import { defineConfig, splitVendorChunkPlugin } from "vite";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";

import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import ElementPlus from "unplugin-element-plus/vite";
import { viteMockServe } from "vite-plugin-mock";
import { viteStaticCopy } from 'vite-plugin-static-copy'


// https://vitejs.dev/config/
export default ({ command }) => {
  return defineConfig({
    envDir: "./env",
    server: {
      host: "127.0.0.1",
      proxy: {
        "/api": {
          target: "http://10.101.40.3:1919/"
        },
        "/atlas_data": {
          target: "http://10.11.140.35:2000/"
        }
      }
    },
    plugins: [
      splitVendorChunkPlugin(),
      viteCompression({
        threshold: 102400
      }),
      vue(),
      ElementPlus({useSource: true}),
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
