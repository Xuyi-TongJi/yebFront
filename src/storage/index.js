import Vue from "vue";
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        routes: [],
        tokenStr: '',
        levelTitleList: []
    },
    // 同步执行
    mutations: {
        // 菜单路由信息配置
        initRoutes(state, data) {
            state.routes = data;
        },
        clearRoutes(state) {
            state.routes = [];
        },
        // Token字符串信息配置
        setTokenStr(state, tokenStr) {
            state.tokenStr = tokenStr;
            sessionStorage.setItem("tokenStr", tokenStr);
        },
        clearTokenStr(state) {
            state.tokenStr = '';
            sessionStorage.removeItem("tokenStr");
        },
        setLevelTitleList(state, list) {
            if (list instanceof Array) {
                state.levelTitleList = list;
            }
        },
        clearLevelTitleList(state) {
            state.levelTitleList = [];
        }
    },
    // 异步执行
    actions: {

    }
})
