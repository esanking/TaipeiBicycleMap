import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';

import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.css';
import 'vue-loading-overlay/dist/vue-loading.css';

import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LIcon,
} from 'vue2-leaflet';

import 'leaflet/dist/leaflet.css';

import App from './App.vue';
// 啟用載入的各組件
Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-popup', LPopup);
Vue.component('l-icon', LIcon);
Vue.component('Loading', Loading);

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
