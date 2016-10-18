import { ReadableStream } from 'whatwg-streams-b';
import { filter } from 'whatwg-streams-fns/filter';
import { map } from 'whatwg-streams-fns/map';
import { merge } from 'whatwg-streams-fns/merge';
import { So } from './so';

const clearInput = ({ DOM }: So): ReadableStream => {
  const keydown$: ReadableStream = DOM.select('.new-todo').events('keydown');
  const clearInput$: ReadableStream = keydown$
    .pipeThrough(filter((event) => {
      const escKeyCode = 27;
      return event.keyCode === escKeyCode;
    }))
    .pipeThrough(map((payload) => ({ type: 'clearInput', payload })));
  return clearInput$;
};

const insertTodo = ({ DOM }: So): ReadableStream => {
  const keydown$: ReadableStream = DOM.select('.new-todo').events('keydown');
  const insertTodo$: ReadableStream = keydown$
    .pipeThrough(filter((event) => {
      const enterKeyCode = 13;
      const trimmed = String(event.target.value).trim();
      return event.keyCode === enterKeyCode && trimmed.length > 0;
    }))
    .pipeThrough(map((event) => String(event.target.value).trim()))
    .pipeThrough(map((payload) => ({ type: 'insertTodo', payload })));
  return insertTodo$;
};

const intent = (sources: So): ReadableStream => {
  return merge(insertTodo(sources), clearInput(sources));
};

export { intent };
