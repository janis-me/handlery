# Getting started

## quick `handlery` introduction

At it's core, `handlery` allows you to write event handler classes like this:

```ts
@subscribe()
class UserHandler extends EventHandler {
  @on('user.add')
  public handleUserEvent1(data: UserAddEvent, context: ) {
    // ...
  }

  @on('user.remove')
  public handleUserEvent2(data: UserRemoveEvent) {
    // ...
  }
}
```

and it's 'emitter-agnostic', fully type-save and very flexible as well!

For example, you can use it with [`emittery`](https://github.com/sindresorhus/emittery) or the nodejs [`EventEmitter`](https://nodejs.org/api/events.html), and you have full control over how your events are typed, when the handlers are registered/subscribed, and you can control when/how they are unsubscribed again.

Basically, `handlery` is made to fit into your architecture! It works in nodejs and the browser, or both! Couple them with websockets, or whatever you need.

## Basic usage

To use `handlery`, you need an event emitter. This can be anything that has an `on` method and an `emit` method of some sorts and let's you emit/subscribe to events.
While you can write that yourself, or use the nodejs built-in [`EventEmitter`](https://nodejs.org/api/events.html), let's look at some example using the awesome [`emittery`](https://github.com/sindresorhus/emittery) library. It's lightweight, promise-based and easy to type using typescript.

First, define some events:

```ts
type MyEvents = {
  'user.add': { name: string };
  'user.remove': { id: string; force: boolean };
};
```

An `event map` type like this (note that it's a `type` and not a `record`!) is just what `emittery` expects!

```ts {1,8}
import Emittery from 'emittery';

type MyEvents = {
  'user.add': { name: string };
  'user.remove': { id: string; force: boolean };
};

const emitter = new Emittery<MyEvents>();
```

Now, we can pass that emitter to `handlery`, using the [`emitteryAdapter`](/reference/adapters#emitteryAdapter). Adapters are needed to make all kinds of emitters compatible with `handlery`. For example, the nodejs `EventEmitter` does not support promises out of the box, and listeners get passed multiple arguments, instead of a single object. An adapter unifies the behavior of emitters.

```ts {2-3,11}
import Emittery from 'emittery';
import handlery from 'handlery';
import emitteryAdapter from 'handlery/adapters';

type MyEvents = {
  'user.add': { name: string };
  'user.remove': { id: string; force: boolean };
};

const emitter = new Emittery<MyEvents>();
const { on, subscribe, EventHandler } = handlery(emitteryAdapter(emitter));
```

The return value of a call to `handlery` returns you all the type-save decorators and a base class `EventHandler` for your classes. And that's it!

The final code creates a handler class that is automatically registered and subscribed to.

The `on` decorator knows which events exist, and what data they expect!

```ts {13-24}
import Emittery from 'emittery';
import handlery from 'handlery';
import emitteryAdapter from 'handlery/adapters';

type MyEvents = {
  'user.add': { name: string };
  'user.remove': { id: string; force: boolean };
};

const emitter = new Emittery<MyEvents>();
const { on, subscribe, EventHandler } = handlery(emitteryAdapter(emitter));

@subscribe()
class UserHandler extends EventHandler {
  @on('user.add')
  public handleUserEvent1(data: [string]) {
    // ...
  }

  @on('user.remove')
  public handleUserEvent2(data: [number, string]) {
    // ...
  }
}
```

## Some more info

You don't have to use the `subscribe` decorator returned by `handlery`. It (and the `register` decorator) are just for your convenience.

You can also just create a class without them and call `register` and `subscribe` afterwards, whenever you are ready to receive events

```ts {13,15}
class UserHandler extends EventHandler {
  @on('user.add')
  public handleUserEvent1(data: [string]) {
    // ...
  }

  @on('user.remove')
  public handleUserEvent2(data: [number, string]) {
    // ...
  }
}

UserHandler.register();
// ...
UserHandler.subscribe();
```

Regardless of how you subscribe your listeners, you can call `UserHandler.unsubscribe()` at any point. That will remove the listeners just for this class.

The `EventHandler` class also has some methods like `subscribeAll` so you can easily subscribe to all (**registered**!) handlers.
If that's what you want, use the `register` decorator, but not `subscribe`:

```ts{3,17}
const { on, register, EventHandler } = handlery(emitter);

@register();
class UserHandler extends EventHandler {
  @on('user.add')
  public handleUserEvent1(data: [string]) {
    // ...
  }

  @on('user.remove')
  public handleUserEvent2(data: [number, string]) {
    // ...
  }
}

// ...
EventHandler.subscribeAll();
```
