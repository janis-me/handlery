import type { Emitter } from '#types/emitter.types';
import type { EventListener, Events } from '#types/event.types';
import { EventHandlerContext } from '#types/handler.types';

export type { Emitter } from '#types/emitter.types';
export type { EventHandlerContext } from '#types/handler.types';

/**
 * function to receive a typed EventHandler class based on the provided emitter.
 * The class is scoped in this function so that static properties of the class can get the type parameter (that's based on the emitter).
 *
 * Because of this 'scoping', the class is not available outside of this function, and all types that resemble `EventEmitter`
 * are based on the `ReturnType` of this function.
 * @param emitter The handlery-typed emitter
 * @returns `EventHandler` base class
 */
function getEventHandlerClass<TEvents extends Events>(emitter: Emitter<TEvents>) {
  class EventHandler {
    public static _emitter: Emitter<TEvents> = emitter;
    public static _instances = new Map<new () => EventHandler, EventHandler>();

    public _listeners: Array<EventListener<TEvents, keyof TEvents>> = [];

    /**
     * Instantiates the EventHandler sub-class and registers it in the static `_instances` map.
     * If the class is already registered, it returns the existing instance.
     * This allows for a singleton-like behavior for each EventHandler subclass.
     * @param this The class that extends `EventHandler`
     * @returns
     */
    public static register<TClass extends EventHandler>(this: new () => TClass): TClass {
      if (!EventHandler._instances.has(this)) {
        EventHandler._instances.set(this, new this());
      }

      return EventHandler._instances.get(this) as TClass;
    }

    /**
     * Registers an event listener for a specific event type.
     * The callback function will be called with the event data when the event is emitted.
     * @param event The event type to listen for
     * @param callback The function to call when the event is emitted
     */
    public registerEvent<T extends keyof TEvents>(event: T, callback: (data: TEvents[T]) => void) {
      this._listeners.push({
        event,
        // Loosen the type constraint of callback to allow for any function that accepts the event data type
        callback: callback as (data: TEvents[keyof TEvents]) => void,
      });
    }

    /**
     * Subscribes all registered EventHandler instances to their respective events.
     *
     * While this can be called on the base `EventHandler` class, it is intended to be used
     * on the sub-classes that extend `EventHandler`.
     */
    public static subscribeAll() {
      EventHandler.unsubscribeAll();
      for (const instance of EventHandler._instances.values()) {
        instance._subscribeInstance();
      }
    }

    /**
     * Unsubscribes all registered EventHandler instances from their respective events.
     *
     * While this can be called on the base `EventHandler` class, it is intended to be used
     * on the sub-classes that extend `EventHandler`.
     */
    public static unsubscribeAll() {
      for (const instance of EventHandler._instances.values()) {
        instance._unsubscribeInstance();
      }
    }

    /**
     * Subscribes the current instance to its registered events.
     * This is a static method that can be called without an instance.
     * It registers the instance before, if it is not already registered.
     */
    public static subscribe() {
      const instance = this.register();
      instance._subscribeInstance();
    }

    /**
     * Unsubscribes the current instance from its registered events.
     * This is a static method that can be called without an instance.
     * It registers the instance before, if it is not already registered.
     */
    public static unsubscribe() {
      const instance = this.register();
      instance._unsubscribeInstance();
    }

    /**
     * Subscribe all registered events of the current instance to listen to events.
     *
     * This can only be called on an instance of the `EventHandler` subclass, which you should not create manually!
     * Instead of this, use the `subscribe` static method on the subclass, as it ensures the instance is registered first.
     */
    public _subscribeInstance() {
      for (const listener of this._listeners) {
        EventHandler._emitter.on(listener.event, listener.callback);
      }
    }

    /**
     * Unsubscribe all registered events of the current instance from listening to events.
     *
     * This can only be called on an instance of the `EventHandler` subclass, which you should not create manually!
     * Instead of this, use the `unsubscribe` static method on the subclass, as it ensures the instance is registered first.
     */
    public _unsubscribeInstance() {
      for (const listener of this._listeners) {
        EventHandler._emitter.off(listener.event, listener.callback);
      }
    }
  }

  return EventHandler;
}

type EventHandler<TEvents extends Events> = ReturnType<typeof getEventHandlerClass<TEvents>>;

export type OnDecorator<TEvents extends Events, TEvent extends keyof TEvents> = (
  eventName: TEvent,
) => <T extends EventHandler<TEvents>>(
  _: (data: TEvents[TEvent], context: EventHandlerContext<TEvent>) => unknown,
  context: ClassMethodDecoratorContext<
    InstanceType<T>,
    (data: TEvents[TEvent], context: EventHandlerContext<TEvent>) => unknown
  >,
) => void;

export type RegisterDecorator<TEvents extends Events> = () => <T extends EventHandler<TEvents>>(
  target: T,
  context: ClassDecoratorContext<abstract new () => T>,
) => T;

export type SubscribeDecorator<TEvents extends Events> = () => (
  target: EventHandler<TEvents>,
  _context: ClassDecoratorContext,
) => EventHandler<TEvents>;

export interface Handlery<TEvents extends Events> {
  EventHandler: EventHandler<TEvents>;
  on: OnDecorator<TEvents, keyof TEvents>;
  register: RegisterDecorator<TEvents>;
  subscribe: SubscribeDecorator<TEvents>;
}

export default function handlery<TEvents extends Events>(emitter: Emitter<TEvents>): Handlery<TEvents> {
  const EventHandlerImpl = getEventHandlerClass<TEvents>(emitter);

  function on<K extends keyof TEvents>(eventName: K) {
    type EventHandlerMethod = (data: TEvents[K], context: EventHandlerContext<K>) => unknown;

    return function <T extends EventHandler<TEvents>>(
      method: EventHandlerMethod,
      context: ClassMethodDecoratorContext<InstanceType<T>, EventHandlerMethod>,
    ) {
      context.addInitializer(function (this: InstanceType<T>) {
        this.registerEvent(eventName, ((data: TEvents[K]) => {
          const ctx: EventHandlerContext<K> = {
            event: {
              name: eventName,
              data: data,
            },
            emitter: EventHandlerImpl._emitter,
          };

          method(data, ctx);
        }) as (data: Events[K]) => void);
      });
    };
  }

  function register() {
    return function <T extends EventHandler<TEvents>>(target: T, _context: ClassDecoratorContext) {
      // Register the handler class when it's decorated
      // This calls the static register() method on the EventHandler subclass
      target.register();

      return target;
    };
  }

  function subscribe() {
    return function <T extends EventHandler<TEvents>>(target: T, _context: ClassDecoratorContext) {
      // Register the handler class when it's decorated
      // This calls the static register() method on the EventHandler subclass
      const instance = target.register();
      instance._subscribeInstance();

      return target;
    };
  }

  return { EventHandler: EventHandlerImpl, on, register, subscribe };
}
