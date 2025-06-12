import { todosStore } from '#store.js';
import Emittery from 'emittery';
import handlery from 'handlery';
import { emitteryAdapter } from 'handlery/adapters';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Events = {
  'todos.add': { name: string; done: boolean };
  'todos.remove': { id: number };
};

export const emittery = new Emittery<Events>();

const Handlery = handlery(emitteryAdapter(emittery));

const { on, register } = Handlery;
export const { EventHandler } = Handlery;

@register()
class _TodoHandler extends EventHandler {
  @on('todos.add')
  public handleTodoAdd(data: Events['todos.add']) {
    todosStore.addTodo(data.name, data.done);
  }

  @on('todos.remove')
  public handleTodoRemove(data: Events['todos.remove']) {
    todosStore.removeTodo(data.id);
  }
}
