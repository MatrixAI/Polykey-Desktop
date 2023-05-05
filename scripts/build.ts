#!/usr/bin/env ts-node

import path from 'path';
import process from 'process';
import esbuild from 'esbuild';

// now should you even bother bundling here?
// also now that you have `polykey.ts` you also have to consider that
// especially if you're calling those things
// it'd be interesting to see
// cause the renderer procedss
// index.js is the nodejs thing
// then renderer.js the other thing
// ok i see now
// esbuild is already enabled to do a bunch of stuff
// the final build does not require source map
// but during this process you do need it
// unlike libraries
// but it can be good to keep it around annyway

// any dependencies used by node.js is now loaded from disk
// so they exist in the `node_modules` directory

const projectRoot = path.join(__dirname, '..');

async function main(argv = process.argv): Promise<number> {
  argv = argv.slice(2);

  const isProduction = argv[0] === 'production';

  esbuild.build({
    platform: 'node',
    entryPoints: [path.join(projectRoot, 'src/main/index.ts')],
    outfile: path.join(projectRoot, 'dist/index.js'),
    bundle: true,
    sourcemap: true,
    minify: isProduction,
    tsconfig: path.join(projectRoot, 'tsconfig.build.json'),
    external: ['./node_modules/']
  });

  // react is just TSX
  // no need for vue anymore

  esbuild.build({
    platform: 'browser',
    entryPoints: [path.join(projectRoot, 'src/renderer/index.ts')],
    outfile: path.join(projectRoot, 'dist/renderer.js'),
    bundle: true,
    sourcemap: true,
    minify: isProduction,
    tsconfig: path.join(projectRoot, 'tsconfig.build.json'),
    target: ['chrome', 'es2021']
  });

  // for production, you want
  // not to set external
  // for development external is fine
  // but for production, you aren't expecting to keep around the node_modules
  // so you should not have it

  process.exitCode = 0;
  return process.exitCode;
}

void main();
