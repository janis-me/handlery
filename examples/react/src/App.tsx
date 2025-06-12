import { useEffect, useState, useSyncExternalStore } from 'react';

import { emittery, EventHandler } from '#events';
import { todosStore } from '#store';

const flexy = { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1rem' } as const;

export default function App() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);

  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (subscribed) {
      EventHandler.subscribeAll();
    } else {
      EventHandler.unsubscribeAll();
    }

    return () => {
      EventHandler.unsubscribeAll();
    };
  }, [subscribed]);

  const handleSubscribeButtonClick = () => {
    setSubscribed(prev => !prev);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const name = formData.get('name') as string;
    const done = formData.get('done') as string;

    if (name) {
      void emittery.emit('todos.add', { name, done: done === 'on' });
    }

    e.currentTarget.reset();
  };

  const handleRemoveButtonClick = (id: number) => {
    void emittery.emit('todos.remove', { id });
  };

  return (
    <div style={{ margin: '0 20%' }}>
      <h1>Handlery + React Example</h1>
      <p>
        This example shows how easy it is to subscribe/unsubscribe to any number of event listeners using handlery. It
        also shows how to sync an external &apos;store&apos; to react, but that&apos;s not the point.
      </p>

      <hr />

      <div style={flexy}>
        <form onSubmit={handleSubmit} style={flexy}>
          <label>
            Todo Name:
            <input type="text" name="name" />
          </label>
          <label>
            Done:
            <input type="checkbox" name="done" />
          </label>
          <button type="submit">Add Todo</button>
        </form>
        <button onClick={handleSubscribeButtonClick}>{subscribed ? 'Unsubscribe' : 'Subscribe'}</button>
      </div>

      <hr />

      <ul style={{ listStyleType: 'none', padding: 0, ...flexy, flexDirection: 'column' }}>
        {todos.map(todo => (
          <li key={todo.id} style={flexy}>
            <span>
              {todo.label} {todo.done ? '✓' : '✗'}
            </span>
            <button
              onClick={() => {
                handleRemoveButtonClick(todo.id);
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
