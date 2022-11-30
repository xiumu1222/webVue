<!--
 * @Description: 
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2020-08-31 15:21:24
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2020-12-07 15:01:06
-->
<template>
    <div class="img-big-pic" v-show="visible">

        <div class="left-btn" @click="preHandle" v-show="showImgIndex>=1">
            <i class="h-icon-angle_left"></i>
        </div>
        <div class="translate-box" :style="{ 'transform': `translateX(${translateX}%)` }">
            <div class="img-content" v-for="(item, index) in imgList" :key="index">
                <!-- <img class="big-pic" :src="item" alt=""> -->
                <img class="big-pic" :src="item" alt="">
            </div>
        </div>

        <div class="right-btn" @click="nextHandle"  v-show="showImgIndex<(imgList.length-1)">
            <i class="h-icon-angle_right"></i>
        </div>
        <div class="img-close-btn-box" @click="closehandle">
            <i class="h-icon-close_sm"></i>
        </div>
    </div>
</template>
<script>

export default {
    name: 'ImgBigPic',
    props: {
    },
    watch: {
    },
    data() {
        return {
            visible: false,
            imgList: [],
            showImgIndex: 0,
            translateX: 0
        }
    },
    created() {

    },
    methods: {
        init(imgList,index) {
            this.showImgIndex= index || 0
            this.translateX= -this.showImgIndex*100
            this.visible = true
            this.imgList = imgList
        },
        closehandle() {
            this.visible = false

        },
        preHandle() {
            this.showImgIndex =  (this.showImgIndex-1)
            this.translateX = -this.showImgIndex*100
        },
        nextHandle() {
            this.showImgIndex =  (this.showImgIndex+1)
            this.translateX = -this.showImgIndex*100
        },

    },
    components: {}
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.img-big-pic {
    position: fixed;
    z-index: 3000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 32px 0;
    
    background: rgba(26, 26, 26, .9);
    white-space: nowrap;

    .right-btn {
        position: absolute;
        top: 0;
        right: 20px;
        width: 80px;
        height: 100%;
        background-color: rgba(0, 0, 0, 0);
        border-radius: 2px;
        cursor: pointer;
        z-index: 10;
        .h-icon-angle_right {
            position: relative;
            top: 50%;
            transform: translate(-0%, -50%);
            color: #fafafa;
            font-size: 72px;
        }
    }

    .left-btn {
        position: absolute;
        top: 0;
        left: 20px;
        width: 80px;
        height: 100%;
        background-color: rgba(0, 0, 0, 0);
        border-radius: 2px;
        cursor: pointer;
        z-index: 10;

        .h-icon-angle_left {
            position: relative;
            top: 50%;
            transform: translate(-0%, -50%);
            color: #fafafa;
            font-size: 72px;
        }
    }

    .translate-box {
        width: 100%;
        height: 100%;
        transform: translateX(0%);
        transition: transform .35s ease;
    }

    .img-content {
        width: 100%;
        height: 100%;
        padding: 0px 100px;
        display: inline-block;
        position: relative;

        // top: 50%;
        // left: 50%;
        // transform: translate(-50%,-50%);
        // text-align: center;
        .big-pic {
            max-width: 100%;
            max-height: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

        }
    }

    .img-close-btn-box {
        border: 1px solid hsla(0, 0%, 100%, .12);
        background-color: #262626;
        position: absolute;
        top: 24px;
        right: 24px;
        width: 40px;
        height: 40px;
        border-radius: 100%;
        cursor: pointer;
        z-index: 11;

        .h-icon-close_sm {
            position: relative;
            top: 1px;
            left: 1px;
            font-size: 36px;
            color: rgba(255, 255, 255, 0.7);
        }

    }
}
</style>
  