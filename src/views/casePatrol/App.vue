<!--
 * @Description: 
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2020-08-26 14:40:08
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2020-12-10 14:48:53
-->
<template>
  <div id="app">
    <!-- <watermarkContent> -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- </watermarkContent> -->
  </div>
</template>

<script>
import socket from '@/mixin/socket'
export default {
  name: 'casePatrol',
  mixins: [socket]
}
</script>

<style lang="less" rel="stylesheet/less">
</style>
