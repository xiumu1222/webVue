<template>
  <div class="filter-search-box">
    <div class="filter-icon-box"
         v-if="styleType!='noFilter'">
         <el-button  v-show="exportable" class="exportBtn" icon="h-icon-download" @click="handleSeclectExport">导出</el-button>
         <!-- <i v-show="exportable" class="exportBtn h-icon-download"></i> -->
      <i :class="{'h-icon-filter':!isFilterBox,'h-icon-filter_f':isFilterBox}"
         @click="searchBoxChange"></i>
    </div>
    <div class="search-box"
         :class="{'dis-none':!isFilterBox&&styleType!='noFilter'}">
      <slot />
    </div>
  </div>
</template>
<script>

export default {
  name: 'FilterSearchBox',
  props: {
    // 'filter','noFilter'
    styleType: {
      type: String,
      default: 'filter'
    },
    exportable:{
      type:Boolean,
      default:false
    },
    soltHeight:{
      type:[String,Number],
      default:0
    }
  },
  data () {
    return {
      isFilterBox: false
    }
  },
  mounted () {
    this.searchBoxInit()
  },
  methods: {
    searchBoxChange () {
      this.isFilterBox = !this.isFilterBox
      this.searchBoxInit()
    },
    searchBoxInit () {
      let searchBox = document.getElementsByClassName('filter-search-box')
      let contentBox = document.getElementsByClassName('filter-search-content')
      let width = searchBox[0].offsetWidth
      let colNumber = Math.floor(width / 330)
      this.$nextTick(() => {
        let searchItemArr = document.getElementsByClassName('filter-search-item')
        for (let i = 0; i < searchItemArr.length; i++) {
          searchItemArr[i].style.width = `${100 / colNumber}%`
          if (searchItemArr[i].className.indexOf('col-2') > -1 && colNumber > 1 && searchItemArr[i].offsetWidth < 430) {
            searchItemArr[i].style.width = `${100 / colNumber * 2}%`
          }
        }
        let filterBoxHeight = searchBox[0].offsetHeight
        contentBox[0].style.height = `calc(100% - ${(filterBoxHeight && (filterBoxHeight + 10) + 0 + (this.soltHeight - 0))}px)`
      })
    },
    /**
     * @description: 导出
     * @author: jinxiaoxu
     * @Date: 2020-11-26 15:21:43
     */
    handleSeclectExport(){
      this.$emit('handleSeclectExport')
    }

  },
  components: {}
}
</script>
<style lang="less" rel="stylesheet/less">
.filter-search-box {
  box-sizing: border-box;
  user-select: none;
  * {
    box-sizing: border-box;
  }
  .filter-icon-box {
    height: 48px;
    width: 100%;
    overflow: hidden;
    position: relative;
    .exportBtn{
        position: absolute;
        top: 8px;
        left: 27px;
      }
    >i {
      padding: 4px;
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 8px;
      font-size: 24px;
      &.h-icon-filter {
        &:hover {
          background: #f2f2f2;
        }
      }
      &.h-icon-filter_f {
        color: #2080f7;
        background: #f2f2f2;
      }
    }
  }
  .search-box {
    width: 100%;
    background: #fbfbfb;
    border-top: solid 1px #e5e5e5;
    border-bottom: solid 1px #e5e5e5;
    padding: 8px 0px;
    padding-right: 16px;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    &.dis-none {
      display: none;
    }
    .filter-search-item {
      padding: 8px 0px;
      display: inline-block;
      min-width: 320px;
      .item-lable {
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        width: 100%;
        height: 24px;
        line-height: 24px;
        margin-bottom: 4px;
        padding-left: 12px;
        text-align: left;
      }
      .item-input {
        padding-left: 12px;
        display: inline-block;
        vertical-align: middle;
        width: 100%;
      }
    }
    .search-btn {
      text-align: right;
      padding-top: 36px;
      flex-grow: 1;
      .el-button {
        width: 96px;
      }
    }
  }
}
</style>
