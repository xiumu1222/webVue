<template>
  <el-select ref="treeSelect" v-model="selectValue" placeholder="请选择" filterable clear :filter-method="filterMethod"
    @change="selsctChange">
    <el-option v-for="item in options" :key="item.indexCode" :label="item.name" :value="item.indexCode" v-show="false">
    </el-option>
    <el-option label="请选择" value="请选择" :disabled="true" v-show="false">
    </el-option>

    <el-tree ref="tree2" :check-strictly="true" :data="filterData" :props="defaultProps" @node-click="handleNodeClick" :default-expanded-keys="expandedKeys"
      node-key="indexCode">
    </el-tree>

  </el-select>

</template>
<script>


export default {
  name: 'SelectWithTree',
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
      selectValue: [],
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

    },
    value(val) {
      // console.log('val', val)
      // this.valueList = val
      this.options.push(val)
      this.selectValue = val.indexCode
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
            }

          } else {
            if (treeItem.type === "person" && treeItem.name.indexOf(val) > -1) {
              expandKey.push(treeItem.indexCode)
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
    selsctChange(selectList) {
    },

    // selectNode节点点击
    handleNodeClick(data, node) {
      // console.log(data)
      // console.log(node)
      if (data.type === "person") {
        this.$emit('input', data)
        this.$refs['treeSelect'].hiddenMenu()

      }



    },
  },
  components: {}
}
</script>
<style lang="less" rel="stylesheet/less">
</style>
