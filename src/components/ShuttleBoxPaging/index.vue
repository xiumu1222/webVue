<template>
  <el-dialog
    :class="['shuttleboxpaging_dialog', {single: !multiple}]"
    :area="[720, 636]"
    no-scrollbar
    title="人员选择"
    :visible.sync="dialogFormVisible"
    :before-close="beforeCLose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="ShuttleBoxPaging">
      <div class="sider">
        <div class="tree-title">部门</div>
        <el-input
          clearable
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          class="filter-tree-input"
          :clear-icon-click="TreeClearIconClick"
        >
          <!-- suffix-icon="h-icon-search"
          :on-icon-click="TreeHandleIconClick"-->
        </el-input>

        <div class="tree-wrap">
          <el-tree
            default-icon="icon-department"
            :node-key="defaultProps.id"
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            :default-expanded-keys="defaultExpandedKeys"
            :current-node-key="currentNodeKey"
            :filter-node-method="filterNode"
            :render-content="renderContent"
            @node-click="TreeHandleNodeClick"
          ></el-tree>
          <!-- <div class="tree_empty_text"
               v-show="filterNothing">
            暂无数据
          </div>-->
        </div>
      </div>
      <div class="left">
        <div class="left-title">人员</div>
        <div class="left-search">
          <el-input
            clearable
            placeholder="请输入"
            v-model="leftSearchInput"
            :clear-icon-click="leftClearIconClick"
          >
            <!--  suffix-icon="h-icon-search" 
                    :on-icon-click="leftHandleIconClick"
            -->
          </el-input>
        </div>
        <div class="left-table">
          <div class="left-table-cantainer">
            <el-table
              force-scroll
              style="width: 100%"
              ref="leftMultipleTable"
              :data="leftTableDataFilterSelect"
              @selection-change="leftHandleSelectionChange"
              :highlight-current-row="!multiple"
              current-row-key="personIndexCode"
              @current-change="handleCurrentChange"
            >
              <!--v-loading="loading"-->
              <template v-if="multiple">
                <el-table-column type="selection"></el-table-column>
              </template>
              <template v-else>
                <!-- <el-table-column label="选择"
                                 width="60">
                  <template slot-scope="scope">
                    {{ scope.row === currentRow ? '√':'' }}
                  </template>
                </el-table-column>-->
                <el-table-column type="radio" :selectable="selectable" label="选择">
                  <!-- <template slot-scope="scope">
                    {{ scope.row === currentRow ? '√':'' }}
                  </template>-->
                </el-table-column>
              </template>
              <el-table-column show-overflow-title :label="multiple?'全选': '人员'">
                <template slot-scope="scope">
                  {{ `${scope.row.personName}(${scope.row.certificateNumber || '无证件号'})` }}
                  <!--&#45;&#45;${scope.row.treePath}-->
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="left-pagination-cantainer">
            <el-pagination
              small
              @current-change="handleCurrentChangePage"
              :total="total"
              layout="first, prev, miniPager, next, last"
              :page-size="20"
              :current-page="pageNo"
            ></el-pagination>
          </div>
        </div>
      </div>
      <template v-if="multiple">
        <div class="middle">
          <el-button
            icon-border="h-icon-angle_right"
            :disabled="!leftMultipleSelection.length"
            @click="pushData"
          ></el-button>
          <el-button
            icon-border="h-icon-angle_left"
            :disabled="!rightMultipleSelection.length"
            @click="deleteData"
          ></el-button>
        </div>
        <div class="right">
          <div class="right-title">已选择人员({{ rightTableDataFilterSelect.length }}人)</div>
          <div class="right-search">
            <el-input
              clearable
              placeholder="请输入"
              suffix-icon="h-icon-search"
              v-model="rightSearchInput"
              :on-icon-click="rightHandleIconClick"
              :clear-icon-click="rightClearIconClick"
            ></el-input>
          </div>
          <div class="right-table">
            <div class="right-table-cantainer">
              <el-table
                force-scroll
                style="width: 100%"
                ref="rightMultipleTable"
                :data="rightTableDataFilterSelect"
                @selection-change="rightHandleSelectionChange"
              >
                <el-table-column type="selection"></el-table-column>
                <el-table-column show-overflow-title label="全选">
                  <template
                    slot-scope="scope"
                  >{{ `${scope.row.personName}(${scope.row.certificateNumber || '无证件号'})--${scope.row.treePath}` }}</template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onsubmit">确 定</el-button>
      <el-button @click="onclose">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import renderContentTree from './renderContentTree'
import ShuttleBoxMixin from './ShuttleBoxPaging'

// 获取第一个匹配节点
export const getFirstObjectInTree = (origin, target, prop) => {
  const result = { target: {} }
  const _getFirstObjectInTree = _origin => {
    return _origin.some(v => {
      if (v[prop].indexOf(target) > -1) {
        result.target = v
        return true
      }
      if (v.children) return _getFirstObjectInTree(v.children)
    })
  }
  _getFirstObjectInTree(origin)
  return result.target
}

const defaultProps = {
  children: 'children',
  label: 'label',
  id: 'id'
}
export default {
  name: 'ShuttleBoxPaging',
  data() {
    return {
      dialogFormVisible: false,
      filterNothing: false,
      filterText: '',
      defaultProps: defaultProps,
      defaultExpandedKeys: [],
      currentNodeKey: '',
      currentSelectIndexCode: '',
      keyCode: 'personIndexCode',
      leftSearchValue: 'personName',
      rightSearchValue: 'personName',
      currentRow: null,
      currentCode: '',
      pageNo:1
    }
  },
  props: {
    treeData: {
      type: Array,
      default() {
        return []
      }
    },
    multiple: {
      type: Boolean,
      default: true
    },
    disabledData: {
      type: String,
      default: ''
    },
    currentCodes: {
      type: String,
      default: ''
    },
    total: {
      type: [Number, String],
      default: 0
    }
  },
  watch: {
    treeData(val) {
      if (val[0]) {
        let _indexCode = val[0][defaultProps.id]
        this.defaultExpandedKeys = [_indexCode]
        this.currentNodeKey = _indexCode
        this.currentSelectIndexCode = _indexCode
        this.$nextTick(() => {
          this.$refs.tree && this.$refs.tree.setCurrentKey(_indexCode)
        })
        this.$emit('ShuttleEvent', {
          type: 'getLeftData',
          payload: {
            indexCode: _indexCode
          }
        })
      }
    },
    leftTableDataFilterSelect: {
      handler: function(val) {
        if (this.currentCode) {
          this.setCurrent(this.currentCode)
        } else {
          this.setCurrent(this.currentCodes)
        }
      },
      immediate: true,
      deep: true
    },
    filterText(val) {
      this.TreeHandleIconClick()
    },
    leftSearchInput(val) {
      this.leftHandleIconClick()
    }
  },
  mixins: [ShuttleBoxMixin, renderContentTree],
  methods: {
    handleCurrentChange(val) {
      console.log('handleCurrentChange', val)
      val && val.personIndexCode && (this.currentCode = val.personIndexCode)
      val && (this.currentRow = val)
    },
    // 切换页码
    handleCurrentChangePage(val) {
      this.pageNo = val
      this.$emit('ShuttleEvent', {
        type: 'changePage',
        payload: {
          indexCode: this.currentSelectIndexCode,
          [this.leftSearchValue]: this.leftSearchInput,
          pageNo: val
        }
      })
    },
    // 树
    TreeHandleIconClick() {
      const first = getFirstObjectInTree(
        this.treeData,
        this.filterText,
        defaultProps.label
      )
      console.log(first[defaultProps.id])
      if (first && first[defaultProps.id]) {
        this.filterNothing = false
        this.$nextTick(() => {
          this.TreeHandleNodeClick(first)
          this.$refs.tree &&
            this.$refs.tree.setCurrentKey(first[defaultProps.id])
          this.$refs.tree.filter(this.filterText)
          this.$refs.tree.$refs.scrollbar.setScroll(0, 0)
        })
      } else {
        this.filterNothing = true
        this.$refs.tree.filter(this.filterText)
      }
    },
    TreeClearIconClick() {
      this.filterNothing = false
      let _indexCode = this.treeData[0][defaultProps.id]
      this.currentSelectIndexCode = _indexCode
      this.$refs.tree.filter('')
      this.$nextTick(() => {
        this.$refs.tree && this.$refs.tree.$refs.scrollbar.setScroll(0, 0)
        this.$refs.tree && this.$refs.tree.setCurrentKey(_indexCode)
        this.treeData[0] && this.TreeHandleNodeClick(this.treeData[0])
      })
    },
    TreeHandleNodeClick(data) {
      this.leftSearchInput = ''
      this.pageNo = 1
      this.currentSelectIndexCode = data[defaultProps.id]
      this.$emit('ShuttleEvent', {
        type: 'getLeftData',
        payload: {
          indexCode: data[defaultProps.id]
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data[defaultProps.label].indexOf(value) !== -1
    },
    leftHandleIconClick() {
      this.$emit('ShuttleEvent', {
        type: 'getLeftData',
        payload: {
          indexCode: this.currentSelectIndexCode,
          [this.leftSearchValue]: this.leftSearchInput
        }
      })
    },
    leftClearIconClick() {
      // this.leftSearchInput = ''
      this.$emit('ShuttleEvent', {
        type: 'getLeftData',
        payload: {
          indexCode: this.currentSelectIndexCode
        }
      })
    },
    setRightData(data) {
      this.rightTableData = data
      this.rightClearIconClick()
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.$nextTick(() => {
        this.resetTree()
      })
    },
    onsubmit() {
      if (!this.rightTableData.length && !this.currentRow) {
        return this.$message('请至少选择一个人员')
      }

      this.$emit('ShuttleEvent', {
        type: 'selectData',
        payload: {
          data: this.multiple ? this.rightTableData : this.currentRow,
          close: this.closeDialog
        }
      })
    },
    onclose() {
      this.$emit('ShuttleEvent', {
        type: 'close',
        payload: {
          close: this.closeDialog
        }
      })
    },
    beforeCLose(done) {
      this.$emit('ShuttleEvent', {
        type: 'beforeCLose',
        payload: {
          done: this.closeDialog
        }
      })
      // setTimeout(()=>{
      //   this.resetTree()
      // },500)
    },
    resetTree() {
      this.setRightData([])
      this.filterText = ''
      this.currentCode = ''
      this.pageNo = 1
      // this.TreeClearIconClick()
      this.leftSearchInput = ''
      let _indexCode = this.treeData[0][defaultProps.id]
      console.log('_indexCode', _indexCode)
      this.defaultExpandedKeys = [_indexCode]
      this.currentNodeKey = _indexCode
      this.currentSelectIndexCode =
        this.$refs.tree && this.$refs.tree.$refs.scrollbar.setScroll(0, 0)
      this.$refs.tree && this.$refs.tree.setCurrentKey(_indexCode)
      this.$emit('ShuttleEvent', {
        type: 'getLeftData',
        payload: {
          indexCode: _indexCode
        }
      })
    },
    setCurrent(id) {
      const row = this.leftTableData.filter(v => v[this.keyCode] === id)
      this.$refs.leftMultipleTable &&
        this.$refs.leftMultipleTable.setCurrentRow(row[0])
    },
    selectable(column) {
      return this.disabledData !== column.personIndexCode
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
.shuttleboxpaging_dialog {
  &.single .el-dialog {
    // width: 635px !important;
    // margin-left: -317.5px !important;
  }

  .el-dialog__body .el-dialog__body-wrapper {
    padding: 0;
  }

  .dialog-footer {
    .el-button {
      width: 96px;
    }
  }

  .el-table__row {
    cursor: pointer;
  }
  .el-table-column--radio .cell {
    font-size: 14px;
  }
}
</style>
<style lang="less" rel="stylesheet/less" scope>
.ShuttleBoxPaging {
  box-sizing: border-box;
  height: 500px;
  width: 100%;
  display: flex;
  position: relative;

  .sider {
    width: 280px;
    border: 1px solid #e5e5e5;
    border-right: 0;
    padding: 8px;
    display: flex;
    flex-direction: column;
  }

  .tree-wrap {
    position: relative;
    flex: 1;
    overflow: hidden;
    margin-top: 8px;
    .el-tree-scrollbar__view.el-scrollbar__view {
      height: 100%;
    }
    .el-tree__empty-text {
      color: #999;
    }
  }

  .left,
  .right {
    flex: 1;
    border: 1px solid #e5e5e5;
  }

  .middle {
    width: 66px;
    height: 80px;
    text-align: center;
    position: relative;
    top: 50%;
    margin-top: -40px;

    .el-button {
      margin: 4px 0;
    }

    .el-button + .el-button {
      margin-left: 0;
    }
  }

  .left-title,
  .right-title {
    box-sizing: border-box;
    height: 48px;
    line-height: 48px;
    padding: 0 21px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    letter-spacing: 0;
  }

  .tree-title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    letter-spacing: 0;
  }

  .left-search,
  .right-search {
    box-sizing: border-box;
    padding: 0 16px;
    display: flex;

    & > .el-select {
      box-sizing: border-box;
      margin-right: 8px;
      flex: 1;
    }

    & > .el-input {
      flex: 3;
    }
  }

  .left-table,
  .right-table {
    box-sizing: border-box;
    width: 100%;
    height: ~'calc(100% - 89px)';
    position: relative;

    .el-table {
      border-left: 0;
    }

    .el-table:after {
      width: 0;
    }

    .el-table .el-table__body-wrapper:before,
    .el-table:before {
      height: 0;
    }
  }

  .left-table-cantainer,
  .right-table-cantainer {
    position: absolute;
    top: 0;
    bottom: 40px;
    box-sizing: border-box;
    width: 100%;
    padding: 0 16px;
    margin-top: 8px;
  }
  .left-pagination-cantainer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 40px;
    padding-top: 16px;
  }

  .el-table__body-wrapper {
    top: 37px !important;
    position: static !important;
  }

  .tree_empty_text {
    color: #5e6e82;
    font-size: 14px;
    position: absolute;
    width: 94%;
    top: 21px;
    left: 112px;
  }
}
</style>
