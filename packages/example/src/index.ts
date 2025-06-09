import Emittery from 'emittery';
import handlery from 'handlery';
import { emitteryAdapter } from 'handlery/adapters';

/*
 * 1.: Create an emitter (like emittery)
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions --- this must be a type so typescript does not enforce 'string' index mapping
export type AppEvents = {
  addUser: { name: string };
  removeUser: { id: string };
};

const EMITTERY = new Emittery<AppEvents>();

/*
 * 2.: Pass the emitter to handlery to get a decorator and event handler class
 */
const emitter = emitteryAdapter(EMITTERY);
const { on, EventHandler } = handlery(emitter);

/*
 * 3.: Define an event handler!
 */
export class UserHandler extends EventHandler {
  @on('addUser')
  public handleAddUser(data: AppEvents['addUser']) {
    console.log('Event received:', data.name);
  }

  @on('removeUser')
  public handleRemoveUser(data: AppEvents['removeUser']) {
    console.log('User removed with ID:', data.id);
  }
}

/*
 * 4: The events are registered when an instance of the handler is created.
 * Do that and then emit some events!
 */
export async function start() {
  new UserHandler();

  await EMITTERY.emit('addUser', { name: 'John Doe' });
  await EMITTERY.emit('removeUser', { id: '12345' });
}

await start();
