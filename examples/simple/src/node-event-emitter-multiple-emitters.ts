import handlery from 'handlery';
import { nodeAdapter } from 'handlery/adapters';
import { EventEmitter } from 'node:events';

type Events = {
  'user.add': [string];
  'user.remove': [number, string];
};

const eventEmitter1 = new EventEmitter<Events>();
const eventEmitter2 = new EventEmitter<Events>();
const Handlery1 = handlery(nodeAdapter(eventEmitter1));
const Handlery2 = handlery(nodeAdapter(eventEmitter2));

@Handlery1.subscribe()
class _UserHandler1 extends Handlery1.EventHandler {
  @Handlery1.on('user.add')
  public handleUserAdd(data: [string]) {
    console.log('Handled user.add:', data);
  }

  @Handlery1.on('user.remove')
  public handleUserRemove(data: [number, string]) {
    console.log('Handled user.remove:', data);
  }
}

@Handlery2.subscribe()
class _UserHandler2 extends Handlery2.EventHandler {
  @Handlery2.on('user.add')
  public handleUserAdd(data: [string]) {
    console.log('Handled user.add:', data);
  }

  @Handlery2.on('user.remove')
  public handleUserRemove(data: [number, string]) {
    console.log('Handled user.remove:', data);
  }
}

// Events work independently for each emitter

eventEmitter1.emit('user.add', 'User event data');
eventEmitter1.emit('user.remove', 123, 'Another user event data');

eventEmitter2.emit('user.add', 'User event data');
eventEmitter2.emit('user.remove', 123, 'Another user event data');
