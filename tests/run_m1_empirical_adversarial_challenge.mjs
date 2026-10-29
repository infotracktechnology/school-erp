import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function main() {
  console.log('Compiling and executing Challenger Deep Adversarial Suite with Vite SSR...');

  await build({
    root: projectRoot,
    configFile: path.resolve(projectRoot, 'vite.config.js'),
    resolve: {
      alias: {
        '@': path.resolve(projectRoot, './src'),
      },
    },
    build: {
      ssr: path.resolve(__dirname, 'm1_empirical_adversarial_challenge.test.jsx'),
      outDir: path.resolve(__dirname, 'dist-test'),
      rollupOptions: {
        output: {
          entryFileNames: 'adversarial-bundle.js',
          format: 'esm',
        },
      },
    },
    logLevel: 'warn',
  });

  await import('./dist-test/adversarial-bundle.js');
}

main().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
