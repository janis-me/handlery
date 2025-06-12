import Emittery from 'emittery';
import handlery from 'handlery';
import { emitteryAdapter } from 'handlery/adapters';

type Events = {
  'user.add': { name: string };
  'user.remove': { id: number };
};

const emitter = new Emittery<Events>();
const { on, EventHandler } = handlery(emitteryAdapter(emitter));

class UserHandler extends EventHandler {
  @on('user.add')
  public handleUserAdd(data: Events['user.add']) {
    console.log('Handled user.add:', data);
  }

  @on('user.remove')
  public handleUserRemove(data: Events['user.remove']) {
    console.log('Handled user.remove:', data);
  }
}

// Later, start the handler.
function start() {
  UserHandler.subscribe();

  void emitter.emit('user.add', { name: 'John Doe' });

  return () => {
    UserHandler.unsubscribe();
  };
}

start();
