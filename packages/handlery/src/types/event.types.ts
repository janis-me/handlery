export type EventKey = PropertyKey;

export type Events = Record<EventKey, unknown>;

export interface EventListener<T extends keyof Events = keyof Events> {
  event: T;
  callback: (data: Events[T]) => void;
}
