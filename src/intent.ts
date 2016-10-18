import { ReadableStream } from 'whatwg-streams-b';
import { filter } from 'whatwg-streams-fns/filter';
import { map } from 'whatwg-streams-fns/map';
import { merge } from 'whatwg-streams-fns/merge';
import { So } from './so';

const intent = (sources: So): ReadableStream => {
  const { DOM } = sources;
  const keydown$: ReadableStream = DOM.select('.new-todo').events('keydown');
  const [keydown1$, keydown2$] = keydown$.tee();
  const clearInput$: ReadableStream = keydown1$
    .pipeThrough(filter((event) => {
      const escKeyCode = 27;
      return event.keyCode === escKeyCode;
    }))
    .pipeThrough(map((payload) => ({ type: 'clearInput', payload })));
  const insertTodo$: ReadableStream = keydown2$
    .pipeThrough(filter((event) => {
      const enterKeyCode = 13;
      const trimmed = String(event.target.value).trim();
      return event.keyCode === enterKeyCode && trimmed.length > 0;
    }))
    .pipeThrough(map((event) => String(event.target.value).trim()))
    .pipeThrough(map((payload) => ({ type: 'insertTodo', payload })));
  return merge(insertTodo$, clearInput$);
};

export { intent };
