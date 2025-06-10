import handlery from 'handlery';
import { nodeAdapter } from 'handlery/adapters';
import { EventEmitter } from 'node:events';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Events = {
  testEvent1: [string];
  testEvent2: [number, string];
};

const eventEmitter = new EventEmitter<Events>();
const adapter = nodeAdapter(eventEmitter);
const { on, EventHandler } = handlery(adapter);

class TestHandler extends EventHandler {
  @on('testEvent1')
  public handleTestEvent1(data: [string]) {
    console.log('Handled testEvent1:', data);
  }

  @on('testEvent2')
  public handleTestEvent2(data: [number, string]) {
    console.log('Handled testEvent2:', data);
  }
}

new TestHandler();

const testData1 = ['Hello, world!'] as const;
const testData2 = [42, 'The answer to life, the universe, and everything'] as const;
eventEmitter.emit('testEvent1', ...testData1);
eventEmitter.emit('testEvent2', ...testData2);
console.log('Events emitted successfully.');
