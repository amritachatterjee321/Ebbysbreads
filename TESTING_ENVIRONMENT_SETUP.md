# 🧪 Testing/Pre-Production Environment Setup Guide

This guide will help you set up and use testing and staging environments for your bakery application.

## 🎯 Overview

Your application now supports multiple environments:
- **Development** (`npm run dev`) - Local development
- **Staging** (`npm run dev:staging`) - Pre-production testing
- **Test** (`npm run dev:test`) - Isolated testing environment

## 🚀 Quick Start

### 1. Environment Setup

#### Development Environment (Default)
```bash
npm run dev
# Runs on http://localhost:5173
```

#### Staging Environment
```bash
npm run dev:staging
# Runs on http://localhost:3000
```

#### Test Environment
```bash
npm run dev:test
# Runs on http://localhost:3001
```

### 2. Environment Configuration

Each environment uses its own configuration file:

- **Development**: Uses `.env` (if exists) or default values
- **Staging**: Uses `env.staging`
- **Test**: Uses `env.test`

## 📋 Environment Configuration Files

### Staging Environment (`env.staging`)
```bash
# Supabase Configuration (Staging Database)
VITE_SUPABASE_URL=your_staging_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_staging_supabase_anon_key

# Environment Identifier
VITE_ENV=staging
VITE_APP_NAME=Ebby's Bakery (Staging)

# Email Configuration (Staging)
VITE_EMAIL_SERVICE=log
VITE_ENABLE_EMAIL_NOTIFICATIONS=true
VITE_ENABLE_DEBUG_MODE=true
```

### Test Environment (`env.test`)
```bash
# Supabase Configuration (Test Database)
VITE_SUPABASE_URL=your_test_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_test_supabase_anon_key

# Environment Identifier
VITE_ENV=test
VITE_APP_NAME=Ebby's Bakery (Test)

# Test Configuration
VITE_TEST_MODE=true
VITE_MOCK_ORDERS=true
VITE_MOCK_PRODUCTS=true
VITE_ENABLE_DEBUG_MODE=true
```

## 🗄️ Database Setup

### 1. Create Staging Database

1. **Create a new Supabase project** for staging
2. **Run the schema migration** from `supabase-schema.sql`
3. **Update `env.staging`** with the new project credentials

### 2. Create Test Database

1. **Create a new Supabase project** for testing
2. **Run the schema migration** from `supabase-schema.sql`
3. **Update `env.test`** with the new project credentials

### 3. Environment-Specific Data

Each environment should have its own data:
- **Staging**: Production-like data for testing
- **Test**: Isolated test data that can be cleared/reset

## 🧪 Testing Features

### Environment Banner
- **Staging**: Yellow banner with 🚧 icon
- **Test**: Red banner with 🧪 icon
- **Production**: No banner

### Test Data Manager
Available in staging and test environments:
- **Generate Test Data**: Creates sample customers and orders
- **Clear Test Data**: Removes test data from database
- **Only visible** in non-production environments

### Enhanced Logging
- Environment-specific console logging
- Debug mode enabled in staging/test
- Error tracking with environment context

## 🔧 Configuration Management

### Environment Variables

The application uses these environment variables:

```typescript
// Core Configuration
VITE_ENV=staging|test|production
VITE_APP_NAME=Application Name
VITE_SUPABASE_URL=Supabase Project URL
VITE_SUPABASE_ANON_KEY=Supabase Anonymous Key

// Feature Flags
VITE_ENABLE_EMAIL_NOTIFICATIONS=true|false
VITE_ENABLE_ANALYTICS=true|false
VITE_ENABLE_DEBUG_MODE=true|false
VITE_ENABLE_MOCK_DATA=true|false

// Test Configuration
VITE_TEST_MODE=true|false
VITE_MOCK_ORDERS=true|false
VITE_MOCK_PRODUCTS=true|false
```

### Environment Detection

Use the environment utilities in your code:

```typescript
import { 
  isDevelopment, 
  isStaging, 
  isTest, 
  isProduction,
  getEnvironmentName,
  log,
  logError 
} from './lib/environment';

// Environment checks
if (isStaging()) {
  // Staging-specific code
}

// Environment-aware logging
log('User action completed', { userId: 123 });
logError('Database connection failed', error);
```

## 🚀 Deployment Scripts

### Build Commands

```bash
# Production build
npm run build

# Staging build
npm run build:staging

# Test build
npm run build:test
```

### Preview Commands

```bash
# Preview production build
npm run preview

# Preview staging build
npm run preview:staging

# Preview test build
npm run preview:test
```

## 🧪 Testing Workflow

### 1. Development Workflow

```bash
# Start development server
npm run dev

# Make changes and test locally
# Use browser dev tools for debugging
```

### 2. Staging Testing Workflow

```bash
# Start staging server
npm run dev:staging

# Test with staging database
# Verify all features work correctly
# Test email notifications
# Test order processing
```

### 3. Test Environment Workflow

```bash
# Start test server
npm run dev:test

# Use Test Data Manager to:
# - Generate test data
# - Test order creation
# - Test email integration
# - Clear test data when done
```

## 📊 Monitoring and Debugging

### Console Logging

Environment-specific logging prefixes:
- `[Development]` - Development logs
- `[Staging]` - Staging logs  
- `[Test]` - Test logs
- `[Production]` - Production logs

### Debug Mode

Enabled in staging and test environments:
- Detailed error messages
- API request logging
- Database operation logging
- Email service logging

### Error Tracking

Environment-aware error handling:
- Different error reporting for each environment
- Environment context in error messages
- Safe error handling that doesn't break the app

## 🔒 Security Considerations

### Environment Isolation

- **Separate databases** for each environment
- **Different API keys** for each environment
- **Isolated test data** that doesn't affect production
- **Environment-specific** feature flags

### Data Protection

- **Test data** is clearly marked and isolated
- **Staging data** should be production-like but separate
- **No production data** in test environments
- **Secure API keys** for each environment

## 🚨 Troubleshooting

### Common Issues

**Environment not loading correctly:**
- Check environment file exists (`env.staging`, `env.test`)
- Verify environment variables are set correctly
- Check Vite configuration

**Database connection issues:**
- Verify Supabase credentials in environment file
- Check database permissions
- Ensure database schema is migrated

**Test data not working:**
- Check if Test Data Manager is visible (should be in staging/test)
- Verify database permissions for test operations
- Check console for error messages

### Debug Commands

```bash
# Check environment variables
echo $VITE_ENV

# Check build output
npm run build:staging

# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint
```

## 🎯 Best Practices

### Development
1. **Use development environment** for local development
2. **Test changes locally** before pushing to staging
3. **Use environment-specific** logging for debugging

### Staging
1. **Test all features** in staging before production
2. **Use production-like data** in staging
3. **Test email notifications** and integrations
4. **Verify performance** and user experience

### Testing
1. **Use test environment** for isolated testing
2. **Generate test data** for comprehensive testing
3. **Clear test data** after testing
4. **Test edge cases** and error scenarios

### Production
1. **Deploy from staging** after thorough testing
2. **Monitor production** logs and errors
3. **Use production** environment for live data only

## 📞 Support

If you encounter issues:

1. **Check environment configuration** files
2. **Verify database connections** and credentials
3. **Review console logs** for error messages
4. **Test in development** environment first
5. **Use environment-specific** debugging tools

The testing environment is designed to be robust and safe, allowing you to test changes without affecting production data. 