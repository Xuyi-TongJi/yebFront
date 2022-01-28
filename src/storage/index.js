import Vue from "vue";
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        routes: [],
        tokenStr: ''
    },
    // 同步执行
    mutations: {
        initRoutes(state, data) {
            state.routes = data;
        },
        setTokenStr(state, tokenStr) {
            state.tokenStr = tokenStr;
            sessionStorage.setItem("tokenStr", tokenStr);
        },
        clearTokenStr(state) {
            state.tokenStr = '';
            sessionStorage.removeItem("tokenStr");
        }
    },
    // 异步执行
    actions: {

    }
})
