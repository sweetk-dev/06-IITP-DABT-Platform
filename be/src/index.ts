import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

// Version endpoint
app.get('/version', (req, res) => {
  res.json({
    success: true,
    data: {
      version: process.env.npm_package_version || '1.0.0',
      buildDate: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BE server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Version info: http://localhost:${PORT}/version`);
});
