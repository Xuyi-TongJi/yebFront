// 代理转发,请求8080端口，转发到8081端口
let proxyObj = {}
proxyObj['/'] = {
    // websocket
    ws: false,
    target: 'http://localhost:8081',
    // 请求头host会被设置target
    changeOrigin: true,
    pathRewrite: {
        '^/': '/'
    }
}

module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    }
}
