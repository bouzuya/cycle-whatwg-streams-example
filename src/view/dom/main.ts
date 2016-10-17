import { section, input, ul } from '@cycle/dom';
import { view as itemView } from './item';

export interface Item {
  completed: boolean;
  editing: boolean;
  title: string;
}

export interface State {
  filterFn: (item: Item) => boolean;
  list: Item[];
}

const view = (state: State): any => {
  const { list, filterFn } = state;
  const allCompleted = list.reduce((x, y) => x && y.completed, true);
  const sectionStyle = { 'display': list.length > 0 ? '' : 'none' };
  return section('.main', { style: sectionStyle }, [
    input('.toggle-all', {
      props: { type: 'checkbox', checked: allCompleted },
    }),
    ul('.todo-list', state.list.filter(filterFn).map(itemView))
  ]);
};

export { view };
