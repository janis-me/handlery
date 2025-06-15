import type { OnDecorator, RegisterDecorator, SubscribeDecorator } from '#types/decorator.types';
import type { Emitter } from '#types/emitter.types';
import type { EventListener, Events } from '#types/event.types';

import { EventKey } from '../dist/event.types-BW8IqkS5';

export type { Emitter } from '#types/emitter.types';
export type { EventHandlerContext } from '#types/handler.types';
export type { OnDecorator, RegisterDecorator, SubscribeDecorator } from '#types/decorator.types';

/**
 * function to receive a typed EventHandler class based on the provided emitter.
 * The class is scoped in this function so that static properties of the class can get the type parameter (that's based on the emitter).
 *
 * Because of this 'scoping', the class is not available outside of this function, and all types that resemble `EventEmitter`
 * are based on the `ReturnType` of this function.
 * @param emitter The handlery-typed emitter
 * @returns `EventHandler` base class
 */
function getEventHandlerClass<TEvents extends Events>(emitter: Emitter<keyof TEvents, TEvents>) {
  class EventHandler {
    public static _emitter: Emitter<keyof TEvents, TEvents> = emitter;
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

    public _registerEvent<T extends keyof TEvents>(event: T, callback: (data: TEvents[T]) => void) {
      // Ensure the listener is not already registered
      if (this._listeners.some(listener => listener.event === event && listener.callback === callback)) {
        return;
      }

      this.registerEvent(event, callback);
    }

    public _subscribeListener<T extends keyof TEvents>(event: T, callback: (data: TEvents[T]) => void) {
      this._registerEvent(event, callback);
      this._subscribeInstance();
    }

    /**
     * Subscribe all registered events of the current instance to listen to events.
     *
     * This can only be called on an instance of the `EventHandler` subclass, which you should not create manually!
     * Instead of this, use the `subscribe` static method on the subclass, as it ensures the instance is registered first.
     */
    public _subscribeInstance() {
      // Ensure nothing is registered twice
      this._unsubscribeInstance();

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

/**
 * The `EventHandlerImpl` type exists only to prevent the compiler from showing the 'raw' return type of the `getEventHandlerClass` function.
 * It is used to create a more user-friendly type for the `EventHandler` class.
 */
export type EventHandlerImpl<TEvents extends Events> = ReturnType<typeof getEventHandlerClass<TEvents>>;
export type EventHandler<TEvents extends Events> = EventHandlerImpl<TEvents>;

export interface Handlery<TEvents extends Events> {
  /**
   * Type representing an EventHandler class that is based on the provided emitter.
   * `extend` it to create your own EventHandler classes!
   */
  EventHandler: EventHandler<TEvents>;
  /**
   * Decorator type for handling events.
   * It allows you to define a method that will be called when the specified event is emitted.
   *
   * @example
   *
   * ```typescript
   * \@register()
   * class MyEventHandler extends EventHandler {
   *   \@on('myEvent')
   *   myEventHandler(data: MyEventData, context: EventHandlerContext<'myEvent'>) {
   *     // ...
   *   }
   * }
   * ```
   */
  on: OnDecorator<TEvents>;
  /**
   * Decorator type for registering an EventHandler class.
   * `Registering` means creating an instance of the class and storing it in `EventHandler`.
   * Later, you can subscribe/unsubscribe the instance easily.
   *
   * As an alternative to `@register`, you can also use `@subscribe` to automatically register and subscribe the instance.
   */
  register: RegisterDecorator<TEvents>;
  /**
   * Decorator type for subscribing an EventHandler class.
   * This decorator registers the class and subscribes all handlers to their respective events.
   *
   * This is a shorthand for `@register` followed by calls to `.subscribe()`.
   */
  subscribe: SubscribeDecorator<TEvents>;
}

/**
 * The main function that creates a typed `EventHandler` class and typed class decorators for handling events.
 * This returns a `Handlery` object that you can easily deconstruct to get everything you need
 *
 * @param emitter The handlery-typed emitter that the `EventHandler` class will use to listen to events. Use adapters to create one for your emitter.
 * @returns A `Handlery<TEvents>` object that provides the `EventHandler` class and decorators for handling events.
 *
 * @example
 * ```typescript
 * import handlery, { EventHandlerContext } from 'handlery';
 * import { nodeAdapter } from 'handlery/adapters';
 * import { EventEmitter } from 'node:events';
 *
 * type Events = {
 *   userEvent1: [string];
 *   userEvent2: [number, string];
 * }
 *
 * const eventEmitter = new EventEmitter<Events>();
 * const { on, register, subscribe, EventHandler } = handlery(nodeAdapter(eventEmitter));
 *
 * \@register()
 * \@subscribe()
 * class UserHandler extends EventHandler {
 *   \@on('userEvent1')
 *   public handleUserEvent1(data: [string]) {
 *     console.log('Handled userEvent1:', data);
 *   }
 *   \@on('userEvent2')
 *   public handleUserEvent2(data: [number, string]) {
 *     console.log('Handled userEvent2:', data);
 *   }
 *}
 */
export default function handlery<
  TKey extends EventKey,
  TArgType extends 'record' | 'array',
  TEvents extends Events<TKey, TArgType>,
>(emitter: Emitter<keyof TEvents, TEvents>): Handlery<TEvents> {
  const EventHandler = getEventHandlerClass<TEvents>(emitter);

  const on: OnDecorator<TEvents> = eventName => {
    return function (method, context) {
      context.addInitializer(function (this) {
        this.registerEvent(eventName, (data: TEvents[typeof eventName]) => {
          const payload = [
            data,
            {
              event: {
                name: eventName,
                data: data,
              },
              emitter: EventHandler._emitter,
            },
          ] as const;

          method(...payload);
        });
      });
    };
  };

  const register: RegisterDecorator<TEvents> = () => {
    return function (target, _context) {
      // Register the handler class when it's decorated
      // This calls the static register() method on the EventHandler subclass
      target.register();

      return target;
    };
  };

  const subscribe: SubscribeDecorator<TEvents> = () => {
    return function (target, _context) {
      // Register the handler class when it's decorated
      // This calls the static register() method on the EventHandler subclass
      const instance = target.register();
      instance._subscribeInstance();

      return target;
    };
  };

  return { EventHandler, on, register, subscribe };
}
