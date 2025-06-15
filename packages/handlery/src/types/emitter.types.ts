import type { Events } from '#types/event.types';

export type UnsubscribeFunction = () => void;

export interface Emitter<TIn extends Events, TOut extends Events = TIn> {
  on<K extends keyof TIn>(event: K | K[], listener: (data: TOut[K]) => void | Promise<void>): UnsubscribeFunction;
  off<K extends keyof TIn>(event: K | K[], listener: (data: TOut[K]) => void | Promise<void>): void;
  once<K extends keyof TIn>(event: K | K[], listener: (data: TOut[K]) => void | Promise<void>): UnsubscribeFunction;
  emit<K extends keyof TIn>(event: K, data: TIn[K]): void | Promise<void>;
}
