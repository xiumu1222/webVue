<template>
    <!-- <watermarkContent> -->
        <div class="case-patrol-box">
            <PathDesc :path-desc-arr="pathDescArr" :is-back="true"></PathDesc>
            <div class="tabs-box">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="案件巡查" name="casePatrol">
                    
                </el-tab-pane>
                <el-tab-pane label="督办记录" name="supervisionRecord">
                    
                </el-tab-pane>
                <el-tab-pane label="考评记录" name="evaluationRecord"></el-tab-pane>
            </el-tabs>

            </div>
            
            <div class="tab-content">
                <CasePatrolTab v-if="this.activeName === 'casePatrol'"></CasePatrolTab>
                <SupervisionRecordTab v-else-if="this.activeName === 'supervisionRecord'"></SupervisionRecordTab>
                <EvaluationRecordTab v-else-if="this.activeName === 'evaluationRecord'"></EvaluationRecordTab>
            </div>
            
        </div>
    <!-- </watermarkContent> -->
</template>
  
  <script>
import PathDesc from '../../components/PathDesc'
import CasePatrolTab from './components/CasePatrolTab'
import EvaluationRecordTab from './components/EvaluationRecordTab'
import SupervisionRecordTab from './components/SupervisionRecordTab'



export default {
    name: "addEdit",
    data() {
        let queryParam = this.$route.query

        return {
            pathDescArr: ['案件巡查', `巡查`],
            queryParam: queryParam,
            activeName: 'casePatrol'
        }
    },
    async mounted() {

    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    },
    components: {
        PathDesc,
        CasePatrolTab,
        EvaluationRecordTab,
        SupervisionRecordTab,
        
    }
}
</script>
  
  <style lang="less" rel="stylesheet/less" scoped>
    .case-patrol-box {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        * {
            box-sizing: border-box;
        }

        .tabs-box {
            height: 48px;
            overflow: hidden;
        }
        
        .tab-content {
            // background: red;
            width: 100%;
            height:~"calc(100% - 96px)";
        }
    }
  </style>
  