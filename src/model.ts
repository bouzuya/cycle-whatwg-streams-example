import { ReadableStream } from 'whatwg-streams-b';
import { filter } from 'whatwg-streams-fns/filter';
import { fold } from 'whatwg-streams-fns/fold';
import { map } from 'whatwg-streams-fns/map';
import { merge } from 'whatwg-streams-fns/merge';

// for debug
import { WritableStream } from 'whatwg-streams-b';

// TODO: any
const model = (action$: ReadableStream<any>): ReadableStream<any> => {
  const state = {
    filterFn: () => true,
    list: []
  };

  // for debug
  const [log$, action1$] = action$.tee();
  log$.pipeTo(new WritableStream({
    write(chunk) {
      console.log(chunk);
    }
  }));

  const [action11$, action12$] = action1$.tee();
  const clearInput$ = action11$
    .pipeThrough(filter((action: any) => action.type === 'clearInput'))
    .pipeThrough(map((_action) => (state: any) => state));
  const [action121$, action122$] = action12$.tee();
  const insertTodo$ = action121$
    .pipeThrough(filter((action: any) => action.type === 'insertTodo'))
    .pipeThrough(map((action: any) => {
      const item = {
        title: action.payload,
        completed: false
      };
      return (state: any) => {
        return Object.assign(state, { list: state.list.concat([item]) });
      };
    }));
  const toggleAll$ = action122$
    .pipeThrough(filter((action: any) => action.type === 'toggleAll'))
    .pipeThrough(map((action: any) => {
      return (state: any) => {
        return Object.assign(state, {
          list: state.list.map((item: any) => {
            return Object.assign({}, item, { completed: action.payload });
          })
        });
      };
    }));
  const reducer$ = merge(clearInput$, insertTodo$, toggleAll$);
  const state$ = reducer$
    .pipeThrough(fold((state: any, reducer: any) => reducer(state), state));
  return state$;
};

export { model };
