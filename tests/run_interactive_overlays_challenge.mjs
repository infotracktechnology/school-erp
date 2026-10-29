import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function main() {
  console.log('Compiling and executing Interactive Overlays Challenge Suite with Vite SSR...');
  
  await build({
    root: projectRoot,
    configFile: path.resolve(projectRoot, 'vite.config.js'),
    resolve: {
      alias: {
        '@': path.resolve(projectRoot, './src'),
      },
    },
    build: {
      ssr: path.resolve(__dirname, 'interactive_overlays_challenge.jsx'),
      outDir: path.resolve(__dirname, 'dist-test'),
      rollupOptions: {
        output: {
          entryFileNames: 'challenge-bundle.js',
          format: 'esm',
        },
      },
    },
    logLevel: 'warn',
  });

  await import('./dist-test/challenge-bundle.js');
}

main().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
