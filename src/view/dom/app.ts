import { div } from '@cycle/dom';
import { view as headerView } from './header';

const view = (_state: any): any => {
  return div([
    headerView()
  ]);
};

export { view };
