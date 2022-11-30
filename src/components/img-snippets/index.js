import Zoom from './src/zoom.vue';
import Rect from './src/rect.vue';
import BtnGroup from './src/btn-group.vue';
import UploadBtn from './src/upload-btn.vue';
import Thumbnail from './src/thumbnail.vue';
import locale from '@hui-pro/locale';
import zhCN from '@hui-pro/img-snippets/lang/zh_CN';

const install = function(Vue) {
  locale.use(zhCN);
  Vue.component(Zoom.name, Zoom);
  Vue.component(Rect.name, Rect);
  Vue.component(BtnGroup.name, BtnGroup);
  Vue.component(UploadBtn.name, UploadBtn);
  Vue.component(Thumbnail.name, Thumbnail);
};

export default {
  install
};
