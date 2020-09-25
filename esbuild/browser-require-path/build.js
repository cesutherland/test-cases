const { build } = require('esbuild')

build({
  entryPoints: ['./index.js'],
  outfile: './dist.js',
  platform: 'browser',
  format: 'cjs',
  bundle: true,
  external: ['path'],
}).catch(() => process.exit(1))
