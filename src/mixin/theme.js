const ORIGINAL_THEME = '#' + process.env.THEME
export default {
  data () {
    return {
      theme: ORIGINAL_THEME,
      themeStore: {}
    }
  },
  created () {
    let _ORIGINAL_THEME = window.localStorage.getItem('ORIGINAL_THEME')
    if (_ORIGINAL_THEME !== ORIGINAL_THEME) {
      window.localStorage.setItem('ORIGINAL_THEME', ORIGINAL_THEME)
      window.localStorage.removeItem('themeColor')
    }
    const links = [].slice.call(document.querySelectorAll('link[rel="stylesheet"]'))
    const getHandler = () => {
      return (newStyle) => {
        const styleTag = document.createElement('style')
        document.head.appendChild(styleTag)
        styleTag.innerText = newStyle
      }
    }
    const promiseList = links.map(({href}) => {
      return this.getLink(href, getHandler())
    })
    if (promiseList.length > 0) {
      Promise.all(promiseList).then(() => {
        let themeColor = window.localStorage.getItem('themeColor')
        this.theme = themeColor || ORIGINAL_THEME
      })
    } else {
      let themeColor = window.localStorage.getItem('themeColor')
      this.theme = themeColor || ORIGINAL_THEME
    }
  },
  watch: {
    theme (val, oldVal) {
      if (typeof val !== 'string') return
      window.localStorage.setItem('themeColor', val)
      const themeCluster = val.replace('#', '')
      const originalCluster = oldVal.replace('#', '')
      const styles = [].slice.call(document.querySelectorAll('style'))
      // .filter(style => {
      //   const text = style.innerText
      //   return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
      // })
      styles.forEach(style => {
        const {innerText} = style
        if (typeof innerText !== 'string' || innerText === '') return
        style.innerText = this.updateStyle(innerText, originalCluster, themeCluster)
      })
    }
  },
  methods: {
    async getLink (url, callback) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText.replace(/@font-face{[^}]+}/g, ''))
            resolve()
          }
        }
        xhr.open('GET', url)
        xhr.send()
      })
    },
    getThemeCluster (theme) {
      const tintColor = (color, tint, type) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        if (tint === 0) { // when primary color is in its rgb space
          return [red, green, blue].join(',')
        } else {
          if (type === 'lighten') {
            let _red = Math.round(tint * (255 - red))
            let _green = Math.round(tint * (255 - green))
            let _blue = Math.round(tint * (255 - blue))
            red += _red
            green += _green
            blue += _blue
          } else if (type === 'darken-floor' || type === 'darken-ceil') {
            let _red = Math.round(tint * red)
            let _green = Math.round(tint * green)
            // 加深时计算有一个像素偏差，对最后一个数进行处理：floor（下舍入）  ceil（上舍入）
            let _blue = type === 'darken-floor' ? Math.floor(tint * blue) : Math.ceil(tint * blue)
            red -= _red
            green -= _green
            blue -= _blue
          }

          red = red.toString(16)
          if (red.length === 1) red = '0' + red

          green = green.toString(16)
          if (green.length === 1) green = '0' + green

          blue = blue.toString(16)
          if (blue.length === 1) blue = '0' + blue

          return `#${red}${green}${blue}`
        }
      }

      const clusters = [theme]
      // 浅色
      for (let i = 0; i <= 12; i++) {
        if (i <= 8) {
          clusters.push(tintColor(theme, Number((i / 10).toFixed(2)), 'lighten'))
        } else {
          let ii = 8 + (i - 8) * 0.4
          clusters.push(tintColor(theme, Number((ii / 10).toFixed(2)), 'lighten'))
        }
      }
      // 深色：加深时计算有一个像素偏差，对最后一个数进行处理：floor（下舍入）  ceil（上舍入）
      clusters.push(tintColor(theme, Number((1 / 10).toFixed(2)), 'darken-floor'))
      clusters.push(tintColor(theme, Number((1 / 10).toFixed(2)), 'darken-ceil'))
      return clusters
    },
    updateStyle (style, oldCluster, newCluster) {
      let newStyle = style
      const oldClusterList = this.getThemeCluster(oldCluster)
      const newClusterList = this.getThemeCluster(newCluster)
      oldClusterList.forEach((color, index) => {
        if (newClusterList[index] === color) return
        newStyle = newStyle.replace(new RegExp(color, 'ig'), newClusterList[index])
      })
      return newStyle
    }
  }
}
