export type EventKey = PropertyKey;

export type Events<
  TKey extends EventKey = EventKey,
  TArgType extends 'record' | 'array' = 'record',
> = TArgType extends 'record' ? Record<TKey, unknown> : Record<TKey, unknown[]>;

export interface EventListener<T extends keyof Events = keyof Events> {
  event: T;
  callback: (data: Events[T]) => void;
}
