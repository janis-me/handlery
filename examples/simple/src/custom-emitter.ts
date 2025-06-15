import handlery, { type Emitter as HandleryEmitter } from 'handlery';

type BaseEvents = {
  'user.add': { name: string };
  'user.remove': { id: number };
};

type DerivedEvents = {
  [K in keyof BaseEvents]: { id: number; payload: BaseEvents[K] };
};

class MyEmitter implements HandleryEmitter<BaseEvents, DerivedEvents> {
  private listeners = Array<{ event: keyof BaseEvents; listener: (data: DerivedEvents[keyof BaseEvents]) => void }>();

  on<K extends keyof BaseEvents>(event: K | K[], listener: (data: DerivedEvents[K]) => void): () => void {
    const events = Array.isArray(event) ? event : [event];
    events.forEach(evt => {
      this.listeners.push({ event: evt, listener: listener as (data: DerivedEvents[keyof BaseEvents]) => void });
    });

    return () => {
      this.off(events, listener);
    };
  }

  off<K extends keyof BaseEvents>(event: K | K[], listener: (data: DerivedEvents[K]) => void): void {
    const events = Array.isArray(event) ? event : [event];
    events.forEach(evt => {
      this.listeners = this.listeners.filter(l => l.event !== evt || l.listener !== listener);
    });
  }

  once<K extends keyof BaseEvents>(event: K | K[], listener: (data: DerivedEvents[K]) => void): () => void {
    const unsubscribe = this.on(event, data => {
      listener(data);
      unsubscribe();
    });
    return unsubscribe;
  }

  emit<K extends keyof BaseEvents>(event: K, data: BaseEvents[K]): void {
    const derivedData = { id: Date.now(), payload: data } as DerivedEvents[K];

    this.listeners
      .filter(l => l.event === event)
      .forEach(l => {
        l.listener(derivedData);
      });
  }
}

const myEmitter = new MyEmitter();

const { on, EventHandler } = handlery<keyof DerivedEvents, 'record', BaseEvents, DerivedEvents>(myEmitter);

class UserHandler extends EventHandler {
  @on('user.add')
  public handleUserAdd(data: DerivedEvents['user.add']) {
    console.log('Handled user.add:', data);
  }

  @on('user.remove')
  public handleUserRemove(data: DerivedEvents['user.remove']) {
    console.log('Handled user.remove:', data);
  }
}

// Later, start the handler.
function start() {
  UserHandler.subscribe();

  myEmitter.emit('user.add', { name: 'John Doe' });

  return () => {
    UserHandler.unsubscribe();
  };
}

start();
