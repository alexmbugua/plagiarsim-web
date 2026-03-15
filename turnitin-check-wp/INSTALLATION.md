# Turnitin Check - WordPress Installation Guide

## Method 1: Using the Plugin (Recommended)

### Step 1: Install the Plugin

1. Download the `turnitin-check-wp` folder
2. Upload it to `/wp-content/plugins/` directory
3. Activate the plugin in WordPress Admin → Plugins

### Step 2: Create a Page

1. Go to Pages → Add New
2. Add the shortcode: `[turnitin_check]`
3. Publish the page

### Step 3: Configure (Optional)

1. Go to Turnitin Check → Settings in the admin menu
2. Customize settings as needed

---

## Method 2: Using a Page Template

### Step 1: Upload Files

1. Copy the `dist` folder to your theme directory:
   ```
   /wp-content/themes/your-theme/turnitin-check/
   ```

2. Copy `page-template.php` to your theme directory

### Step 2: Create Page

1. Go to Pages → Add New
2. Select "Turnitin Check" as the page template
3. Publish the page

---

## Method 3: Using Custom HTML Block (Simplest)

### Step 1: Upload Static Files

1. Upload the `dist` folder to your server via FTP:
   ```
   /public_html/turnitin-check/
   ```

2. Or use a plugin like "File Manager" to upload

### Step 2: Create Page

1. Go to Pages → Add New
2. Add a Custom HTML block
3. Paste this code:

```html
<div id="turnitin-check-root"></div>
<link rel="stylesheet" href="/turnitin-check/assets/index-XXXXXX.css">
<script type="module" src="/turnitin-check/assets/index-XXXXXX.js"></script>
```

**Note**: Replace `XXXXXX` with the actual hash from your built files.

---

## Method 4: Using a Child Theme

### Step 1: Create Child Theme

Create a folder: `/wp-content/themes/turnitin-check-child/`

### Step 2: Create style.css

```css
/*
Theme Name: Turnitin Check Child
Template: your-parent-theme
*/
```

### Step 3: Create functions.php

```php
<?php
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('turnitin-check', get_stylesheet_directory_uri() . '/dist/assets/index-XXXXXX.css');
    wp_enqueue_script('turnitin-check', get_stylesheet_directory_uri() . '/dist/assets/index-XXXXXX.js', array(), '1.0', true);
});
```

### Step 4: Create page-turnitin.php

Copy the contents of `page-template.php` to this file.

---

## WordPress Integration Details

### User Authentication

The app integrates with WordPress user system:
- Registration creates WordPress users
- Login uses WordPress authentication
- Sessions are managed by WordPress

### Database

The plugin creates custom tables for:
- Upload slots
- Document history
- Reports

### AJAX Endpoints

Available endpoints:
- `turnitin_check_auth` - Login/Register
- `turnitin_check_upload` - Document upload
- `turnitin_check_report` - Get reports

### Shortcodes

- `[turnitin_check]` - Full application
- `[turnitin_check_pricing]` - Pricing table only
- `[turnitin_check_stats]` - Stats display

---

## Customization

### Change Colors

Edit `/dist/assets/index-*.css` and modify:
```css
--color-primary: #3557e7;
--color-secondary: #0f1b41;
```

### Change Content

Edit the React source files and rebuild:
```bash
cd /path/to/app
npm run build
```

### Add Custom CSS

Add to your theme's `style.css` or use Customizer:
```css
.turnitin-check-app {
    /* Your custom styles */
}
```

---

## Troubleshooting

### App Not Loading

1. Check browser console for errors
2. Verify file paths are correct
3. Ensure all assets are uploaded

### Styles Not Applied

1. Check if CSS file is loaded in Network tab
2. Clear browser cache
3. Check for CSS conflicts

### Login Not Working

1. Verify AJAX URL is correct
2. Check WordPress nonce
3. Review error logs

---

## Support

For issues and customization:
- Email: support@turnitincheck.com
- Documentation: https://turnitincheck.com/docs
