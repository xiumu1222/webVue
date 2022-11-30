import src from './src/img-preview';

const install = function(Vue) {
  Vue.component(src.name, src);
};

export default {
  install
};
