<template>
    <el-dialog :area="[720, 636]" no-scrollbar title="人员选择" :visible.sync="dialogFormVisible">
        <div class="shuttle-box-by-police">
            <div class="tree-box">
                <div class="tree-box-title">部门</div>
                <div class="filter-input-box">
                    <el-input placeholder="输入关键字进行过滤" v-model="treeFilterVal" clearable></el-input>
                </div>
                <div class="tree-content-box">
                    <el-tree :node-key="defaultProps.key" :data="treeData" :props="defaultProps"
                        :filter-node-method="filterNode" ref="shuttleTree" @node-click="TreeHandleNodeClick"></el-tree>
                </div>
            </div>
            <div class="table-box">
                <div class="table-box-title">人员</div>
                <div class="filter-input-box">
                    <el-input placeholder="输入关键字进行过滤" v-model="tableFilterVal" @input="tableFilterHandle" clearable>
                    </el-input>
                </div>
                <div class="table-content-box">
                    <el-table force-scroll style="width: 100%" ref="leftMultipleTable" :data="tableData"
                        @current-change="handleCurrentChange">
                        <el-table-column type="radio" :selectable="selectable" label="选择">
                        </el-table-column>
                        <el-table-column show-overflow-title label="人员">
                            <template slot-scope="scope">
                                {{  `${scope.row.personName}(${scope.row.certificateNumber || '无证件号'})`  }}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="table-pagination-box">
                    <el-pagination small @current-change="handleCurrentChangePage" :total="total"
                        layout="prev, pager, next" :page-size="pageSize" :current-page="pageNo">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onsubmit">确 定</el-button>
            <el-button @click="onclose">取 消</el-button>
        </div>
    </el-dialog>
</template>
<script>

import server from '../../server/common'
export default {
    name: 'ShuttleBoxByPolice',
    data() {
        return {
            dialogFormVisible: false,
            treeFilterVal: '',
            tableFilterVal: '',
            treeData: [
            ],
            defaultProps: {
                children: 'children',
                label: 'label',
                key: 'id'
            },
            tableData: [],
            pageSize: 10,
            pageNo: 1,
            total: 0,
            currentTreeNodeData: {},
            disabledData: {},
            currentTableData: {}
        }
    },
    props: {
    },
    watch: {
        treeFilterVal(val) {
            this.$refs.shuttleTree.filter(val, !this.treeFilterVal);
        }
    },
    mounted() {
        
    },
    mixins: [],
    methods: {
        init(){
            this.dialogFormVisible = true
            this.loadOrgTree()

        },
        handleCurrentChange(data) {
            this.currentTableData = data
        },
        tableFilterHandle(data) {
            this.queryPagePersons()
        },
        TreeHandleNodeClick(data) {
            this.currentTreeNodeData = data
            this.queryPagePersons()
        },
        async loadOrgTree() {
            const result = await server.loadOrgTree()
            const { data } = result
            if (data.code === '0') {
                this.treeData = data.data || []
                this.currentTreeNodeData = this.treeData[0]
                
                this.$nextTick(() => {
                    this.$refs.shuttleTree && this.$refs.shuttleTree.setCurrentKey(this.currentTreeNodeData[this.defaultProps.key])
                    this.$refs.shuttleTree.expandNode(this.currentTreeNodeData[this.defaultProps.key])
                })
                this.queryPagePersons()
            } else {
                this.$messagebox(result)
            }
        },
        // 获取警员账号信息
        async queryPagePersons() {
            let params = {
                deptCodeList: this.currentTreeNodeData[this.defaultProps.key],
                personName: this.tableFilterVal,
                pageNo: this.pageNo,
                pageSize: this.pageSize
            }
            const result = await server.queryPagePersons(params)
            const { data } = result
            if (data.code === '0') {
                this.tableData = data.data.list
                this.total = data.data.total
            } else {
                this.$messagebox(result)
            }
        },
        handleCurrentChangePage(pageNo) {
            console.log(pageNo)
            this.pageNo = pageNo
            this.queryPagePersons()
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        onsubmit() {
            if (this.currentTableData && this.currentTableData.personIndexCode) {
                this.dialogFormVisible = false
                this.$emit('onSubmit', this.currentTableData)

            } else {

                return this.$message('请选择人员')

            }
        },
        onclose() {
            this.dialogFormVisible = false
        },
        selectable(column) {
            return this.disabledData !== column.personIndexCode
        }

    }
}
</script>
  <style lang="less" rel="stylesheet/less" scope>
  .shuttle-box-by-police {
      width: 100%;
      height: 519px;
      border: 1px solid #e5e5e5;
  
      .tree-box {
          width: 280px;
          height: 100%;
          padding: 8px;
          display: inline-block;
          vertical-align: top;
          border-right: 1px solid #e5e5e5;
  
          .tree-box-title {
              height: 40px;
              line-height: 40px;
              font-size: 14px;
              color: rgba(0, 0, 0, 0.9);
              letter-spacing: 0;
  
          }
  
          .tree-content-box {
              height: 422px;
              margin-top: 8px;
          }
      }
  
      .table-box {
          display: inline-block;
          vertical-align: top;
          width: 410px;
          height: 100%;
          padding: 8px;
  
          .table-box-title {
              height: 40px;
              line-height: 40px;
              font-size: 14px;
              color: rgba(0, 0, 0, 0.9);
              letter-spacing: 0;
  
          }
  
          .table-content-box {
              height: 395px;
              margin-top: 8px;
          }
      }
  
      .table-pagination-box {
          padding-top: 3px;
          text-align: center;
  
          .el-pagination {
              text-align: center;
          }
      }
  }
  </style>
  