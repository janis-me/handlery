export type EventKey = PropertyKey;

export type Events<
  TKey extends EventKey = EventKey,
  TArgType extends 'record' | 'array' = 'record',
> = TArgType extends 'record' ? Record<TKey, unknown> : Record<TKey, unknown[]>;

export interface EventListener<TEvents extends Events, TKey extends keyof TEvents> {
  event: TKey;
  callback: (data: TEvents[TKey]) => void;
}
