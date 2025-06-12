import handlery from 'handlery';
import { nodeAdapter } from 'handlery/adapters';
import { EventEmitter } from 'node:events';

type Events = {
  'user.add': [string];
  'user.remove': [number, string];
};

const eventEmitter = new EventEmitter<Events>();
const adapter = nodeAdapter(eventEmitter);
const { on, subscribe, EventHandler } = handlery(adapter);

@subscribe()
class _UserHandler extends EventHandler {
  @on('user.add')
  public handleUserAdd(data: [string]) {
    console.log('Handled user.add:', data);
  }

  @on('user.remove')
  public handleUserRemove(data: [number, string]) {
    console.log('Handled user.remove:', data);
  }
}

eventEmitter.emit('user.add', 'User event data');
eventEmitter.emit('user.remove', 123, 'Another user event data');
