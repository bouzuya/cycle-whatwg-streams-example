import {
  h1,
  header,
  input
} from '@cycle/dom';

const view = (): any => {
  return header('.header', [
    h1('todos'),
    input('.new-todo', {
      props: {
        type: 'text',
        placeholder: 'What needs to be done?',
        autofocus: true,
        name: 'newTodo'
      },
      hook: {
        update(_oldVNode: any, vnode: any) {
          vnode.elm.value = '';
        },
      },
    })
  ]);
};

export { view };
