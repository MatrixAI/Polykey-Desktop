README3
========

Notes on syntax used in this project and compiler toolchain for JS.

Using babel to setup a compiler toolchain for JS:

{
  "plugins": [
    ["babel-plugin-root-import", {"rootPathSuffix": "src"}],
    "partial-application",
    "transform-object-rest-spread"
  ],
  "presets": [ "env", "react", "flow" ]
}

So root import is good. Partial application is simple, object spread syntax as well.

The only thing is missing is flow types and pattern matching: https://github.com/xxllexx/babel-plugin-pattern-matching

Note that react transformations is brought in through the react preset. That allows using jsx syntax.

Also native object are extended using the sugar library.
