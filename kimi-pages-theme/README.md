# Kimi Pages Theme

A WordPress theme containing static page templates for the Kimi platform sections.

## Installation

1. Upload the `kimi-pages-theme` folder to your WordPress `wp-content/themes/` directory.
2. Activate the theme in WordPress admin under **Appearance > Themes**.
3. Create new pages and assign the appropriate page templates:
   - **Home Page**: Use "Home Page" template for the hero section
   - **Features Page**: Use "Features Page" template
   - **Pricing Page**: Use "Pricing Page" template
   - **About Page**: Use "About Page" template
   - **Services Page**: Use "Services Page" template
   - **Contact Page**: Use "Contact Page" template

## Page Templates Included

- `page-home.php` - Hero section with call-to-action
- `page-features.php` - Features showcase
- `page-pricing.php` - Pricing plans
- `page-about.php` - About page
- `page-services.php` - Services overview
- `page-contact.php` - Contact form and information

## Customization

- Edit the templates in `page-*.php` files to modify content
- Update styles in `style.css`
- Add images to the `images/` folder (create if needed) and reference them in templates

## Linking Pages

Use Elementor or the WordPress menu system to link between pages. The header navigation in `index.php` provides basic menu structure.

## Notes

- This theme provides static HTML versions of the React components
- Functionality (forms, interactions) needs to be added separately using Elementor widgets or custom code
- Images referenced in templates need to be added to `images/` folder