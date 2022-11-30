<template>
  <!--基本信息-->
  <div class="audio-video-info">
    <div class="video-type-tab-box">
      <div class="video-type-tab" :class="{ 'on': activeName === item.tag }" @click="tabClickHandle(item)"
        v-for="(item, index) in audioAndVideoDataList" :key="index">{{ item.tagName }}({{ item.fileNum || 0 }})</div>

    </div>
    <el-scrollbar wrap-class="audio-video-info-scrollbar">
      <div class="vedio-box">
        <div class="personList" v-if="(personItem.fileInfos && personItem.fileInfos.length)"
          v-for="(personItem, personIndex) in currentVideoDataList" :key="personIndex">
          <div class="personInfo" v-show="(personItem.fileInfos && personItem.fileInfos.length)">
            <span class="personType overflow" v-if="personItem.suspectName" :title="personItem.videoStartTime || ''">{{
                personItem.videoStartTime || ''
            }}</span>
            <span class="personLine" v-if="personItem.suspectName">|</span>
            <span class="personName  overflow" :title="personItem.suspectName || '视频'">
              {{ personItem.suspectName || '视频' }}
            </span>
            <span class="personLine" v-if="personItem.suspectName && personItem.count">|</span>
            <span v-if="personItem.suspectName && personItem.count" class="personType overflow"
              :title="personItem.count || ''">第 {{ personItem.count || '0' }} 次 讯（询）问</span>
          </div>
          <div class="personAudio" v-show="personItem.fileInfos && personItem.fileInfos.length">
            <div class="vedio-item" v-for="(items, indexs) in personItem.fileInfos" :key="indexs">
              <div class="vedio-top">
                <img v-if="items.thumbnaiUrl" v-lazy="items.thumbnaiUrl" alt="">
                <span v-else class="emptyImg"></span>
                <span class="vedio-btn" @click="handleOvitPlay(items)"></span>
              </div>
              <div class="vedio-label overflow" :title="items.fileName">
                {{ items.fileName }}
              </div>
            </div>
          </div>
        </div>
        <div class="no-data" v-else>暂无数据</div>
      </div>
    </el-scrollbar>
    <iframe style="width:0; height: 0" ref="HikIframeUrl" id="HikIframeUrl" src=""></iframe>
  </div>
</template>
<script>
// import server from '../../server/index'
import server from '../../../server/casehandlingarchives.js'
export default {
  name: 'AudioVideoInfo',
  data() {
    return {
      activeName: '',
      audioAndVideoDataList: [],
      audioAndVideoMap: {},
      currentVideoDataList: [],
      isEmpty: false,
      personType: {},
      personSex: {},
      inqDict: [],
      hikvideoplayer: '',
      lineNumber: 0,
      inquestIndexCode: '',
      fileCategoryMap: {
        1: {
          name: '接处警',
          icon: 'jiejinchu'
        },
        2: {
          name: '办案区',
          icon: 'bananqu'
        },
        3: {
          name: '讯（询）问',
          icon: 'shenxun'
        },
        4: {
          name: '现场勘查',
          icon: 'xianchangkancha'
        }
      }, // 文件类别;1:接处警,2:办案区,3:讯（询）问,4:现场勘查;
      bToolsSocket: null,
      ws: null,
      isInstall: false
    }
  },
  async mounted() {
    this.initWebSocket()
    this.inquestIndexCode = this.$route.query.indexCode
    // let el = document.querySelector('#audioAndVideoDataConBottom')
    // if (!el) return false
    // let _width = el.offsetWidth - 80
    // this.lineNumber = Math.floor(_width / 222)
    await this.getDict()
    await this.getTag()
    // await this.loadVideos()
    await this.onCheckOvit('HikVideoPlayer')
  },
  methods: {
    //视频类型切换
    tabClickHandle(item) {
      this.activeName = item.tag
      this.loadVideos(item.tag)
    },
    // 数据字典
    async getDict() {
      let parmas = {
        codes: 'inqfd.caseType,inqfd.inquestType,inqfd.accusation,inqfd.suspectType,common.human_certificate_type,common.human_gender'
      }
      let res = await server.getDict(parmas)
      if (res.data.code === '0') {
        let data = res.data.data
        this.inqDicts = data
        let sexData = data['common.human_gender']
        let personType = data['inqfd.suspectType']
        this.personSex = this.computedDic(sexData)
        this.personType = this.computedDic(personType)
      } else {
        this.$messagebox(res)
      }
    },
    async getTag() {
      let parmas = {
        caseCode: this.inquestIndexCode
      }

      let res = await server.loadVideosType(parmas) //
      if (res.data.code === '0') {
        let list = res.data.data
        this.audioAndVideoDataList = list
        list.forEach((val, index) => {
          this.audioAndVideoMap[val.tag] = index
        })
        this.activeName = this.audioAndVideoDataList[0].tag
        this.loadVideos(this.audioAndVideoDataList[0].tag)
      } else {
        this.$messagebox(res)
      }
    },
    // 获取案件音视频资料
    async loadVideos(typeCode) {
      let parmas = {
        caseCode: this.inquestIndexCode, //
        typeCode: typeCode
      }
      let loadingInstance = this.$loading({ fullscreen: true })
      let res = await server.loadVideos(parmas) //
      loadingInstance.close()
      if (res.data.code === '0') {
        let index = this.audioAndVideoMap[typeCode]
        let list = res.data.data
        this.currentVideoDataList = list
        this.audioAndVideoDataList[index].dataList = list
      } else {
        this.$messagebox(res)
      }
    },
    computedDic(list) {
      let dicMap = {}
      if (list && list.length) {
        for (let i = 0; i < list.length; i++) {
          dicMap[list[i].key] = list[i].name
        }
      }
      return dicMap
    },

    computedCollapsebox(item) {
      if (item.tag === this.activeName) {
      } else {
        return 'height:0;'
      }
    },
    // 调用视侦通工具播放
    handleOvitPlay(item) {
      let url1 = item.downloadUrl
      // 'http://10.192.71.58:6201/pbgtest/cfe99879f30b436f9a0aa1c0e88fce11?filename=VGA+IN+CVR+2019%2F08%2F06+13%3A41.mp4&token=aGlrY3N0b3IgSElLMmJrMmE1WDJNenYyeU4wcFNXMjk5NnhHNXM5VzI6WGY3SHdNcXZjdGNLcTBiemN6eFJGTkFTSGo4PQ=='
      let urlList = url1.split('\/')
      let pramsUrl = `${urlList[0]}//${urlList[2]}`
      let streamurl = url1.slice(pramsUrl.length)
      // let _index = item.fileName.lastIndexOf('.MP4')
      let _fileName = item.fileName.replace(/\s+/g, '')
      let videCover = `hikvideoplayer://${pramsUrl}/playvideo?name=${_fileName}&streamurl='${streamurl}'`// res.data.data
      if (item.videoIndexKey) {
        let url2 = item.videoIndexUrl
        let idxdownurl = url2.slice(pramsUrl.length)
        videCover = `${videCover}&protocol=http&idxdownurl='${idxdownurl}'`
      }
      console.log(videCover)
      if (videCover) {
        if (this.isInstall) {
          let dom = document.getElementById('HikIframeUrl') // this.$refs.HikIframeUrl
          try {
            dom.src = videCover
          } catch {

          }
        } else {
          this.$message.error('系统检测到未安装视侦通,请前往首页下载安装!')
        }
      }
    },
    // 验证是否安装
    onCheckOvit(exe) {
      let progid = 'HikToolCheckActivex.IHikCheckToolActi.1'
      try {
        let HikToolCheckOCX = new window.ActiveXObject(progid)
        this.isInstall = Number(HikToolCheckOCX.CheckToolStatus(exe)) === 1 || false
      } catch {
        try {
          this.ws = new WebSocket('wss://127.0.0.1:18001/WebS_Js')
          this.ws.onopen = () => {
            if (this.ws.readyState === 1 || this.ws.readyState === '1') {
              this.ws.send('{"comment":{"commenttype":"checkapp", "context":"HikVideoPlayer"}}')
            }
          }
          this.ws.onerror = (evt) => {
            this.isInstall = false
          }
          this.ws.onmessage = (evt) => {
            var dataObj = JSON.parse(evt.data)
            if (dataObj.comment.resultCode === '1') {
              this.isInstall = true
            } else {
              this.isInstall = false
            }
          }
          this.ws.onclose = () => {
            this.ws = null
          }
        } catch (e) {
          this.isInstall = false
          if (e.message === 'SecurityError') {
            this.$message('连接失败，请刷新页面')
          }
        }
      }
    },
    initWebSocket() {
      // noteFormatClientprotocol
      // let _self = this
      let socketHost =
        window.location.protocol.indexOf('https') > -1
          ? 'wss://127.0.0.1:18001/WebS_Js'
          : 'ws://127.0.0.1:18000/WebS_Js'
      try {
        if (!this.bToolsSocket) {
          this.bToolsSocket = new WebSocket(socketHost)
        }

        this.bToolsSocket.onopen = () => {
          // 发送检测插件助手是否安装请求
          let jsonObj =
            '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'

          this.bToolsSocket.send(jsonObj)
        }
        this.bToolsSocket.onerror = () => {
          // 连接失败，通信中间件未安装
          this.$message('检测到您未安装插件助手')
        }
        this.bToolsSocket.onmessage = (data) => {
          let _data = JSON.parse(data.data)
          if (
            _data &&
            _data.comment &&
            _data.comment.commenttype === 'checkapp'
          ) {
            // 检测插件助手是否安装
            if (_data.comment.resultCode === '1') {
              // let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolcasefileupload", "commentcmd":"btoolcasefileupload://CenterUrl:${_self.$centerUrl};Toollist:PROT_btoolercprotocol;CmdLine:btoolercprotocol://nginxIP:${_self.$centerUrl};nginxport:${_self.$centerUrl};context:${_self.$centerUrl};sg:${_self.$centerUrl};protocol:${_self.$centerUrl};componentID:${_self.$centerUrl};servicetype:${_self.$centerUrl};context:${_self.$centerUrl};businessInfo:${_self.$centerUrl};language:${_self.$centerUrl};"}}`
              // _self.bToolsSocket.send(jsonObj)
            } else {
              this.$message('检测到您未安装插件助手')
            }
          }
          if (_data &&
            _data.comment &&
            _data.comment.context === 'btoolcasefileupload'
          ) {
            if (_data.comment.resultCode === '1') {

            } else {
              this.$message('拉起上传器失败')
            }
          }
        }
        this.bToolsSocket.onclose = () => {
          this.bToolsSocket = null
        }
      } catch (err) {
        console.log(err)
        if (err.message === 'SecurityError') {
          this.$message('连接失败，请刷新页面')
        }
      }
    },
  },
  destroyed() {
    this.bToolsSocket && this.bToolsSocket.close()
    this.ws && this.ws.close()
  },
  components: {}
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.audio-video-info {
  width: 100%;
  // max-height: 500px;

  .video-type-tab {
    display: inline-block;
    padding: 6px 10px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-right: none;
    margin-left: -1px;
    position: relative;
    text-align: center;

    &:last-child {
      border-right: 1px solid rgba(0, 0, 0, 0.3);
    }

    &.on {
      border: 1px solid #2080F7;
      color: #2080F7;
      z-index: 1;
    }

  }

  .vedio-box {
    padding-top: 16px;

    .personList {
      // display: inline-block;
      vertical-align: top;
      margin-right: 20px;

      // width: 200px;
      >.personInfo {
        box-sizing: border-box;
        // width: 100%;
        // white-space: nowrap;
        // overflow: hidden;

        >span {
          font-size: 14px;
          height: 16px;
          line-height: 16px;
          // color: #4d4d4d;
          font-weight: bold;
          display: inline-block;
          vertical-align: top;

          &.personName {
            max-width: 160px;
          }

          &.personLine {
            width: 32px;
            text-align: center;
            color: #ccc;
            // font-size: 16px;
          }

          &.personType {
            max-width: 120px;
          }
        }
      }

      >.personAudio {
        height: auto;
        padding-bottom: 16px;
      }
    }

    .vedio-item {
      display: inline-block;
      width: 200px;
      height: 149px;
      // padding: 3px;
      box-sizing: border-box;
      margin: 11px 22px 11px 0;
      border-radius: 4px;

      .vedio-top {
        width: 100%;
        height: 111px;
        background: #f5f5f5;
        position: relative;
        border: 1px solid #e5e5e5;
        border-bottom: none;
        box-sizing: border-box;

        // margin-bottom: 4px;
        >img {
          width: 100%;
          height: 100%;
        }

        >img[lazy="error"] {
          width: 100%;
          height: 100%;
          background: url(../../../assets/image/default_no_video.png) no-repeat;
          background-size: 100% 100%;
        }

        >.emptyImg {
          width: 48px;
          height: 48px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: url(../../../assets/image/default_no_video.png) no-repeat;
          background-size: 100% 100%;
        }

        .vedio-btn {
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: none;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: url(../../../assets/image/audio_play_icons.png) no-repeat;
          background-position-y: -40px;
          z-index: 2;
        }
      }

      .vedio-top:hover {
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background-color: rgba(0, 0, 0, 0.4);
          z-index: 1;
        }

        .vedio-btn {
          display: block;
        }
      }

      .vedio-label {
        width: 100%;
        height: 36px;
        padding: 0 12px;
        box-sizing: border-box;
        line-height: 36px;
        font-size: 12px;
        word-break: break-all;
        overflow: hidden;
        color: #4d4d4d;
        border: 1px solid #e5e5e5;
        border-top: none;
      }
    }

    .vedio-item:hover {
      box-shadow: 0px 0px 16px #e5e5e5;

      .vedio-top {
        border: 1px solid #f5f5f5;
        border-bottom: none;
      }

      .vedio-label {
        border: 1px solid #ffffff;
        border-top: none;
      }
    }
  }

  .no-data {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            color: #999;
        }
}

/deep/.audio-video-info-scrollbar {
  height: 300px;
  overflow-x: hidden;
  padding-right: 10px;
}
</style>
