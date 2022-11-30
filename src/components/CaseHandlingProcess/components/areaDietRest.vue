<template>
  <el-scrollbar v-loading="loadingInstance" wrap-class="case-handling-process-scroll" ref="scrollbar">
    <div id="areaDietRest" class="areaDietRest" v-loading="loadingInstance">
      <div class="areaGoodsOfPersonBox" ref="areaGoodsOfPersonBox">
        <div class="areaGoodsOfPersonTitle">
          <i></i>
          <span>饮食休息记录</span>
        </div>
        <div class="info-form-box">
          <div class="info-row">
            <div class="info-col col-2">
              <div class="info-label">类型</div>
              <div class="info-value">{{restInfo.type && inqRestMap[restInfo.type]}}</div>
            </div>
            <div class="info-col col-2">
              <div class="info-label">房间名称</div>
              <div class="info-value">{{restInfo.roomName}}</div>
            </div>
          </div>
          <div class="info-row">
            <div class="info-col col-2">
              <div class="info-label">开始时间</div>
              <div class="info-value">
                {{restInfo.beginTime && $moment(restInfo.beginTime).format('YYYY-MM-DD HH:mm:ss')}}
              </div>
            </div>
            <div class="info-col col-2">
              <div class="info-label">结束时间</div>
              <div class="info-value">
                {{restInfo.endTime && $moment(restInfo.endTime).format('YYYY-MM-DD HH:mm:ss')}}
              </div>
            </div>
          </div>
          <div class="info-row">
            <div class="info-col col-1">
              <div class="info-label">看管员姓名</div>
              <div class="info-value">
                {{restInfo.managerName}}
              </div>
            </div>
          </div>
          <div class="info-row">
            <div class="info-col col-1">
              <div class="info-label">备注</div>
              <div class="info-value">{{restInfo.remark}}</div>
            </div>
          </div>
          <div class="info-row">
            <div class="info-col col-2 H80">
              <div class="info-label">办案民警签名</div>
              <div class="info-value">
                <div class="sign-item">
                  <img v-if="restInfo.policeSign" :src="restInfo.policeSignUrl" alt="" srcset="" />

                </div>
              </div>
            </div>
            <div class="info-col col-2 H80">
              <div class="info-label">看管民警签名</div>
              <div class="info-value">
                <div class="sign-item">
                  <img v-if="restInfo.managerSign" :src="restInfo.managerSignUrl" alt="" srcset="" />

                </div>
              </div>
            </div>
          </div>
          

        </div>
        <!-- <div class="table-container">
          <el-table :data="tableData" stripe tooltip-effect="dark" style="width: 100%" force-scroll>
            <el-table-column label="序号" type="index" width="60"></el-table-column>
            <el-table-column label="类型" show-overflow-title prop="type">
              <template slot-scope="scope">
                {{scope.row.type && inqRestMap[scope.row.type]}}
              </template>
              
            </el-table-column>
            <el-table-column label="房间名称" show-overflow-title prop="roomName"></el-table-column>
            <el-table-column label="开始时间" show-overflow-title prop="beginTime">
              <template slot-scope="scope">
                {{scope.row.beginTime && $moment(scope.row.beginTime).format('YYYY-MM-DD HH:mm:ss')}}
              </template>
            </el-table-column>
            <el-table-column label="结束时间" show-overflow-title prop="endTime">
              <template slot-scope="scope">
                {{scope.row.endTime && $moment(scope.row.endTime).format('YYYY-MM-DD HH:mm:ss')}}
              </template>
            </el-table-column>
            <el-table-column label="备注" show-overflow-title prop="remark"></el-table-column>
            <el-table-column label="办案民警签名" show-overflow-title prop="policeSignUrl" width="120">
              <template slot-scope="scope">
                <div class="sign-item">
                  <img :src="scope.row.policeSignUrl" alt="" srcset="" />

                </div>
                
              </template>
            </el-table-column>
            <el-table-column label="看管民警签名" show-overflow-title prop="managerSignUrl" width="120">
              <template slot-scope="scope">
                <div class="sign-item">
                  <img :src="scope.row.managerSignUrl" alt="" srcset="" />

                </div>
                
              </template>
            </el-table-column>
          </el-table>
        </div> -->
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import server from '../../../server/ledgerManage'
// import ShowPhoto from '../../../components/ShowPhoto/index'
export default {
  name: 'areaDietRest',
  props: {
    currentRegisterId: {
      type: String,
      default: '',
    },
    currentIndexCode: {
      type: String,
      default: '',
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
      dialogVisible: false,
      imgUrl: '',
      dialogVisibleTitle: '',
      tableData: [],
      goodsManagerInfo: {},
      loadingInstance: false,
      inqRestMap: {},
      restInfo: {}
    }
  },
  mixins: [],
  methods: {
    async findRestInfo() {
      // console.log(this.inqDictList)
      let params = {
        // registerIndexCode: this.currentRegisterId,
        indexCode: this.currentIndexCode
      }
      let res = await server.findRestInfo(params)
      if (res.data.code === '0') {
        // let data = res.data.data
        // this.tableData = data
        this.restInfo = res.data.data || {}

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
  },
  watch: {
    inqDictList: {
      handler: function (newV, oldV) {
        if (this.inqDictList) {
          this.inqRestMap = this.computedDic(this.inqDictList['inqfd.casehandlingmgt.rest.type'])
        }
      },
      immediate: true,
      deep: true,
    },
    currentIndexCode(indexCode) {
      console.log(indexCode)
      this.findRestInfo()

    },
  },
  created() {
    this.findRestInfo()
  },
  components: {
    // ShowPhoto,
  },
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.areaDietRest {
  width: 100%;
  height: 100%;
  // padding: 32px;
  background: #fff;
  box-sizing: border-box;
  position: relative;

  .areaGoodsOfPersonBox {
    width: 100%;
    // padding: 40px;
    margin: 0px auto;
    // box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
    height: 100%;
    position: relative;
    // padding-bottom: 240px;
    box-sizing: border-box;

    .areaGoodsOfPersonTitle {
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

  .table-container {
    width: 100%;
    border-left: 1px solid #e5e5e5;
    border-right: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    box-sizing: border-box;
    height: 500px;

    .returnStatusColor {
      width: 8px;
      height: 8px;
      display: inline-block;
      border-radius: 4px;
      margin-right: 4px;
    }

    .operationBtn {
      display: inline-block;
      // padding: 0 8px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #2080f7;
      letter-spacing: 0;
      line-height: 20px;
      cursor: pointer;

      .canDelete {
        display: none;
      }
    }
  }

  .table-info {
    position: relative;
    height: 200px;
    width: 100%;
    box-sizing: border-box;
    border-left: 1px solid #ddd;

    .el-col {
      height: 38px !important;
      padding-left: 0px !important;
      padding-right: 0px !important;
    }

    .tableItem {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-bottom: 1px solid #ddd;
      list-style: none;

      .tableItemLabel {
        width: 120px;
        position: relative;
        text-indent: 14px;
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        color: #999999;
      }

      .tableItemLabel::before {
        content: '';
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
        width: ~'calc(100% - 120px)';
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
        height: 100%;
        float: left;
        line-height: 38px;
        text-align: center;
        border-right: 1px solid #ddd;
      }
    }

    .el-col:nth-last-of-type(1),
    .el-col:nth-last-of-type(2),
    .el-col:nth-last-of-type(3) {
      height: 80px !important;

      .tableItemLabel {
        line-height: 80px;
      }

      .signContent {
        width: 120px;
        height: 80px;
        padding: 4px;
        box-sizing: border-box;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .sign-item {
    display: inline-block;
    position: relative;
    top: 4px;
    width: 150px;
    height: 72px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABaCAIAAACwpMoFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYzRDBCN0JBMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYzRDBCN0JCMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjNEMEI3QjgwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjNEMEI3QjkwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4bhszUAAAJtElEQVR42uyd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);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    // padding: 5px;

    >img {
      width: 100%;
      height: 100%;
    }
  }


  .info-form-box {
    border-bottom: 1px solid #E5E5E5;
    border-right: 1px solid #E5E5E5;

    .info-row {}

    .info-col {
      display: inline-block;
      vertical-align: top;
      border-top: 1px solid #E5E5E5;
      border-left: 1px solid #E5E5E5;
      white-space: nowrap;

      &.col-4 {
        width: 25%;
      }

      &.col-1 {
        width: 100%;
      }

      &.col-2 {
        width: 50%;
      }

      &.col-3 {
        width: 33.3%;
      }

      &.H80 {
        .info-label {
        height: 80px;
        line-height: 80px;

      }

      .info-value {
        height: 80px;
        line-height: 80px;
      }
      }

      .info-label {
        display: inline-block;
        vertical-align: top;
        height: 40px;
        width: 110px;
        line-height: 40px;
        padding-left: 16px;
        background: #FAFAFA;
        border-right: 1px solid #E5E5E5;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.30);

      }

      .info-value {
        display: inline-block;
        vertical-align: top;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.70);
        padding-left: 16px;
        width: ~'calc(100% - 110px)';
        white-space: nowrap;
      }
    }

  }
}
</style>
