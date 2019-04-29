/* eslint-disable */
import Vue from 'vue';
import ElementUI from 'element-ui';
import axios from 'axios';
import 'babel-polyfill'; // 解决ie兼容
import jsbn from 'jsbn';
import Echarts from 'echarts';
import ecc from 'eosjs-ecc'; // 引入加密插件库
import 'element-ui/lib/theme-chalk/index.css';
import store from './store';

import App from './App';
import router from './router';
import httpServer from './service/httpServer'; // 引入axios方法
import httpConfig from './service/httpConfig';
import common from './util/common';
import './assets/fonts/iconfont.css';

Vue.config.productionTip = false;
Vue.prototype.echarts = Echarts;
Vue.use(Echarts);
Vue.use(ElementUI);
// 挂载axios
Vue.prototype.$axios = httpServer;
Vue.prototype.API = httpConfig;
Vue.prototype.jsbn = jsbn;
Vue.prototype.ecc = ecc;
Vue.prototype.common = common;

axios.defaults.emulateJSON = true;

//路由拦截
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    store.state.token = localStorage.getItem('currentUser_token');
    if (store.state.token) {
      // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next();
  }
});

/* eslint-disable*/
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  data: {
    bus: new Vue()
  }
});
