import { Emitter } from '#types/emitter.types';
import type { Events } from '#types/event.types';

export type EventHandlerContextExtraFunction<TEvents extends Events> = (
  event: keyof TEvents,
  data: TEvents[keyof TEvents],
) => unknown;

export interface EventHandlerContext<T extends keyof Events, TExtra = unknown> {
  event: {
    name: T;
    data: Events[T];
  };
  emitter: Emitter;
  extra: TExtra;
}

export type EventHandlerMethod<
  TEvents extends Events,
  K extends keyof TEvents,
  TConfigExtraFunction extends EventHandlerContextExtraFunction<TEvents> | undefined,
> = (data: TEvents[K], context: EventHandlerContext<K, ReturnType<NonNullable<TConfigExtraFunction>>>) => unknown;
