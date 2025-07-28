# Google Authentication for Bakery Admin Panel

## Overview

The bakery application now includes secure Google OAuth authentication for the admin panel. This ensures that only authorized users can access the admin dashboard to manage products, orders, and homepage settings.

## Features

- ✅ **Google OAuth Integration**: Secure login using Google accounts
- ✅ **Protected Admin Routes**: Admin panel is only accessible to authenticated users
- ✅ **User Profile Management**: Automatic user profile creation and management
- ✅ **Session Management**: Secure session handling with Supabase
- ✅ **Responsive Design**: Clean, modern login interface
- ✅ **Error Handling**: Comprehensive error handling and user feedback

## How It Works

1. **Login Flow**: Users click the admin button on the homepage or navigate to `/admin`
2. **Authentication**: Google OAuth handles the authentication process
3. **Authorization**: The system checks if the user has admin privileges
4. **Access Control**: Only authorized users can access the admin dashboard
5. **Session Management**: Supabase handles secure session management

## File Structure

```
src/
├── components/
│   ├── Login.tsx                 # Login component with Google OAuth
│   └── ProtectedAdminRoute.tsx   # Protected route wrapper
├── services/
│   └── auth.ts                   # Authentication service
├── lib/
│   └── supabase.ts               # Updated with user_profiles types
└── main.tsx                      # Updated with React Router

Database:
├── user-profiles-migration.sql   # Database migration for user profiles
└── GOOGLE_OAUTH_SETUP.md         # Complete setup guide
```

## Quick Start

### 1. Set up Google OAuth
Follow the detailed guide in `GOOGLE_OAUTH_SETUP.md` to:
- Configure Google Cloud Console
- Set up OAuth credentials
- Configure Supabase authentication

### 2. Run Database Migration
Execute the `user-profiles-migration.sql` script in your Supabase SQL Editor.

### 3. Test the Setup
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:5181/admin`
3. Click "Sign in with Google"
4. Complete the OAuth flow

## Configuration

### Environment Variables
Make sure your `.env` file includes:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Admin Access Control
By default, any authenticated user can access the admin panel. To restrict access:

1. **By Email Domain**: Edit `src/services/auth.ts`:
```typescript
async isAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;
  
  const allowedDomains = ['yourcompany.com'];
  const userDomain = user.email?.split('@')[1];
  
  return allowedDomains.includes(userDomain || '');
}
```

2. **By Specific Emails**: Edit `src/services/auth.ts`:
```typescript
async isAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;
  
  const allowedEmails = ['admin@yourcompany.com'];
  
  return allowedEmails.includes(user.email || '');
}
```

## Security Features

- **Row Level Security (RLS)**: Database tables are protected with RLS policies
- **Secure Sessions**: Supabase handles secure session management
- **OAuth 2.0**: Industry-standard OAuth 2.0 authentication
- **HTTPS Required**: Production deployments require HTTPS
- **Environment Variables**: Sensitive data is stored in environment variables

## User Experience

### Login Page
- Clean, modern design with Google branding
- Loading states and error handling
- Responsive design for all devices

### Admin Dashboard
- User profile display in header
- Sign out functionality
- Seamless integration with existing admin features

### Error Handling
- Clear error messages for authentication failures
- Graceful handling of network issues
- User-friendly feedback for all scenarios

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Check Google Cloud Console redirect URIs
   - Verify Supabase project URL

2. **"Access denied" after login**
   - Check `isAdmin` function logic
   - Verify user email permissions

3. **Database errors**
   - Run the migration script
   - Check Supabase logs

### Debug Steps
1. Check browser console for errors
2. Verify environment variables
3. Check Supabase authentication logs
4. Test with different email addresses

## Production Deployment

### Environment Setup
1. Update Google OAuth redirect URIs for production domain
2. Update Supabase site URL and redirect URLs
3. Set production environment variables
4. Enable HTTPS

### Security Checklist
- [ ] HTTPS enabled
- [ ] Environment variables configured
- [ ] Google OAuth redirect URIs updated
- [ ] Supabase settings configured
- [ ] Admin access restrictions implemented
- [ ] Error monitoring set up

## Support

For issues or questions:
1. Check the `GOOGLE_OAUTH_SETUP.md` guide
2. Review Supabase documentation
3. Check browser developer tools
4. Verify all configuration steps

## Future Enhancements

Potential improvements:
- Multi-factor authentication
- Role-based access control
- Audit logging
- Session timeout settings
- Remember me functionality
- Password reset capabilities 