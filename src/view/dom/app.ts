import { div } from '@cycle/dom';
import { view as headerView } from './header';
import { view as mainView } from './main';

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
  return div([
    headerView(),
    mainView(state)
  ]);
};

export { view };
