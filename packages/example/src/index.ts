import handlery, { EventHandlerContext } from 'handlery';
import { nodeAdapter } from 'handlery/adapters';
import { EventEmitter } from 'node:events';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Events = {
  userEvent1: [string];
  userEvent2: [number, string];
  testEvent1: [string];
  testEvent2: [number, string];
};

const eventEmitter = new EventEmitter<Events>();
const adapter = nodeAdapter(eventEmitter);
const { on, register, subscribe, EventHandler } = handlery(adapter);

@register()
@subscribe()
class _UserHandler extends EventHandler {
  @on('userEvent1')
  public handleUserEvent1(data: [string]) {
    console.log('Handled userEvent1:', data);
  }

  @on('userEvent2')
  public handleUserEvent2(data: [number, string]) {
    console.log('Handled userEvent2:', data);
  }
}

@subscribe()
class TestHandler extends EventHandler {
  @on('testEvent1')
  public async handleTestEvent1(data: [string], ctx: EventHandlerContext<'testEvent1'>) {
    console.log('Handled testEvent1:', data);
    await ctx.emitter.emit('testEvent2', [42, 'Hello from testEvent1']);
  }

  @on('testEvent2')
  public handleTestEvent2(data: [number, string]) {
    console.log('Handled testEvent2:', data);
  }
}

eventEmitter.emit('userEvent1', 'User event data');
eventEmitter.emit('userEvent2', 123, 'Another user event data');

TestHandler.unsubscribe();

eventEmitter.emit('testEvent1', 'Test event data');
