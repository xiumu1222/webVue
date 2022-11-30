<template>
  <div class="police-management common-list-page-box">

    <div class="operation-box">
      <div class="operation-item">
        <el-button icon="h-icon-export" @click="exportHandle">导出</el-button>
      </div>
    </div>
    <div class="content-box" id="content_box">
      <el-table ref="autoTable" :data="tableData" force-scroll style="width: 100%" v-loading="loading">
        <el-table-column show-overflow-title label="序号" type="index" width="60">
        </el-table-column>
        <el-table-column show-overflow-title prop="type" label="存在问题">
          <template slot-scope="scope">
            {{scope.row.typeName}}
            <!-- {{ alarmRuleListMap[scope.row.type] &&alarmRuleListMap[scope.row.type].name }} -->
          </template>
        </el-table-column>
        <el-table-column show-overflow-title prop="rectificationInfo" label="问题描述">
        </el-table-column>
        <!-- <el-table-column show-overflow-title prop="caseType" label="案件类型">
            <template slot-scope="scope">
              {{ caseTypeMap[scope.row.caseType] }}
            </template>
          </el-table-column> -->
        <el-table-column show-overflow-title prop="violationDeptName" label="违规部门">
        </el-table-column>
        <el-table-column show-overflow-title prop="violationName" label="违规人">
        </el-table-column>
        <el-table-column show-overflow-title prop="time" label="督办时间">
          <template slot-scope="scope">
            {{ scope.row.time && $moment(scope.row.time).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-title prop="picUrl" label="问题图片数">
          <template slot-scope="scope">
            <div class="pic-num" @click="showBigPicHandle(scope.row.picUrl)" v-if="scope.row.picUrl && scope.row.picUrl.length>0">{{ scope.row.picUrl && scope.row.picUrl.length }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-title prop="dealStatus" label="督办状态">
          <template slot-scope="scope">
            <!-- {{ scope.row.dealStatus===0?'整改中':'已完成' }} -->

            <span class="blue-tag" v-if="scope.row.dealStatus === 1">已结束</span>
            <span class="red-tag" v-else-if="scope.row.dealStatus === 2">待整改</span>
            <span class="red-tag" v-else-if="scope.row.dealStatus === 0">待督办</span>
            <span class="red-tag" v-else-if="scope.row.dealStatus === 3">误判</span>
          </template>
        </el-table-column>

      </el-table>

    </div>
    <div class="footer-box">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="searchForm.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="pageTotal"></el-pagination>
    </div>
    <ImgBigPic ref="ImgBigPic"></ImgBigPic>
    
  </div>
</template>

<script>
import server from "../../../server/casePatrol";
import ImgBigPic from "../../../components/ImgBigPic/index.vue"
export default {
  name: "CasePatrol",
  data() {
    let queryParam = this.$route.query;
    // queryParam.indexCode = 'b40e6e110f4247d9a56dbbec5f41353f'
    return {
      queryParam: queryParam,
      activeName: 'casePatrol',
      isFilterBox: false,
      loading: false,
      searchForm: {

        pageNo: 1,
        pageSize: 20,
        sourceType: 'case',      //源数据类型（case-案件、policesituation-警情、place-场所）
        sourceIndexCode: queryParam.indexCode, //源数据编

      },
      pageTotal: 0,
      tableData: [],
      multipleSelection: [],
      caseStatusList: [],
      caseTypeList: [],
      caseTypeMap: {},
      caseLevelMap: {},
      accusationMap: {},
      statusMap: {},
      caseInspectProblem: [],
      timeArr: [],
      alarmRuleList:[],
      alarmRuleListMap: {}

    };
  },
  async mounted() {
    this.queryAlarmConfigDtail()
    this.searchForm = { ...this.searchForm, pageNo: 1 };
    await this.preAlarmPageQueryBySource()
  },
  methods: {
    async exportHandle() {
      let params = {
        ...this.searchForm
      }
      let res = await server.exportStatisPreAlarmByType(params, {
        responseType: 'blob'
      })
      if (res.data && res.data instanceof Blob) {
        this.onExport(res.data, res)
      } else {
        this.$messagebox(res)
      }
    },
    onExport(res, data) {
      if (!res) return
      let fileNameString = data.headers['content-disposition']
      let fileNameList =
        (fileNameString && fileNameString.split(';filename=')) || []
      let fileName =
        (fileNameList.length &&
          decodeURIComponent(decodeURIComponent(fileNameList[1]))) ||
        ''
      let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      console.log('======', fileName)
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        let fileURL = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = fileURL
        fileName && (link.download = fileName)
        //此写法兼容可火狐浏览器
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(fileURL)
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    async activated() {
      this.preAlarmPageQueryBySource()
    },
    // 列表查询
    async preAlarmPageQueryBySource() {
      let params = {
        ...this.searchForm
      }
      this.loading = true
      const result = await server.preAlarmPageQueryBySource(params);
      const { data } = result;
      if (data.code === "0") {
        let list = data.data.list
        this.tableData = list
        this.pageTotal = data.data.total;
        this.loading = false
      } else {
        this.loading = false
        this.$messagebox(result)
      }
    },
    //查询告警规则
    async queryAlarmConfigDtail() {

      let params = {
        type: "1",
        pageNo: 1,
        pageSize: 1000,
        applicableScenes: [0,1,2,3],         // 适用场景
        manualFlag: 1
        // parentIndexCode: [this.queryParam.parentIndexCode],
        // indexCodes: [this.queryParam.indexCode],
      }


      const res = await server.queryAlarmConfig(params)
      let data = res.data
      if (data.code === '0') {
        let list = data.data.list
        let alarmRuleListMap = {}
        list.forEach(item => {
          alarmRuleListMap[item.indexCode] = item
          
        });
        this.alarmRuleListMap = alarmRuleListMap
      } else {
        this.$messagebox(res)
      }

    },
    // 每页展示数量改变
    handleSizeChange(pageSize) {
      this.searchForm = { ...this.searchForm, pageSize: pageSize, pageNo: 1 };
      this.preAlarmPageQueryBySource();
    },
    // 页码改变
    handleCurrentChange(pageNo) {
      this.searchForm = { ...this.searchForm, pageNo: pageNo };
      this.preAlarmPageQueryBySource();
    },

    showBigPicHandle(picUrl){
      // let imgList = picUrl.map((imgItem)=>{
      //   return imgItem.path
      // })
      this.$refs.ImgBigPic.init(picUrl)
    },
  },
  mixins: [],
  components: {ImgBigPic}
}
</script>

<style lang="less" scoped>
.police-management {
  &.common-list-page-box {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;


    * {
      box-sizing: border-box;
    }

    .tabs-box {
      height: 48px;
      overflow: hidden;
    }

    .search-box {
      padding: 6px 0px;

      .search-item {
        display: inline-block;
        vertical-align: bottom;
        width: 244px;
        height: 72px;
        padding: 6px 12px;

        &.btn-item {
          height: auto;
          text-align: right;
        }

        .el-button {
          min-width: 78px;

          &.is-icon {
            min-width: 32px;
          }
        }

        .item-lable {
          height: 24px;
          margin-bottom: 4px;
        }

      }
    }

    .operation-box {
      padding: 6px 12px;
      height: 44px;
      position: relative;

      &::before {
        content: '';
        display: block;
        width: 100%;
        // border-top: 1px solid #e0e0e0;
        position: relative;
        top: -6px;
      }

      .operation-item {
        display: inline-block;
      }
    }

    .content-box {
      padding: 0px 12px;
      height: ~"calc(100% - 96px)";
    }

    .footer-box {
      // border-top: 1px solid rgb(224, 224, 224);
      padding: 0px 12px;
      position: relative;

      &::before {
        content: '';
        display: block;
        width: 100%;
        border-top: 1px solid #e0e0e0;
        // position: absolute;
        // top: 0px;
        // left: 0px;
      }
    }

    .table-ctrl-btn {
      color: #2080F7;
      padding-right: 8px;
      border-right: solid 1px #e5e5e5;
      margin-right: 8px;
      cursor: pointer;

      &:last-child {
        padding: none;
        margin: none;
        border: none;
      }
    }

  }

}
.pic-num {
  color: #2080F7;
  cursor: pointer;
}

.red-tag {
    display: inline-block;
    width: 56px;
    height: 20px;
    line-height: 20px;
    background: rgba(247,59,32,0.20);
    border-radius: 2px;
    font-size: 12px;
    color: #F73B20;
    text-align: center;
  }
  .blue-tag {
    display: inline-block;
    width: 56px;
    height: 20px;
    line-height: 20px;
    background: rgba(33,150,243,0.20);
    border-radius: 2px;
    font-size: 12px;
    color: #2196F3;
    text-align: center;
  }
</style>
