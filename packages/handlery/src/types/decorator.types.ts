import { EventHandler } from '#index';
import { Emitter } from '#types/emitter.types';
import { Events } from '#types/event.types';
import { EventHandlerMethod } from '#types/handler.types';

export type OnDecoratorImpl<
  TIn extends Events,
  TOut extends Events,
  TEvent extends keyof TOut,
  TEmitter extends Emitter<TIn, TOut>,
> = <T extends EventHandler<TIn, TOut>>(
  method: EventHandlerMethod<TIn, TOut, TEmitter, TEvent>,
  context: ClassMethodDecoratorContext<InstanceType<T>, EventHandlerMethod<TIn, TOut, TEmitter, TEvent>>,
) => void;
export type OnDecorator<
  TIn extends Events,
  TOut extends Events = TIn,
  TEmitter extends Emitter<TIn, TOut> = Emitter<TIn, TOut>,
> = <TEvent extends keyof TOut>(eventName: TEvent) => OnDecoratorImpl<TIn, TOut, TEvent, TEmitter>;

export type RegisterDecoratorImpl<TIn extends Events, TOut extends Events> = <T extends EventHandler<TIn, TOut>>(
  target: T,
  context: ClassDecoratorContext<EventHandler<TIn, TOut>>,
) => T;
export type RegisterDecorator<TIn extends Events, TOut extends Events = TIn> = () => RegisterDecoratorImpl<TIn, TOut>;

export type SubscribeDecoratorImpl<TIn extends Events, TOut extends Events = TIn> = <T extends EventHandler<TIn, TOut>>(
  target: T,
  context: ClassDecoratorContext<EventHandler<TIn, TOut>>,
) => T;
export type SubscribeDecorator<TIn extends Events, TOut extends Events = TIn> = () => SubscribeDecoratorImpl<TIn, TOut>;
