import fs from 'fs';
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

// 定義將 PNG 檔案複製到 dist 目錄的函數
function copyPngFilesPlugin() {
  return {
    name: 'copy-png-files',
    apply: 'build',
    async writeBundle() {
      // 將 assets\images\card\inFrame 目錄下的所有 PNG 檔案複製到 dist 目錄中
      const pngFiles = glob.sync('assets/images/card/inFrame/**/*.png');
      pngFiles.forEach((file) => {
        const destFilePath = file.replace(/^assets\/images\/card\/inFrame\//, 'dist/');
        fs.copyFileSync(file, destFilePath);
      });
    },
  };
}

export default defineConfig({
  base: '/3EYEMMS/',
  plugins: [
    liveReload(['./layout/**/*.ejs', './pages/**/*.ejs', './pages/**/*.html']),
    ViteEjsPlugin(),
    moveOutputPlugin(),
    copyPngFilesPlugin(), // 將 PNG 檔案複製到 dist 目錄中的插件
  ],
  server: {
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
