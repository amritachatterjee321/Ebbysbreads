# Staging Google OAuth Setup

## Problem
Google Auth is not working on staging because the staging environment needs its own Google OAuth configuration.

## Solution

### Step 1: Update Staging Environment Variables

1. **Edit `env.staging`** with your actual staging Supabase credentials:

```bash
# Staging Environment Configuration
VITE_ENV=staging
VITE_APP_NAME=Ebby's Bakery (Staging)

# Supabase Configuration (Staging) - REPLACE WITH ACTUAL VALUES
VITE_SUPABASE_URL=https://your-actual-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-staging-anon-key

# Email Configuration (Staging)
VITE_EMAILJS_PUBLIC_KEY=your-emailjs-public-key
VITE_EMAILJS_SERVICE_ID=your-emailjs-service-id
VITE_EMAILJS_TEMPLATE_ID=your-emailjs-template-id

# Feature Flags (Staging)
VITE_ENABLE_EMAIL_NOTIFICATIONS=true
VITE_USE_MOCK_DATA=false
VITE_ENABLE_ANALYTICS=false

# Debug Settings (Staging)
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### Step 2: Set Up Staging Supabase Project

1. **Create a new Supabase project for staging** (if not already done):
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Name it "ebbys-bakery-staging" or similar
   - Choose your region
   - Set up the database

2. **Get your staging credentials**:
   - Go to Settings → API
   - Copy the "Project URL" and "anon public" key
   - Update `env.staging` with these values

### Step 3: Configure Google OAuth for Staging

1. **Go to your staging Supabase project**:
   - Authentication → Settings → Auth Providers
   - Enable Google provider

2. **Set up Google OAuth credentials for staging**:
   - Go to https://console.cloud.google.com/apis/credentials
   - Create a new OAuth 2.0 Client ID for staging
   - Add authorized redirect URIs:
     ```
     https://your-staging-project.supabase.co/auth/v1/callback
     http://localhost:3000/admin
     http://localhost:3000/
     ```

3. **Configure Supabase Google OAuth**:
   - Client ID: Your staging Google OAuth client ID
   - Client Secret: Your staging Google OAuth client secret
   - Redirect URL: `https://your-staging-project.supabase.co/auth/v1/callback`

### Step 4: Test the Configuration

1. **Restart the staging server**:
   ```bash
   npm run dev:staging
   ```

2. **Test Google Auth**:
   - Go to http://localhost:3000/admin
   - Try signing in with Google
   - Check browser console for any errors

### Step 5: Alternative - Use Production Supabase for Staging

If you want to use the same Supabase project for both production and staging:

1. **Update `env.staging`** to use production Supabase:
   ```bash
   # Use production Supabase for staging testing
   VITE_SUPABASE_URL=https://your-production-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-production-anon-key
   ```

2. **Add localhost to Google OAuth redirect URIs**:
   - Go to Google Cloud Console
   - Add `http://localhost:3000/admin` to authorized redirect URIs

## Quick Fix (Use Production Supabase)

If you want to quickly test staging with production data:

1. **Copy production credentials to staging**:
   ```bash
   # Copy from env.production to env.staging
   VITE_SUPABASE_URL=https://your-production-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-production-anon-key
   ```

2. **Restart staging server**:
   ```bash
   npm run dev:staging
   ```

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**:
   - Add `http://localhost:3000/admin` to Google OAuth redirect URIs
   - Make sure the redirect URI in Supabase matches exactly

2. **"Client not found" error**:
   - Check that you're using the correct Google OAuth client ID
   - Verify the client ID is for the staging environment

3. **"Supabase not configured" error**:
   - Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
   - Restart the development server after changing environment variables

### Debug Steps:

1. **Check browser console** for any error messages
2. **Verify environment variables** are loaded correctly
3. **Test Supabase connection** by checking if other features work
4. **Check network tab** for failed requests to Supabase

## Next Steps

After setting up Google OAuth for staging:

1. **Test the complete flow**: Browse → Add to Cart → Checkout → Auth
2. **Verify staging environment indicators** are showing
3. **Test with different Google accounts** if needed
4. **Deploy staging to Vercel** for testing in production-like environment 