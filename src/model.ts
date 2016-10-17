import { ReadableStream } from 'whatwg-streams-b';
import { filter } from 'whatwg-streams-fns/filter';
import { map } from 'whatwg-streams-fns/map';
import { fold } from 'whatwg-streams-fns/fold';

const model = (action$: ReadableStream): ReadableStream => {
  const state = {
    filterFn: () => true,
    list: []
  };
  const state$ = action$
    .pipeThrough(filter((action) => action.type === 'insertTodo'))
    .pipeThrough(map((action) => {
      return {
        title: action.payload,
        completed: false
      };
    }))
    .pipeThrough(fold((state, item) => {
      return Object.assign(state, { list: state.list.concat([item]) });
    }, state));
  return state$;
};

export { model };

