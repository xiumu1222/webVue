<template>
  <el-select v-model="selectValue" placeholder="请选择" multiple filterable :filter-method="filterMethod"
    @change="selsctChange">
    <el-option v-for="item in options" :key="item.indexCode" :label="item.name" :value="item.indexCode" v-show="false">
    </el-option>
    <el-option label="请选择" value="请选择" :disabled="true" v-show="false">
    </el-option>

    <el-tree ref="tree2" :check-strictly="true" :data="filterData" :props="defaultProps" show-checkbox
      node-key="indexCode" @check-change="checkChange" :default-expanded-keys="expandedKeys">
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
      this.selectValue.length <= 0 && (this.selectValue = val.map((v) => {
        this.options.push(v)
        return v['indexCode']
      }))
      // console.log('selectValue', this.selectValue)
      this.$nextTick(() => {
        this.$refs.tree2 && this.$refs.tree2.setCheckedKeys(val.map(v => v['indexCode']))
      })

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

      // this.$nextTick(()=>{
      //   this.$refs.tree2.expandNode("530902000000")
      // })

    },
    selsctChange(selectList) {
      this.$refs.tree2.setCheckedKeys(selectList)
      let isgo = false
      // console.log(this.value)
      // console.log(this.selectValue)
      if (this.value.length !== this.selectValue.length) {
        isgo = true
        // console.log('isgo')

      } else {
        this.value.forEach((item) => {
          if (this.selectValue.indexOf(item.indexCode) < 0) {
            // console.log('isgo')
            isgo = true

          }

        })
      }


      if (isgo) {


        // console.log(this.$refs.tree2.getCheckedNodes())

        this.$emit('input', this.$refs.tree2.getCheckedNodes())
      }



    },

    checkChange(data1, nodeChecked, data3) {
      if (data1.type === "person") {
        let isOptionPush = !this.options.some((item) => {
          return item.indexCode === data1.indexCode

        })
        nodeChecked && isOptionPush && this.options.push(data1)

        if (!nodeChecked && this.selectValue.indexOf(data1.indexCode) > -1) {
          this.selectValue.splice(this.selectValue.indexOf(data1.indexCode), 1);
        }
        if (nodeChecked && this.selectValue.indexOf(data1.indexCode) < 0) {
          this.selectValue.push(data1.indexCode)
        }
      }
    }
  },
  components: {}
}
</script>
<style lang="less" rel="stylesheet/less">
</style>
