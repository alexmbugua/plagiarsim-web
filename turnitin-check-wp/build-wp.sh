#!/bin/bash

#!/bin/bash

# Build script for WordPress plugin
# This script builds the React app and copies files to WordPress

echo "Building AcademicAssist for WordPress..."

# Navigate to the React app directory
cd ../app

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    npm install
fi

# Copy WordPress-specific source files
cp ../turnitin-check-wp/src-wp/* src/

# Temporarily modify vite config for WordPress build
sed -i 's|outDir: '\''\./dist'\'',|outDir: '\''../turnitin-check-wp/dist'\'',\n    emptyOutDir: true,\n    rollupOptions: {\n      input: {\n        main: path.resolve(__dirname, '\''src/main.wp.tsx'\''),\n      },\n      output: {\n        entryFileNames: '\''assets/index-[hash].js'\'',\n        chunkFileNames: '\''assets/[name]-[hash].js'\'',\n        assetFileNames: (assetInfo) => {\n          const info = assetInfo.name.split('\''.'\'');\n          const ext = info[info.length - 1];\n          if (/\\.(css)$/i.test(assetInfo.name)) {\n            return '\''assets/index-[hash][extname]'\'';\n          }\n          return '\''assets/[name]-[hash][extname]'\'';\n        },\n      },\n    },|' vite.config.ts

# Build for WordPress
npm run build

# Restore original vite config
git checkout vite.config.ts

# Clean up copied files
rm -f src/AuthContext.wp.tsx src/App.wp.tsx src/main.wp.tsx

echo "Build complete! WordPress plugin is ready in ../turnitin-check-wp/"
      output: {
        entryFileNames: 'assets/index-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/i.test(assetInfo.name)) {
            return 'assets/index-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    outDir: '../turnitin-check-wp/dist',
    emptyOutDir: true,
  },
})
EOF

# Clean up temporary files
rm -f src/main-wp.tsx vite.config.wp.ts

echo "Build complete! WordPress plugin is ready in ../turnitin-check-wp/"
