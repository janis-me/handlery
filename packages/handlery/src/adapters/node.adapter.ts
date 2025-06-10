import { EventEmitter } from 'node:events';

import type { Emitter } from '#types/emitter.types';
import type { Events } from '#types/event.types';

type EventMap<T extends EventEmitter> = T extends EventEmitter<infer TEvents> ? TEvents : never;

// TODO: Somehow infer the types from nodes EventEmitter<T>
export function nodeAdapter<
  TEventEmitter extends EventEmitter,
  TEventMap extends EventMap<TEventEmitter>,
  TEvents extends Events<string | symbol, 'array'> = TEventMap extends [never]
    ? Events<string | symbol, 'array'>
    : TEventMap,
>(eventEmitter: TEventEmitter): Emitter<TEvents> {
  return {
    on: <K extends keyof TEvents>(event: K | K[], listener: (data: TEvents[K]) => void | Promise<void>) => {
      const synchronousListener = (...args: unknown[]) => {
        void listener(args as TEvents[K]);
      };

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
  };
}
