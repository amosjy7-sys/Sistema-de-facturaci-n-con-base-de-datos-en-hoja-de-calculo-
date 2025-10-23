import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',

  // Google Sheets
  googleSheets: {
    clientId: process.env.GOOGLE_SHEETS_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_SHEETS_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_SHEETS_REDIRECT_URI || 'http://localhost:3001/auth/google/callback',
    spreadsheetId: process.env.SPREADSHEET_ID || '',
  },

  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Session
  sessionTimeoutHours: parseInt(process.env.SESSION_TIMEOUT_HOURS || '8', 10),

  // Business Rules
  business: {
    itbisRate: parseFloat(process.env.DEFAULT_ITBIS_RATE || '0.18'),
    creditDays: parseInt(process.env.DEFAULT_CREDIT_DAYS || '30', 10),
    minMargin: parseFloat(process.env.DEFAULT_MIN_MARGIN || '0.05'),
    maxDiscountWithoutApproval: parseFloat(process.env.MAX_DISCOUNT_WITHOUT_APPROVAL || '0.05'),
  },
};

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';
