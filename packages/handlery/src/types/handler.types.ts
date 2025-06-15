import { Emitter } from '#types/emitter.types';
import type { Events } from '#types/event.types';

export interface EventHandlerContext<
  TIn extends Events,
  TOut extends Events,
  TEmitter extends Emitter<TIn, TOut>,
  T extends keyof TOut,
> {
  event: {
    name: T;
    data: TOut[T];
  };
  emitter: TEmitter;
}

export type EventHandlerMethod<
  TIn extends Events,
  TOut extends Events,
  TEmitter extends Emitter<TIn, TOut>,
  K extends keyof TOut,
> = (data: TOut[K], context: EventHandlerContext<TIn, TOut, TEmitter, K>) => unknown;
