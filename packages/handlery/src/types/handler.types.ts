import type { Events } from '#types/event.types';

export interface EventHandlerContext<T extends keyof Events> {
  event: T;
}

export type EventHandlerMethod<TEvents extends Events, K extends keyof TEvents> = (
  data: TEvents[K],
  context: EventHandlerContext<K>,
) => unknown;
