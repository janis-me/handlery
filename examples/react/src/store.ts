interface Todo {
  id: number;
  label: string;
  done: boolean;
}

let nextId = 0;
let todos: Todo[] = [];
let listeners: Array<() => void> = [];

export const todosStore = {
  addTodo(label: string, done = false) {
    todos = [...todos, { id: nextId++, label, done }];
    emitChange();
  },
  removeTodo(id: number) {
    if (todos.some(todo => todo.id === id)) {
      todos = todos.filter(todo => todo.id !== id);
      emitChange();
    } else {
      console.warn(`Todo with id ${String(id)} does not exist.`);
    }
  },
  subscribe(this: void, listener: () => void) {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot(this: void) {
    return todos;
  },
};

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}
