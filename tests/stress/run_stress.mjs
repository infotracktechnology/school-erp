import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

console.log('Building M1 Empirical Stress Suite via Vite SSR...');
await build({
  root: projectRoot,
  configFile: path.resolve(projectRoot, 'vite.config.js'),
  build: {
    ssr: path.resolve(__dirname, 'primitives_stress.test.jsx'),
    outDir: path.resolve(__dirname, 'dist'),
    rollupOptions: {
      output: {
        entryFileNames: 'bundle.js',
        format: 'es',
      },
    },
    emptyOutDir: true,
  },
  logLevel: 'warn',
});

console.log('Executing compiled stress test suite in Node.js...\n');
const suite = await import('./dist/bundle.js');
const results = await suite.runAllStressTests();

if (results.failed > 0) {
  console.error(`\n[CRITICAL FAILURE] ${results.failed} stress tests failed!`);
  process.exit(1);
} else {
  console.log(`\n[SUCCESS] All ${results.total} stress tests passed successfully!`);
  process.exit(0);
}
