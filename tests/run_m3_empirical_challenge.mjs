import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function main() {
  console.log('Compiling and executing Milestone 3 Empirical Challenge Suite with Vite SSR...');

  await build({
    root: projectRoot,
    configFile: path.resolve(projectRoot, 'vite.config.js'),
    resolve: {
      alias: [
        { find: '../ui/dialog', replacement: path.resolve(__dirname, 'mock_dialog.jsx') },
        { find: '@/components/ui/dialog', replacement: path.resolve(__dirname, 'mock_dialog.jsx') },
        { find: '../../../context/ErpContext', replacement: path.resolve(__dirname, 'mock_erp_context.jsx') },
        { find: '../../context/ErpContext', replacement: path.resolve(__dirname, 'mock_erp_context.jsx') },
        { find: '../context/ErpContext', replacement: path.resolve(__dirname, 'mock_erp_context.jsx') },
        { find: '@/context/ErpContext', replacement: path.resolve(__dirname, 'mock_erp_context.jsx') },
        { find: '@', replacement: path.resolve(projectRoot, './src') },
      ],
    },
    build: {
      ssr: path.resolve(__dirname, 'm3_empirical_challenge.jsx'),
      outDir: path.resolve(__dirname, 'dist-m3-empirical'),
      rollupOptions: {
        output: {
          entryFileNames: 'm3-empirical-bundle.js',
          format: 'esm',
        },
      },
    },
    logLevel: 'warn',
  });

  await import('./dist-m3-empirical/m3-empirical-bundle.js');
}

main().catch((err) => {
  console.error('Milestone 3 Challenge execution failed:', err);
  process.exit(1);
});
