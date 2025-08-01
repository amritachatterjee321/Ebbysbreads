# Google Auth Production Fix

## 🚨 **Google Auth Not Working on Production**

Based on your Vercel deployment, here's how to fix Google Auth for production:

## 🔍 **Step 1: Find Your Production Domain**

Your Vercel deployment URL is likely:
```
https://ebbysbreads.vercel.app
```
or
```
https://ebbys-bakery.vercel.app
```

**To find your exact domain:**
1. Go to your Vercel dashboard
2. Check your project's deployment URL
3. Note the exact domain (case-sensitive)

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
https://your-vercel-domain.vercel.app/auth/callback
https://your-vercel-domain.vercel.app/admin
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
https://your-vercel-domain.vercel.app
```

### 3.3 Update Redirect URLs
Add your production URLs to the "Redirect URLs" section:

```
https://your-vercel-domain.vercel.app/auth/callback
https://your-vercel-domain.vercel.app/admin
```

**Keep these for development:**
```
http://localhost:5173/auth/callback
http://localhost:5181/auth/callback
http://localhost:5173/admin
http://localhost:5181/admin
```

## 🔧 **Step 4: Update OAuth Consent Screen**

1. Go to "APIs & Services" → "OAuth consent screen"
2. Add your production domain to "Authorized domains":
```
your-vercel-domain.vercel.app
```

## 🔧 **Step 5: Verify Environment Variables**

### 5.1 Check Vercel Environment Variables
1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Verify these are set:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5.2 Redeploy After Changes
1. After updating environment variables, redeploy your app
2. Go to "Deployments" → "Redeploy"

## 🧪 **Step 6: Test the Fix**

### 6.1 Test in Incognito Mode
1. Open an incognito/private browser window
2. Go to your production domain: `https://your-vercel-domain.vercel.app`
3. Navigate to `/admin`
4. Click "Sign in with Google"
5. Complete the OAuth flow

### 6.2 Check for Errors
If you still get errors, check:
- Browser console for specific error messages
- Network tab for failed requests
- Google Cloud Console for OAuth errors

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

### Issue 3: "Environment Variables Not Found"
**Error:** App can't connect to Supabase

**Solution:**
- Verify environment variables in Vercel dashboard
- Redeploy after setting variables

### Issue 4: "CORS Errors"
**Error:** Cross-origin requests blocked

**Solution:**
- Ensure Supabase Site URL matches your production domain
- Check redirect URLs include your production domain

## 🔍 **Debugging Tools**

### Use the OAuth Debugger
1. Go to your production site
2. Navigate to `/oauth-debug`
3. Check the debug information
4. Look for any configuration mismatches

### Check OAuth Production Checker
1. Go to your production site
2. Navigate to `/oauth-checker`
3. Run the configuration check
4. Follow the recommendations

## 📋 **Quick Checklist**

- [ ] Updated Google Cloud Console OAuth 2.0 Client ID with production redirect URIs
- [ ] Updated Supabase Site URL to production domain
- [ ] Added production redirect URLs to Supabase
- [ ] Updated OAuth consent screen with production domain
- [ ] Verified environment variables in Vercel
- [ ] Redeployed application after changes
- [ ] Tested in incognito browser window

## 🚀 **Expected Result**

After completing these steps:
- ✅ Google Auth should work on production
- ✅ Users can sign in with Google on your live site
- ✅ OAuth flow completes successfully
- ✅ Users are redirected back to admin panel

## 💡 **Need Help?**

If you're still having issues:
1. Check the browser console for specific error messages
2. Verify all URLs match exactly (case-sensitive)
3. Test in an incognito browser window
4. Check Google Cloud Console for OAuth errors
5. Review Supabase authentication logs

**Your Google Auth should work perfectly on production after following these steps!** 🔐 