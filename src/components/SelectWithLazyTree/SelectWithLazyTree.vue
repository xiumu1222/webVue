<template>
  <div class="select-with-lazy-tree">
    <el-select
      :value="value"
      placeholder="请选择"
      ref="treeSelect"
      :filterable="filterable"
      :filter-method="filterMethod"
      :multiple="multiple"
      multiple-nowrap
      @input="updateVal"
      @change="change"
      :disabled="disabled"
      :clear="clear"
    >
      <el-option
        label="部门选择"
        value="部门选择"
        :disabled="true"
        v-show="false"
      >
      </el-option>
      <el-option
        v-for="(item,index) in treeShowData"
        :key="item[nodeKey]"
        :label="item[defaultProps.label]"
        :value="item[nodeKey]"
        v-show="false"
      >
      </el-option>
      <el-tree
        :data="treeData"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :render-content="renderContent"
        :filter-node-method="filterNode"
        ref="tree2"
        @check-change="checkChange"
        :show-checkbox="multiple"
        :check-strictly="true"
        :simple-data="simpleData"
        :node-key="nodeKey"
        :parent-key="parentKey"
        class="select-lazy-tree"
      ></el-tree>
    </el-select>
  </div>
</template>
<script>
import renderContentTree from '../../mixin/renderContentTree'

export default {
  name: 'SelectWithLazyTree',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: null,
      default: () => {
        return null
      }
    },
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label'
        }
      }
    },
    simpleData: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    nodeKey: {
      type: String,
      default: () => {
        return 'id'
      }
    },
    parentKey: {
      type: String,
      default: () => {
        return 'Pid'
      }
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    filterable:{
      type:Boolean,
      default:()=>{
        return true
      }
    },
    clear:{
      type:Boolean,
      default:()=>{
        return true
      }
    }

  },
  data () {
    return {
      filterText: '',
      treeShowData:[]
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    },
    value (val) {
      if (this.multiple) {
        let valArr = this.$refs.tree2.getCheckedNodes()
        let newValArr = valArr.filter((item) => {
          return val.indexOf(item[this.nodeKey]) > -1
        })
        this.$refs.tree2.setCheckedNodes(newValArr)
      } else {

      }
    },
    // treeData:{
    //   handler:function(val){
    //     console.log('***********',val)
    //   },
    //   deep:true,
    //   immediate:true
    // }
  },
  mixins: [renderContentTree],
  mounted () {
  },
  methods: {
    // select change事件
    change (val) {
      if (this.multiple) {
         let valArr = this.$refs.tree2.getCheckedNodes()
         this.$emit('change', valArr)
        } else {
          let data = {}
          // this.treeData.forEach((item) => {
          //   if (item[this.nodeKey] === val) {
          //     data = item
          //   }
          // })
          data = this.getTreeNode(this.treeData,val)
          this.treeShowData = [{
              ...data
            }]

          console.log('1***************',val,data)
          this.$emit('change', data)
        }
      
    },
    // 触发v-model绑定
    updateVal (val) {
       console.log('2***************',val)
      this.$emit('input', val)
    },
    // 多选项改变
    checkChange (val) {
      if (this.multiple) {
        let valArr = this.$refs.tree2.getCheckedNodes()
        let data = valArr.map((item) => {
          return item[this.nodeKey]
        })
        this.treeShowData = [...valArr]
        this.$emit('input', data)
        this.$emit('change', valArr)
      }
    },
    // 树查询过滤
    filterNode (value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    // selectNode节点点击
    handleNodeClick (data, nodeData) {
      if (!this.multiple) {
        let value = data[this.nodeKey]
        console.log('5***************',data)
        this.treeShowData = [{
          ...data
        }]
        this.$emit('input', value)
        this.$emit('change', data)
        this.$refs['treeSelect'].hiddenMenu()
      }
    },
    filterMethod (val) {
      this.filterText = val
    },
    getTreeNode(list,target){
      for(let i=0;i<list.length;i++){
        let item = list[i]
        if (item[this.nodeKey] === target) {
           return  item
        } else {
          if(item.children){
           let arr = this.getTreeNode(item.children,target)
           if(arr[this.nodeKey]){
             return arr
           }
          }
        }
      }
      return {}
    }
  },
  components: {
  }
}
</script>
<style lang="less" rel="stylesheet/less">

.select-lazy-tree {
  width: 100%;
  font-size: 12px;
  .el-tree-scrollbar__wrap {
    max-height: 200px;
  }
}

</style>
