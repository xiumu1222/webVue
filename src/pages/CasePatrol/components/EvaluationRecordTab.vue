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
        <el-table-column show-overflow-title prop="evaluateConfigName" label="考评规则">
        </el-table-column>
        <el-table-column show-overflow-title prop="evaluateTitle" label="考评标题">
        </el-table-column>
        <!-- <el-table-column show-overflow-title prop="caseType" label="案件类型">
            <template slot-scope="scope">
              {{ caseTypeMap[scope.row.caseType] }}
            </template>
          </el-table-column> -->
        <el-table-column show-overflow-title prop="deductionValue" label="扣分值">
        </el-table-column>
        <el-table-column show-overflow-title prop="evaluateDetail" label="问题描述">
        </el-table-column>
        <el-table-column show-overflow-title prop="deptName" label="责任单位">
        </el-table-column>
        <el-table-column show-overflow-title prop="personName" label="责任人">
        </el-table-column>
        <el-table-column show-overflow-title prop="createTime" label="考评时间">
          <template slot-scope="scope">
            {{ scope.row.createTime && $moment(scope.row.createTime).format('YYYY-MM-DD HHmm:ss') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-title prop="attachmentInfoList" label="问题图片">
          <template slot-scope="scope">
            <div class="pic-num" @click="showBigPicHandle(scope.row.attachmentInfoList)" v-if="scope.row.attachmentInfoList && scope.row.attachmentInfoList.length>0">{{ scope.row.attachmentInfoList && scope.row.attachmentInfoList.length }}</div>
            <div v-else>--</div>
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

    };
  },
  async mounted() {
    this.searchForm = { ...this.searchForm, pageNo: 1 };
    await this.evaluatePageQuery()
  },
  methods: {
    async exportHandle() {
      let params = {
        ...this.searchForm
      }
      let res = await server.exportEvaluateInfo(params, {
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
      await this.lastestParams ? this.policeSituationPge(this.lastestParams) : this.policeSituationPge()
    },
    // 查询按钮点击回调
    searchHandle() {
      this.searchForm.pageNo = 1;
      this.evaluatePageQuery();
    },
    // 重置按钮回调
    resetHandle() {
      this.searchForm = {
        ...this.searchForm,
        caseName: "",
        caseNoFuzzy: "",
        caseType: "",
        deptName: "",
        handlerName: "",
        status: [],
        pageNo: 1,
        pageSize: 20,
      };
      this.evaluatePageQuery();
    },
    // 列表查询
    async evaluatePageQuery() {
      let params = {
        ...this.searchForm
      }
      this.loading = true
      const result = await server.evaluatePageQuery(params);
      const { data } = result;
      if (data.code === "0") {
        let list = data.data.list
    
        this.tableData = list;
        this.pageTotal = data.data.total;
        this.loading = false
      } else {
        this.loading = false
        this.$messagebox(result)
      }
    },
    // 每页展示数量改变
    handleSizeChange(pageSize) {
      this.searchForm = { ...this.searchForm, pageSize: pageSize, pageNo: 1 };
      this.evaluatePageQuery();
    },
    // 页码改变
    handleCurrentChange(pageNo) {
      this.searchForm = { ...this.searchForm, pageNo: pageNo };
      this.evaluatePageQuery();
    },
    showBigPicHandle(attachmentInfoList){
      let imgList = attachmentInfoList.map((imgItem)=>{
        return imgItem.path
      })
      this.$refs.ImgBigPic.init(imgList)
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
</style>
