<template>
  <el-scrollbar v-loading="loadingInstance" wrap-class="case-handling-process-scroll" ref="scrollbar">
    <div id="areaInfosAcquisition" class="areaInfosAcquisition">
      <div class="areaInfosAcquisitionTableBox">
        <div class="areaInfosAcquisitionTitle">
          <i></i>
          <span>信息采集记录</span>
        </div>
        <div class="tableContent">
          <ul class="areaInfosAcquisitionTable clearfix">
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  信息采集
                </div>
                <!-- doCollected  doCollected -->
                <div class="tableItemCon" v-if="currentPerson.doCollected == 1">
                  是
                </div>
                <div class="tableItemCon" v-else-if="currentPerson.doCollected == 0">
                  否
                </div>
                <div class="tableItemCon" v-else>
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  采集项目
                </div>
                <div class="tableItemCon" :title="computedCollectedItems(currentPerson.collectedItems)">
                  {{ computedCollectedItems(currentPerson.collectedItems) }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  信息入库
                </div>
                <div class="tableItemCon" v-if="currentPerson.doStoraged == 1">
                  是
                </div>
                <div class="tableItemCon" v-else-if="currentPerson.doStoraged == 0">
                  否
                </div>
                <div class="tableItemCon" v-else>
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  核查比对
                </div>
                <div class="tableItemCon" v-if="currentPerson.doCompared == 1">
                  是
                </div>
                <div class="tableItemCon" v-else-if="currentPerson.doCompared == 0">
                  否
                </div>
                <div class="tableItemCon" v-else>
                </div>
              </li>
            </el-col>
            <!-- <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  办案区
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.areaName || ''">
                  {{ currentPerson.areaName || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  办案部门
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.deptName || ''">
                  {{ currentPerson.deptName || '' }}
                </div>
              </li>
            </el-col> -->
            <!-- <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  开始时间
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.collectedBeginTime ? $moment(currentPerson.collectedBeginTime).format('YYYY-MM-DD HH:mm:ss'):''">
                  {{ currentPerson.collectedBeginTime ? $moment(currentPerson.collectedBeginTime).format('YYYY-MM-DD HH:mm:ss'):'' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  结束时间
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.collectedEndTime ? $moment(currentPerson.collectedEndTime).format('YYYY-MM-DD HH:mm:ss'):''">
                  {{ currentPerson.collectedEndTime ? $moment(currentPerson.collectedEndTime).format('YYYY-MM-DD HH:mm:ss'):'' }}
                </div>
              </li>
            </el-col> -->
            <el-col :span="24">
              <li class="tableItem">
                <div class="tableItemLabel">
                  登记人
                </div>
                <div class="tableItemCon" :title="currentPerson.registrantName||''">
                  {{ currentPerson.registrantName || '' }}
                </div>
              </li>
            </el-col>
          </ul>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import server from '../../../server/ledgerManage'
export default {
  name: 'areaInfosAcquisition',
  props: {
    currentRegisterId: {
      type: String,
      default: ''
    },
    inqDictList: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      currentPerson: {
        registerName: '',
        registerSex: 1,
        registerAge: null,
        idcardType: '',
        idcardNo: '',
        registerAddr: '',
        registerPhoto: '',
        registerPhoto2: '',
        telPhone: '',
        address: ''
      },
      loadingInstance: false,
      collectItemMap: {}
    }
  },
  methods: {
    async findCollectedInfo() {
      this.loadingInstance = true
      try {
        let params = {
          registerIndexCode: this.currentRegisterId
        }
        let res = await server.findCollectedInfo(params)
        this.loadingInstance = false
        if (res.data.code === '0') {
          let data = res.data.data
          this.currentPerson = data || {}

        } else {
          this.$messagebox(res)
        }
      } catch {
        this.loadingInstance = false
      }
    },
    computedCollectedItems(list) {
      if (list) {
        let array = list//string.split(',')
        let _array = []
        for (let i = 0; i < array.length; i++) {
          _array.push(this.collectItemMap[array[i]])
        }
        return _array.join('，')
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
    }
  },
  watch: {
    inqDictList: {
      handler: function (newV, oldV) {
        if (this.inqDictList) {
          this.collectItemMap = this.computedDic(
            this.inqDictList['inqfd.collectItem']
          )
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    if (this.inqDictList) {
      this.collectItemMap = this.computedDic(
        this.inqDictList['inqfd.collectItem']
      )
    }
  },
  mounted() {
    this.findCollectedInfo()
  }
}
</script>

<style lang="less" rel="stylesheet/less">
.areaInfosAcquisition {
  width: 100%;
  height: 100%;

  .areaInfosAcquisitionTableBox {
    width: 100%;
    // padding: 40px;
    // margin: 40px auto;
    // box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
    background: #fff;
    height: auto;
    box-sizing: border-box;

    .areaInfosAcquisitionTitle {
      height: 40px;
      padding-bottom: 16px;
      box-sizing: border-box;

      >i {
        background: #2080f7;
        display: inline-block;
        width: 4px;
        height: 12px;
        margin-top: 4px;
      }

      >span {
        display: inline-block;
        height: 20px;
        font-family: PingFangSC-Regular;
        margin-left: 16px;
        font-size: 14px;
        color: #4d4d4d;
        letter-spacing: 0;
        line-height: 20px;
      }
    }
  }

  .tableContent {
    width: 100%;
    border: 1px solid #ddd;
    border-right: 1px solid #fff;
    border-bottom: 1px solid #fff;
  }

  .areaInfosAcquisitionTable {
    width: 100%;

    .el-col {
      height: 38px;
      padding-left: 0px !important;
      padding-right: 0px !important;

      .tableItem {
        width: 100%;
        height: 38px;
        border-bottom: 1px solid #ddd;

        .tableItemLabel {
          width: 120px;
          position: relative;
          text-indent: 14px;
          font-family: PingFangSC-Semibold;
          font-size: 14px;
          color: #999999;
        }

        .tableItemLabel::before {
          content: "";
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.3;
          top: 0;
          left: 0;
          z-index: 1;
          background: #f2f2f2;
        }

        .tableItemCon {
          width: ~"calc(100% - 120px)";
          text-align: left;
          text-indent: 14px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #4d4d4d;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        >div {
          height: 38px;
          float: left;
          line-height: 38px;
          text-align: center;
          border-right: 1px solid #ddd;
        }
      }
    }
  }
}
</style>
