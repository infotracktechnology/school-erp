import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initDatabase, testConnection } from './config/database.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
app.set('etag', false); // Disable 304 caching so clients always get fresh report data
const PORT = process.env.PORT || 5000;

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(morgan('dev'));

// API Routes
app.use('/api', apiRouter);

// Root route
app.get('/', (_req, res) => {
  res.json({
    name: 'School ERP Backend API',
    version: '1.0.0',
    orm: 'Sutando ORM',
    database: 'MySQL',
    status: 'online',
    endpoints: {
      health: '/api/health',
      organization: '/api/organization',
      branches: '/api/branches',
      academicYears: '/api/academic-years',
      classes: '/api/classes',
      students: '/api/students',
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize DB and start server
initDatabase();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Backend] School ERP Express + Sutando Server running on http://localhost:${PORT}`);
  // Test connection asynchronously so server is immediately responsive
  testConnection();
});
