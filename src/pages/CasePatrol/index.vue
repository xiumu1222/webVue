<template>
  <!-- <watermarkContent> -->
  <div class="police-management common-list-page-box">
    <div class="tabs-box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="行政案件" name="1"></el-tab-pane>
        <el-tab-pane label="刑事案件" name="2"></el-tab-pane>
      </el-tabs>

    </div>
    <div class="search-box" id="search_box">
      <div class="search-item">
        <div class="item-lable">
          案件编号
        </div>
        <div class="item-input">
          <el-input v-model="searchForm.caseNo" placeholder="请输入"></el-input>
        </div>
      </div>
      <div class="search-item">
        <div class="item-lable">
          案件名称
        </div>
        <div class="item-input">
          <el-input v-model="searchForm.caseName" placeholder="请输入"></el-input>
        </div>
      </div>

      <div class="search-item">
        <div class="item-lable">
          巡查状态
        </div>
        <div class="item-input">
          <el-select v-model="searchForm.inspectStatus" placeholder="请选择" clear>
            <el-option label="未巡查" :value="0"></el-option>
            <el-option label="已巡查" :value="1"></el-option>
          </el-select>
        </div>
      </div>
      <div class="search-item">
        <div class="item-lable">
          承办单位
        </div>
        <div class="item-input">
          <el-input v-model="searchForm.deptName" placeholder="请输入"></el-input>
        </div>
      </div>
      <div class="search-item">
        <div class="item-lable">
          承办人
        </div>
        <div class="item-input">
          <el-input v-model="searchForm.hostPoliceName" placeholder="请输入"></el-input>
        </div>
      </div>
      <div class="search-item col-2">
        <div class="item-lable">
          受理时间
        </div>
        <div class="item-input">
          <el-date-picker v-model="timeArr" type="datetimerange" placeholder="选择日期范围" start-placeholder="开始时间"
            end-placeholder="结束时间" :style="{ width: '100%' }" :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </div>
      </div>
      <div class="search-item btn-item">
        <el-button type="primary" @click="searchHandle">
          查询
        </el-button>
        <el-button @click="resetHandle">
          重置
        </el-button>
        <el-button icon="h-icon-angles_up_sm" v-if="isFilterBox" @click="searchBoxOpenClosehandle" />
        <el-button icon="h-icon-angles_down_sm" v-else @click="searchBoxOpenClosehandle" />
      </div>
    </div>
    <div class="operation-box">
      <!-- <div class="operation-item">
        <el-button icon="h-icon-export" @click="exportHandle">导出</el-button>
      </div> -->
    </div>
    <div class="content-box" id="content_box">
      <el-table ref="autoTable" :data="tableData" force-scroll style="width: 100%" v-loading="loading">
        <el-table-column show-overflow-title label="序号" type="index" width="60">
        </el-table-column>
        <el-table-column show-overflow-title prop="caseNo" label="案件编号">
        </el-table-column>
        <el-table-column show-overflow-title prop="caseName" label="案件名称">
        </el-table-column>
        <!-- <el-table-column show-overflow-title prop="caseType" label="案件类型">
            <template slot-scope="scope">
              {{ caseTypeMap[scope.row.caseType] }}
            </template>
          </el-table-column> -->
        <el-table-column show-overflow-title prop="status" label="案件状态">
          <template slot-scope="scope">
            {{ statusMap[scope.row.status] }}
            <!-- {{ scope.row.status === '0' ? '在办' : '办结' }} -->
          </template>
        </el-table-column>
        <el-table-column show-overflow-title prop="caseLevel" label="案件级别">
          <template slot-scope="scope">
            {{ caseLevelMap[scope.row.caseLevel] }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-title prop="caseCause" label="案由">
          <template slot-scope="scope">
            {{ scope.row.caseCause && (scope.row.caseCause.split(',').map((item)=>{
              return accusationMap[item]
            })).join('，')  }}
            <!-- accusationMap[scope.row.caseCause] -->
          </template>
        </el-table-column>
        <el-table-column show-overflow-title prop="happenTime" label="案发时间">
          <template slot-scope="scope">
            {{ scope.row.happenTime ? $moment(scope.row.happenTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-title prop="happenPlace" label="案发地点">
        </el-table-column>
        <el-table-column show-overflow-title prop="acceptanceTime" label="受理时间">
          <template slot-scope="scope">
            {{ scope.row.acceptanceTime ? $moment(scope.row.acceptanceTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-title prop="deptName" label="承办单位">
        </el-table-column>
        <el-table-column show-overflow-title prop="caseHandlers" label="承办人">
          <template slot-scope="scope">
            {{ scope.row.caseHandlers && (scope.row.caseHandlers.map((item)=>{
              return item.name
            })).join('，') }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-title prop="inspectStatus" label="巡查状态">
          <template slot-scope="scope">
            <span class="blue-tag" v-if="scope.row.inspectStatus === 1">已巡查</span>
            <span class="red-tag" v-else>未巡查</span>
            
            <!-- {{ scope.row.inspectStatus === 1?'已巡查':'未巡查' }} -->
          </template>
        </el-table-column>

        <el-table-column label="操作" show-overflow-title width="100">
          <template slot-scope="scope">
            <span class="table-ctrl-btn" @click="superviseHandle(scope.row)">巡查</span>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div class="footer-box">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="searchForm.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="pageTotal"></el-pagination>
    </div>
    
  </div>
  <!-- </watermarkContent> -->
</template>

<script>
import server from "../../server/casePatrol";

export default {
  name: "CasePatrol",
  data() {
    return {
      activeName: '1',
      isFilterBox: false,
      loading: false,
      searchForm: {

        pageNo: 1,
        pageSize: 20,

        caseType: '1',//案件类型（行政、刑事）
        caseNo: '',//案件编号
        caseName: '',//案件名称
        deptIndexCodes: [],//承办单位
        inspectStatus: '',//案件巡查状态
        hostPoliceName: '',//主办民警
        deptName: '',
        acceptanceTime: {
          beginTime: '',
          endTime: ''
        },//受理时间

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
    this.getDictFuc();
    this.searchForm = { ...this.searchForm, pageNo: 1 };
    await this.casePageQueryFuc()


    this.searchBoxAutoHeight()
  },
  methods: {
    // exportHandle() {
    //   window.open(`/casehandlingarchives/ui/inspect/case/export.do?caseType=${this.searchForm.caseType}&caseNo=${this.searchForm.caseNo}&caseName=${this.searchForm.caseName}&inspectStatus=${this.searchForm.inspectStatus}&hostPoliceName=${this.searchForm.hostPoliceName}&deptName=${this.searchForm.deptName}&acceptanceTime={beginTime:${this.searchForm.acceptanceTime.beginTime},endTime:${this.searchForm.acceptanceTime.endTime}}`)
    // },
    async exportHandle() {
      let params = {
        ...this.searchForm,
        caseType: this.activeName,
      }
      params.acceptanceTime.beginTime = this.timeArr[0] && this.$moment(this.timeArr[0]).format("YYYY-MM-DD HH:mm:ss")
      params.acceptanceTime.endTime = this.timeArr[1] && this.$moment(this.timeArr[1]).format("YYYY-MM-DD HH:mm:ss")
      let res = await server.caseExport(params, {
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
      this.casePageQueryFuc()
    },
    async activated() {
      await this.lastestParams ? this.policeSituationPge(this.lastestParams) : this.policeSituationPge()
    },
    // 查询按钮点击回调
    searchHandle() {
      this.searchForm.pageNo = 1;
      this.casePageQueryFuc();
    },
    // 重置按钮回调
    resetHandle() {
      this.timeArr = []
      this.searchForm = {
        ...this.searchForm,
        pageNo: 1,
        pageSize: 20,
        caseNo: '',//案件编号
        caseName: '',//案件名称
        deptIndexCodes: [],//承办单位
        inspectStatus: '',//案件巡查状态
        hostPoliceName: '',//主办民警
        deptName: '',
        acceptanceTime: {
          beginTime: '',
          endTime: ''
        },//受理时间
      };
      this.casePageQueryFuc();
    },
    // 列表查询
    async casePageQueryFuc() {
      let params = {
        ...this.searchForm,
        caseType: this.activeName,
      }
      params.acceptanceTime.beginTime = this.timeArr[0] && this.$moment(this.timeArr[0]).format("YYYY-MM-DD HH:mm:ss")
      params.acceptanceTime.endTime = this.timeArr[1] && this.$moment(this.timeArr[1]).format("YYYY-MM-DD HH:mm:ss")
      this.loading = true
      const result = await server.casePageQuery(params);
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
      this.casePageQueryFuc();
    },
    // 页码改变
    handleCurrentChange(pageNo) {
      this.searchForm = { ...this.searchForm, pageNo: pageNo };
      this.casePageQueryFuc();
    },
    // 获取字典数据
    async getDictFuc() {
      let params = {
        codes: "inqfd.caseType,inqfd.caseLevel,inqfd.brief,inqfd.caseStatus,inqfd.caseInspectProblem",
      };
      const result = await server.getDict(params);
      const { data } = result;
      if (data.code === "0") {
        this.caseTypeList = data.data['inqfd.caseType']
        let caseLevelList = data.data['inqfd.caseLevel']
        this.caseStatusList = data.data['inqfd.caseStatus']
        let briefList = data.data['inqfd.brief']
        this.caseTypeMap = this.computedDic(this.caseTypeList)
        this.caseLevelMap = this.computedDic(caseLevelList)
        this.accusationMap = this.computedDic(briefList)
        this.statusMap = this.computedDic(this.caseStatusList)
        this.caseInspectProblem = data.data['inqfd.caseInspectProblem']
      } else {
        this.$messagebox(result)
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
    // 督办
    superviseHandle(row) {
      // this.$router.push({ path: 'casePatrol', query: { indexCode: row.indexCode } })
      this.$router.push({ path: 'patrol', query: { indexCode: row.indexCode, caseType: this.activeName } })
    },

    searchBoxOpenClosehandle() {
      this.isFilterBox = !this.isFilterBox
      this.searchBoxAutoHeight()

    },
    // 筛选查询条件区域自适应
    searchBoxAutoHeight() {
      let searchBox = document.getElementById('search_box')
      let contentBox = document.getElementById('content_box')
      let width = searchBox.offsetWidth
      let colNumber = Math.floor(width / 244)  //一行最大可容纳几个正常搜索项
      let hasLen = colNumber
      this.$nextTick(() => {
        let searchItemArr = Array.from(searchBox.querySelectorAll('.search-item'))
        // console.log('searchItemArr', searchItemArr)
        let itemLen = searchItemArr.length
        let lastRowNum = 0
        let btnItemL = 1
        for (let i = 0; i < itemLen; i++) {
          let styleWidth = ''
          
          if (this.isFilterBox) {
            searchItemArr[i].style.display = 'inline-block'


            if (searchItemArr[i].className.indexOf('col-2') > -1) {
              styleWidth = `${100 / colNumber * 2}%`
              if (hasLen === 1) {
                hasLen -= 3
              } else {
                hasLen -= 2
              }
            } else {
              styleWidth = `${100 / colNumber}%`
              hasLen -= 1
            }

            if (hasLen < 0) {
              // console.log(hasLen)
              lastRowNum += 1
              hasLen = colNumber + hasLen

            }

            if (i === (itemLen - 1)) {
              styleWidth = `${100 / colNumber * (hasLen + 1)}%`
            }
            searchItemArr[i].style.width = styleWidth
          } else {
            // searchItemArr[i].style.display = 'none'
            
            if (searchItemArr[i].className.indexOf('col-2') > -1) {
              styleWidth = `${100 / colNumber * 2}%`
              hasLen -= 2
              if(hasLen===0){
                btnItemL = 2
              }

            } else {
              styleWidth = `${100 / colNumber}%`
              hasLen -= 1
            }

            if (hasLen <= 0 && i !== (itemLen - 1)) {
              searchItemArr[i].style.display = 'none'
            }
            if (i === (itemLen - 1)) {
              
              styleWidth = `${100 / colNumber * btnItemL}%`
            }
            searchItemArr[i].style.width = styleWidth
          }

        }
        this.filterBoxHeight = searchBox.offsetHeight
        contentBox.style.height = `calc(100% - ${(this.filterBoxHeight && (this.filterBoxHeight + 117))}px)`
      })
    },
  },
  mixins: [],
  components: {}
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
      max-height: 44px;
      position: relative;

      &::before {
        content: '';
        display: block;
        width: 100%;
        border-top: 1px solid #e0e0e0;
        position: relative;
        top: -6px;
      }

      .operation-item {
        display: inline-block;
      }
    }

    .content-box {
      padding: 0px 12px;
      height: ~"calc(100% - 184px)";
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

}
</style>
