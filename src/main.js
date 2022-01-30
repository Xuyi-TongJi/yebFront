import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import store from './storage';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css';
import router from "@/router";

import {postRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";
import {getRequest} from "@/utils/api";
import {initMenu} from "@/utils/menus";
import {Message} from "element-ui";

Vue.config.productionTip = false
Vue.use(ElementUI)

// 以插件形式使用封装请求函数
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

// 路由前置守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next();
  }
  // 如果用户登录，则查询菜单, 防止sessionStorage未定义
  else if (store.state.tokenStr !== '' || sessionStorage.getItem("tokenStr") != null) {
    initMenu(router, store);
    if (sessionStorage.getItem("user") == null) {
      getRequest("/system/admin/info").then(res => {
        if (res.data.obj) {
          // sessionStorage中只能存储字符串
          sessionStorage.setItem("user", JSON.stringify(res.data.obj));
        }
      })
    }
    next();
  }
  // 用户既没有登录，也没有访问登录页
  else {
    Message.info({message: '请先登录', duration: 3 * 1000});
    // 转发到登陆界面
    next('/?redirect=' + to.path);
  }
})

new Vue({
  router, store,
  render: h => h(App),
}).$mount('#app')
