# About Section Setup Guide

## Overview
The About Section feature allows you to add a customizable "About Ebby" section to your homepage. This section displays an image on the left and text content on the right, and can be fully edited from the admin dashboard.

## Features
- **Editable Title**: Customize the section title (default: "About Ebby")
- **Editable Content**: Write your story, mission, or any content you want to share
- **Editable Image**: Upload images directly for the about section
- **Responsive Design**: Works on both desktop and mobile devices
- **Admin Control**: All content can be managed from the admin dashboard

## Setup Instructions

### 1. Database Migration
First, run the database migration to add the new fields:

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `about-section-migration.sql`
4. Click "Run" to execute the migration

### 2. Configure the About Section
1. Go to your admin dashboard (`/admin`)
2. Click on the "Homepage Settings" tab
3. Click "Edit Settings"
4. Scroll down to the "About Section" area
5. Fill in the following fields:
   - **About Title**: The heading for the section (e.g., "About Ebby")
   - **About Content**: Your story, mission, or description
   - **About Image**: Upload an image by clicking or dragging and dropping

### 3. Save and View
1. Click "Save Settings"
2. Go to your homepage to see the new About section at the bottom

## Content Suggestions

### About Title Ideas
- "About Ebby"
- "Our Story"
- "Meet the Baker"
- "The Ebby's Story"
- "Our Mission"

### About Content Ideas
- Your baking journey and passion
- Your commitment to quality ingredients
- Your family's baking tradition
- Your mission to bring fresh bread to the community
- Your unique baking techniques or recipes

### Image Suggestions
- A photo of you/the baker at work
- Your bakery or kitchen
- Freshly baked bread
- A warm, inviting bakery scene
- Your baking tools or ingredients

**Note:** You can now upload images directly instead of providing URLs. Simply drag and drop an image or click to select one from your computer.

## Technical Details

### Database Fields Added
- `about_title`: VARCHAR(255) - The section title
- `about_content`: TEXT - The main content/description
- `about_image_url`: TEXT - URL of the uploaded about section image (automatically generated)

### Frontend Components
- **Homepage**: Displays the about section at the bottom
- **Admin Dashboard**: Form fields to edit the about section content
- **Settings Tab**: Preview of current about section settings

### Styling
- Responsive grid layout (image left, text right on desktop)
- Orange accent color matching the site theme
- Rounded corners and shadows for modern appearance
- Mobile-friendly stacking on smaller screens

## Troubleshooting

### Image Not Displaying
- Check that the image was uploaded successfully
- Ensure the image file is a valid image format (JPG, PNG, etc.)
- Try uploading a different image if the current one isn't working
- Check that your internet connection is stable during upload

### Content Not Updating
- Refresh the homepage after saving settings
- Check the browser console for any errors
- Verify that the database migration was successful

### Styling Issues
- Clear your browser cache
- Check that all CSS is loading properly
- Ensure you're using the latest version of the application

## Customization

You can further customize the about section by:
- Modifying the CSS classes in the Homepage component
- Adding more fields to the database and form
- Changing the layout or styling to match your brand
- Adding animations or interactive elements

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify that all database migrations have been run
3. Ensure your Supabase connection is working properly
4. Contact support with specific error details 