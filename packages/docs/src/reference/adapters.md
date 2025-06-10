# Adapters

Adapters are used to make `handlery` work with all kinds of emitter libraries.

They ensure that the emitter passed into handlery has a compatible API, meaning

- Necessary functions like `on`, `off`, `emit` etc.
- A promise-based listener approach
- listener methods that return `unsubscribe` functions
- ... and some more

The adapter acts like a 'bridge' between the emitter and `handlery`.

## Supported emitters

Currently, we're focusing on making things stable. Thus, only two emitters are supported right now:

- emittery (https://github.com/sindresorhus/emittery) and
- node's built-in EventEmitter (https://nodejs.org/api/events.html)

## For example

Here is how the `emittery` adapter looks like (at the time of this writing, it might be outdated. See [the source](https://github.com/janis-me/handlery/blob/main/packages/handlery/src/adapters/emittery.adapter.ts) if you need to)

```ts
export function emitteryAdapter<TEvents extends Events>(
  emittery: Emittery<TEvents, TEvents & OmnipresentEventData, never>,
): Emitter<TEvents> {
  return {
    on: <K extends PropertyKey>(event: K | K[], listener: (data: TEvents[K]) => void | Promise<void>) => {
      return emittery.on(event, listener);
    },
    off: <K extends PropertyKey>(event: K | K[], listener: (data: TEvents[K]) => void | Promise<void>) => {
      emittery.off(event, listener);
    },
    once: <K extends PropertyKey>(event: K | K[], listener: (data: TEvents[K]) => void | Promise<void>) => {
      void emittery.once(event).then(listener);

      return () => {
        emittery.off(event, listener);
      };
    },
    emit: <K extends PropertyKey>(event: K, data: TEvents[K]) => {
      return emittery.emit(event, data);
    },
  };
}
```

There is not much going on here! It mostly just takes `emittery` and wraps it's functions with proper types.
