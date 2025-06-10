import { describe, expect, it, vi } from 'vitest';

describe('Custom', () => {
  const listeners = new Map<PropertyKey | PropertyKey[], (data: unknown) => void>();
  const onHandler = vi.fn((eventName: PropertyKey | PropertyKey[], listener: (data: unknown) => void) => {
    listeners.set(eventName, listener);
    return () => {
      listeners.delete(eventName);
      return undefined;
    };
  });
  const offHandler = vi.fn((eventName: PropertyKey | PropertyKey[], _: (data: unknown) => void) => {
    if (listeners.has(eventName)) {
      listeners.delete(eventName);
      return undefined;
    }
  });
  const onceHandler = vi.fn((eventName: PropertyKey | PropertyKey[], listener: (data: unknown) => void) => {
    const off = onHandler(eventName, (data: unknown) => {
      listener(data);
      offHandler(eventName, listener);
      return undefined;
    });
    return () => {
      off();
      return undefined;
    };
  });

  const customEmitter = {
    on: onHandler,
    off: offHandler,
    emit: vi.fn((eventName: PropertyKey, data: unknown) => {
      const listener = listeners.get(eventName);
      if (listener) {
        listener(data);
      }
      return undefined;
    }),
    once: onceHandler,
  };

  it('should import handlery', async () => {
    const handlery = await import('handlery');
    expect(handlery).toBeDefined();
  });

  it('should accept a custom emitter', async () => {
    const handlery = await import('handlery');
    const { on, EventHandler } = handlery.default(customEmitter);

    expect(on).toBeDefined();
    expect(EventHandler).toBeDefined();
  });

  it('should register and handle events with custom emitter', async () => {
    const handlery = await import('handlery');
    const { on, EventHandler } = handlery.default<{ testEvent: { message: string } }>(customEmitter);

    const handlerFunction = vi.fn();

    class TestHandler extends EventHandler {
      @on('testEvent')
      public handleTestEvent(data: { message: string }) {
        handlerFunction(data);
      }
    }

    TestHandler.register();
    EventHandler.subscribeAll();

    const testData = { message: 'Hello, world!' };
    customEmitter.emit('testEvent', testData);
    expect(customEmitter.emit).toHaveBeenCalledWith('testEvent', testData);
    expect(handlerFunction).toHaveBeenCalledWith(testData);
    expect(onHandler).toHaveBeenCalledWith('testEvent', expect.any(Function));
  });
});
