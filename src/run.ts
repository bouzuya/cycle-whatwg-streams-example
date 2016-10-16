import {
  CycleExecution,
  CycleSetup,
  DisposeFunction,
} from '@cycle/base';
import cycle from '@cycle/base';
import streamAdapter from './adapter';

export function run<Sources, Sinks>(
  main: (sources: Sources) => Sinks,
  drivers: { [name: string]: Function }
): DisposeFunction {
  const { run } = cycle(main, drivers, { streamAdapter });
  return run();
}

const setup = function <So, Si>(
  main: (sources: So) => Si,
  drivers: { [name: string]: Function }
): CycleExecution<So, Si> {
  return cycle(main, drivers, { streamAdapter });
} as CycleSetup;

setup.run = run;

export default setup;
