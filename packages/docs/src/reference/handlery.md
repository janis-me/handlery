# The handlery function

The `handlery` function takes an `Emitter` and returns a bunch of decorators (`on`, `subscribe`, ...) alongside an `EventHandler` base class.

An emitter can be **any object** that has functions like `on`, `emit`, `off` and `once`. You can find the exact typing of an `Emitter` [here](https://github.com/janis-me/handlery/blob/main/packages/handlery/src/types/emitter.types.ts), but **chances are you are using an** [`adapter`](/reference/adapters) alongside a pre-made emitter library like the [`emittery`](https://github.com/sindresorhus/emittery) or the nodejs [`EventEmitter`](https://nodejs.org/api/events.html).

If you want to code your own `emitter`, go for it! For example, build one that uses WebSockets to send typed events. `handlery` will tell you if your implementation does not match the requirements.

But, in short:

::: tip
You will probably pass an [adapter](/reference/adapters) into `handlery`, which itself takes a third-party emitter library.
:::

## The important part:

The important part is what `handlery` returns:

```ts
const { EventHandler, on, subscribe, register } = handlery(emitter);
```

Here's a quick explanation:

- `EventHandler` is the base class you **need to** use for your classes. It manages your listeners, allowing for automatic unsubscribes, easily subscribing all events etc.
- `on` is used for methods within the `EventHandler`. It takes an event it (like `user.add`) and passes the event data (and a [`context`](/reference/context)) to the method.
- `register` is a decorator called on the class, used to create an instance of your handler and register it to the global `EventHandler`. That way you can manage all your listeners from a single place.
- `subscribe` is also a class decorator, used to automatically 'enable' all event listeners of the class. This way you don't have to call `MyHandler.subscribe()` afterwards.

::: info
Note that `register` and `subscribe` are totally optional and only for convenience. It's perfectly valid (and sometimes even necessary) to call `MyHandler.register()` and `MyHandler.subscribe()` afterwards.
:::

::: info
Also, note that `subscribe` calls `register` under the hood. That's because internally, `register` creates a singleton instance of your handler class, and `subscribe` operates on that singleton. Thus a class must be registered before it can subscribe to events.
:::
