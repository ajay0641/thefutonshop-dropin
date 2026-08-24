/**
 * Stages a publishable package from dist/ so imports match storefront usage:
 *   @ajay0641/tfs-menu/render.js
 *   @ajay0641/tfs-menu/api.js
 *   @ajay0641/tfs-menu/containers/MenuContainer.js
 *
 * Official Adobe drop-ins publish dist contents at the package root (not under /dist).
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const outDir = path.join(root, '.publish');

function cleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.copyFileSync(src, dest);
}

if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'render.js'))) {
  console.error('Missing dist/. Run "npm run build" before packing.');
  process.exit(1);
}

cleanDir(outDir);
copyRecursive(distDir, outDir);

const rootPkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const publishPkg = {
  name: rootPkg.name,
  version: rootPkg.version,
  description:
    rootPkg.description ||
    'The Futon Shop navigation menu drop-in for Adobe Commerce storefronts',
  license: rootPkg.license || 'MIT',
  engines: rootPkg.engines,
  sideEffects: false,
};

fs.writeFileSync(
  path.join(outDir, 'package.json'),
  `${JSON.stringify(publishPkg, null, 2)}\n`
);

for (const doc of ['CHANGELOG.md', 'README.md', 'LICENSE.md']) {
  const from = path.join(root, doc);
  if (fs.existsSync(from)) {
    fs.copyFileSync(from, path.join(outDir, doc));
  }
}

const parentLicense = path.join(root, '..', 'LICENSE.md');
if (!fs.existsSync(path.join(outDir, 'LICENSE.md')) && fs.existsSync(parentLicense)) {
  fs.copyFileSync(parentLicense, path.join(outDir, 'LICENSE.md'));
}

console.log(`Prepared publish package at ${outDir}`);
console.log(`  ${publishPkg.name}@${publishPkg.version}`);
