import src from './src/img-view.vue';

const install = function(Vue) {
  Vue.component(src.name, src);
};

export default {
  install
};
