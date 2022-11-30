<template>
  <el-select ref="treeSelect" v-model="selectValue" placeholder="请选择单位" filterable clear :filter-method="filterMethod"
    @change="selsctChange">
    <el-option v-for="item in options" :key="item[defaultProps.id]" :label="item[defaultProps.label]" :value="item[defaultProps.id]" v-show="false">
    </el-option>
    <el-option label="请选择" value="请选择" :disabled="true" v-show="false">
    </el-option>

    <el-tree ref="tree2" :check-strictly="true" :data="filterData" :props="defaultProps" @node-click="handleNodeClick" :default-expanded-keys="expandedKeys"
      :node-key="defaultProps.id">
    </el-tree>

  </el-select>

</template>
<script>


export default {
  name: 'SelectWithTreeNewDept',
  props: {
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
          label: 'label',
          id:'id',
          icon: 'icon'
        }
      }
    },
    nodeKey: {
      type: String,
      default: () => {
        return 'id'
      }
    },
    value: {
      type: null,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      filterText: '',
      selectValue: '',
      options: [
        // {
        //   name:'',
        //   indexCode:''
        // }
      ],
      filterData: [],
      selectValueList: [],
      checkedNodes: [],
      expandedKeys: []
    }
  },
  watch: {
    treeData(val) {
      this.filterData = val
      this.expandedKeys = [this.filterData[0][this.defaultProps.id]]

    },
    value(val) {
      console.log('val', val)
      // this.valueList = val
      this.options = [val]
      console.log(this.options)
      this.selectValue = val.id || ''
      // console.log('selectValue', this.selectValue)
      // this.$nextTick(() => {
      //   this.$refs.tree2 && this.$refs.tree2.setCheckedKeys(val.map(v => v['indexCode']))
      // })

    }
  },
  mixins: [],
  mounted() {
  },
  methods: {
    filterMethod(val) {
      if (!val) {
        this.expandedKeys = []
        this.filterData = this.treeData
        this.expandedKeys = [this.filterData[0][this.defaultProps.id]]
        return false
      }
      let expandKey = []
      let forTreeDataFun = (treeData) => {
        let newArr = []
        for (let i = 0; i < treeData.length; i++) {
          let treeItem = treeData[i]
          if (treeItem.children && treeItem.children.length > 0) {
            let pushArr = forTreeDataFun(treeItem.children)
            if (pushArr && pushArr.length > 0) {
              newArr.push({
                ...treeItem,
                children: pushArr
              })
            }else if ((treeItem.type === "dept" || treeItem.type === 'department') && treeItem[this.defaultProps.label].indexOf(val) > -1) {
              expandKey.push(treeItem[this.defaultProps.id])
              newArr.push(treeItem)
            }

          } else {
            if ((treeItem.type === "dept" || treeItem.type === 'department') && treeItem[this.defaultProps.label].indexOf(val) > -1) {
              expandKey.push(treeItem[this.defaultProps.id])
              newArr.push(treeItem)
            }

          }
        }

        return newArr

      }
      let resArr = forTreeDataFun(this.treeData)
      this.expandedKeys = expandKey
      this.filterData = resArr

    },
    selsctChange(data) {
      console.log(data)
      this.$emit('deptChange', data)
    },

    // selectNode节点点击
    handleNodeClick(data, node) {
      console.log(data)
      if (data.type === "dept" || data.type === 'department') {
        this.$emit('input', {...data})
        this.$refs['treeSelect'].hiddenMenu()

      }
    },
  },
  components: {}
}
</script>
<style lang="less" rel="stylesheet/less">
</style>
