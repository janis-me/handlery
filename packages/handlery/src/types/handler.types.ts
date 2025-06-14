import { Emitter } from '#types/emitter.types';
import type { Events } from '#types/event.types';

export interface EventHandlerContext<TEvents extends Events, T extends keyof TEvents> {
  event: {
    name: T;
    data: TEvents[T];
  };
  emitter: Emitter<T, TEvents>;
}

export type EventHandlerMethod<TEvents extends Events, K extends keyof TEvents> = (
  data: TEvents[K],
  context: EventHandlerContext<TEvents, K>,
) => unknown;
