import { describe, expect, it, vi } from 'vitest';

describe('Node EventEmitter', () => {
  it('should import handlery', async () => {
    const handlery = await import('handlery');
    expect(handlery).toBeDefined();
  });

  it('should accept Node.js EventEmitter', async () => {
    const { nodeAdapter } = await import('handlery/adapters');
    const handlery = await import('handlery');
    const { EventEmitter } = await import('events');

    const eventEmitter = new EventEmitter();
    const adapter = nodeAdapter(eventEmitter);
    const { on, EventHandler } = handlery.default(adapter);

    expect(on).toBeDefined();
    expect(EventHandler).toBeDefined();
  });

  it('should register and handle events with Node.js EventEmitter', async () => {
    const { nodeAdapter } = await import('handlery/adapters');
    const handlery = await import('handlery');
    const { EventEmitter } = await import('events');

    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    type Events = {
      testEvent1: [string];
    };

    const eventEmitter = new EventEmitter<Events>();
    const adapter = nodeAdapter(eventEmitter);
    const { on, EventHandler } = handlery.default(adapter);

    const handlerFunction = vi.fn();

    class TestHandler extends EventHandler {
      @on('testEvent1')
      public handleTestEvent(data: [string]) {
        handlerFunction(data);
      }
    }

    TestHandler.register();
    EventHandler.subscribeAll();

    const testData = { message: 'Hello, world!' };
    eventEmitter.emit('testEvent1', testData.message);

    expect(handlerFunction).toHaveBeenCalledWith([testData.message]);
    expect(eventEmitter.listenerCount('testEvent1')).toBe(1);
  });

  it('should register and handle multi-argument events with Node.js EventEmitter', async () => {
    const { nodeAdapter } = await import('handlery/adapters');
    const handlery = await import('handlery');
    const { EventEmitter } = await import('events');

    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    type Events = {
      testEvent2: [number, string];
    };

    const eventEmitter = new EventEmitter<Events>();
    const adapter = nodeAdapter(eventEmitter);
    const { on, EventHandler } = handlery.default(adapter);

    const handlerFunction = vi.fn();

    class TestHandler extends EventHandler {
      @on('testEvent2')
      public handleTestEvent2(data: [number, string]) {
        handlerFunction(data);
      }
    }

    TestHandler.register();
    EventHandler.subscribeAll();

    const testData = { number: 42, message: 'Hello, world!' };
    eventEmitter.emit('testEvent2', testData.number, testData.message);
    expect(handlerFunction).toHaveBeenCalledWith([testData.number, testData.message]);
    expect(eventEmitter.listenerCount('testEvent2')).toBe(1);
  });
});
