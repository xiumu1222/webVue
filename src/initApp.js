import axios from 'axios'
import moment from 'moment'
import server from './server/axios/index'
import '@/assets/fonts/font.css'
import '@/assets/css/reset.css'
import './views/common.less'
import withAxios from './server/axios/withAxios'

import {
  errorLoadPage,
  renderThemeFromCssUrl
} from 'dolphin-plugin-tools'

import ErrorPage from '@/components/ErrorPage'

import i18n from './i18n/index'
import 'hui/lib/hui.css'
import huiLocale from 'hui/lib/locale'
import huiProLocale from '@hui-pro/locale'
import { getToken, setLanguage as setLanguageInternal } from './util'

import page from '@hui-pro/page'
import '@hui-pro/page/theme/index.scss'

import Watermark from '@hui-pro/watermark'
import '@hui-pro/watermark/theme/index.scss'

import watermarkContent from '@/components/watermarkContent'

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
  },
  'getWatermark': {
    url: '/ui/common/getWatermark.do',
    method: 'get'
  }
}

let assetsUrl = process.env.BASE_URL + process.env.VUE_APP_ASSETS

async function initApp (Vue, App, router, a) {
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
  try {
    let { token, skin = {}, LanguageData } = await getToken()
    if (!skin.webSkin) skin.webSkin = 'blue'
    server.defaults.headers.post['X-CSRF-TOKEN'] = token.token
    // 设置主题,多语言
    await Promise.all([renderTheme({ skin }), setLanguage({ LanguageData })])
    // ================common变量=========================

    Vue.prototype.$watermarkContent = {
      userMark: '',
      ipMark: ''
    }
    const getWatermark = async () => {
      const { data } = await withAxios(serverConfig).getWatermark()
      if (data.code === '0') {
        Vue.prototype.$watermarkContent = data.data || {
          userMark: '',
          ipMark: ''
        }
      }
    }
    await getWatermark()

    
    //= ===================================================
    Vue.use(page)
    Vue.use(Watermark)
    Vue.use(watermarkContent)
    Vue.component(watermarkContent.name, watermarkContent)
    // 初始化vue实例
    return new Vue({
      router,
      i18n,
      render: h => h(App, { ref: 'app' })
    }).$mount('#app')
  } catch (error) {
    console.log(error)
    // 错误处理
    await renderTheme({ skin: 'redblack' })

    // 真实环境需注释
    return new Vue({
      router,
      i18n,
      render: h => h(App, { ref: 'app' })
    }).$mount('#app')

    errorLoadPage(Vue, ErrorPage)
  }
}

async function renderTheme ({ skin }) {
  try {
    // public/static/skin/xxx/skin.css
    // const requestUrl = `${assetsUrl}/skin/${skin.webSkin}/skin.css`
    const requestUrl = `${assetsUrl}/skin/blue/skin.css`
    await renderThemeFromCssUrl(requestUrl)
  } catch (error) {
    // 设置自定义皮肤失败, 但是由于默认皮肤的存在, 可以继续初始化Vue实例
    console.error('设置自定义皮肤失败')
    throw error
  }
}

async function setLanguage ({ LanguageData, portalLanguageJson }) {
  // public/static/i18n/xxx/index.json
  let langStr = LanguageData.multiLanguage
  let _language = 'zh-CN'
  if (langStr.indexOf('_') == -1) {
    _language = langStr
  } else {
    _language = langStr.split('_').join('-')
  }
  const requestUrl = `${assetsUrl}/i18n/${_language}/index.json`
  const { data: i18nJson } = await axios.get(requestUrl)
  const locale = Object.assign({}, i18nJson, portalLanguageJson, LanguageData.data)
  await setLanguageInternal(locale, LanguageData.multiLanguage, [huiLocale, huiProLocale], i18n)
}

export default initApp
