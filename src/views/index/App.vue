<template>
  <watermarkContent>
    <div class="IndexView">
      <div class="menu">
        <div class="scroll">
          <ul>
            <li
              class="margin"
              v-for="view in views"
              :key="view[0]"
            >
              <ElButton
                type="primary"
                @click="clickHandler(view[0])"
              >
                {{ view[0]+':'+view[1] }}
              </ElButton><span
                class="h-icon-done"
                :style="view[2]?'color:#d00':'color:#ececec'"
              ></span><span
                class="labelName"
                :style="view[2]?'color:#d00':'color:#fff'"
              >完成</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </watermarkContent>
</template>

<script>
import EventBus from '../../mixin/EventBus'
// import markdown from './markdown'

export default {
  name: 'IndexView',
  data () {
    return {
      views: [
        ['casehandlingarchives', '一案一档', 0],
        ['personhandlingarchives', '一人一档', 0],
        ['cascadeConfig', '级联配置', 0],
        ['earlyWarningCenter','告警中心',0],
        ['caseSmartPlatform', '执法监督态势', 0],
        // ['casehandlingEvaluation', '执法考评', 0],
        ['processorConfig','处理人配置',0],
        
        ['policeSituationManagement', '警情管理', 0],
        ['casePatrol', '案件巡查', 0],
        ['policeSituationPatrol', '警情巡查', 0],
        ['areaPatrol', '场所巡查', 0],
        ['earlyWarningRecord', '预警中心', 0],
        ['lawEvaluation', '执法考评', 0],
        ['performanceEvaluation', '绩效查看', 0],
        ['reportAlarmConfig', '告警配置', 0],
        ['evaluationRulesConfig', '考评规则配置', 0],
        ['earlyWarningConfig', '预警配置', 0],
      ]
    }
  },
  mixins: [EventBus],
  methods: {
    clickHandler (view) {
      console.log(123, view)
      window.open(location.protocol + '//' + location.host + '/' + process.env.VUE_APP_CONTEXT + '/' + view + '.html')
    }
  }
}
</script>

<style lang="scss">
.IndexView {
  width: 100%;
  height: 100%;

  overflow: auto;

  display: flex;

  .margin {
    margin: 5px;
  }

  .el-button {
    max-width: 600px !important;
  }

  .demo {
    flex: 1;

    & > div {
      & + div {
        margin-top: 16px;
      }
    }
  }

  .menu {
    flex: 1;
    overflow: hidden;
    height: 100%;
  }

  .markdown {
    flex: 2;
  }

  .scroll {
    overflow: auto;
    height: 100%;
  }
  .h-icon-done {
    font-size: 32px;
    color: #d00;
    font-weight: 900;
    vertical-align: top;
  }
  .labelName {
    font-size: 16px;
    font-weight: 900;
    vertical-align: top;
  }
}
</style>
