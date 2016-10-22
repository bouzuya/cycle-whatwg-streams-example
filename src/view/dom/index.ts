import { ReadableStream } from 'whatwg-streams-b';
import { map } from 'whatwg-streams-fns/map';
import { view as appView } from './app';

const view = (state$: ReadableStream<any>): ReadableStream<any> => {
  return state$.pipeThrough(map((state: any) => appView(state)));
};

export { view };
