<template>
  <div class="operate-box">
    <template v-if="operateItem.length <= 0">
    </template>
    <template v-else-if="operateItem.length > 3">
      <span :title="operateItem[0].name"
            class="operationBtn">{{ operateItem[0].name }}</span>
      <span class="dividingLine">|</span>
      <span :title="operateItem[1].name"
            class="operationBtn">{{ operateItem[1].name }}</span>
      <span class="dividingLine">|</span>
      <el-popover placement="bottom"
                  trigger="hover"
                  popper-class="operateBoxPopover"
                  v-model="visible">
        <div style="text-align: right; margin: 0">
          <span :title="item.name"
                class="operationBtn"
                v-for="(item, index) in operateItem"
                :key="index"
                v-show="index > 1">{{ item.name }}</span>
        </div>
        <span slot="reference"
              title="更多"
              style="margin-left:10px"
              class="operationBtn">更多</span>
      </el-popover>
    </template>
    <template v-else>
      <template v-for="(item, index) in operateItem">
        <span :title="item.name"
              class="operationBtn"
              :key="index">{{ item.name }}</span>
        <span class="dividingLine"
              v-show="index != operateItem.length - 1"
              :key="index + 'line'">|</span>
      </template>
    </template>
  </div>
</template>
<script>
import './operate.less'
export default {
  name: 'OperateBox',
  props: {
    operateItem: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      isFilterBox: false,
      visible: false
    }
  },
  mounted () {
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
        contentBox[0].style.height = `calc(100% - ${(filterBoxHeight && (filterBoxHeight + 10) + 0)}px)`
      })
    }

  },
  components: {}
}
</script>
<style lang="less" rel="stylesheet/less">
.operate-box {
  box-sizing: border-box;
  user-select: none;
  * {
    box-sizing: border-box;
  }
  .dividingLine {
    color: #e6e6e6;
  }
  .operationBtn {
    display: inline-block;
    padding: 0 8px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #2080f7;
    letter-spacing: 0;
    line-height: 20px;
    cursor: pointer;
  }
}
</style>
