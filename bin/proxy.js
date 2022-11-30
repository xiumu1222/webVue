/*
 * @Description:
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2020-08-26 14:05:16
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2020-12-23 11:32:23
 */
const proxyList = [
  {
    test: '/apis/*',
    // target: 'https://10.66.174.189',
    // target: 'http://10.16.81.114:9998/',
    // target: 'http://10.16.82.113:8384', // 老谭
    // target: 'http://10.12.66.12:9034/',
    // target: 'http://10.16.81.25:9998/',
    // target: 'https://10.19.132.149/',
    // target: 'http://10.3.176.207:9034/',
    // target: 'http://10.195.239.39:9034/',
    target: 'https://10.66.168.249/',
    // target: 'https://10.66.168.249/',
    // target: 'http://10.195.239.39:9034/',
    Cookie: 'JSESSIONID=1Ynw4gnJza7LGOeSiFcRFbNmdndDhWSMln77u2sF;',
    pathRewrite: {
      '^/apis': ''
    },
    ws: true
  }
]
const proxy = {}
proxyList.forEach(({ test, target, ws, Cookie, pathRewrite }) => {
  proxy[test] = {
    target,
    changeOrigin: true, // 是否跨域
    secure: false,
    ws, // websocket支持
    headers: {
      Referer: target,
      Cookie // target登录后的cookie
    },
    pathRewrite
  }
})
module.exports = proxy
