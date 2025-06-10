# Context

All methods that are decorated with `@on('...')` receive the event data as the first argument, and a `context` as the second.

The context contains:

- An `event` prop that has the event ID/name and all data
- The raw `emitter` that was passed into `handlery`

That way, you can easily respond to events, or fire new ones!

```ts {5}
@subscribe()
class TestHandler extends EventHandler {
  @on('test-event-1')
  public async handleTestEvent1(data: Events['test-event-1'], ctx: EventHandlerContext<'test-event-2'>) {
    await ctx.emitter.emit('test-event-2', { name: 'John' });
  }

  @on('test-event-1')
  public handleTestEvent2(data: [number, string]) {
    console.log('Handled test-event-2:', data);
  }
}
```
