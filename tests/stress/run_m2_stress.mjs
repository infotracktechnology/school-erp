import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

console.log('Building M2 Empirical Shell & Navigation Stress Suite via Vite SSR...');
await build({
  root: projectRoot,
  configFile: path.resolve(projectRoot, 'vite.config.js'),
  plugins: [
    {
      name: 'mock-erp-context',
      enforce: 'pre',
      resolveId(source) {
        if (source.includes('ErpContext')) {
          return path.resolve(__dirname, 'mockErpContext.js');
        }
        return null;
      },
    },
  ],
  build: {
    ssr: path.resolve(__dirname, 'm2_shell_nav_stress.test.jsx'),
    outDir: path.resolve(__dirname, 'dist-m2'),
    rollupOptions: {
      output: {
        entryFileNames: 'bundle-m2.js',
        format: 'es',
      },
    },
    emptyOutDir: true,
  },
  logLevel: 'warn',
});

console.log('Executing compiled M2 stress test suite in Node.js...\n');
const suite = await import('./dist-m2/bundle-m2.js');
const results = await suite.runAllM2StressTests();

if (results.failed > 0) {
  console.error(`\n[CRITICAL FAILURE] ${results.failed} M2 stress tests failed!`);
  process.exit(1);
} else {
  console.log(`\n[SUCCESS] All ${results.total} M2 stress tests passed successfully!`);
  process.exit(0);
}
