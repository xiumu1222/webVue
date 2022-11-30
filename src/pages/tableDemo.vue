<template>
      <div class="common-list-page-box">
        <div class="tabs-box">
  
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
          <div class="search-item col-2">
            <div class="item-lable">
              受理时间
            </div>
            <div class="item-input">
              <el-date-picker v-model="timeArr" type="datetimerange" placeholder="选择日期范围" start-placeholder="开始时间"
                end-placeholder="结束时间" :style="{ width: '100%' }">
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
            <el-button icon="h-icon-add" @click="addHandle">添加</el-button>
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
            <el-table-column show-overflow-title prop="status" label="案件状态">
              <template slot-scope="scope">
                {{ statusMap[scope.row.status] }}
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
  </template>
  
  <script>
  import server from "../server/casePatrol";
  
  export default {
    name: "CasePatrol",
    data() {
      return {
        activeName: 'casePatrol',
        isFilterBox: false,
        loading: false,
        searchForm: {
          
          pageNo: 1,
          pageSize: 20,
  
          caseType:'',//案件类型（行政、刑事）
          caseNo:'',//案件编号
          caseName:'',//案件名称
          deptIndexCodes:'',//承办单位
          inspectStatus:'',//案件巡查状态
          hostPoliceName:'',//主办民警
          acceptanceTime: {
            beginTime:'',
            endTime:''
          },//受理时间
  
          // caseName: "",
          // caseNoFuzzy: "",
          // caseType: "",
          // deptName: "",
          // handlerName: "",
          // status: [],
          // pageNo: 1,
          // pageSize: 20,
  
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
        casePatrolDialogParams: {
          dialogFormVisible: false,
          caseNo: '',
          caseName: '',
          briefCase: '',
          confirmName: '',
          confirmDeptName: '',
          confirmDeptIndexCode: '',
          caseInspectProblem: [],
          sourceIndexCode: ''
        }
      };
    },
    async mounted() {
      this.getDictFuc();
      await this.getCurrentUser()
      this.searchForm = { ...this.searchForm, pageNo: 1 };
      await this.casePageQueryFuc()
  
  
      this.searchBoxAutoHeight()
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
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
        this.casePageQueryFuc();
      },
      // 列表查询
      async casePageQueryFuc() {
        let params = {
          ...this.searchForm
        }
        this.loading = true
        const result = await server.casePageQuery(params);
        const { data } = result;
        if (data.code === "0") {
          let list = data.data.list
          list.map(v => {
            let caseHandlersName = (v.caseHandlers && v.caseHandlers.length) ? v.caseHandlers.find(item => item.type === 1) : {}
            v.caseHandlersName = caseHandlersName ? caseHandlersName.name : ''
          })
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
        this.$router.push({ path: 'casePatrol', query: { indexCode: row.indexCode } })
  
      },
      // 获取当前登录用户信息
      async getCurrentUser() {
        const { data } = await server.getCurrentUser()
        if (data.code === "0") {
          if (data.data && data.data.personCode) {
            this.casePatrolDialogParams = {
              ...this.casePatrolDialogParams,
              confirmName: data.data.personName,
              confirmDeptName: data.data.orgName,
              confirmDeptIndexCode: data.data.orgCode
            }
          }
        } else {
          this.$message.error(this.$t(data.code));
        }
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
        contentBox.style.height = `calc(100% - ${(this.filterBoxHeight && (this.filterBoxHeight + 100))}px)`
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
        height: 44px;
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
  
  }
  </style>
  