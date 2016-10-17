import { button, div, input, label, li } from '@cycle/dom';

export interface Item {
  completed: boolean;
  editing: boolean;
  title: string;
}

const view = (item: Item): any => {
  const { title, completed, editing } = item;
  const todoRootClasses = { completed, editing };
  return li('.todoRoot', { class: todoRootClasses }, [
    div('.view', [
      input('.toggle', {
        props: { type: 'checkbox', checked: completed },
      }),
      label([title]),
      button('.destroy')
    ]),
    input('.edit', {
      props: { type: 'text' },
      hook: {
        update(_oldVNode: any, { elm }: any) {
          elm.value = title;
          if (editing === true) {
            elm.focus();
            elm.selectionStart = elm.value.length;
          }
        }
      }
    })
  ]);
};

export { view };
