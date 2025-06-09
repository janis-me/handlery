import { describe, expect, it, vi } from 'vitest';

describe('Emittery', () => {
  it('should create a valid emittery adapter', async () => {
    const { emitteryAdapter } = await import('handlery/adapters');
    const Emittery = await import('emittery');

    const EMITTERY = new Emittery.default();

    const adapter = emitteryAdapter(EMITTERY);

    expect(adapter).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(adapter.on).toBeInstanceOf(Function);
  });

  it('should accept the adapter in handlery', async () => {
    const { emitteryAdapter } = await import('handlery/adapters');
    const handlery = await import('handlery');
    const Emittery = await import('emittery');

    const EMITTERY = new Emittery.default();
    const adapter = emitteryAdapter(EMITTERY);

    const { on, EventHandler } = handlery.default(adapter);

    expect(on).toBeDefined();
    expect(EventHandler).toBeDefined();
  });

  it('should register and handle events', async () => {
    const { emitteryAdapter } = await import('handlery/adapters');
    const handlery = await import('handlery');
    const Emittery = await import('emittery');

    const EMITTERY = new Emittery.default();
    const adapter = emitteryAdapter(EMITTERY);
    const { on, EventHandler } = handlery.default(adapter);

    const handlerFunction = vi.fn();

    class TestHandler extends EventHandler {
      @on('testEvent')
      public handleTestEvent(data: { message: string }) {
        handlerFunction(data);
      }
    }

    new TestHandler();

    const testData = { message: 'Hello, world!' };
    await EMITTERY.emit('testEvent', testData);
    expect(handlerFunction).toHaveBeenCalledWith(testData);
  });
});
