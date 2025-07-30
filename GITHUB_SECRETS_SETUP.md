# GitHub Secrets Setup for Vercel Deployment

## Required GitHub Secrets

Add these secrets in your GitHub repository: `Settings → Secrets and variables → Actions`

### Vercel Deployment Secrets
```
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_organization_id_here
VERCEL_PROJECT_ID=your_project_id_here
```

### Production Environment Secrets
```
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
VITE_EMAIL_SERVICE=resend
VITE_ENABLE_EMAIL_NOTIFICATIONS=true
```

### Staging Environment Secrets
```
VITE_SUPABASE_URL_STAGING=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY_STAGING=your_staging_supabase_anon_key
```

## How to Get Vercel Credentials

### 1. Vercel Token
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name: "GitHub Actions Deployment"
4. Copy the token immediately (you won't see it again!)

### 2. Project ID
1. Go to your Vercel project dashboard
2. Settings → General
3. Copy the "Project ID"

### 3. Organization ID
1. Go to your Vercel project dashboard
2. Settings → General
3. Copy the "Team ID" (this is your org ID)

## Quick Setup Steps

1. **Create Vercel Project:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Deploy (this creates the project)

2. **Get Credentials:**
   - Follow the steps above to get token, project ID, and org ID

3. **Add GitHub Secrets:**
   - Go to your GitHub repo settings
   - Add all the secrets listed above

4. **Test Deployment:**
   - Push to `staging` branch to test staging deployment
   - Push to `main` branch to test production deployment

## Troubleshooting

- **Token not found:** Make sure you copied the token correctly
- **Project not found:** Ensure the project ID matches your Vercel project
- **Permission denied:** Check that your Vercel token has the right permissions 