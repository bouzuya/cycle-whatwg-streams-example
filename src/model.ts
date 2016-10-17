import { ReadableStream, WritableStream } from 'whatwg-streams-b';

const model = (action$: ReadableStream): ReadableStream => {
  action$.pipeTo(new WritableStream({
    write(c) {
      console.log(c);
    }
  }));
  const state = {};
  const state$ = new ReadableStream({
    start(controller) {
      controller.enqueue(state);
    }
  });
  return state$;
};

export { model };

