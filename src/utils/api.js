// 全局axios处理
import axios from "axios";

// 单独引入Message
import {Message} from "element-ui";
import router from "@/router";

// 相应拦截器
axios.interceptors.response.use(
    success => {
        // 调用后端接口成功
        if (success.status && success.status === 200) {
            // 业务逻辑错误
            if (success.data.code === 500 || success.data.code === 401 || success.data.code === 403) {
                Message.error({message: success.data.message, duration: 3 * 1000});
                return Promise.reject(success.data.message);
            }
            // 业务逻辑正确
            if (success.data.message) {
                Message.success({message: success.data.message, duration: 3 * 1000});
                return success;
            }
        }
    },
    // 调用后端接口失败
    error => {
        if (error.response.code === 504 || error.response.code === 404) {
            Message.error({message: '服务器被我吃了～', duration: 3 * 1000});
        } else if (error.response.code === 403) {
            Message.error({message: '权限不足！', duration: 3 * 1000});
        } else if (error.response.code === 401) {
            Message.error({message: '尚未登录，请先登录再进行其他操作!', duration: 3 * 1000});
            router.push("/");
        } else {
            if (error.response.data.message) {
                Message.error({message: error.response.data.message, duration: 3 * 1000});
            } else {
                Message.error({message: "未知错误"});
            }
        }
        return Promise.reject(error);
    })

let base = '';

export const postRequest = (url, params) => {
    return axios({
            method: 'post',
            url: base + url,
            data: params
        }
    )
}
