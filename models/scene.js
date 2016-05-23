import thinky from '../thinky';

const r = thinky.r;
const type = thinky.type;

let Scene = thinky.createModel('Scene', {
  id: type.string(),
  name: type.string(),
  template: type.string(),
  data: type.array(),
  order: type.number().integer().min(0)
});

export default Scene
