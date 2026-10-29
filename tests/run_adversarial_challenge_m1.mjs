import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function main() {
  console.log('Compiling and executing Deep Adversarial Challenge Suite (challenger_m1_retry_2) with Vite SSR...');

  await build({
    root: projectRoot,
    configFile: path.resolve(projectRoot, 'vite.config.js'),
    resolve: {
      alias: {
        '@': path.resolve(projectRoot, './src'),
      },
    },
    build: {
      ssr: path.resolve(__dirname, 'adversarial_challenge_m1.jsx'),
      outDir: path.resolve(__dirname, 'dist-adversarial'),
      rollupOptions: {
        output: {
          entryFileNames: 'adversarial-bundle.js',
          format: 'esm',
        },
      },
      emptyOutDir: true,
    },
    logLevel: 'warn',
  });

  console.log('Running compiled adversarial challenge bundle in Node.js...\n');
  await import('./dist-adversarial/adversarial-bundle.js');
}

main().catch((err) => {
  console.error('Adversarial challenge execution failed:', err);
  process.exit(1);
});
