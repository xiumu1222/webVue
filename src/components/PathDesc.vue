<template>
  <!-- <div class="path-desc-layout">
    <div class="path-desc-box">
      <i
        class="h-icon-arrow_left"
        @click="goBack"
        v-if="isBack"
      ></i>
      <div class="path-box">
        <div
          class="path-item"
          v-for="(item,index) in breadcrumbs"
          :key="index"
        >
          {{ item }}
          <span class="spil-item">
            /
          </span>
        </div>
      </div>
    </div>
    <slot></slot>
  </div> -->
  <div class="path-desc-box" :class="{'H66': smallTitle}">
    <!-- <h-page-container>
      <h-page-header :breadcrumb="pathDescArr"
                     :return-event="goBack"
                     :return-icon="isBack" />
    </h-page-container> -->

    <div class="back-icon-box" v-if="isBack" @click="goBack">
      <i class="h-icon-angle_left"></i>
    </div>
    <div class="breadcrumbs-box">
      <div class="breadcrumb-item" v-for="(item,index) in breadcrumbs" :key="index">
        {{ item }}
          <i class="h-icon-angle_right"></i>
      </div>
    </div>

    <div class="small-title" v-if="smallTitle">
      {{smallTitle}}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    pathDescArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    smallTitle: {
      type: String,
      default: () => {
        return ''
      }
    },
    isAuto: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    isBack: {
      type: Boolean,
      default: true
    },
    goBackHandle: {
      type: Function,
      default: () => {
        return 'noneBackHandle'
      }
    }
  },
  data () {
    return {
      breadcrumbs: []
    }
  },
  mounted () {
    (this.isAuto && this.$breadcrumb && this.$breadcrumb.length > 0) ? (this.breadcrumbs = [...this.$breadcrumb, ...this.pathDescArr]) : (this.breadcrumbs = [...this.pathDescArr])
  },
  methods: {
    // 回退
    goBack () {
      // this.$router.push('/')
      let data = this.goBackHandle()
      if (data === 'noneBackHandle') {
        this.$router.push('/')
      }
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
// .path-desc-layout {
//   border-bottom: solid 1px #e5e5e5;
// }
.path-desc-box {
  box-sizing: border-box;
  height: 48px;
  padding: 3px 16px;
  background: #ffffff;
  overflow: hidden;
  padding-top: 12px;
  border-bottom: 1px solid #e0e0e0;
  &.H66 {
    height: 66px;
    .small-title {
      font-size: 14px;
      color: rgba(0,0,0,0.40);
      padding-left: 30px;
      padding-top: 5px;
    }
  }
  .back-icon-box {
    display: inline-block;
    vertical-align: top;
    width: 20px;
    height: 20px;
    margin-right: 12px;
    border: solid 1px #4d4d4d;
    border-radius: 22px;
    // text-align: center;
    // line-height: 24px;
    cursor: pointer;
    .h-icon-angle_left {
      font-size: 12px;
      color: #000;
      position: relative;
      left: 2px;
    }
  }

  .breadcrumbs-box {
    display: inline-block;
    vertical-align: top;
    .breadcrumb-item {
      color: #4d4d4d;
      display: inline-block;
      height: 22px;
      .h-icon-angle_right {
        display: inline-block;
        vertical-align: top;
        width: 22px;
        height: 22px;
        line-height: 22px;
        text-align: center;
      }

      &:last-child {
        color: #1a1a1a;
        cursor: text;
        font-weight: 600;
        .h-icon-angle_right {
          display: none;
          
        }
      }
    }
  }


  .h-page-header {
    border-bottom: solid 1px transparent;
    padding-left: 0px;
  }
  .h-page-container {
    // height: 100%;
    height: 48px;
  }
  // .h-icon-arrow_left {
  //   display: inline-block;
  //   vertical-align: middle;
  //   margin-right: 10px;
  //   font-size: 16px;
  //   color: #4d4d4d;
  //   cursor: pointer;
  // }
  // .path-box {
  //   display: inline-block;
  //   vertical-align: middle;
  //   .path-item {
  //     display: inline-block;
  //     font-size: 12px;
  //     color: #999999;
  //     .spil-item {
  //       padding: 0px 8px;
  //     }
  //     &:last-child {
  //       color: #4d4d4d;
  //       .spil-item {
  //         display: none;
  //       }
  //     }
  //   }
  // }
}
</style>
