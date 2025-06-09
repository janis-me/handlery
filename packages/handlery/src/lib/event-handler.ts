import { globals } from '#globals.js';
import { Emitter } from '#types/emitter.types';
import type { Events } from '#types/event.types';

export abstract class EventHandler<TEvents extends Events = Events> {
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
