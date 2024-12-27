import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {},
    global: {},
    Lame: {},
    Presets: {},
    GainAnalysis: {},
    QuantizePVT: {},
    Quantize: {},
    Takehiro: {},
    Reservoir: {},
    MPEGMode: {},
    BitStream: {},
    Encoder: {},
  },
  plugins: [react()],
  base: './',
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      {
        find: '@assets',
        replacement: path.resolve(__dirname, 'src/assets'),
      },
      {
        find: '@components',
        replacement: path.resolve(__dirname, 'src/components'),
      },
      {
        find: '@pages',
        replacement: path.resolve(__dirname, 'src/pages'),
      },
      {
        find: '@store',
        replacement: path.resolve(__dirname, 'src/store'),
      },
      {
        find: '@utils',
        replacement: path.resolve(__dirname, 'src/utils'),
      },
      {
        find: '@apis',
        replacement: path.resolve(__dirname, 'src/apis'),
      },
    ],
  },
  assetsInclude: ['**/*.wasm'],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  }
})
