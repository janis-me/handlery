import Emittery from 'emittery';
import handlery from 'handlery';
import { emitteryAdapter } from 'handlery/adapters';

type Events = {
  'user.add': { name: string };
  'user.remove': { id: number };
  'post.add': { title: string; content: string };
  'post.remove': { id: number };
  'comment.add': { postId: number; content: string };
  'comment.remove': { id: number; postId: number };
};

const emitter = new Emittery<Events>();
const { on, register, EventHandler } = handlery(emitteryAdapter(emitter));

@register()
class _UserHandler extends EventHandler {
  @on('user.add')
  public handleUserAdd(data: Events['user.add']) {
    console.log('Handled user.add:', data);
  }

  @on('user.remove')
  public handleUserRemove(data: Events['user.remove']) {
    console.log('Handled user.remove:', data);
  }
}

@register()
class _PostHandler extends EventHandler {
  @on('post.add')
  public handlePostAdd(data: Events['post.add']) {
    console.log('Handled post.add:', data);
  }

  @on('post.remove')
  public handlePostRemove(data: Events['post.remove']) {
    console.log('Handled post.remove:', data);
  }
}

@register()
class _CommentHandler extends EventHandler {
  @on('comment.add')
  public handleCommentAdd(data: Events['comment.add']) {
    console.log('Handled comment.add:', data);
  }

  @on('comment.remove')
  public handleCommentRemove(data: Events['comment.remove']) {
    console.log('Handled comment.remove:', data);
  }
}

// Later, start the handler.
function start() {
  // Automatically subscribe all registered handlers
  // Comment this out to see that no events are handled
  EventHandler.subscribeAll();

  void emitter.emit('user.add', { name: 'John Doe' });
  void emitter.emit('post.add', { title: 'New Post', content: 'This is the content of the new post.' });
  void emitter.emit('comment.add', { postId: 1, content: 'This is a comment on the new post.' });

  return () => {
    EventHandler.unsubscribeAll();
  };
}

start();
