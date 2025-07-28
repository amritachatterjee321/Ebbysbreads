# Google OAuth Setup Guide for Bakery Admin

This guide will help you set up Google OAuth authentication for the bakery admin panel using Supabase.

## Prerequisites

1. A Supabase project (already set up)
2. A Google Cloud Console project
3. The bakery application running locally

## Step 1: Set up Google Cloud Console

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

### 1.2 Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Bakery Admin"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email addresses that will access the admin panel)

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Set the name: "Bakery Admin Web Client"
5. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:5173/auth/callback` (for local development)
   - `http://localhost:5181/auth/callback` (for local development)
6. Click "Create"
7. **Save the Client ID and Client Secret** - you'll need these for Supabase

## Step 2: Configure Supabase Authentication

### 2.1 Enable Google Provider
1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" and click "Enable"
4. Enter the Google Client ID and Client Secret from Step 1.3
5. Set the redirect URL to: `https://your-project-ref.supabase.co/auth/v1/callback`
6. Click "Save"

### 2.2 Configure Site URL
1. In Supabase dashboard, go to "Authentication" > "Settings"
2. Set "Site URL" to: `http://localhost:5181` (for local development)
3. Add additional redirect URLs:
   - `http://localhost:5181/admin`
   - `http://localhost:5173/admin`
4. Click "Save"

## Step 3: Set up Database Tables

### 3.1 Run the User Profiles Migration
1. Go to Supabase dashboard > "SQL Editor"
2. Copy and paste the contents of `user-profiles-migration.sql`
3. Click "Run" to execute the script

This will create:
- `user_profiles` table
- Row Level Security (RLS) policies
- Triggers for automatic profile creation
- Functions for handling user updates

## Step 4: Configure Environment Variables

### 4.1 Update .env file
Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 5: Test the Setup

### 5.1 Start the Development Server
```bash
npm run dev
```

### 5.2 Test Authentication
1. Navigate to `http://localhost:5181/admin`
2. You should see the login page
3. Click "Sign in with Google"
4. Complete the Google OAuth flow
5. You should be redirected back to the admin panel

## Step 6: Customize Admin Access (Optional)

### 6.1 Restrict Access by Email Domain
If you want to restrict admin access to specific email domains, modify the `isAdmin` function in `src/services/auth.ts`:

```typescript
async isAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;
  
  // Only allow specific email domains
  const allowedDomains = ['yourcompany.com', 'gmail.com'];
  const userDomain = user.email?.split('@')[1];
  
  return allowedDomains.includes(userDomain || '');
}
```

### 6.2 Restrict Access by Specific Emails
```typescript
async isAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;
  
  // Only allow specific email addresses
  const allowedEmails = ['admin@yourcompany.com', 'owner@gmail.com'];
  
  return allowedEmails.includes(user.email || '');
}
```

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Make sure the redirect URI in Google Cloud Console matches exactly
   - Check that the Supabase project URL is correct

2. **"Access denied" after login**
   - Check the `isAdmin` function logic
   - Verify the user's email is in the allowed list

3. **"Table user_profiles does not exist"**
   - Run the migration script in Supabase SQL Editor
   - Check that the script executed successfully

4. **Authentication not working in production**
   - Update the redirect URIs to include your production domain
   - Update the Site URL in Supabase settings

### Debug Steps

1. Check browser console for errors
2. Check Supabase logs in the dashboard
3. Verify environment variables are correct
4. Test with different email addresses

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **OAuth Secrets**: Keep Google Client Secret secure
3. **Domain Restrictions**: Consider implementing email domain restrictions
4. **Session Management**: Supabase handles session security automatically
5. **HTTPS**: Use HTTPS in production

## Next Steps

After setup is complete:
1. Test all admin functionality
2. Set up production environment variables
3. Configure production redirect URIs
4. Consider implementing additional security measures
5. Set up monitoring and logging

## Support

If you encounter issues:
1. Check the Supabase documentation
2. Review Google Cloud Console logs
3. Check browser developer tools
4. Verify all configuration steps were completed 