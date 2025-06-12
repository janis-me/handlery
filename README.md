<p align="center">
  <a href="https://github.com/janis-me/themed" target="_blank" rel="noopener noreferrer">
    <img width="220px" src="./handlery-logo.png" alt="Themed logo">
  </a>
</p>
<p align="center" style="font-size: 1.5rem;">
  <b>handlery</b>: typed event handling like it should be.
</p>
<p align="center">
  <a href="https://handlery.dev">
    <img src="https://img.shields.io/badge/Documentation-online-blue" alt="build status">
  </a>
  <a href="https://app.netlify.com/sites/handlery/deploys">
    <img alt="docs deployment" src="https://img.shields.io/netlify/c3cdf58b-607b-46d3-8bb5-ac3d94070850?style=flat&logo=netlify&label=docs">
  </a>
  <a href="https://github.com/janis-me/handlery/deployments">
    <img alt="GitHub deployments" src="https://img.shields.io/github/deployments/janis-me/handlery/prod?logo=github&label=build">
  </a>
  <a href="https://npmjs.com/package/handlery">
    <img alt="handlery on npm" src="https://img.shields.io/npm/v/handlery?label=npm&labelColor=orange&color=grey">
  </a>
</p>
<br/>

`handlery` (like [`emittery`](https://github.com/sindresorhus/emittery) but for 'handle') is a super clean and easy way to handle any kind of events with class-based handlers (and decorators!). It works with all kinds of event emitters (emittery, nodejs' `EventEmitter`...) out of the box! Just look at it:

```ts
@register()
class UserHandler extends EventHandler {
  @on('user.add')
  public handleAddUser(user: Events['user.add'], ctx: HandlerContext) {
    ctx.emitter.emit('user.add.response', { ... })
    // ...
  }
}
```

It requires typescript decorators support (modern, ECMA decorators. Not `Decorators.Legacy` etc.) And an event emitter like [`emittery`](https://github.com/sindresorhus/emittery) or node's built-in [`EventEmitter`](https://nodejs.org/api/events.html).

## Installation

It's on npm!

```bash
npm install handlery
# or
pnpm add handlery
# or
yarn add handlery
```

## Usage

**(Check out our [docs](https://handlery.dev))**

First, you need some event emitter. `handlery` works with emittery, the nodejs event emitter and many more. Let's use [`emittery`](https://github.com/sindresorhus/emittery) as an example.

First, define some events. Event IDs can be strings, numbers or symbols

```ts
export type AppEvents = {
  'user.add': { name: string };
  'user.remove': { id: string };
};

const EMITTERY = new Emittery<AppEvents>();
```

then, import the right adapter from `handlery/adapters`, in this case `emitteryAdapter` and pass your `emittery` instance. Pass the converted emitter to `handlery`

```ts
const emitter = emitteryAdapter(EMITTERY);
const { on, subscribe, EventHandler } = handlery(emitter);
```

The returned `Handlery` type has the functions `on`, `subscribe` and a class `EventHandler` that can be used to create your handler classes:

```ts
@subscribe()
export class UserHandler extends EventHandler {
  @on('user.add')
  public handleAddUser(data: AppEvents['user.add']) {
    console.log('User created:', data.name);
  }

  @on('user.remove')
  public handleRemoveUser(data: AppEvents['user.remove']) {
    console.log('User removed with ID:', data.id);
  }
}
```

The listener functions are created right away, and start listening instantly due to the `subscribe` decorator on the class. If you leave that subscribe decorator away, you can always register and subscribe the class later with

```ts
UserHandler.register();
// or
UserHandler.subscribe();
```

The difference between those is that `register` creates an instance of the class and `subscribe` actually starts listening to events.
If you use the `@subscribe()` decorator, the handler class will be registered and subscribed right away. Of course, you can also call `UserHandler.unsubscribe()` later on.

## Different emitter adapters

The `emitteryHandler` function I showed you above is a wrapper around the `emittery adapter`, which can be imported from `handlery/adapters`. You could write the same thing as

```ts
import handlery from 'handlery';
import { emitteryAdapter } from 'handlery/adapters';

const EMITTERY = new Emittery<AppEvents>();

const emitter = emitteryAdapter(EMITTERY);
const { on, EventHandler } = handlery(emitter);
```

The purpose of the adapters is to take any form of event emitter and turn it into a simpler, handlery-compatible version. This is done to support all kinds of emitter typings, and different function signatures. For example, `emittery`'s `on` method can take an abort signal as part of an `options` parameter, returns an unsubscribe function and can be async. The nodejs `EventEmitter` `on` only has two arguments, returns the `EventEmitter` and is always synchronous.

To ensure this library is 'emitter-agnostic', we ensure a single, easy-to-use format.

### The node `EventEmitter` adapter

Node's `EventEmitter` is special in that it passes multiple parameters to it's handlers/emitters. Where in emittery you would do something like

```ts
emitter.emit('myEvent', { myData1: 42, myDataTwo: 'test' });
```

In node, you would pass the data as an argument list. Because of that, handlers receive arguments as an array!

```ts
class MyHandler extends EventHandler {
  @on('myEvent')
  public handleTestEvent2(data: [number, string]) {
    console.log('Handled myEvent:', data);
  }
}
```

The good thing is that handlery is able to infer all types from the EventEmitter. So if you typed that, you're good!

```ts
type Events = {
  testEvent1: [string];
  testEvent2: [number, string];
};

const eventEmitter = new EventEmitter<Events>();
const adapter = nodeAdapter(eventEmitter);
const { on, EventHandler } = handlery(adapter);

// `on` and `EventHandler` know that the `data` prop is of type `[string]` or `[string, number]`.
class TestHandler extends EventHandler {
  @on('testEvent1')
  public handleTestEvent1(data: [string]) {
    console.log('Handled testEvent1:', data);
  }

  @on('testEvent2')
  public handleTestEvent2(data: [number, string]) {
    console.log('Handled testEvent2:', data);
  }
}
```
