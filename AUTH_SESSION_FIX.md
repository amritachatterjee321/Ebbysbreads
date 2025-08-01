# Fix AuthSessionMissingError in Production

## 🚨 **Error: AuthSessionMissingError: Auth session missing!**

This error occurs when the Supabase client can't find a valid authentication session. Here's how to fix it:

## 🔍 **Root Causes**

1. **Environment Variables Not Set**: Supabase credentials are missing or using placeholder values
2. **Invalid Session**: The user's session has expired or is corrupted
3. **OAuth Configuration**: Google OAuth redirect URIs don't match production domain
4. **Supabase Configuration**: Site URL or redirect URLs are incorrect

## 🔧 **Step 1: Check Environment Variables**

### 1.1 Verify Vercel Environment Variables
1. Go to your Vercel dashboard
2. Navigate to your project → Settings → Environment Variables
3. Ensure these are set correctly:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 1.2 Check for Placeholder Values
Make sure your environment variables are NOT:
- `https://your-project.supabase.co`
- `your-anon-key`
- `your_supabase_project_url`
- `your_supabase_anon_key`

### 1.3 Redeploy After Changes
After updating environment variables:
1. Go to Deployments
2. Click "Redeploy" on your latest deployment

## 🔧 **Step 2: Fix Google OAuth Configuration**

### 2.1 Update Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add your production redirect URIs:

```
https://your-vercel-domain.vercel.app/auth/callback
https://your-vercel-domain.vercel.app/admin
```

### 2.2 Update Supabase Authentication
1. Go to your Supabase dashboard
2. Navigate to "Authentication" → "Settings"
3. Update "Site URL" to your production domain
4. Add production redirect URLs

## 🔧 **Step 3: Clear Browser Session**

### 3.1 Clear Local Storage
1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Clear all Supabase-related storage:
   - Local Storage
   - Session Storage
   - Cookies

### 3.2 Test in Incognito Mode
1. Open an incognito/private browser window
2. Go to your production site
3. Try to sign in with Google

## 🔧 **Step 4: Debug the Issue**

### 4.1 Use Built-in Debug Tools
Your app has debugging tools:

1. **Go to your production site**
2. **Navigate to `/oauth-debug`** - Shows current OAuth configuration
3. **Navigate to `/oauth-checker`** - Checks production OAuth setup
4. **Navigate to `/troubleshooter`** - Provides specific solutions

### 4.2 Check Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for these error messages:
   - `❌ VITE_SUPABASE_URL is not properly configured`
   - `❌ VITE_SUPABASE_ANON_KEY is not properly configured`
   - `No active session found`

## 🔧 **Step 5: Verify Supabase Connection**

### 5.1 Test Supabase Connection
1. Go to your production site
2. Navigate to `/test-supabase`
3. Check if the connection is successful

### 5.2 Check Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "Users"
3. Check if your user exists and is active

## 🐛 **Common Solutions**

### Solution 1: Environment Variables Issue
**Problem**: Console shows "VITE_SUPABASE_URL is not properly configured"

**Fix**:
1. Go to Vercel dashboard
2. Set correct environment variables
3. Redeploy the application

### Solution 2: OAuth Redirect URI Mismatch
**Problem**: "The redirect URI in the request does not match a registered redirect URI"

**Fix**:
1. Update Google Cloud Console OAuth 2.0 Client ID
2. Add your production domain to redirect URIs
3. Update Supabase Authentication settings

### Solution 3: Session Expired
**Problem**: "No active session found"

**Fix**:
1. Clear browser storage
2. Sign in again with Google
3. Check if OAuth flow completes successfully

### Solution 4: Supabase Configuration
**Problem**: Supabase Site URL doesn't match production domain

**Fix**:
1. Update Supabase Authentication Site URL
2. Add production redirect URLs
3. Ensure HTTPS is used

## 🧪 **Testing the Fix**

### Test 1: Environment Variables
1. Check browser console for configuration errors
2. Ensure no placeholder values are being used

### Test 2: OAuth Flow
1. Go to your production site
2. Navigate to `/admin`
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. Verify you're redirected back to admin panel

### Test 3: Session Persistence
1. Sign in successfully
2. Refresh the page
3. Verify you remain signed in
4. Check browser console for session errors

## 📋 **Quick Checklist**

- [ ] Environment variables set correctly in Vercel
- [ ] No placeholder values in environment variables
- [ ] Google OAuth redirect URIs include production domain
- [ ] Supabase Site URL matches production domain
- [ ] Supabase redirect URLs include production domain
- [ ] Application redeployed after environment variable changes
- [ ] Tested in incognito browser window
- [ ] No console errors related to Supabase configuration

## 🚀 **Expected Result**

After completing these steps:
- ✅ No "AuthSessionMissingError" in console
- ✅ Google OAuth works on production
- ✅ Users can sign in and stay signed in
- ✅ Admin panel is accessible after authentication

## 💡 **Need Help?**

If you're still having issues:
1. Check the browser console for specific error messages
2. Use the built-in debugging tools (`/oauth-debug`, `/oauth-checker`)
3. Verify all URLs match exactly (case-sensitive)
4. Test in an incognito browser window
5. Check Google Cloud Console for OAuth errors

**The AuthSessionMissingError should be resolved after following these steps!** 🔐 