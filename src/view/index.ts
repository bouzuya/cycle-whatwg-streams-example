import { ReadableStream } from 'whatwg-streams-b';
import { Si } from '../si';
import { view as domView } from './dom';

const view = (state$: ReadableStream<any>): Si => {
  return {
    DOM: domView(state$)
  };
};

export { view };
