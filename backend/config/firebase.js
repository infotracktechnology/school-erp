import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(
  __dirname,
  'school-erp-66d10-firebase-adminsdk-fbsvc-9b3d500817.json'
);

let app;

if (!getApps().length) {
  try {
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      app = initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('✅ [Firebase Admin] Initialized successfully with service account');
    } else {
      console.warn('⚠️ [Firebase Admin] Service account file not found at:', serviceAccountPath);
      app = initializeApp();
    }
  } catch (error) {
    console.error('❌ [Firebase Admin] Initialization failed:', error);
  }
} else {
  app = getApp();
}

export default app;