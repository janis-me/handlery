import { EventHandler } from '#index';
import { Events } from '#types/event.types';
import { EventHandlerContextExtraFunction, EventHandlerMethod } from '#types/handler.types';

export type OnDecoratorImpl<
  TEvents extends Events,
  TEvent extends keyof TEvents,
  TConfigExtraFunction extends EventHandlerContextExtraFunction<TEvents> | undefined,
> = <T extends EventHandler<TEvents, TConfigExtraFunction>>(
  method: EventHandlerMethod<TEvents, TEvent, TConfigExtraFunction>,
  context: ClassMethodDecoratorContext<InstanceType<T>, EventHandlerMethod<TEvents, TEvent, TConfigExtraFunction>>,
) => void;
export type OnDecorator<
  TEvents extends Events,
  TConfigExtraFunction extends EventHandlerContextExtraFunction<TEvents> | undefined,
> = <TEvent extends keyof TEvents>(eventName: TEvent) => OnDecoratorImpl<TEvents, TEvent, TConfigExtraFunction>;

export type RegisterDecoratorImpl<
  TEvents extends Events,
  TConfigExtraFunction extends EventHandlerContextExtraFunction<TEvents> | undefined,
> = <T extends EventHandler<TEvents, TConfigExtraFunction>>(
  target: T,
  context: ClassDecoratorContext<EventHandler<TEvents, TConfigExtraFunction>>,
) => T;
export type RegisterDecorator<
  TEvents extends Events,
  TConfigExtraFunction extends EventHandlerContextExtraFunction<TEvents> | undefined,
> = () => RegisterDecoratorImpl<TEvents, TConfigExtraFunction>;

export type SubscribeDecoratorImpl<
  TEvents extends Events,
  TConfigExtraFunction extends EventHandlerContextExtraFunction<TEvents> | undefined,
> = <T extends EventHandler<TEvents, TConfigExtraFunction>>(
  target: T,
  context: ClassDecoratorContext<EventHandler<TEvents, TConfigExtraFunction>>,
) => T;
export type SubscribeDecorator<
  TEvents extends Events,
  TConfigExtraFunction extends EventHandlerContextExtraFunction<TEvents> | undefined,
> = () => SubscribeDecoratorImpl<TEvents, TConfigExtraFunction>;
