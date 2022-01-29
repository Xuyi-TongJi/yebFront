// 全局axios处理
import axios from "axios";

// 单独引入Message
import {Message} from "element-ui";
import router from "@/router";

// 请求拦截器
axios.interceptors.request.use(
    config => {
        // 把tokenStr添加到请求头'Authorization'中
        if (sessionStorage.getItem("tokenStr")) {
            config.headers['Authorization'] = sessionStorage.getItem('tokenStr');
        }
        return config;
    }, error => {
        Message.error({message: "发生未知错误" + error, duration: 3 * 1000});
    }
)

// 响应拦截器
axios.interceptors.response.use(
    success => {
        // 调用后端接口成功
        if (success.status != null && success.status === 200) {
            // 返回数组信息
            if (success.data instanceof Array) {
                return success;
            } else {
                // 返回ResponseBean且业务逻辑错误
                if (success.data.status === 500 || success.data.status === 401 || success.data.status === 403) {
                    Message.error({message: success.data.message, duration: 3 * 1000});
                    return success;
                }
                // 返回ResponseBean且业务逻辑正确
                else if (success.data.status === 200) {
                    Message.success({message: success.data.message, duration: 3 * 1000});
                    return success;
                }
            }
        }
        return success;
    },
    // 调用后端接口失败
    error => {
        if (error.response.status === 504 || error.response.status === 404) {
            Message.error({message: '服务器被我吃了～', duration: 3 * 1000});
        } else if (error.response.status === 403) {
            Message.error({message: '权限不足！', duration: 3 * 1000});
        } else if (error.response.status === 401) {
            Message.error({message: '尚未登录，请先登录再进行其他操作!', duration: 3 * 1000});
            router.replace("/");
        } else {
            if (error.response.data.message) {
                Message.error({message: error.response.data.message, duration: 3 * 1000});
            } else {
                Message.error({message: "未知错误"});
            }
        }
        return error;
    })

let base = '';

// 封装post请求
export const postRequest = (url, params) => {
    return axios({
            method: 'post',
            url: base + url,
            data: params
        }
    )
}

// 封装delete请求
export const deleteRequest = (url, params) => {
    return axios({
            method: 'delete',
            url: base + url,
            data: params
        }
    )
}

// 封装put请求
export const putRequest = (url, params) => {
    return axios({
            method: 'put',
            url: base + url,
            data: params
        }
    )
}

// 封装get请求
export const getRequest = (url, params) => {
    return axios({
            method: 'get',
            url: base + url,
            data: params
        }
    )
}
