/* 菜单请求工具类 */
// 在js文件中不能使用vue组件插件
import {getRequest} from "@/utils/api";

// 如果router中没有菜单路由配置，则初始化菜单
export const initMenu = (router, store) => {
    if (store.state.routes.length === 0) {
        getRequest("/system/cfg/menu").then(res => {
            if (res.data != null) {
                // 格式化Router
                let fmtRoutes = formatRoutes(res.data);
                // 添加到路由
                router.addRoutes(fmtRoutes);
                // 存储到vuex
                store.commit('initRoutes', fmtRoutes);
            }
        })
    }
}

export const formatRoutes = (routes) => {
    let fmtRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            iconCls,
            children
        } = router;
        if (children && children instanceof Array) {
            // 递归
            children = formatRoutes(children);
        }
        let fmtRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            children: children,
            // component字符串转为Vue component对象
            component(resolve) {
                let pkg = '';
                if (!component.startsWith("Home")) {
                    pkg = component.substr(0, 3).toLowerCase() + '/';
                }
                require(['../views/' + pkg + component + '.vue'], resolve);
            }
        }
        fmtRoutes.push(fmtRouter);
    });
    return fmtRoutes;
}
