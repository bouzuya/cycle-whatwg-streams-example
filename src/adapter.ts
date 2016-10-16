import {
  StreamAdapter,
  Observer,
  StreamSubscribe,
  DisposeFunction,
  Subject,
} from '@cycle/base';
import {
  ReadableStream, ReadableStreamController, WritableStream
} from 'whatwg-streams-b';

const WhatwgStreamsAdapter: StreamAdapter = {
  adapt(
    this: StreamAdapter,
    originStream: any,
    originStreamSubscribe: StreamSubscribe
  ): ReadableStream {
    if (this.isValidStream(originStream)) {
      return originStream;
    }
    let controller: ReadableStreamController | null = null;
    const dispose = originStreamSubscribe(originStream, {
      next(x) {
        if (controller !== null) controller.enqueue(x);
      },
      error(e) {
        if (controller !== null) controller.error(e);
      },
      complete() {
        if (controller !== null) controller.close();
      }
    });
    return new ReadableStream({
      start(c) {
        controller = c;
      },
      cancel(_reason) {
        if (typeof dispose === 'function') {
          (dispose as DisposeFunction).call(null);
        }
      }
    });
  },

  remember(observable: ReadableStream): ReadableStream {
    return observable;
  },

  makeSubject<T>(): Subject<T> {
    let controller: ReadableStreamController | null = null;
    const stream = new ReadableStream({
      start(c) {
        controller = c;
      }
    });
    const observer: Observer<T> = {
      next(x: T) { if (controller !== null) controller.enqueue(x); },
      error(err: any) { if (controller !== null) controller.error(err); },
      complete() { if (controller !== null) controller.close(); }
    };
    return { stream, observer };
  },

  isValidStream(stream: any): stream is ReadableStream {
    return (
      typeof stream.pipeTo === 'function' &&
      typeof stream.pipeThrough === 'function' &&
      typeof stream.tee === 'function' &&
      typeof stream.getReader === 'function'
    );
  },

  streamSubscribe<T>(
    stream: any,
    observer: Observer<T>
  ): DisposeFunction {
    stream.pipeTo(new WritableStream({
      write(chunk) {
        observer.next(chunk);
      },
      abort(reason) {
        observer.error(reason);
      },
      close() {
        observer.complete();
      }
    }));
    return () => void stream.cancel();
  },
};

export default WhatwgStreamsAdapter;
