import { EventHandler } from '#index';
import { Events } from '#types/event.types';
import { EventHandlerMethod } from '#types/handler.types';

export type OnDecoratorImpl<TIn extends Events, TOut extends Events, TEvent extends keyof TOut> = <
  T extends EventHandler<TIn, TOut>,
>(
  method: EventHandlerMethod<TIn, TOut, TEvent>,
  context: ClassMethodDecoratorContext<InstanceType<T>, EventHandlerMethod<TIn, TOut, TEvent>>,
) => void;
export type OnDecorator<TIn extends Events, TOut extends Events = TIn> = <TEvent extends keyof TOut>(
  eventName: TEvent,
) => OnDecoratorImpl<TIn, TOut, TEvent>;

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
