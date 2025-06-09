import { globals } from '#globals.js';
import { EventHandler } from '#lib/event-handler';
import { getOnDecorator } from '#lib/on';
import type { Emitter } from '#types/emitter.types';
import type { Events } from '#types/event.types';

export type { EventHandler } from '#lib/event-handler';
export type { Emitter } from '#types/emitter.types';

export type HandlerDecorator<TEvents extends Events> = ReturnType<typeof getOnDecorator<TEvents>>;
export type HandlerClass<TEvents extends Events> = typeof EventHandler<TEvents>;

export interface Handlery<TEvents extends Events> {
  EventHandler: HandlerClass<TEvents>;
  on: HandlerDecorator<TEvents>;
}

export function handlery<TEvents extends Events>(emitter: Emitter<TEvents>): Handlery<TEvents> {
  globals.emitter = emitter;

  return { EventHandler, on: getOnDecorator<TEvents>() };
}

export default handlery;
