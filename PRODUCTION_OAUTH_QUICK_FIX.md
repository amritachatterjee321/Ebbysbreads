# Quick Fix: Google OAuth Production Configuration

## 🚨 **Current Issue**
- "No active session found" - Normal (no user signed in)
- "Auth state changed: INITIAL_SESSION undefined" - Normal (initializing)
- **Real problem**: Google OAuth not configured for production domain

## 🔧 **Step 1: Find Your Production Domain**

Your Vercel deployment URL is likely one of these:
```
https://ebbysbreads.vercel.app
https://ebbys-bakery.vercel.app
https://your-username-ebbys-bakery.vercel.app
```

**To find your exact domain:**
1. Go to your Vercel dashboard
2. Check your project's deployment URL
3. Copy the exact domain

## 🔧 **Step 2: Update Google Cloud Console**

### 2.1 Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" → "Credentials"

### 2.2 Update OAuth 2.0 Client ID
1. Find your "Bakery Admin Web Client" credentials
2. Click the edit (pencil) icon
3. In "Authorized redirect URIs", **ADD** your production URLs:

```
https://YOUR-EXACT-DOMAIN.vercel.app/auth/callback
https://YOUR-EXACT-DOMAIN.vercel.app/admin
```

**Example:**
```
https://ebbysbreads.vercel.app/auth/callback
https://ebbysbreads.vercel.app/admin
```

4. **Keep your existing localhost URLs** for development
5. Click "Save"

## 🔧 **Step 3: Update Supabase Authentication**

### 3.1 Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "Settings"

### 3.2 Update Site URL
Change the "Site URL" to your production domain:
```
https://YOUR-EXACT-DOMAIN.vercel.app
```

### 3.3 Update Redirect URLs
Add your production URLs to the "Redirect URLs" section:

```
https://YOUR-EXACT-DOMAIN.vercel.app/auth/callback
https://YOUR-EXACT-DOMAIN.vercel.app/admin
```

**Keep these for development:**
```
http://localhost:5173/auth/callback
http://localhost:5181/auth/callback
http://localhost:5173/admin
http://localhost:5181/admin
```

## 🔧 **Step 4: Test the Fix**

### 4.1 Test in Incognito Mode
1. Open an incognito/private browser window
2. Go to your production domain: `https://YOUR-EXACT-DOMAIN.vercel.app`
3. Navigate to `/admin`
4. Click "Sign in with Google"
5. Complete the OAuth flow

### 4.2 Expected Result
- ✅ No "redirect URI mismatch" error
- ✅ OAuth flow completes successfully
- ✅ You're redirected back to admin panel
- ✅ You see "Auth state changed: SIGNED_IN" in console

## 🐛 **Common Issues & Solutions**

### Issue 1: "Redirect URI Mismatch"
**Error:** "The redirect URI in the request does not match a registered redirect URI"

**Solution:**
- Double-check the exact redirect URI in Google Cloud Console
- Ensure no trailing slashes
- Verify HTTPS is used (not HTTP)

### Issue 2: "Invalid Site URL"
**Error:** Supabase authentication fails

**Solution:**
- Update Site URL in Supabase Authentication settings
- Ensure it matches your Vercel domain exactly

### Issue 3: Still Getting "No active session found"
**This is normal!** The session will be created after successful OAuth sign-in.

## 🔍 **Debugging Tools**

### Use Built-in Debug Tools
1. Go to your production site
2. Navigate to `/oauth-debug` - Shows current OAuth configuration
3. Navigate to `/oauth-checker` - Checks production OAuth setup
4. Navigate to `/troubleshooter` - Provides specific solutions

### Check Console Messages
After successful OAuth, you should see:
```
Auth state changed: SIGNED_IN user@email.com
```

## 📋 **Quick Checklist**

- [ ] Found your exact Vercel domain
- [ ] Updated Google Cloud Console OAuth 2.0 Client ID with production redirect URIs
- [ ] Updated Supabase Site URL to production domain
- [ ] Added production redirect URLs to Supabase
- [ ] Tested in incognito browser window
- [ ] OAuth flow completes without errors

## 🚀 **Expected Result**

After completing these steps:
- ✅ Google OAuth works on production
- ✅ Users can sign in with Google
- ✅ OAuth flow completes successfully
- ✅ Users are redirected back to admin panel
- ✅ Session is created and maintained

## 💡 **Need Your Domain?**

**Can you tell me your exact Vercel deployment URL?** This will help me give you the exact redirect URIs to add to your Google OAuth configuration.

**The "No active session found" message is normal - the real fix is configuring OAuth for your production domain!** 🔐 