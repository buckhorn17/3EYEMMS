import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { glob } from 'glob';

import liveReload from 'vite-plugin-live-reload';

function moveOutputPlugin() {
  return {
    name: 'move-output',
    enforce: 'post',
    apply: 'build',
    async generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (fileName.startsWith('pages/')) {
          const newFileName = fileName.slice('pages/'.length);
          bundle[fileName].fileName = newFileName;
        }
      }
    },
  };
}

// 新增這個函數處理圖片檔案
function copyImagesPlugin() {
  return {
    name: 'copy-images',
    apply: 'build',
    async buildStart() {
      const images = glob.sync('./assets/images/card/inFrame/*.png','./assets/images/card/inFrame/past/*.png','./assets/images/card/inFrame/past/content/*.png','./assets/images/card/inFrame/present/*.png','./assets/images/card/inFrame/present/content/*.png','./assets/images/card/inFrame/future/*.png','./assets/images/card/inFrame/future/content/*.png');
      images.forEach((image) => {
        this.emitFile({
          type: 'asset',
          fileName: path.basename(image),
          source: path.resolve(image),
        });
      });
    },
  };
}

export default defineConfig({
  // base 的寫法：
  // base: '/Repository 的名稱/'
  base: '/3EYEMMS/',
  plugins: [
    liveReload(['./layout/**/*.ejs', './pages/**/*.ejs', './pages/**/*.html']),
    ViteEjsPlugin(),
    moveOutputPlugin(),
    copyImagesPlugin(),
  ],
  server: {
    // 啟動 server 時預設開啟的頁面
    open: 'pages/index.html',
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync('pages/**/*.html')
          .map((file) => [
            path.relative('pages', file.slice(0, file.length - path.extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
    },
    outDir: 'dist',
  },
});
