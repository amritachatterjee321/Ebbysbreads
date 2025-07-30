#!/bin/bash

# Ebby's Bakery - Staging Branch Workflow Scripts

echo "🚀 Ebby's Bakery Git Workflow Helper"
echo "====================================="

case "$1" in
    "start-feature")
        if [ -z "$2" ]; then
            echo "Usage: ./workflow.sh start-feature <feature-name>"
            exit 1
        fi
        echo "📝 Starting new feature: $2"
        git checkout staging
        git pull origin staging
        git checkout -b "feature/$2"
        echo "✅ Feature branch 'feature/$2' created from staging"
        ;;
    
    "test-staging")
        echo "🧪 Testing staging environment"
        git checkout staging
        npm run dev:staging
        ;;
    
    "merge-feature")
        if [ -z "$2" ]; then
            echo "Usage: ./workflow.sh merge-feature <feature-name>"
            exit 1
        fi
        echo "🔄 Merging feature: $2"
        git checkout staging
        git pull origin staging
        git merge "feature/$2"
        echo "✅ Feature merged to staging"
        echo "🧪 Test staging environment: npm run dev:staging"
        ;;
    
    "deploy-production")
        echo "🚀 Deploying to production"
        git checkout main
        git pull origin main
        git merge staging
        git push origin main
        echo "✅ Deployed to production"
        ;;
    
    "hotfix")
        if [ -z "$2" ]; then
            echo "Usage: ./workflow.sh hotfix <issue-description>"
            exit 1
        fi
        echo "🚨 Creating hotfix: $2"
        git checkout main
        git checkout -b "hotfix/$2"
        echo "✅ Hotfix branch 'hotfix/$2' created from main"
        ;;
    
    "status")
        echo "📊 Current branch status:"
        git branch -v
        echo ""
        echo "🔄 Recent commits:"
        git log --oneline -5
        ;;
    
    *)
        echo "Available commands:"
        echo "  start-feature <name>    - Create new feature branch"
        echo "  test-staging           - Test staging environment"
        echo "  merge-feature <name>   - Merge feature to staging"
        echo "  deploy-production      - Deploy staging to production"
        echo "  hotfix <description>   - Create hotfix branch"
        echo "  status                 - Show current status"
        echo ""
        echo "Example:"
        echo "  ./workflow.sh start-feature email-integration"
        echo "  ./workflow.sh test-staging"
        echo "  ./workflow.sh merge-feature email-integration"
        echo "  ./workflow.sh deploy-production"
        ;;
esac 