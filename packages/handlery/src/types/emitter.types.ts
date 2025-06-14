import type { EventKey, Events } from '#types/event.types';

export type UnsubscribeFunction = () => void;

export interface Emitter<TKey extends EventKey, TEvents extends Events<TKey, 'record' | 'array'> = Events> {
  on<K extends keyof TEvents>(
    event: K | K[],
    listener: (data: TEvents[K]) => void | Promise<void>,
  ): UnsubscribeFunction;
  off<K extends keyof TEvents>(event: K | K[], listener: (data: TEvents[K]) => void | Promise<void>): void;
  once<K extends keyof TEvents>(
    event: K | K[],
    listener: (data: TEvents[K]) => void | Promise<void>,
  ): UnsubscribeFunction;
  emit<K extends keyof TEvents>(event: K, data: TEvents[K]): void | Promise<void>;
}
