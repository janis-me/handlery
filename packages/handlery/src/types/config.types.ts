import { Events } from '#types/event.types';
import { EventHandlerContextExtraFunction } from '#types/handler.types';

export interface HandleryConfig<
  _TEvents extends Events,
  TContextExtra extends EventHandlerContextExtraFunction<_TEvents> | undefined,
> {
  context?: {
    extra?: TContextExtra;
  };
}
