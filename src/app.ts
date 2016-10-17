import { Si } from './si';
import { So } from './so';
import { intent } from './intent';
import { model } from './model';
import { view } from './view';

const main = (sources: So): Si => view(model(intent(sources)));

export { main };
