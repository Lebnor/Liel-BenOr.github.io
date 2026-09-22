Three.js 0.186.0, MIT license. Bundled from the official npm distribution.
Bundler: esbuild 0.28.2; format esm, minified.
Entry: three/build/three.module.js

Regenerate with an external temporary dependency directory:
npm install --prefix /tmp/world-vendor three@0.186.0 esbuild@0.28.2
/tmp/world-vendor/node_modules/.bin/esbuild /tmp/world-vendor/node_modules/three/build/three.module.js --bundle --minify --format=esm --outfile=static/vendor/three.module.min.js
