import { ReadableStream } from 'whatwg-streams-b';
import { div, makeHTMLDriver, DOMSource } from '@cycle/dom';
import { run } from './run';

type So = { DOM: DOMSource; }; // Sources
type Si = { DOM: ReadableStream; }; // Sinks

const main = ({ DOM }: So): Si => {
  const click$: ReadableStream = DOM.select('.app').events('click');
  const sinks: Si = {
    DOM: new ReadableStream({
      start(controller) {
        controller.enqueue(div('.app', ['hello']));
        console.log(click$);
      }
    })
  };
  return sinks;
};

run(main, { DOM: makeHTMLDriver(html => console.log(html)) });
