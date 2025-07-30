# 🚀 Git Workflow Guide - Staging Branch Setup

This guide explains how to use the staging branch workflow for the Ebby's Bakery application.

## 🎯 Branch Strategy

```
main (production) ←── staging ←── feature branches
```

### **Branch Purposes:**

- **`main`** - Production-ready code (always stable)
- **`staging`** - Pre-production testing and integration
- **`feature/*`** - Individual features and bug fixes

## 🚀 Development Workflow

### **1. Starting New Work**

```bash
# Always start from staging branch
git checkout staging
git pull origin staging

# Create feature branch
git checkout -b feature/your-feature-name
```

### **2. Development Process**

```bash
# Make your changes
# Test in development environment
npm run dev

# Test in staging environment
npm run dev:staging

# Commit your changes
git add .
git commit -m "feat: add new feature description"
```

### **3. Merging to Staging**

```bash
# Switch to staging branch
git checkout staging
git pull origin staging

# Merge your feature branch
git merge feature/your-feature-name

# Test in staging environment
npm run dev:staging

# Push to remote staging
git push origin staging
```

### **4. Deploying to Production**

```bash
# When staging is tested and approved
git checkout main
git pull origin main

# Merge staging into main
git merge staging

# Push to production
git push origin main
```

## 🧪 Environment Testing

### **Development Testing**
```bash
git checkout feature/your-feature
npm run dev
# Test at http://localhost:5173
```

### **Staging Testing**
```bash
git checkout staging
npm run dev:staging
# Test at http://localhost:3000
```

### **Production Testing**
```bash
git checkout main
npm run build
# Deploy and test production build
```

## 📋 Branch Naming Conventions

### **Feature Branches:**
- `feature/email-integration`
- `feature/admin-dashboard`
- `feature/payment-system`

### **Bug Fix Branches:**
- `fix/order-creation-error`
- `fix/email-notification-bug`
- `fix/mobile-responsive-issue`

### **Hotfix Branches:**
- `hotfix/critical-security-fix`
- `hotfix/production-crash-fix`

## 🔒 Branch Protection Rules

### **Main Branch Protection:**
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Restrict direct pushes

### **Staging Branch Protection:**
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Allow force pushes (for emergency fixes)

## 🚨 Emergency Hotfix Process

### **For Critical Production Issues:**

```bash
# Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-issue

# Make minimal fix
# Test thoroughly

# Merge to main and staging
git checkout main
git merge hotfix/critical-issue
git push origin main

git checkout staging
git merge hotfix/critical-issue
git push origin staging

# Delete hotfix branch
git branch -d hotfix/critical-issue
```

## 📊 Environment Configuration

### **Development Environment:**
- Uses `.env` (if exists)
- Runs on `localhost:5173`
- Connects to development database

### **Staging Environment:**
- Uses `.env.staging`
- Runs on `localhost:3000`
- Connects to staging database
- Shows yellow banner: "🚧 Staging Environment"

### **Production Environment:**
- Uses `.env.production` (if exists)
- Built with `npm run build`
- Connects to production database
- No environment banners

## 🎯 Best Practices

### **Before Merging to Staging:**
1. ✅ All tests pass
2. ✅ Code reviewed
3. ✅ Staging environment tested
4. ✅ No console errors
5. ✅ Database migrations applied

### **Before Merging to Main:**
1. ✅ Staging thoroughly tested
2. ✅ All features working
3. ✅ Performance acceptable
4. ✅ Security review completed
5. ✅ Documentation updated

### **Commit Message Guidelines:**
```
type: brief description

feat: add new email notification system
fix: resolve order creation error
docs: update API documentation
style: format code according to guidelines
refactor: restructure order processing logic
test: add unit tests for email service
chore: update dependencies
```

## 🚨 Troubleshooting

### **Merge Conflicts:**
```bash
# Resolve conflicts
git status
# Edit conflicted files
git add .
git commit -m "resolve merge conflicts"
```

### **Staging Branch Out of Sync:**
```bash
git checkout staging
git pull origin staging
git merge main
git push origin staging
```

### **Feature Branch Behind Staging:**
```bash
git checkout feature/your-feature
git rebase staging
# Resolve conflicts if any
git push --force-with-lease origin feature/your-feature
```

## 📞 Support

If you encounter issues:
1. Check this workflow guide
2. Review branch protection rules
3. Consult with the team
4. Create an issue for workflow improvements

## 🎯 Quick Reference

### **Daily Workflow:**
```bash
git checkout staging
git pull origin staging
git checkout -b feature/your-feature
# Make changes
npm run dev:staging
git add . && git commit -m "feat: description"
git checkout staging && git merge feature/your-feature
git push origin staging
```

### **Release Workflow:**
```bash
git checkout main
git merge staging
git push origin main
# Deploy to production
```

This workflow ensures code quality, proper testing, and safe deployments to production. 