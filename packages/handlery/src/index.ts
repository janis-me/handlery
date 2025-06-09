import { emitteryAdapter } from '#adapters/emittery.adapter';
import { globals } from '#globals';
import type { Emitter } from '#types/emitter.types';
import type { Events } from '#types/event.types';
import { EventHandlerContext } from '#types/handler.types';

export type { Emitter } from '#types/emitter.types';

abstract class EventHandler<TEvents extends Events = Events> {
  public static get emitter(): Emitter {
    if (!globals.emitter) {
      throw new Error('Emitter is not initialized. Ensure you are calling `handlery` before anything else.');
    }

    return globals.emitter;
  }

  public registerEvent<T extends keyof TEvents>(event: T, callback: (data: TEvents[T]) => void) {
    (EventHandler.emitter as Emitter<TEvents>).on(event, callback);
  }
}

function getOnDecorator<TEvents extends Events>() {
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

type HandlerDecorator<TEvents extends Events> = ReturnType<typeof getOnDecorator<TEvents>>;
type HandlerClass<TEvents extends Events> = typeof EventHandler<TEvents>;

export interface Handlery<TEvents extends Events> {
  EventHandler: HandlerClass<TEvents>;
  on: HandlerDecorator<TEvents>;
}

export default function handlery<TEvents extends Events>(emitter: Emitter<TEvents>): Handlery<TEvents> {
  globals.emitter = emitter;

  return { EventHandler, on: getOnDecorator<TEvents>() };
}

// adapter utility functions
export const emitteryHandler = <TEvents extends Events>(...args: Parameters<typeof emitteryAdapter<TEvents>>) =>
  handlery(emitteryAdapter(...args));
