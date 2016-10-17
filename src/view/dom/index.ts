import { ReadableStream } from 'whatwg-streams-b';
import { map } from 'whatwg-streams-fns/map';
import { view as appView } from './app';

const view = (state$: ReadableStream): ReadableStream => {
  return state$.pipeThrough(map((state) => appView(state)));
};

export { view };
