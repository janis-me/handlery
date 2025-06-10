import Emittery, { OmnipresentEventData } from 'emittery';

import type { Emitter } from '#types/emitter.types';
import type { Events } from '#types/event.types';

export function emitteryAdapter<TEvents extends Events>(
  emittery: Emittery<TEvents, TEvents & OmnipresentEventData, never>,
): Emitter<TEvents> {
  return {
    on: <K extends PropertyKey>(event: K | K[], listener: (data: TEvents[K]) => void | Promise<void>) => {
      return emittery.on(event, listener);
    },
    off: <K extends PropertyKey>(event: K | K[], listener: (data: TEvents[K]) => void | Promise<void>) => {
      emittery.off(event, listener);
    },
    once: <K extends PropertyKey>(event: K | K[], listener: (data: TEvents[K]) => void | Promise<void>) => {
      void emittery.once(event).then(listener);

      return () => {
        emittery.off(event, listener);
      };
    },
    emit: <K extends PropertyKey>(event: K, data: TEvents[K]) => {
      return emittery.emit(event, data);
    },
  };
}
