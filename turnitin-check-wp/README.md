# AcademicAssist WordPress Plugin

A professional student academic support platform providing plagiarism reports, AI detection, proofreading, citation help, and assignment assistance.

## Features

- **Plagiarism Reports** - Powered by Turnitin technology
- **AI Detection Reports** - Identify AI-generated content
- **Proofreading** - Professional editing services
- **Citation Help** - APA, MLA, Chicago, Harvard formats
- **Assignment Help** - Expert guidance and support
- **Wallet System** - Prepaid balance for services
- **Multiple Payment Methods** - Bank, Crypto, PayPal, Wise

## Installation

### Method 1: Plugin Upload (Recommended)

1. Download `academic-assist-wp.zip`
2. Go to WordPress Admin → Plugins → Add New → Upload Plugin
3. Choose the zip file and click Install Now
4. Activate the plugin
5. Add shortcode `[academic_assist]` to any page

### Method 2: Manual Upload

1. Extract the zip file
2. Upload `turnitin-check-wp` folder to `/wp-content/plugins/`
3. Activate in WordPress Admin → Plugins

## Shortcode

```
[academic_assist]
```

## Payment Methods Supported

- **Bank Transfer** - Direct bank transfer
- **Cryptocurrency** - BTC, ETH, USDT accepted
- **PayPal** - Secure PayPal payment
- **Wise** - International transfer

## Development

### Building the React Frontend

The plugin includes a React frontend that needs to be built before use:

1. Navigate to the main React app directory (`../app`)
2. Install dependencies: `npm install`
3. Copy WordPress-specific files: `cp ../turnitin-check-wp/src-wp/* src/`
4. Modify `vite.config.ts` to build to WordPress directory (see build-wp.sh for details)
5. Run: `npm run build`
6. The built files will be in `dist/` directory

### Using the Build Script

Run `./build-wp.sh` from the plugin directory to automatically build the frontend.

## API Endpoints

The plugin provides REST API endpoints:

- `GET /wp-json/academic-assist/v1/documents` - Get user documents
- `POST /wp-json/academic-assist/v1/documents` - Upload document
- `GET /wp-json/academic-assist/v1/wallet` - Get wallet balance

## AJAX Endpoints

- `wp_ajax_academic_assist_auth` - Handle login/registration

## File Structure

```
/wp-content/plugins/turnitin-check-wp/
├── turnitin-check.php      # Main plugin file
├── README.md               # This file
└── dist/                   # Built React app
    ├── assets/
    │   ├── index-*.js
    │   └── index-*.css
    └── index.html
```

## Support

For support and customization, contact: support@academicassist.com

## Disclaimer

This plugin uses Turnitin technology to provide plagiarism and AI detection reports. 
Turnitin is a registered trademark of Turnitin, LLC. We are an independent service 
provider helping students access these reports.
