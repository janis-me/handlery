# Installation

It's on [npm](https://www.npmjs.com/package/handlery), so just install it as a dependency:

::: code-group

```sh [npm]
$ npm install handerly
```

```sh [pnpm]
$ pnpm add handerly
```

```sh [yarn]
$ yarn add handerly
```

```sh [bun]
$ bun add handerly
```

:::

You also need a recent version of typescript (tested with `5.8`) and support for [ECMA decorators](https://github.com/tc39/proposal-decorators).

So make sure you are not using the deprecated typescript legacy-decorators. In recent typescript versions that should work out of the box, but think about what ECMA version your code targets! There is [no native browser support](https://caniuse.com/decorators) for decorators yet, so use polyfills, a transpiler, a babel plugin or whatever.

## That's it!

You can now look at how to [get started](/guide/getting-started)
