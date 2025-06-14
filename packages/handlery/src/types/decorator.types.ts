import { EventHandler } from '#index';
import { Events } from '#types/event.types';
import { EventHandlerMethod } from '#types/handler.types';

export type OnDecoratorImpl<TEvents extends Events, TEvent extends keyof TEvents> = <T extends EventHandler<TEvents>>(
  method: EventHandlerMethod<TEvents, TEvent>,
  context: ClassMethodDecoratorContext<InstanceType<T>, EventHandlerMethod<TEvents, TEvent>>,
) => void;
export type OnDecorator<TEvents extends Events> = <TEvent extends keyof TEvents>(
  eventName: TEvent,
) => OnDecoratorImpl<TEvents, TEvent>;

export type RegisterDecoratorImpl<TEvents extends Events> = <T extends EventHandler<TEvents>>(
  target: T,
  context: ClassDecoratorContext<EventHandler<TEvents>>,
) => T;
export type RegisterDecorator<TEvents extends Events> = () => RegisterDecoratorImpl<TEvents>;

export type SubscribeDecoratorImpl<TEvents extends Events> = <T extends EventHandler<TEvents>>(
  target: T,
  context: ClassDecoratorContext<EventHandler<TEvents>>,
) => T;
export type SubscribeDecorator<TEvents extends Events> = () => SubscribeDecoratorImpl<TEvents>;
