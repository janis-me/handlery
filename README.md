# handlery - event handling for ALL emitters

`handlery` (like [`emittery`](https://github.com/sindresorhus/emittery) but for 'handle') is a minimal way to handle events with nice class decorators. It works with all kinds of event emitters and offers an API that works with all of them! Instead of

```ts
function registerUserHandlers() {
  const addListener = emitter.on('user.add', (user: UserAddEvent) => {
    // ...
  });

  return () => {
    addListener.unsubscribe();
  };

  // ...
}

const unsubscribeUsers = registerUserHandlers();
```

you can simply do

```ts
class UserHandler extends EventHandler {
  @on('user.add')
  public handleAddUser(user, ctx) {
    // ...
  }
}
```

It requires typescript decorators support, and we're talking the ECMA stage 3 decorators, not `Decorators.Legacy` or whatever else you can set in tsconfig.

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

First, you need some event emitter. `handlery` works with emittery, the nodejs event emitter and many more. Let's use [`emittery`](https://github.com/sindresorhus/emittery) as an example.

First, define some events. Event IDs can be strings, numbers or symbols

```ts
export type AppEvents = {
  'user.add': { name: string };
  'user.remove': { id: string };
};

const EMITTERY = new Emittery<AppEvents>();
```

then, use the exported function `emitteryHandler` and pass your `emittery` instance.

```ts
const { on, EventHandler } = emitteryHandler(EMITTERY);
```

The returned `Handlery` type has an `on` function and a class `EventHandler` that can be used to create your handler classes....

...and that's it! Now you can use both to create your handlers:

```ts
export class UserHandler extends EventHandler {
  @on('addUser')
  public handleAddUser(data: AppEvents['addUser']) {
    console.log('User created:', data.name);
  }

  @on('removeUser')
  public handleRemoveUser(data: AppEvents['removeUser']) {
    console.log('User removed with ID:', data.id);
  }
}
```

The listener functions are created right away, and start listening to events as soon as an instance of the UserHandler class is created (`new UserHandler()`)

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
