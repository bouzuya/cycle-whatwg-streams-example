import { ReadableStream } from 'whatwg-streams-b';
import { filter } from 'whatwg-streams-fns/filter';
import { map } from 'whatwg-streams-fns/map';
import { So } from './so';


const intent = (sources: So): ReadableStream => {
  const { DOM } = sources;
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

export { intent };
