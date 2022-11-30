// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'eventsource-polyfill'
// import 'babel-polyfill'

import '@/assets/css/reset.css';
import '@/assets/fonts/font.css';
import 'babel-polyfill';
import 'eventsource-polyfill';
import HUI from 'hui';
import 'hui/lib/theme-default/index.css';
import moment from 'moment';
import Vue from 'vue';
import i18n from '../i18n/lang';
import axios from '../server/axios/index';
import withAxios from '../server/axios/withAxios';

let language = 'zh_CN'
const serverConfig = {
  'multiLanguage': {
    url: '/multiLanguage.do',
    method: 'get'
  },
  'csrfToken': {
    url: '/ui/common/csrfToken.do',
    method: 'get'
  },
  'currLanguage': {
    url: '/currLanguage.do',
    method: 'get'
  },
  // 查询centerurl
  'findNginxInfoVo': {
    url: '/common/findNginxInfoVo.do',
    method: 'get'
  }
}
const multiLanguage = async (serverConfig, callback) => {
  const {data} = await withAxios(serverConfig).multiLanguage({multiLanguage: language})
  if (data.code === '0') {
    i18n.mergeLocaleMessage(language, data.data.data)
    i18n.locale = language
  }
  // const {data: nginxInfo} = await withAxios(serverConfig).findNginxInfoVo({})
  // if (nginxInfo.code === '0') {
  //   Vue.prototype.$centerUrl = `${nginxInfo.data.protocolType}://${nginxInfo.data.nginxIp}:${nginxInfo.data.nginxPort}/portal/`
  // }
  callback()
}

const getToken = async (serverConfig, callback) => {
  const {data} = await withAxios(serverConfig).csrfToken({})
  if (data.code === '0') {
    axios.defaults.headers.post['X-CSRF-TOKEN'] = data.data && data.data.token
    currLanguage(serverConfig, callback)
  } else {
    currLanguage(serverConfig, callback)
  }
}

const currLanguage = async (serverConfig, callback) => {
  const {data} = await withAxios(serverConfig).currLanguage({})
  if (data.code === '0') {
    language = data.data
    // language = `zh_CN`
  }
  multiLanguage(serverConfig, callback)
}

export const initTokenAndLanguage = (callback) => {
  getToken(serverConfig, callback)
}
export const Bus = new Vue()

Vue.use(HUI)
Vue.config.productionTip = false
Vue.prototype.$moment = moment
Vue.prototype.$dateDiff = (startTime, endTime) => {
  let _startTime = new Date(startTime).getTime()
  let _endTime = endTime ? new Date(endTime).getTime() : new Date().getTime()
  let HH = Math.floor((_endTime - _startTime) / 1000 / 60 / 60)
  let mm = Math.floor((_endTime - _startTime) / 1000 / 60 % 60)
  return `${HH}时${mm}分`
}
Vue.prototype.$duration = (startTime, endTime) => {
  let _startTime = new Date(startTime).getTime()
  let _endTime = endTime ? new Date(endTime).getTime() : new Date().getTime()
  let formatTime = _endTime - _startTime
  let time = '0分'
  let min = 0
  let hour = 0
  if (formatTime > 0) {
    let _time = formatTime / 1000
    if (parseInt(_time) > 60) {
      min = parseInt(_time / 60)
      time = min + '分'
      if (min > 60) {
        min = parseInt(_time / 60) % 60
        hour = parseInt(parseInt(_time / 60) / 60)
        time = hour + '小时' + min + '分'
      }
    }
  }
  return time
}
Vue.prototype.$strlen = (str) => {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
      len += 2
    } else {
      len++
    }
  }
  return len
}
Vue.prototype.$substring = (str, num) => {
  let len = 0
  let resStr = ''
  for (let i = 0; i < str.length; i++) {
    (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) ? len += 2 : len++
    if (len >= num) {
      resStr = str.substring(0, i) + '...'
      break
    }
  }
  resStr = resStr || str
  return resStr
}
let portalConfigCrumbs = window.localStorage.getItem('portal_config_crumbs')
Vue.prototype.$breadcrumb = portalConfigCrumbs ? portalConfigCrumbs.split('/') : []
