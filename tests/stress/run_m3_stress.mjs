import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

console.log('Building M3 Empirical Core Modules Stress Suite via Vite SSR...');
await build({
  root: projectRoot,
  configFile: path.resolve(projectRoot, 'vite.config.js'),
  plugins: [
    {
      name: 'mock-erp-context-and-portal',
      enforce: 'pre',
      resolveId(source) {
        if (source.includes('ErpContext')) {
          return path.resolve(__dirname, 'mockErpContext.js');
        }
        if (source === '@radix-ui/react-portal') {
          return path.resolve(__dirname, 'mockPortal.js');
        }
        return null;
      },
    },
  ],
  build: {
    ssr: path.resolve(__dirname, 'm3_core_modules_stress.test.jsx'),
    outDir: path.resolve(__dirname, 'dist-m3'),
    rollupOptions: {
      output: {
        entryFileNames: 'bundle-m3.js',
        format: 'es',
      },
    },
    emptyOutDir: true,
  },
  logLevel: 'warn',
});

console.log('Executing compiled M3 stress test suite in Node.js...\n');
const suite = await import('./dist-m3/bundle-m3.js');
const results = await suite.runAllM3StressTests();

if (results.failed > 0) {
  console.error(`\n[CRITICAL FAILURE] ${results.failed} M3 stress tests failed!`);
  process.exit(1);
} else {
  console.log(`\n[SUCCESS] All ${results.total} M3 stress tests passed successfully!`);
  process.exit(0);
}
