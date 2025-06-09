import { EventHandler } from '#lib/event-handler';
import type { Events } from '#types/event.types';
import type { EventHandlerContext } from '#types/handler.types';

export function getOnDecorator<TEvents extends Events>() {
  return function on<K extends keyof TEvents>(eventName: K) {
    type EventHandlerMethod = (data: TEvents[K], context: EventHandlerContext<K>) => unknown;

    return function <T extends EventHandler>(
      _: EventHandlerMethod,
      context: ClassMethodDecoratorContext<T, EventHandlerMethod>,
    ) {
      context.addInitializer(function (this: T) {
        this.registerEvent(eventName, ((data: Events[K]) => {
          // @ts-expect-error We can be sure we can call this[context.name]
          const method = this[context.name] as EventHandlerMethod;

          const ctx: EventHandlerContext<K> = {
            event: eventName,
          };

          method(data as TEvents[K], ctx);
        }) as (data: Events[K]) => void);
      });
    };
  };
}
