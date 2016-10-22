import { ReadableStream } from 'whatwg-streams-b';
import { filter } from 'whatwg-streams-fns/filter';
import { map } from 'whatwg-streams-fns/map';
import { merge } from 'whatwg-streams-fns/merge';
import { So } from './so';

// TODO: export
interface Action {
  type: string;
}

const clearInput = ({ DOM }: So): ReadableStream<Action> => {
  type Event = { keyCode: number; };
  const keydown$: ReadableStream<Event> = DOM
    .select('.new-todo')
    .events('keydown');
  const clearInput$: ReadableStream<Action> = keydown$
    .pipeThrough(filter((event: Event) => {
      const escKeyCode = 27;
      return event.keyCode === escKeyCode;
    }))
    .pipeThrough(map((payload: Event) => ({ type: 'clearInput', payload })));
  return clearInput$;
};

const insertTodo = ({ DOM }: So): ReadableStream<Action> => {
  type Event = { target: { value: string; }; keyCode: number; };
  const keydown$: ReadableStream<Event> = DOM
    .select('.new-todo').events('keydown');
  const insertTodo$: ReadableStream<Action> = keydown$
    .pipeThrough(filter((event: Event) => {
      const enterKeyCode = 13;
      const trimmed = String(event.target.value).trim();
      return event.keyCode === enterKeyCode && trimmed.length > 0;
    }))
    .pipeThrough(map((event: Event): string => {
      return String(event.target.value).trim();
    }))
    .pipeThrough(map((payload: string) => ({ type: 'insertTodo', payload })));
  return insertTodo$;
};

const toggleAll = ({ DOM }: So): ReadableStream<Action> => {
  type Event = { target: { checked: boolean; }; };
  const keydown$: ReadableStream<Event> = DOM
    .select('.toggle-all').events('click');
  const toggleAll$: ReadableStream<Action> = keydown$
    .pipeThrough(map((event: Event) => event.target.checked))
    .pipeThrough(map((payload: boolean) => ({ type: 'toggleAll', payload })));
  return toggleAll$;
};

// TODO: any
const intent = (sources: So): ReadableStream<any> => {
  return merge(insertTodo(sources), clearInput(sources), toggleAll(sources));
};

export { intent };
