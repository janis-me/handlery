import type { EventKey, Events } from '#types/event.types';

export type UnsubscribeFunction = () => void;

export interface Emitter<TEvents extends Events<EventKey, 'record' | 'array'> = Events> {
  on<K extends keyof TEvents>(
    event: K | K[],
    listener: (data: TEvents[K]) => void | Promise<void>,
  ): UnsubscribeFunction;
}
