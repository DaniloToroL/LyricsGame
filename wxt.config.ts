import { defineConfig } from 'wxt';
import vue from '@vitejs/plugin-vue';
import { resolve, dirname } from "node:path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["activeTab", "storage"],
  },
  imports: {
    addons: {
      vueTemplate: true,
    },
  },
  vite: () => ({
    plugins: [vue()],
  }),
});
