import Emittery from 'emittery';
import handlery, { EventHandlerContext } from 'handlery';
import { emitteryAdapter } from 'handlery/adapters';

type Events = {
  'user.add': { name: string };
};

const emitter = new Emittery<Events>();
const { on, subscribe, EventHandler } = handlery(emitteryAdapter(emitter), {
  context: {
    extra: event => {
      const listenerCount = emitter.listenerCount(event);
      return { listenerCount };
    },
  },
});

@subscribe()
class _UserHandler extends EventHandler {
  @on('user.add')
  public handleUserAdd(data: Events['user.add'], ctx: EventHandlerContext<'user.add'>) {
    console.log(ctx.extra);
    console.log('Handled user.add:', data);
  }
}

void emitter.emit('user.add', { name: 'John Doe' });
