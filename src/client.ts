import { makeDOMDriver } from '@cycle/dom';
import { run as runCycle } from 'cycle-whatwg-streams-run';
import { main } from './app';

const run = (): void => {
  runCycle(main, { DOM: makeDOMDriver('.todoapp') });
};

export { run };
