import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'non-blocking-css',
        enforce: 'post',
        transformIndexHtml(html) {
          return html.replace(
            /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
            `<link rel="preload" as="style" crossorigin href="$1" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" crossorigin href="$1"></noscript>`
          );
        }
      },
      compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024,
        verbose: false,
        filter: /\.(html|js|css|svg|json|xml)$/i,
      }),
      compression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
        verbose: false,
        filter: /\.(html|js|css|svg|json|xml)$/i,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    esbuild: {
      legalComments: 'none',
      drop: ['debugger'],
    },
    build: {
      target: 'es2020',
      minify: 'esbuild',
      cssMinify: true,
      sourcemap: true,
      cssCodeSplit: true,
      modulePreload: {
        polyfill: false,
        resolveDependencies: (_filename, deps) => {
          // Only preload core vendor-react on initial page load; defer all route/modal chunks until required
          return deps.filter((dep) => dep.includes('vendor-react'));
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
                return 'vendor-react';
              }
            }
          },
        },
      },
    },
    server: {
      allowedHosts: true as const,
      headers: {
        'X-Robots-Tag': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      headers: {
        'X-Robots-Tag': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
    },
  };
});
