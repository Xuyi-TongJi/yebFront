import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import Home from "@/views/Home";

Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        hidden: true
    },
    {
        path: '/hello',
        name: '首页',
        component: Home
    }
]

const router = new VueRouter({
        routes
    }
)

// 导出router
export default router
