# 🚀 Production Deployment Guide

This guide explains how to deploy the Ebby's Bakery application to production using automated CI/CD pipelines.

## 🎯 Deployment Architecture

```
GitHub Repository
├── main branch → Production (Vercel)
├── staging branch → Staging (Vercel)
└── feature branches → Development (Local)
```

## 🚀 Deployment Platforms

### **Primary Platform: Vercel**
- **Production**: `https://ebbys-bakery.vercel.app`
- **Staging**: `https://staging-ebbys-bakery.vercel.app`
- **Preview**: Automatic for each PR

### **Alternative Platforms**
- **Netlify**: Similar to Vercel
- **AWS S3 + CloudFront**: For advanced users
- **Firebase Hosting**: Google's platform

## 📋 Prerequisites

### **1. Vercel Account Setup**
1. **Sign up** at [vercel.com](https://vercel.com)
2. **Connect GitHub** repository
3. **Import project** from GitHub
4. **Configure environment variables**

### **2. GitHub Secrets Setup**
Go to your GitHub repository → Settings → Secrets and variables → Actions

**Required Secrets:**
```bash
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# Production Environment
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_EMAIL_SERVICE=resend
VITE_ENABLE_EMAIL_NOTIFICATIONS=true

# Staging Environment
VITE_SUPABASE_URL_STAGING=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY_STAGING=your_staging_anon_key
```

## 🚀 Deployment Workflow

### **Automatic Deployments**

#### **Staging Deployment**
```bash
# Push to staging branch
git checkout staging
git push origin staging
# → Automatically deploys to staging environment
```

#### **Production Deployment**
```bash
# Merge staging to main
git checkout main
git merge staging
git push origin main
# → Automatically deploys to production
```

### **Manual Deployments**

#### **Via GitHub Actions**
1. Go to **Actions** tab in GitHub
2. Select **"Deploy to Production"** or **"Deploy to Staging"**
3. Click **"Run workflow"**

#### **Via Vercel Dashboard**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **"Deploy"**

## 🔧 Environment Configuration

### **Production Environment**
```bash
VITE_ENV=production
VITE_APP_NAME=Ebby's Bakery
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_EMAIL_SERVICE=resend
VITE_ENABLE_EMAIL_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false
```

### **Staging Environment**
```bash
VITE_ENV=staging
VITE_APP_NAME=Ebby's Bakery (Staging)
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_staging_anon_key
VITE_EMAIL_SERVICE=log
VITE_ENABLE_EMAIL_NOTIFICATIONS=true
VITE_ENABLE_DEBUG_MODE=true
```

## 🧪 Testing Before Deployment

### **Local Testing**
```bash
# Test production build locally
npm run build
npm run preview

# Test staging build locally
npm run build:staging
npm run preview:staging
```

### **Staging Testing**
1. **Deploy to staging** first
2. **Test all features** in staging environment
3. **Verify database connections**
4. **Test email notifications**
5. **Check performance**

### **Production Testing**
1. **Deploy to production**
2. **Smoke test** critical features
3. **Monitor error logs**
4. **Check analytics**

## 🔒 Security Configuration

### **Environment Variables**
- ✅ **Never commit** sensitive data to git
- ✅ **Use GitHub Secrets** for production values
- ✅ **Rotate keys** regularly
- ✅ **Use different keys** for each environment

### **HTTPS Configuration**
- ✅ **Force HTTPS** in production
- ✅ **Enable HSTS** headers
- ✅ **Configure CSP** (Content Security Policy)
- ✅ **Set secure cookies**

### **Database Security**
- ✅ **Use RLS** (Row Level Security) in Supabase
- ✅ **Limit API access** with proper policies
- ✅ **Monitor database** access logs
- ✅ **Backup regularly**

## 📊 Monitoring and Analytics

### **Error Monitoring**
- **Sentry**: Error tracking and performance monitoring
- **Vercel Analytics**: Built-in performance monitoring
- **Supabase Logs**: Database query monitoring

### **Performance Monitoring**
- **Core Web Vitals**: Page load performance
- **Lighthouse**: Performance audits
- **Real User Monitoring**: Actual user experience

### **Business Analytics**
- **Google Analytics**: User behavior tracking
- **Custom Events**: Order tracking, conversions
- **A/B Testing**: Feature experimentation

## 🚨 Rollback Procedures

### **Quick Rollback**
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

### **Database Rollback**
1. **Restore from backup** if needed
2. **Run migration rollback** scripts
3. **Verify data integrity**

### **Vercel Rollback**
1. Go to **Vercel Dashboard**
2. Select **Deployments**
3. Click **"Redeploy"** on previous deployment

## 🎯 Best Practices

### **Before Production Deployment**
1. ✅ **Staging thoroughly tested**
2. ✅ **All tests passing**
3. ✅ **Performance acceptable**
4. ✅ **Security review completed**
5. ✅ **Documentation updated**
6. ✅ **Backup created**

### **During Deployment**
1. ✅ **Monitor deployment logs**
2. ✅ **Check for errors**
3. ✅ **Verify environment variables**
4. ✅ **Test critical paths**

### **After Deployment**
1. ✅ **Smoke test production**
2. ✅ **Monitor error rates**
3. ✅ **Check performance metrics**
4. ✅ **Verify email notifications**
5. ✅ **Update status page**

## 🚨 Troubleshooting

### **Common Issues**

#### **Build Failures**
```bash
# Check build logs
npm run build

# Verify dependencies
npm ci

# Check TypeScript errors
npx tsc --noEmit
```

#### **Environment Variable Issues**
- Verify secrets are set in GitHub
- Check Vercel environment variables
- Ensure variable names match exactly

#### **Database Connection Issues**
- Verify Supabase credentials
- Check RLS policies
- Test database connectivity

#### **Email Service Issues**
- Verify email service credentials
- Check email service quotas
- Test email delivery

## 📞 Support

### **Vercel Support**
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### **GitHub Actions Support**
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Community](https://github.com/orgs/community/discussions)

### **Supabase Support**
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)

## 🎯 Quick Reference

### **Deployment Commands**
```bash
# Deploy to staging
git checkout staging
git push origin staging

# Deploy to production
git checkout main
git merge staging
git push origin main
```

### **Environment URLs**
- **Production**: `https://ebbys-bakery.vercel.app`
- **Staging**: `https://staging-ebbys-bakery.vercel.app`
- **Preview**: `https://ebbys-bakery-git-feature-branch.vercel.app`

### **Monitoring URLs**
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **GitHub Actions**: `https://github.com/username/repo/actions`
- **Supabase Dashboard**: `https://supabase.com/dashboard`

This deployment guide ensures reliable, secure, and automated deployments to production. 