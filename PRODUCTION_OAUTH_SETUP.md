# Google OAuth Production Setup Guide

This guide will help you update your Google OAuth configuration for production deployment.

## Current Status

Your application is currently configured for local development with:
- **Local Site URL**: `http://localhost:5181`
- **Local Redirect URIs**: `http://localhost:5173/auth/callback`, `http://localhost:5181/auth/callback`

## Step 1: Determine Your Production Domain

First, identify your production domain. Common options include:
- Custom domain (e.g., `https://ebbysbreads.com`)
- Vercel deployment (e.g., `https://your-app.vercel.app`)
- Netlify deployment (e.g., `https://your-app.netlify.app`)
- GitHub Pages (e.g., `https://username.github.io/repo-name`)

## Step 2: Update Google Cloud Console

### 2.1 Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" → "Credentials"

### 2.2 Edit OAuth 2.0 Client ID
1. Find your "Bakery Admin Web Client" credentials
2. Click the edit (pencil) icon
3. In "Authorized redirect URIs", add your production URLs:

```
https://your-production-domain.com/auth/callback
https://your-production-domain.com/admin
```

**Example for different platforms:**

**Vercel:**
```
https://ebbysbreads.vercel.app/auth/callback
https://ebbysbreads.vercel.app/admin
```

**Netlify:**
```
https://ebbysbreads.netlify.app/auth/callback
https://ebbysbreads.netlify.app/admin
```

**Custom Domain:**
```
https://ebbysbreads.com/auth/callback
https://ebbysbreads.com/admin
```

4. Click "Save"

## Step 3: Update Supabase Authentication Settings

### 3.1 Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "Settings"

### 3.2 Update Site URL
Change the "Site URL" from `http://localhost:5181` to your production domain:

```
https://your-production-domain.com
```

### 3.3 Update Redirect URLs
In the "Redirect URLs" section, add your production URLs:

```
https://your-production-domain.com/auth/callback
https://your-production-domain.com/admin
```

**Keep the local development URLs for testing:**
```
http://localhost:5173/auth/callback
http://localhost:5181/auth/callback
http://localhost:5173/admin
http://localhost:5181/admin
```

## Step 4: Environment Variables for Production

### 4.1 Production Environment Variables
Set these environment variables in your production deployment platform:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4.2 Platform-Specific Setup

**Vercel:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the variables above

**Netlify:**
1. Go to Site settings → Environment variables
2. Add the variables above

**GitHub Pages:**
1. Go to repository settings → Secrets and variables → Actions
2. Add the variables as repository secrets

## Step 5: Test Production OAuth

### 5.1 Deploy Your Application
Deploy your application to your chosen platform.

### 5.2 Test Authentication Flow
1. Visit your production domain
2. Navigate to `/admin`
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. Verify you're redirected back to the admin panel

## Step 6: Troubleshooting Production Issues

### Common Production Issues

#### 1. "Redirect URI Mismatch"
**Problem:** Google OAuth redirect URI doesn't match production URL.

**Solution:**
- Double-check the redirect URI in Google Cloud Console
- Ensure HTTPS is used (not HTTP)
- Verify no trailing slashes or extra characters

#### 2. "Invalid Site URL"
**Problem:** Supabase Site URL doesn't match production domain.

**Solution:**
- Update Site URL in Supabase Authentication settings
- Ensure HTTPS is used
- Remove any trailing slashes

#### 3. "Environment Variables Not Found"
**Problem:** Production environment variables are not set.

**Solution:**
- Verify environment variables are set in your deployment platform
- Check variable names match exactly (case-sensitive)
- Redeploy after setting environment variables

#### 4. "CORS Errors"
**Problem:** Cross-origin requests blocked.

**Solution:**
- Ensure Supabase Site URL matches your production domain exactly
- Check that redirect URLs include your production domain

## Step 7: Security Best Practices

### 7.1 HTTPS Only
- Always use HTTPS in production
- Never use HTTP for OAuth redirects in production

### 7.2 Domain Verification
- Consider verifying your domain with Google Cloud Console
- This removes the "unverified app" warning

### 7.3 Environment Variable Security
- Never commit environment variables to version control
- Use your deployment platform's secure environment variable storage

### 7.4 OAuth Consent Screen
- Update your OAuth consent screen with production domain
- Add your production domain to authorized domains

## Step 8: Monitoring and Maintenance

### 8.1 Monitor OAuth Usage
- Check Google Cloud Console for OAuth usage statistics
- Monitor Supabase authentication logs

### 8.2 Regular Updates
- Keep your OAuth consent screen information updated
- Review and update redirect URIs as needed
- Monitor for any security advisories

## Quick Reference

### Google Cloud Console URLs
- **Current Redirect URIs**: `https://your-project-ref.supabase.co/auth/v1/callback`
- **Add Production**: `https://your-production-domain.com/auth/callback`

### Supabase Settings
- **Site URL**: `https://your-production-domain.com`
- **Redirect URLs**: 
  - `https://your-production-domain.com/auth/callback`
  - `https://your-production-domain.com/admin`

### Environment Variables
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all URLs match exactly (case-sensitive)
3. Test in an incognito browser window
4. Check browser developer tools for specific errors
5. Review Supabase and Google Cloud Console logs

---

**Remember**: Always test your OAuth flow in production before going live with your application! 🔐 