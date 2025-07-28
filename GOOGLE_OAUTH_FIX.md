# Google OAuth Authentication Fix Guide

This guide provides comprehensive instructions to fix Google OAuth authentication issues in your bakery admin panel.

## Quick Fix Checklist

### 1. Environment Variables
- [ ] Create `.env` file in project root
- [ ] Add `VITE_SUPABASE_URL` with your Supabase project URL
- [ ] Add `VITE_SUPABASE_ANON_KEY` with your Supabase anon key

### 2. Google Cloud Console Setup
- [ ] Create/select Google Cloud project
- [ ] Enable Google+ API
- [ ] Configure OAuth consent screen
- [ ] Create OAuth 2.0 credentials
- [ ] Add redirect URIs

### 3. Supabase Configuration
- [ ] Enable Google provider in Supabase
- [ ] Add Google Client ID and Secret
- [ ] Set Site URL in Authentication settings
- [ ] Add redirect URLs

## Detailed Setup Instructions

### Step 1: Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**To find these values:**
1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy the "Project URL" and "anon public" key

### Step 2: Google Cloud Console Setup

#### 2.1 Create/Select Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

#### 2.2 Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in required information:
   - App name: "Bakery Admin"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email addresses)

#### 2.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Set name: "Bakery Admin Web Client"
5. Add authorized redirect URIs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   http://localhost:5173/auth/callback
   http://localhost:5181/auth/callback
   ```
6. Click "Create"
7. **Save the Client ID and Client Secret**

### Step 3: Supabase Configuration

#### 3.1 Enable Google Provider
1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "Providers"
3. Find "Google" and click "Enable"
4. Enter the Google Client ID and Client Secret from Step 2.3
5. Set the redirect URL to: `https://your-project-ref.supabase.co/auth/v1/callback`
6. Click "Save"

#### 3.2 Configure Site URL
1. In Supabase dashboard, go to "Authentication" → "Settings"
2. Set "Site URL" to: `http://localhost:5181`
3. Add additional redirect URLs:
   ```
   http://localhost:5181/admin
   http://localhost:5173/admin
   ```
4. Click "Save"

### Step 4: Database Setup

Run the user profiles migration in Supabase SQL Editor:

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle user updates
CREATE OR REPLACE FUNCTION handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_user_update();
```

## Testing the Setup

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Authentication
1. Navigate to `http://localhost:5181/admin`
2. You should see the login page with configuration status
3. Click "Sign in with Google"
4. Complete the Google OAuth flow
5. You should be redirected back to the admin panel

## Troubleshooting

### Common Issues

#### 1. "Redirect URI Mismatch"
**Problem:** The redirect URI in Google Cloud Console doesn't match your Supabase callback URL.

**Solution:**
- Verify the redirect URI in Google Cloud Console matches exactly: `https://your-project-ref.supabase.co/auth/v1/callback`
- Make sure there are no extra spaces or characters

#### 2. "Invalid Client ID/Secret"
**Problem:** The Google OAuth credentials are incorrect.

**Solution:**
- Double-check the Client ID and Client Secret in Supabase Authentication → Providers → Google
- Ensure you copied the values correctly from Google Cloud Console

#### 3. "Configuration Required" Warning
**Problem:** Environment variables are not set.

**Solution:**
- Create a `.env` file in your project root
- Add the correct Supabase URL and anon key
- Restart your development server

#### 4. "Access Denied" After Login
**Problem:** User doesn't have admin privileges.

**Solution:**
- Check the `isAdmin` function in `src/services/auth.ts`
- Modify the function to allow your email domain or specific emails

#### 5. "Table user_profiles does not exist"
**Problem:** Database migration not run.

**Solution:**
- Run the user profiles migration in Supabase SQL Editor
- Check that the script executed successfully

### Debug Steps

1. **Check Browser Console**
   - Open developer tools (F12)
   - Look for any error messages in the Console tab

2. **Check Supabase Logs**
   - Go to Supabase dashboard → Logs
   - Look for authentication-related errors

3. **Verify Environment Variables**
   - Ensure `.env` file exists and has correct values
   - Restart development server after changes

4. **Test in Incognito Window**
   - Open an incognito/private window
   - Navigate to the admin page
   - This avoids cached sessions

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **OAuth Secrets**: Keep Google Client Secret secure
3. **Domain Restrictions**: Consider implementing email domain restrictions
4. **HTTPS**: Use HTTPS in production
5. **Session Management**: Supabase handles session security automatically

## Production Deployment

When deploying to production:

1. **Update Redirect URIs** in Google Cloud Console:
   ```
   https://your-production-domain.com/auth/callback
   ```

2. **Update Site URL** in Supabase:
   ```
   https://your-production-domain.com
   ```

3. **Set Production Environment Variables**:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Support Tools

The application includes built-in support tools:

- **Setup Guide**: `/setup-guide` - Step-by-step setup instructions
- **Troubleshooter**: `/troubleshooter` - Diagnostic tool for common issues

## Next Steps

After successful setup:

1. Test all admin functionality
2. Configure user roles and permissions
3. Set up monitoring and logging
4. Consider implementing additional security measures
5. Plan for production deployment

## Getting Help

If you continue to experience issues:

1. Check the troubleshooting section above
2. Use the built-in troubleshooter tool
3. Review Supabase and Google Cloud Console documentation
4. Check browser developer tools for specific error messages
5. Verify all configuration steps were completed correctly 