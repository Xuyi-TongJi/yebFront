import Vue from "vue";
import Vuex from 'vuex';
import {enable} from "core-js/internals/internal-metadata";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        routes: [],
        tokenStr: '',
        levelTitleList: [],
        menuList: [],
        adminList: []
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
        },
        setMenuList(state, list) {
            if (list instanceof Array) {
                state.menuList = list;
            }
        },
        clearMenuList(state) {
            state.menuList = [];
        },
        setAdminList(state, list) {
            if (list instanceof Array) {
                state.adminList = list;
            }
        },
        setAdminListIndexUserFace(state, index, userFace) {
            if (userFace != null) {
                state.adminList[index].userFace = userFace;
            }
        },
        setAdminListIndexEnabled(state, index, enabled) {
            if (enable() != null) {
                state.adminList[index].enabled = enabled;
            }
        },
        clearAdminList(state) {
            state.adminList = [];
        }
    },
    // 异步执行
    actions: {

    }
})
