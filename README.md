# Polykey

[![pipeline status](https://gitlab.com/MatrixAI/open-source/Polykey-Desktop/badges/master/pipeline.svg)](https://gitlab.com/MatrixAI/open-source/Polykey-Desktop/commits/master)

Polykey is a distributed secret sharing system. It helps you manage your
secrets, passwords, API keys and more. It is designed for both managing
personal secrets and infrastructural secrets. This means it can be used
interactively, or in automated fashion. Unlike hosted password managers,
it is "self-hosted", you keep your own secrets. However it is not an
"online" service, so it needs very little maintenance.

It is distributed and decentralised, and secrets are shared between
Polykey nodes. As a user, you can create multiple nodes for each of your
computing platforms, and backups are simply another Polykey node.

Polykey integrates Git, GnuPG, and Keybase.

It is written in JavaScript and intended to work cross-platform: Linux,
Mac, Windows, Android, iOS. It does not necessarily run in the browser.

The design of Polykey is still under flux. Below is currently the
proposal.

A Polykey node is just an encrypted tar archive. It is just state, not
code. One can launch a Polykey application targetting a specific node.
This node needs to be accessible, it can just be a local file path.

The encrypted tar archive represents a sort of virtual directory of
secrets. It is an indexed tar archive to allow random access.

Secrets are organised in flat repositories instead of a hierarchy. In order
to organise secrets, secrets are grouped into tags. This means it is
a sort of tag based filesystem. This is achieved through the use of
hardlinks.

A Polykey node is never decrypted on-disk, it always remains encrypted
on disk. It is only decrypted in-memory. This means we unpack the
archive into an in-memory filesystem. This enables us to maintain
portability between different platform behaviours with regards to
filesystem features such as support for hardlinks.

An important feature of Polykey is the ability to share secrets in a
distributed peer-to-peer style. Our foundation is to start with
a Git based synchronisation system. Secrets are managed as git
directories, which maintains version history of secrets as they
are updated. It is possible to then push to nodes that you control.
But for nodes that you don't control, you can allow other nodes to
pull your secret repositories

Sharing secrets is done through public & private key cryptography.
In order to share keys with another node, you need to know their
public key. For initial key discovery we rely on on keybase for
social proof and as an alternative to public key servers.

Each secret repository has its own version history. This means a
secret repository may contain multiple secrets. Each secret repository
is shared as a unit. It is probably recommended to keep a secret
repository for each secret.

Why would you share secrets? Beyond the basic issue of having a shared
API keys among several agents, or a shared password between users.
This also allows a basic form of capability based security. Where you
can create hierarchal networks of Polykey nodes, and subdivide secrets
into smaller Polykey nodes.

The result is that secrets are encrypted at rest, secrets are encrypted
at transmission, and they can be shared between users and infrastructure.
There's no need for a network unless you are sharing secrets. And you can
run a Polykey node out of a USB stick.

All of other bells and whistles of modern password managers can then be
built on top of this secure platform.

---

Current status:

* js-resource-counter - https://github.com/MatrixAI/js-resource-counter
* js-permaproxy - https://github.com/MatrixAI/js-permaproxy
* js-virtualfs - https://github.com/MatrixAI/js-virtualfs
* js-reference-pointer - https://github.com/MatrixAI/js-reference-pointer
* js-object-tagger - https://github.com/MatrixAI/js-object-tagger
* js-array-fixed - https://github.com/MatrixAI/js-array-fixed
* js-tree-order-index - https://github.com/MatrixAI/js-tree-order-index
* js-virtualgit - https://github.com/MatrixAI/js-virtualgit

The last 2 are still being developed.


### Development
1. `npm install`
2. `npm run dev:build`
3. `npm run electron`

You can do `npm run watch`, but because of the issue to do with oauth2orize, you will have to run `npm run mock_for_oauth2orize` which just creates the required directory in the dist, before you can run `electron .`.

**Other Instructions**:
```
# install (or reinstall packages from package.json)
npm install
# build the development dist and watch for file changes
npm run watch
# build the production dist
npm run build
# run the tests
npm run test
# lint the source code
npm run lint
# automatically fix the source
npm run lintfix
```

#### Linking local code for testing.
For temporary scaffolding of working with client-refactoring branch of js-polykey use this technique:
npm install --save-dev ../js-polykey
This will create a symlink inside the node_modules pointing to js-polykey project.
This allows us to do things like:
```ts
import GRPCClient from '@matrixai/polykey/src/grpc/GRPCClient';

async function main () {
  console.log(GRPCClient);
}

main();
```

Notice that I'm importing from the @matrixai/polykey/src/ and not from dist nor are we just doing @matrixai/polykey directly.
This is because the dist build might not be working inside js-polykey branch, and we just want to test out source code quickly.
Then afterwards just use:
`npm run ts-node -- ./test.ts`
Assuming that was put into ./test.ts.

#### Other development notes.
##### Level down conflict.
The module `level` used in js-polykey conflicts with how webpack builds things.
You need to make sure the webpack config contains
```js
  node: { // When in devmode, webpack needs to get it from node_modules
    __dirname: true,
    __filename: true,
  }
```

##### Source map warnings on node_modules
Some modules may be missing source mappings and this will clutter the compile output with warnings.
We can filter out the warnings by adding the following options to the `webpack.config.js`
```js
test: /\.js$/,
loader: "source-map-loader",
options: { //Added to filter out source map warnings for node modules.
  filterSourceMappingUrl: (url, resourcePath) => {
    return !/.*\/node_modules\/.*/.test(resourcePath);
  }
}
```

### Building the releases:
```
nix-build ./release.nix --attr application
nix-build ./release.nix --attr docker # untested
# packages for distribution
nix-build ./release.nix --attr package.linux.x64.deb
nix-build ./release.nix --attr package.linux.x64.rpm
nix-build ./release.nix --attr package.windows.x64.exe
nix-build ./release.nix --attr package.darwin.x64.zip
```

**Install into Nix user profile**:
```
nix-env -f ./release.nix --install --attr application
```



### Building - old
1. npm run mock_for_oauth2orize
2. Then create temp files under copy grant and lib.
3. npm run dev:webpack:watch
4. npx tsc -p tsconfig-electron.json
5. npm run make:mac
6. electron-packager ./dist Polykey --out=out/win --platform=win32 --arch=x64 --icon=icons/icons/win/icon.ico


### Tests
We are using Jest for the testing.
There were a few changes that were made to get jest working with Polukey.

#### Testing vue.
For general Vue testing we need the `@vue/test-utils` package.
```js
//package.json
"devDependencies": {
  "@vue/test-utils": "^2.0.0-beta.14",
}
```
In testing we can use this to mount components and test them via.
```ts
import { mount } from '@vue/test-utils';
import Antd from 'ant-design-vue';
import DefaultButton from '@/renderer/atoms/button/DefaultButton.vue'

describe('DefaultButton component', () => {
  const wrapper = mount(DefaultButton, {  //Mounts the component
    global: {
      plugins: [Antd],
    },
    props: {},
  });
  test('Exists.', async () => {
    expect(wrapper.exists()).toBe(true); //We can use the wrapper to interact with the component.
    // clicking elements
    await wrapper.trigger('click') //Clicking
    // we can get elements to trigger with
    const button = wrapper.get('data-test=button-to-test');
    await button.trigger('click');
    // but for this the button needs the attribute data-test="button-to-test"
    //I will provide a better example. soon.
  });
});
```

#### Issues
Issues and their fixes as follows.

##### importing Ant-design-vue
To avoid warnings when using ant-design-vue the following changes were made to the jest.config.js
```js
//The lines were added.
const transformIgnorePatterns = [
  '/dist/',
  // Ignore modules without es dir.
  // Update: @babel/runtime should also be transformed
  // 'node_modules/(?!.*(@babel|lodash-es))',
  'node_modules/(?!@ant-design/icons-vue|@ant-design/icons-svg|lodash-es)/',
];
module.exports = {
  //...
  transformIgnorePatterns,
}
```

##### Tansforms for babel and SVG
We needed to add a transform for .js files, so `babel-jest` was added.
In the package.json file
```js
//package.json
"devDependencies": {
    //...
    //for babel
    "@babel/preset-env": "^7.13.10",
    "babel-jest": "^26.6.3",
    //...
    //For SVG and other imports
    "jest-transform-stub": "^2.0.0",
}
```
Added a babel.config.js file
```js
//babel.config.js
module.exports = {
  presets: ['@babel/preset-env'],
};
```
Added a line to jest.config.js
```js
//jest.config.js
module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',        //For babel.
    "^.+\\.svg$": "jest-transform-stub" //For stubbing svg
  }
}
```


