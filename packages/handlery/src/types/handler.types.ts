import { Emitter } from '#types/emitter.types';
import type { Events } from '#types/event.types';

export interface EventHandlerContext<T extends keyof Events> {
  event: {
    name: T;
    data: Events[T];
  };
  emitter: Emitter;
}

export type EventHandlerMethod<TEvents extends Events, K extends keyof TEvents> = (
  data: TEvents[K],
  context: EventHandlerContext<K>,
) => unknown;
