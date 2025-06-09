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
  };
}
