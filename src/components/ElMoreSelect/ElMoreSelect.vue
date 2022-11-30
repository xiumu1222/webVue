<template>
  <el-select
    :value="value"
    filterable
    :multiple="multiple"
    placeholder="请选择"
    @focus="caseCauseFocus"
    @change="caseCauseChange"
    :filter-method="caseCauseFilter"
    @on-scrolling-y="caseCauseScrolling"
    @input="updateVal"
    @visible-change="visiblechange"
    :multiple-limit="multipleLimit"
    clear
  >
    <el-option
      v-for="item in accusationSlow"
      :key="item[defaultProps.key]"
      :label="item[defaultProps.name]"
      :value="item[defaultProps.key]"
    >
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: null,
      default: () => {
        return null
      }
    },
    defaultProps: {
      type:Object,
      default:()=>{
        return {
          name:'name',
          key:'key'
        }
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    multipleLimit: {
      type: [String, Number],
      default: 1
    }
  },
  data () {
    return {
      accusationSlow: [],
      filterAccusationSlow: [],
      visible: false
    }
  },
  methods: {
    visiblechange (val) {
      if (val) {
        this.accusationSlow = this.options.filter((item, index) => {
          return index < 10
        })
        this.filterAccusationSlow = []
      }
      console.log('visiblechange', this.accusationSlow)
      this.visible = val
    },
    // 触发v-model绑定
    updateVal (val) {
      console.log('触发v-model绑定')
      this.$emit('input', val)
      this.$emit('selectChange',val)
    },
    caseCauseFocus () {
      this.accusationSlow = this.options.filter((item, index) => {
        return index < 10
      })
      this.filterAccusationSlow = []
    },
    caseCauseChange (val) {
      this.$nextTick(() => {
        if (this.multiple) {
          if (!this.visible) {
            this.accusationSlow = this.options.filter((item) => {
              let key = item[this.defaultProps.key]
              return val.indexOf(key) > -1
            })
          }
        } else {
          this.accusationSlow = this.options.filter((item) => {
            return item[this.defaultProps.key] === val
          })
        }
      })
    },
    caseCauseFilter (val) {
      this.accusationSlow = this.options.filter((item) => {
        if (val) {
          return item[this.defaultProps.name].indexOf(val) > -1
        } else {
          return true
        }
      })
      this.filterAccusationSlow = [...this.accusationSlow]
    },
    caseCauseScrolling ({scrollTop, percentY}) {
      if (percentY >= 1) {
        let len = this.accusationSlow.length
        let filterData = (this.filterAccusationSlow && this.filterAccusationSlow.length) > 0 ? this.filterAccusationSlow : this.options
        this.accusationSlow = filterData.filter((item, index) => {
          return index < (len + 10)
        })
      }
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">

</style>
