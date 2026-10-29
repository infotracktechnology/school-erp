import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function main() {
  console.log('Compiling and executing Milestone 4 Empirical Boundary Challenge Suite with Vite SSR...');

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
      ssr: path.resolve(__dirname, 'm4_empirical_boundary_challenge.jsx'),
      outDir: path.resolve(__dirname, 'dist-m4-boundary'),
      rollupOptions: {
        output: {
          entryFileNames: 'm4-boundary-bundle.js',
          format: 'esm',
        },
      },
    },
    logLevel: 'warn',
  });

  await import('./dist-m4-boundary/m4-boundary-bundle.js');
}

main().catch((err) => {
  console.error('Milestone 4 Boundary Challenge execution failed:', err);
  process.exit(1);
});
