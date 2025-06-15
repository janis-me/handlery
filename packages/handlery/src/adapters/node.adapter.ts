import { EventEmitter } from 'node:events';

import type { Emitter } from '#types/emitter.types';
import type { Events } from '#types/event.types';

type EventMap<T extends EventEmitter> = T extends EventEmitter<infer TEvents> ? TEvents : never;

export function nodeAdapter<
  TEventEmitter extends EventEmitter,
  TEventMap extends EventMap<TEventEmitter>,
  TEvents extends Events<string | symbol, 'array'> = TEventMap extends [never]
    ? Events<string | symbol, 'array'>
    : TEventMap,
>(eventEmitter: TEventEmitter): Emitter<TEvents, TEvents> {
  // Keep track of synchronous listeners so we're able to un-register them later
  const synchronousListeners = new Map<
    (data: TEvents[keyof TEvents]) => void | Promise<void>,
    (data: TEvents[keyof TEvents]) => void
  >();

  const makeSynchronousListener = (
    listener: (data: TEvents[keyof TEvents]) => void | Promise<void>,
  ): ((data: unknown) => void) => {
    if (synchronousListeners.has(listener)) {
      return synchronousListeners.get(listener) as (data: unknown) => void;
    }
    const synchronousListener = (...args: unknown[]) => {
      void listener(args as TEvents[keyof TEvents]);
    };
    synchronousListeners.set(listener, synchronousListener);
    return synchronousListener;
  };

  return {
    on: <K extends keyof TEvents>(event: K | K[], listener: (data: TEvents[K]) => void | Promise<void>) => {
      const synchronousListener = makeSynchronousListener(listener as (data: TEvents[keyof TEvents]) => void);

      if (Array.isArray(event)) {
        event.forEach(evt => eventEmitter.on(evt as string | symbol, synchronousListener));
        return () => {
          event.forEach(evt => eventEmitter.off(evt as string | symbol, synchronousListener));
        };
      } else {
        eventEmitter.on(event as string | symbol, synchronousListener);

        return () => {
          eventEmitter.off(event as string | symbol, synchronousListener);
        };
      }
    },
    off: <K extends keyof TEvents>(event: K | K[], listener: (data: TEvents[K]) => void | Promise<void>) => {
      const synchronousListener = makeSynchronousListener(listener as (data: TEvents[keyof TEvents]) => void);

      if (Array.isArray(event)) {
        event.forEach(evt => eventEmitter.off(evt as string | symbol, synchronousListener));
      } else {
        eventEmitter.off(event as string | symbol, synchronousListener);
      }
    },
    once: <K extends keyof TEvents>(event: K | K[], listener: (data: TEvents[K]) => void | Promise<void>) => {
      const synchronousListener = makeSynchronousListener(listener as (data: TEvents[keyof TEvents]) => void);

      if (Array.isArray(event)) {
        event.forEach(evt => eventEmitter.once(evt as string | symbol, synchronousListener));
        return () => {
          event.forEach(evt => eventEmitter.off(evt as string | symbol, synchronousListener));
        };
      } else {
        eventEmitter.once(event as string | symbol, synchronousListener);

        return () => {
          eventEmitter.off(event as string | symbol, synchronousListener);
        };
      }
    },
    emit: <K extends keyof TEvents>(event: K, data: TEvents[K]) => {
      eventEmitter.emit(event as string | symbol, data);
    },
  };
}
