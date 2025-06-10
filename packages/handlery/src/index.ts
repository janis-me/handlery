import type { Emitter } from '#types/emitter.types';
import type { EventListener, Events } from '#types/event.types';
import { EventHandlerContext } from '#types/handler.types';

export type { Emitter } from '#types/emitter.types';
export type { EventHandlerContext } from '#types/handler.types';

export default function handlery<TEvents extends Events>(emitter: Emitter<TEvents>) {
  class EventHandler {
    public static _emitter: Emitter<TEvents> = emitter;
    public static _instances = new Map<new () => EventHandler, EventHandler>();

    public _listeners: Array<EventListener<TEvents, keyof TEvents>> = [];

    public static register<TClass extends EventHandler>(this: new () => TClass): TClass {
      if (!EventHandler._instances.has(this)) {
        EventHandler._instances.set(this, new this());
      }

      return EventHandler._instances.get(this) as TClass;
    }

    public registerEvent<T extends keyof TEvents>(event: T, callback: (data: TEvents[T]) => void) {
      this._listeners.push({
        event,
        // Loosen the type constraint of callback to allow for any function that accepts the event data type
        callback: callback as (data: TEvents[keyof TEvents]) => void,
      });
    }

    public static subscribeAll() {
      EventHandler.unsubscribeAll();
      for (const instance of EventHandler._instances.values()) {
        instance._subscribeInstance();
      }
    }

    public static unsubscribeAll() {
      for (const instance of EventHandler._instances.values()) {
        instance._unsubscribeInstance();
      }
    }

    public static subscribe() {
      const instance = this.register();
      instance._subscribeInstance();
    }

    public static unsubscribe() {
      const instance = this.register();
      instance._unsubscribeInstance();
    }

    public _subscribeInstance() {
      for (const listener of this._listeners) {
        EventHandler._emitter.on(listener.event, listener.callback);
      }
    }

    public _unsubscribeInstance() {
      for (const listener of this._listeners) {
        EventHandler._emitter.off(listener.event, listener.callback);
      }
    }
  }

  function on<K extends keyof TEvents>(eventName: K) {
    type EventHandlerMethod = (data: TEvents[K], context: EventHandlerContext<K>) => unknown;

    return function <T extends EventHandler>(
      // TODO: use this method?
      _: EventHandlerMethod,
      context: ClassMethodDecoratorContext<T, EventHandlerMethod>,
    ) {
      context.addInitializer(function (this: T) {
        this.registerEvent(eventName, ((data: Events[K]) => {
          // @ts-expect-error We can be sure we can call this[context.name]
          const method = this[context.name] as EventHandlerMethod;

          const ctx: EventHandlerContext<K> = {
            event: {
              name: eventName,
              data: data as TEvents[K],
            },
            emitter: EventHandler._emitter,
          };

          method(data as TEvents[K], ctx);
        }) as (data: Events[K]) => void);
      });
    };
  }

  function register() {
    return function <T extends typeof EventHandler>(target: T, _context: ClassDecoratorContext) {
      // Register the handler class when it's decorated
      // This calls the static register() method on the EventHandler subclass
      target.register();

      return target;
    };
  }

  function subscribe() {
    return function <T extends typeof EventHandler>(target: T, _context: ClassDecoratorContext) {
      // Register the handler class when it's decorated
      // This calls the static register() method on the EventHandler subclass
      const instance = target.register();
      instance._subscribeInstance();

      return target;
    };
  }

  return { EventHandler, on, register, subscribe };
}
