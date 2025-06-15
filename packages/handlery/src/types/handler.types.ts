import { Emitter } from '#types/emitter.types';
import type { Events } from '#types/event.types';

export interface EventHandlerContext<TIn extends Events, TOut extends Events, T extends keyof TOut> {
  event: {
    name: T;
    data: TOut[T];
  };
  emitter: Emitter<TIn, TOut>;
}

export type EventHandlerMethod<TIn extends Events, TOut extends Events, K extends keyof TOut> = (
  data: TOut[K],
  context: EventHandlerContext<TIn, TOut, K>,
) => unknown;
