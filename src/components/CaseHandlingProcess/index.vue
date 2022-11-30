<template>

    <div class="case-handling-process">
        <div class="process-steps-layout">
            <el-scrollbar wrap-class="case-handling-process-scroll" ref="scrollbar">
                <div class="process-steps">

                    <div class="step-item" v-for="(item, index) in caseAreaUsedList" :key="index">
                        <div class="step-content" @click="handleCenterRecord(item, index)"
                            :class="{ 'on': index == currentCenterKey }">
                            <div class="step-name">{{ activeTypeNameMap[item.activeType] || '' }}</div>
                            <div class="step-time">
                                {{ (item.endTime && $moment(item.endTime).format('YYYY-MM-DD HH:mm:ss')) || ''
                                }}
                            </div>
                        </div>
                    </div>
                </div>

            </el-scrollbar>
        </div>
        <div class="process-content" v-if="currentRegisterId">
            <component :is="activeType" :inq-dict-list="inqDictList" :current-register-id="currentRegisterId"
                :current-index-code="currentIndexCode" :processCode="processCode"></component>
        </div>
        <div class="process-content" v-else>
            <div class="no-data">暂无数据</div>
        </div>

    </div>

</template>
<script>
import server from '../../server/ledgerManage'
export default {
    name: 'CaseHandlingProcess',
    props: {
        // currentRegisterId: {
        //     type: String,
        //     default() {
        //         return ''
        //     }
        // }
    },
    data() {
        return {
            currentIndexCode: '',
            processCode:'',
            inqDictList: {},
            currentRegisterId: '',
            currentCenterKey: 0,
            activeType: 'areaBasicInfo',
            activeTypeMap: {
                1: 'areaBasicInfo',
                2: 'areaPersonCheck',
                3: 'areaGoodsOfPerson',
                4: 'areaInfosAcquisition',
                5: 'areaDrugAbuse',
                8: 'areaReturnGoods',
                9: 'areaTempOut',
                10: 'areaFinalOut',
                12: 'areaDietRest',
            },
            activeTypeNameMap: {
                1: '入区登记',
                2: '人身检查',
                3: '物品登记',
                4: '信息采集',
                5: '吸毒检测',
                8: '物品归还',
                9: '临时出入区',
                10: '最终出区',
                12: '饮食休息'
            },
            caseAreaUsedList: [
            ],
        }
    },
    mounted() {
    },
    methods: {
        //初始化或更新流程
        init(currentRegisterId, inqDictList) {



            if ((this.currentRegisterId !== currentRegisterId) || this.inqDictList !== inqDictList) {
                this.currentRegisterId = currentRegisterId
                this.inqDictList = inqDictList
                this.currentRegisterId && this.getCenterActiveList()

            }



        },
        //获取办案流程
        async getCenterActiveList() {
            const res = await server.findActiveInfo({ registerIndexCode: this.currentRegisterId })
            const { data } = res
            if (data.code == '0') {
                let _data = data.data.filter((item) => {
                    return item.activeType !== 11 && item.activeType !== 6 && item.activeType !== 7 && item.activeType < 13
                })
                const resData = _data
                this.caseAreaUsedList = resData

                this.currentIndexCode = this.caseAreaUsedList[0].indexCode
                this.processCode = this.caseAreaUsedList[0].processCode
            this.currentCenterKey = 0
            this.activeType = this.activeTypeMap[this.caseAreaUsedList[0].activeType]
            } else {
                this.$messagebox(res)
            }
        },
        handleCenterRecord(items, idx) {
            this.currentIndexCode = items.indexCode
            this.processCode = items.processCode
            this.currentCenterKey = idx
            this.activeType = this.activeTypeMap[items.activeType]
        },

    },
    components: {
        areaBasicInfo: () => import("./components/areaBasicInfo"),
        areaPersonCheck: () => import("./components/areaPersonCheck"),
        areaGoodsOfPerson: () => import("./components/areaGoodsOfPerson"),
        areaInfosAcquisition: () => import("./components/areaInfosAcquisition"),
        areaDrugAbuse: () => import("./components/areaDrugAbuse"),
        areaReturnGoods: () => import("./components/areaReturnGoods"),
        areaTempOut: () => import("./components/areaTempOut"),
        areaFinalOut: () => import("./components/areaFinalOut"),
        areaDietRest: () => import("./components/areaDietRest"),
    },
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.case-handling-process {
    width: 100%;
    height: 100%;
    margin: 0 auto;

    .process-steps-layout {
        height: 100%;
        width: 190px;
        display: inline-block;
        vertical-align: top;
    }

    .process-steps {
        height: 100%;
        display: inline-block;
        vertical-align: top;
        width: 190px;
        padding-left: 25px;

        .step-item {
            height: 85px;
            position: relative;

            &::before {
                content: '';
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 12px;
                border: solid 2px #2080f7;
                position: absolute;
                left: -20px;
                top: 5px;
            }

            &::after {
                content: '';
                display: inline-block;
                width: 1;
                height: ~'calc(100% - 12px)';
                border-left: solid 1px #2080f7;
                position: absolute;
                left: -15px;
                top: 17px;
            }

            &:last-child {
                &::after {
                    opacity: 0;
                }
            }

            .step-content {
                width: 130px;
                height: 50px;
                border: 1px solid rgba(0, 0, 0, 0.2);
                background: #FFFFFF;
                border-radius: 4px;
                cursor: pointer;
                padding-left: 6px;
                padding-top: 4px;

                &.on {
                    border: 1px solid #2196F3;
                    box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.1)
                }

                &:hover {
                    border: 1px solid #2196F3;
                    box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.1)
                }

                .step-name {
                    font-weight: 600;
                    font-size: 16px;
                    font-style: normal;
                    color: #4D4D4D;
                    // margin-bottom: 5px;
                }

                .step-time {
                    color: #999;
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 20px;
                }

            }

        }
    }

    .process-content {
        display: inline-block;
        height: 100%;
        vertical-align: top;
        width: ~'calc(100% - 190px)';
        position: relative;

        .no-data {
            font-size: 14px;
            width: 100%;
            text-align: center;
            position: relative;
            color: #999;
            top: calc(~"50% - 48px");
        }
    }
}

/deep/.case-handling-process-scroll {
    height: 100%;
    overflow-x: hidden;
}
</style>
  