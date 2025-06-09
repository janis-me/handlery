import type { Events } from '#types/event.types';

export type UnsubscribeFunction = () => void;

export interface Emitter<TEvents extends Events = Events> {
  on<K extends keyof TEvents>(
    event: K | K[],
    listener: (data: TEvents[K]) => void | Promise<void>,
  ): UnsubscribeFunction;
  once(event: keyof TEvents): Promise<void>;
  off<K extends keyof TEvents>(event: K, listener: (data: TEvents[K]) => void | Promise<void>): void;
  emit<K extends keyof TEvents>(event: K, data: TEvents[K]): Promise<void>;
}
