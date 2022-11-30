<template>
    <div class="case-patrol-tab">
        <div class="case-patrol-info-box">
            <el-scrollbar wrap-class="case-patrol-info-scrollbar" ref="caseScrollbar" @on-scrolling-y="scrollHandle">
                <div class="case-patrol-item">
                    <div class="item-title" id="ajxx"><i class="item-title-icon"><i></i></i>案件信息</div>
                    <div class="info-form-box">
                        <div class="info-row">
                            <div class="info-col col-4">
                                <div class="info-label">案件编号</div>
                                <div class="info-value">{{ caseDetailData.caseNo }}</div>
                            </div>
                            <div class="info-col col-4">
                                <div class="info-label">案件名称</div>
                                <div class="info-value">{{ caseDetailData.caseName }}</div>
                            </div>
                            <div class="info-col col-4">
                                <div class="info-label">案件类型</div>
                                <div class="info-value">{{ caseTypeMap[caseDetailData.caseType] }}</div>
                            </div>
                            <div class="info-col col-4">
                                <div class="info-label">案件状态</div>
                                <div class="info-value">{{caseStatusMap[caseDetailData.status]}}</div>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-col col-4">
                                <div class="info-label">案件级别</div>
                                <div class="info-value">{{ caseLevelMap[caseDetailData.caseLevel] }}</div>
                            </div>
                            <div class="info-col col-4">
                                <div class="info-label">案由</div>
                                <div class="info-value">{{ caseDetailData.caseCause &&
                                        caseDetailData.caseCause.split(',').map((key) => {
                                            return briefMap[key]
                                        }).join('，')
                                }}</div>
                            </div>
                            <div class="info-col col-4">
                                <div class="info-label">案发时间</div>
                                <div class="info-value">{{ caseDetailData.happenTime &&
                                        $moment(caseDetailData.happenTime).format('YYYY-MM-DD HH:mm:ss')
                                }}</div>
                            </div>
                            <div class="info-col col-4">
                                <div class="info-label">案发地点</div>
                                <div class="info-value">{{ caseDetailData.happenPlace }}</div>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-col col-4">
                                <div class="info-label">受理时间</div>
                                <div class="info-value">{{ caseDetailData.acceptanceTime &&
                                        $moment(caseDetailData.acceptanceTime).format('YYYY-MM-DD HH:mm:ss')
                                }}</div>
                            </div>
                            <div class="info-col col-4">
                                <div class="info-label">立案时间</div>
                                <div class="info-value">{{ caseDetailData.filingTime &&
                                        $moment(caseDetailData.filingTime).format('YYYY-MM-DD HH:mm:ss')
                                }}</div>
                            </div>
                            <div class="info-col col-4">
                                <div class="info-label">结案时间</div>
                                <div class="info-value">{{ caseDetailData.caseCloseTime &&
                                        $moment(caseDetailData.caseCloseTime).format('YYYY-MM-DD HH:mm:ss')
                                }}</div>
                            </div>
                            <div class="info-col col-4">
                                <div class="info-label">承办单位</div>
                                <div class="info-value">{{ caseDetailData.unitName }}</div>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-col col-2">
                                <div class="info-label">承办人</div>
                                <div class="info-value">{{ caseDetailData.caseHandlers &&
                                        caseDetailData.caseHandlers.map((item) => { return item.name }).join(',')
                                }}</div>
                            </div>
                            <!-- <div class="info-col col-4">
                                <div class="info-label">警情编号</div>
                                <div class="info-value">{{ caseDetailData.policeSituationNo }}</div>
                            </div> -->
                            <div class="info-col col-2">
                                <div class="info-label">简要案情</div>
                                <div class="info-value">{{ caseDetailData.briefCase }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="case-patrol-item">
                    <div class="item-title" id="jjxx"><i class="item-title-icon"><i></i></i>警情信息</div>
                    <div class="detail-title">
                        <div class="detail-title-label">警情编号</div>
                        <div class="detail-title-value w-120" :title="policeSituationInfo.policeSituationNo">{{ policeSituationInfo.policeSituationNo }}</div>
                        <div class="detail-title-label">内容简介</div>
                        <div class="detail-title-value w-700" :title="policeSituationInfo.reportContent">{{ policeSituationInfo.reportContent }}</div>
                        <!-- <div class="detail-title-type">大家斗殴</div> -->
                    </div>
                    <div class="info-form-box">
                        <div class="info-row">
                            <div class="info-col col-3">
                                <div class="info-label">报警时间</div>
                                <div class="info-value">
                                    {{ policeSituationInfo.reportTime &&
                                            $moment(policeSituationInfo.reportTime).format('YYYY-MM-DD HH:mm:ss')
                                    }}
                                </div>
                            </div>
                            <div class="info-col col-3">
                                <div class="info-label">接警时间</div>
                                <div class="info-value">
                                    {{ policeSituationInfo.receiveTime &&
                                            $moment(policeSituationInfo.receiveTime).format('YYYY-MM-DD HH:mm:ss')
                                    }}
                                </div>
                            </div>
                            <div class="info-col col-3">
                                <div class="info-label">处警时间</div>
                                <div class="info-value">
                                    {{ policeSituationInfo.handleTime &&
                                            $moment(policeSituationInfo.handleTime).format('YYYY-MM-DD HH:mm:ss')
                                    }}
                                </div>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-col col-3">
                                <div class="info-label">报警人</div>
                                <div class="info-value">{{ policeSituationInfo.reporterName }}</div>
                            </div>
                            <div class="info-col col-3">
                                <div class="info-label">接警民警</div>
                                <div class="info-value">{{ policeSituationInfo.receivePoliceName }}</div>
                            </div>
                            <div class="info-col col-3">
                                <div class="info-label">处警单位</div>
                                <div class="info-value">{{ policeSituationInfo.handleDeptName }}</div>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-col col-1">
                                <div class="info-label">处理结果</div>
                                <div class="info-value" :title="policeSituationInfo.handleResult">{{ policeSituationInfo.handleResult }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="case-patrol-item">
                    <div class="item-title" id="sary"><i class="item-title-icon"><i></i></i>涉案人员</div>
                    <el-scrollbar wrap-class="jzxx-scrollbar" v-if="suspectInfos && suspectInfos.length > 0">
                        <div class="person-card-box">
                            <div class="person-card-item" v-for="(item, index) in suspectInfos" :key="index">
                                <div class="perosn-pic">
                                    <img class="img-val" v-if="item.suspectPhoto" :src="item.suspectPhoto" alt="">
                                </div>
                                <div class="person-info">
                                    <div class="person-name">{{ item.suspectName }}<i class="sex-icon"></i></div>
                                    <div class="person-info-item" :title="certificateTypeMap[item.certificateType]">
                                        <div class="item-label">证件类型</div>
                                        <div class="item-value">{{ certificateTypeMap[item.certificateType] }}</div>
                                    </div>
                                    <div class="person-info-item" :title="item.certificateNo">
                                        <div class="item-label">证件号码</div>
                                        <div class="item-value">{{ item.certificateNo }}</div>
                                    </div>
                                    <div class="person-info-item">
                                        <div class="item-label">联系方式</div>
                                        <div class="item-value">{{ item.mobile }}</div>
                                    </div>
                                    <div class="person-info-item">
                                        <div class="item-label">户籍地址</div>
                                        <div class="item-value">{{ item.permanentAddress }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                    <div class="no-data" v-else>暂无数据</div>
                </div>

                <div class="case-patrol-item">
                    <div class="item-title" id="baqjl"><i class="item-title-icon"><i></i></i>办案区流程</div>
                    <div class="person-tab-box">
                        <div class="person-tab-item" @click="processPersonClickHandle(item)"
                            :class="{ on: currentRegisterId === item.registerIndexCode }"
                            v-for="(item, index) in personList" :title="item.registerName">{{ item.registerName || '--'
                            }}</div>
                    </div>
                    <div class="person-tab-content">
                        <CaseHandlingProcess ref="CaseHandlingProcess" :current-register-id="currentRegisterId">
                        </CaseHandlingProcess>
                    </div>

                </div>

                <div class="case-patrol-item">
                    <div class="item-title" id="xwjl"><i class="item-title-icon"><i></i></i>讯问记录</div>
                    <div class="record-box" v-if="interrogationsList && interrogationsList.length > 0">
                        <template v-for="(item, index) in interrogationsList">
                            <div class="record-row" v-for="(detail, index) in item.interrogationDtos"
                                :key="item.indexCode">
                                <div class="record-name" :title="detail.suspectName">{{ detail.suspectName }}</div>
                                <div class="record-room" :title="detail.roomName">{{ detail.roomName }}</div>
                                <div class="record-item interrogate-type">
                                    <div class="record-item-label">类型</div>
                                    <div class="record-item-value">{{ inquestTypeMap[detail.interrogateType] }}</div>
                                </div>
                                <div class="record-item">
                                    <div class="record-item-label">时间</div>
                                    <div class="record-item-value time-value">
                                        {{ $moment(detail.beginTime).format('YYYY-MM-DD HH:mm:ss') }} -
                                        {{ detail.endTime && $moment(detail.endTime).format('YYYY-MM-DD HH:mm:ss') }}
                                    </div>
                                </div>
                                <div class="record-item">
                                    <div class="record-item-label">时长</div>
                                    <div class="record-item-value long-value">
                                        {{ diffTime(detail.beginTime, detail.endTime).time }}</div>
                                </div>
                                <div class="record-item">
                                    <div class="record-item-label">办案人员</div>
                                    <div class="record-item-value person-value" :title="detail.interrogateHandlers.map((handler) => {
                                        return (handler.deptName + '/' + handler.personName)
                                    
                                    }).join(',')">
                                        {{ detail.interrogateHandlers.map((handler) => {
                                                return (handler.deptName + '/' + handler.personName)
                                        
                                            }).join(',')
                                        }}</div>
                                    <!-- 刑侦科/李燕 -->
                                </div>
                                <div class="record-item">
                                    <div class="record-item-btn" @click="handleExport(detail.indexCode)">笔录</div>
                                    <!-- <div class="record-item-btn">视频</div> -->
                                </div>

                            </div>
                        </template>
                    </div>
                    <div class="no-data" v-else>暂无数据</div>

                </div>

                <div class="case-patrol-item">
                    <div class="item-title" id="sacw"><i class="item-title-icon"><i></i></i>涉案财物</div>
                    <div class="item-table-box">
                        <el-table :data="goodsDetailData" force-scroll style="width: 100%">
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <el-table :data="props.row.goodsTransferInfos"
                                        :style="!(props.row.goodsTransferInfos && props.row.goodsTransferInfos.length) ? 'min-height:100px;' : 'height:100%;'"
                                        force-scroll header-row-class-name="goodsInfoTable"
                                        style="width: 100%;height:100%;">
                                        <el-table-column label="序号" type="index" width="90">
                                            <template slot-scope="props">（{{ props.$index + 1 }}）</template>
                                        </el-table-column>
                                        <el-table-column label="物品操作">
                                            <template slot-scope="scope">{{
                                                    caseGoodOperatorType[scope.row.goodsOperator]
                                            }}</template>
                                        </el-table-column>
                                        <el-table-column label="操作时间">
                                            <template slot-scope="scope">{{ scope.row.operatorTime &&
                                                    $moment(scope.row.operatorTime).format('YYYY-MM-DD HH: mm: ss')
                                            }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作原因">
                                            <template slot-scope="scope">{{
                                                    caseGoodOutStockReason[scope.row.outstockReason]
                                            }}</template>
                                        </el-table-column>
                                        <el-table-column label="操作人" prop="operatorName"></el-table-column>
                                    </el-table>
                                </template>
                            </el-table-column>
                            <el-table-column label="序号" type="index" width="60"></el-table-column>
                            <el-table-column label="物品名称" prop="name"></el-table-column>
                            <el-table-column label="物品编号" prop="indexCode"></el-table-column>
                            <el-table-column label="场所名称" prop="areaName"></el-table-column>
                            <el-table-column label="物品类型">
                                <template slot-scope="scope">{{ scope.row.typeName || '其他' }}</template>
                            </el-table-column>
                            <el-table-column label="物品状态">
                                <template slot-scope="scope">{{ scope.row.statusName }}</template>
                            </el-table-column>
                            <el-table-column label="物品数量" prop="num"></el-table-column>
                            <el-table-column label="物品单位" prop="unit" show-overflow-title>
                                <template slot-scope="scope">{{ scope.row.unit }}</template>
                            </el-table-column>
                            <el-table-column label="物品特征" prop="feature"></el-table-column>
                            <el-table-column label="物品来源">
                                <template slot-scope="scope">{{ caseGoodSource[scope.row.source] }}</template>
                            </el-table-column>
                            <el-table-column label="存放位置" prop="position"></el-table-column>
                            <el-table-column label="是否在库">
                                <template slot-scope="scope">{{ scope.row.stock == 1 ? '是' : '否' }}</template>
                            </el-table-column>
                            <el-table-column label="是否调用">
                                <template slot-scope="scope">{{ scope.row.call == 1 ? '是' : '否' }}</template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>

                <div class="case-patrol-item">
                    <div class="item-title" id="jzxx"><i class="item-title-icon"><i></i></i>卷宗信息</div>

                    <el-scrollbar wrap-class="jzxx-scrollbar"
                        v-if="folderDetailDataList && folderDetailDataList.length > 0">

                        <div class="folder-detail-item" v-for="(folderDetailData, index) in folderDetailDataList">
                            <div class="info-form-box">

                                <div class="info-row">
                                    <div class="info-col col-4">
                                        <div class="info-label">卷宗名称</div>
                                        <div class="info-value" :title="folderDetailData.name">{{ folderDetailData.name
                                        }}
                                        </div>
                                    </div>
                                    <div class="info-col col-4">
                                        <div class="info-label">卷宗编号</div>
                                        <div :title="folderDetailData.indexCode" class="info-value">
                                            {{ folderDetailData.indexCode }}
                                        </div>
                                    </div>
                                    <div class="info-col col-4">
                                        <div class="info-label">卷宗类型</div>
                                        <div class="info-value">{{ folderType[folderDetailData.type] }}</div>
                                    </div>
                                    <div class="info-col col-4">
                                        <div class="info-label">卷宗状态</div>
                                        <div class="info-value">{{ folderStatus[folderDetailData.status] }}</div>
                                    </div>
                                </div>
                                <div class="info-row">

                                    <div class="info-col col-4">
                                        <div class="info-label">是否归档</div>
                                        <div :title="caseStatus[folderDetailData.closeFlag]" class="info-value">{{
                                                caseStatus[folderDetailData.closeFlag]
                                        }}
                                        </div>
                                    </div>
                                    <div class="info-col col-4">
                                        <div class="info-label">立卷人</div>
                                        <div :title="folderDetailData.creator" class="info-value">{{
                                                folderDetailData.creator
                                        }}</div>
                                    </div>
                                    <div class="info-col col-4">
                                        <div class="info-label">送卷人</div>
                                        <div :title="folderDetailData.sender" class="info-value">{{
                                                folderDetailData.sender
                                        }}</div>
                                    </div>
                                    <div class="info-col col-4">
                                        <div class="info-label">场所名称</div>
                                        <div :title="folderDetailData.placeName" class="info-value">{{
                                                folderDetailData.placeName
                                        }}
                                        </div>
                                    </div>
                                </div>
                                <div class="info-row">

                                    <div class="info-col col-1">
                                        <div class="info-label">登记单位</div>
                                        <div :title="folderDetailData.registerDeptName" class="info-value">{{
                                                folderDetailData.registerDeptName
                                        }}</div>
                                    </div>

                                </div>
                            </div>
                            <div class="item-title-sm">卷宗流转记录</div>
                            <div class="item-table-box jzxx">
                                <el-table :data="folderDetailData.folderTransferInfos" force-scroll style="width: 100%">
                                    <el-table-column label="序号" type="index" width="60"></el-table-column>
                                    <el-table-column label="卷宗操作">
                                        <template slot-scope="scope">
                                            {{ folderTransferType[scope.row.folderOperator] }}</template>
                                    </el-table-column>
                                    <el-table-column label="操作时间">
                                        <template slot-scope="scope">
                                            {{ scope.row.operatorTime &&
                                                    $moment(scope.row.operatorTime).format('YYYY-MM-DD HH:mm:ss')
                                            }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作原因">
                                        <template slot-scope="scope">
                                            {{ folderReason[scope.row.operatorReason] }}</template>
                                    </el-table-column>
                                    <el-table-column label="操作人" prop="operatorName">
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-scrollbar>
                    <div class="no-data" v-else>暂无数据</div>

                </div>

                <div class="case-patrol-item">
                    <div class="item-title" id="yspzl"><i class="item-title-icon"><i></i></i>音视频资料</div>
                    <audioVideoInfo></audioVideoInfo>

                </div>
            </el-scrollbar>
        </div>
        <div class="case-patrol-process-box">
            <div class="process-content">
                <div class="process-item" :class="{ 'on': scrollTopMap['ajxx'] }" @click="scrollXHandle('ajxx')">案件信息
                </div>
                <div class="process-item" :class="{ 'on': scrollTopMap['jjxx'] }" @click="scrollXHandle('jjxx')">警情信息
                </div>
                <div class="process-item" :class="{ 'on': scrollTopMap['sary'] }" @click="scrollXHandle('sary')">涉案人员
                </div>
                <div class="process-item" :class="{ 'on': scrollTopMap['baqjl'] }" @click="scrollXHandle('baqjl')">办案区流程
                </div>
                <div class="process-item" :class="{ 'on': scrollTopMap['xwjl'] }" @click="scrollXHandle('xwjl')">讯问记录
                </div>
                <div class="process-item" :class="{ 'on': scrollTopMap['sacw'] }" @click="scrollXHandle('sacw')">涉案财物
                </div>
                <div class="process-item" :class="{ 'on': scrollTopMap['jzxx'] }" @click="scrollXHandle('jzxx')">卷宗信息
                </div>
                <div class="process-item" :class="{ 'on': scrollTopMap['yspzl'] }" @click="scrollXHandle('yspzl')">音视频资料
                </div>
            </div>

        </div>
        <div class="case-patrol-form-box">
            <SupervisionEvaluationForm ref="SupervisionEvaluationForm"></SupervisionEvaluationForm>
        </div>
    </div>
</template>
<script>
import server from "../../../server/casePatrol";
import CaseHandlingProcess from "../../../components/CaseHandlingProcess/index.vue";
import SupervisionEvaluationForm from "../../../components/SupervisionEvaluationForm/index.vue"
export default {
    props: {

    },
    data() {
        let queryParam = this.$route.query;
        // queryParam.indexCode = 'b40e6e110f4247d9a56dbbec5f41353f'
        return {
            queryParam: queryParam,
            dictData: {},
            scrollTop: 0,
            scrollTopMap: {
                'ajxx': true,
                'jjxx': false,
                'sary': false,
                'baqjl': false,
                'xwjl': false,
                'sacw': false,
                'jzxx': false,
                'yspzl': false,
            },

            /**
             * 字典map
             */


            /**
             * 案件信息
             */
            caseDetailData: {},
            briefMap: {},
            caseTypeMap: {},
            caseLevelMap: {},
            caseStatusMap: {},

            /**
             * 警情信息
             */
            policeSituationInfo: {},

            /**
             * 涉案人信息
             */
            suspectInfos: [],
            certificateTypeMap: {},

            /**
             * 办案区流程涉及到的数据
             */
            personList: [],
            personTypeMap: {},
            sexMap: {},
            currentCenterKey: 0,
            currentRegisterId: '',
            inqDictList: [],

            /**
             * 讯问记录
             */
            interrogationsList: [],
            inquestTypeMap: {},


            /**
             * //涉案财物信息
             */
            goodsDetailData: [],
            // 物品类型
            caseGoodType: {
            },
            // 物品状态
            caseGoodStatus: {
            },
            // 物品来源
            caseGoodSource: {
            },
            // 物品操作
            caseGoodOperatorType: {
            },
            // 出库原因
            caseGoodOutStockReason: {
                '0': '调用',
                '1': '没收',
                '2': '发还',
                '3': '销毁',
                '4': '拍卖',
                '5': '变卖',
                '6': '收缴',
                '7': '追缴',
                '8': '随案移送',
                '9': '上缴国库',
                '10': '解除查封',
                '11': '解除冻结',
                '12': '随案附卷',
            },

            /**
             * //卷宗信息
             */
            folderDetailDataList: [],
            folderDetailData: {},
            folderStatus: {
            }, //卷宗状态
            folderType: {
            }, //卷宗类型
            folderTransferType: {
            },//卷宗操作
            folderReason: {
            },//出入库原因
            caseStatus: {
                0: '否',
                1: '是'
            },//是否归档


            //导航条相关
            scorllLock: false,
            scrollTimer: null
        }
    },
    async mounted() {
        await this.inqDict()
        //获取案件信息
        await this.caseBaseInfo()

        //获取警情信息
        this.findCaseRelatedPoliceSituationInfo()

        //获取讯询问记录
        this.loadInterrogations()

        //获取办案流程数据
        this.loadCaseArea()


        //获取涉案财物数据
        this.getCaseGoodsInfos()

        //获取卷宗信息数据
        this.folderInfo()

        this.$refs.SupervisionEvaluationForm.init('case', this.queryParam.indexCode, [this.queryParam.caseType]) //'1': '行政案件巡查','2': '刑事案件巡查',
    },
    methods: {

        getAllScrollTop() {


        },
        scrollXHandle(type) {
            let ele = document.getElementById(type)
            this.scrollTop = ele.offsetTop
            console.log(ele.offsetTop)
            this.$refs.caseScrollbar.setScroll(ele.offsetTop);
            this.scrollTopMap = {
                'ajxx': false,
                'jjxx': false,
                'sary': false,
                'baqjl': false,
                'xwjl': false,
                'sacw': false,
                'jzxx': false,
                'yspzl': false,
            }
            this.scrollTopMap[type] = true
            this.scorllLock = true
            setTimeout(() => {
                this.scorllLock = false
            }, 800)
            // this.scrollTopMap = scrollTopMap
        },
        scrollHandle(data) {
            if (this.scorllLock) {
                return false
            }

            this.scrollTimer && clearTimeout(this.scrollTimer)
            this.scrollTimer = setTimeout(() => {
                let scrollTopMap = {
                    'ajxx': false,
                    'jjxx': false,
                    'sary': false,
                    'baqjl': false,
                    'xwjl': false,
                    'sacw': false,
                    'jzxx': false,
                    'yspzl': false,
                }

                let scrollTop = data.scrollTop

                let ajxxTop = document.getElementById('ajxx').offsetTop
                let jjxxTop = document.getElementById('jjxx').offsetTop
                let saryTop = document.getElementById('sary').offsetTop
                let baqjlTop = document.getElementById('baqjl').offsetTop
                let xwjlTop = document.getElementById('xwjl').offsetTop
                let sacwTop = document.getElementById('sacw').offsetTop
                let jzxxTop = document.getElementById('jzxx').offsetTop
                let yspzlTop = document.getElementById('yspzl').offsetTop




                scrollTopMap.ajxx = (scrollTop < jjxxTop)
                scrollTopMap.jjxx = (scrollTop >= jjxxTop && scrollTop < saryTop)
                scrollTopMap.sary = (scrollTop >= saryTop && scrollTop < baqjlTop)
                scrollTopMap.baqjl = (scrollTop >= baqjlTop && scrollTop < xwjlTop)
                scrollTopMap.xwjl = (scrollTop >= xwjlTop && scrollTop < sacwTop)
                scrollTopMap.sacw = (scrollTop >= sacwTop && scrollTop < (jzxxTop))
                scrollTopMap.jzxx = (scrollTop >= (jzxxTop) && scrollTop < yspzlTop)
                scrollTopMap.yspzl = (scrollTop >= yspzlTop)

                this.scrollTopMap = scrollTopMap
            }, 200)

            console.log(data)
            // console.log(data.scrollTop)

        },
        // 获取案件信息
        async caseBaseInfo() {
            if (this.queryParam.indexCode) {
                let params = { indexCode: this.queryParam.indexCode }
                const result = await server.caseBaseInfo(params)
                const { data } = result
                if (data.code === '0') {
                    this.caseDetailData = data.data
                    this.suspectInfos = data.data.suspectInfos
                } else {
                    this.$messagebox(result)
                }
            }
        },
        //获取警情信息 findCaseRelatedPoliceSituationInfo
        async findCaseRelatedPoliceSituationInfo() {
            if (this.queryParam.indexCode) {
                let params = {
                    caseIndexCode: this.queryParam.indexCode, pageNo: 1,
                    pageSize: 20
                }
                const result = await server.findCaseRelatedPoliceSituationInfo(params)
                const { data } = result
                if (data.code === '0') {
                    this.policeSituationInfo = data.data.list[0] || {}
                    // this.caseDetailData = data.data
                    // this.suspectInfos = data.data.suspectInfos
                } else {
                    this.$messagebox(result)
                }
            }
        },
        //获取讯询问记录 loadInterrogations
        async loadInterrogations() {
            if (this.queryParam.indexCode) {
                let params = {
                    caseCode: this.queryParam.indexCode
                }
                const result = await server.loadInterrogations(params)
                const { data } = result
                if (data.code === '0') {
                    this.interrogationsList = data.data
                    // this.policeSituationInfo = data.data.list[0]
                    // this.caseDetailData = data.data
                    // this.suspectInfos = data.data.suspectInfos
                } else {
                    this.$messagebox(result)
                }
            }
        },
        //查看笔录
        async handleExport(indexCode) {
            if (indexCode) {
                let parmas = {
                    interrogationCode: indexCode
                }
                let res = await server.getInterrogationRecordPrintUrl(parmas)
                if (res.data.code === '0') {
                    if (res.data.data) {
                        window.open(res.data.data, '_blank')
                        // let myWindow = window.open(res.data.data)
                        // myWindow.onload = function () {
                        //   setTimeout(() => { myWindow.document.title = '讯(询)问笔录' }, 500)
                        // }
                    } else {
                        this.$message.error('笔录信息不存在')
                    }
                } else {
                    this.$messagebox(res)
                }
            }
        },
        processPersonClickHandle(item) {
            this.currentRegisterId = item.registerIndexCode
            this.$refs.CaseHandlingProcess.init(this.currentRegisterId, this.inqDictList)

        },

        //获取办案区流程人员信息
        async loadCaseArea() {
            let params = {
                indexCode: this.queryParam.indexCode
            };
            const result = await server.loadCaseArea(params);
            const { data } = result;
            if (data.code === "0") {
                this.personList = data.data || []
                this.personList[0] && (this.currentRegisterId = this.personList[0].registerIndexCode)

                this.$refs.CaseHandlingProcess.init(this.currentRegisterId, this.inqDictList)

            } else {
                this.$messagebox(result);
            }
        },


        // 获取涉案财物信息
        async getCaseGoodsInfos() {
            if (this.queryParam.indexCode) {
                let params = { caseIndexCode: this.queryParam.indexCode }
                const result = await server.getCaseGoodsInfos(params)
                const { data } = result
                if (data.code === '0') {
                    this.goodsDetailData = data.data || []
                } else {
                    this.$messagebox(result)
                }
            }
        },
        // 获取卷宗基本信息
        async folderInfo() {
            if (this.queryParam.indexCode) {
                let params = { caseIndexCode: this.queryParam.indexCode }
                const result = await server.getFolderInfo(params)
                const { data } = result
                if (data.code === '0') {
                    this.folderDetailDataList = data.data || []
                } else {
                    this.$messagebox(result)
                }
            }
        },

        //计算在区时长
        diffTime(startTime, endTime) {
            let H = ''
            let m = ''
            if (endTime) {
                H = this.$moment(endTime).diff(this.$moment(startTime), 'hours')
                m = this.$moment(endTime).diff(this.$moment(startTime), 'minutes') % 24
            } else {
                H = this.$moment().diff(this.$moment(startTime), 'hours')
                m = this.$moment().diff(this.$moment(startTime), 'minutes') % 24
            }


            return { hour: parseInt(H), time: `${H}小时${m}分` }


        },
        // 数据字典
        async inqDict() {
            let params = {
                codes: "inqfd.caseType,inqfd.inquestType,inqfd.brief,inqfd.caseLevel,common.human_certificate_type,inqfd.caseStatus,",
            };
            params.codes += 'common.human_gender,inqfd.suspectType,inqfd.registerType,inqfd.collectItem,inqfd.handleResult'
            params.codes += ',inqfd.temporaryLeaveReason,inqfd.checkSample,inqfd.sampleDrugItem,inqfd.caseGoodStatus,inqfd.caseGoodSource,inqfd.caseGoodOperatorType'
            params.codes += ',inqfd.caseGoodType,inqfd.caseGoodOutStockReason,inqfd.folderStatus,inqfd.folderType,inqfd.folderTransferType,inqfd.folderReason'
            params.codes += ",inqfd.casehandlingmgt.rest.type,inqfd.casehandlingmgt.translation.type,inqfd.casehandlingmgt.special.population.type,inqfd.casehandlingmgt.rest.type"
            let res = await server.getDict(params);
            if (res.data.code === "0") {
                let data = res.data.data;
                this.inqDictList = data
                this.dictData = data;
                this.personTypeMap = this.computedDic(data['inqfd.suspectType']);
                this.inquestTypeMap = this.computedDic(data['inqfd.inquestType']);
                this.briefMap = this.computedDic(data['inqfd.brief']);
                this.caseTypeMap = this.computedDic(data['inqfd.caseType']);
                this.caseLevelMap = this.computedDic(data['inqfd.caseLevel']);
                this.certificateTypeMap = this.computedDic(data['common.human_certificate_type']);
                this.caseStatusMap = this.computedDic(data['inqfd.caseStatus']);

                this.sexMap = this.computedDic(data['common.human_gender']);

                this.caseGoodStatus = this.computedDic(data['inqfd.caseGoodStatus']);

                this.caseGoodSource = this.computedDic(data['inqfd.caseGoodSource']);

                this.caseGoodOperatorType = this.computedDic(data['inqfd.caseGoodOperatorType']);

                this.caseGoodType = this.computedDic(data['inqfd.caseGoodType']);

                this.caseGoodOutStockReason = this.computedDic(data['inqfd.caseGoodOutStockReason']);

                this.folderStatus = this.computedDic(data['inqfd.folderStatus']);

                this.folderType = this.computedDic(data['inqfd.folderType']);

                this.folderTransferType = this.computedDic(data['inqfd.folderTransferType']);

                this.folderReason = this.computedDic(data['inqfd.folderReason']);

                this.$refs.CaseHandlingProcess.init(this.currentRegisterId, this.dictData)
            } else {
                this.$messagebox(res);
            }
        },
        computedDic(list) {
            let dicMap = {};
            if (list && list.length) {
                for (let i = 0; i < list.length; i++) {
                    dicMap[list[i].key] = list[i].name;
                }
            }
            return dicMap;
        },

    },
    components: {
        audioVideoInfo: () => import("./audioVideoInfo"),
        CaseHandlingProcess,
        SupervisionEvaluationForm
    },
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.case-patrol-tab {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    * {
        box-sizing: border-box;
    }

    .case-patrol-info-box {
        display: inline-block;
        vertical-align: top;
        padding-top: 22px;
        height: 100%;
        width: ~'calc(100% - 743px)';
        padding-right: 21px;
    }

    .case-patrol-item {
        width: 100%;
        padding-left: 25px;
        margin-bottom: 24px;
        position: relative;
        min-height: 200px;

        .no-data {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            color: #999;
        }

        .item-title {
            font-size: 16px;
            color: rgba(0, 0, 0, 0.90);
            letter-spacing: 0;
            font-weight: 400;
            margin-bottom: 16px;

            .item-title-icon {
                width: 16px;
                height: 16px;
                display: inline-block;
                position: relative;
                top: 3px;
                vertical-align: top;
                margin-right: 8px;

                &::before {
                    content: '';
                    display: inline-block;
                    width: 7px;
                    height: 7px;
                    background: #2D72FC;
                    position: absolute;
                    left: 0px;
                    top: 0px;
                    border-radius: 1px;
                }

                &::after {
                    content: '';
                    display: inline-block;
                    width: 7px;
                    height: 7px;
                    background: #2D72FC;
                    position: absolute;
                    left: 9px;
                    top: 0px;
                    border-radius: 1px;
                    transform: rotate(45deg);
                }

                i {
                    &::before {
                        content: '';
                        display: inline-block;
                        width: 7px;
                        height: 7px;
                        background: #2D72FC;
                        position: absolute;
                        left: 0px;
                        top: 9px;
                        border-radius: 1px;
                    }

                    &::after {
                        content: '';
                        display: inline-block;
                        width: 7px;
                        height: 7px;
                        background: #2D72FC;
                        position: absolute;
                        left: 9px;
                        top: 9px;
                        border-radius: 1px;
                    }
                }

            }
        }

        .item-title-sm {
            margin: 10px 0px 6px 0px;
        }

        .info-form-box {
            border-bottom: 1px solid #E5E5E5;
            border-right: 1px solid #E5E5E5;

            .info-row {}

            .info-col {
                display: inline-block;
                vertical-align: top;
                border-top: 1px solid #E5E5E5;
                border-left: 1px solid #E5E5E5;
                white-space: nowrap;

                &.col-4 {
                    width: 25%;
                }

                &.col-1 {
                    width: 100%;
                }

                &.col-2 {
                    width: 50%;
                }

                &.col-3 {
                    width: 33.3%;
                }

                .info-label {
                    display: inline-block;
                    vertical-align: top;
                    height: 40px;
                    width: 110px;
                    line-height: 40px;
                    padding-left: 16px;
                    background: #FAFAFA;
                    border-right: 1px solid #E5E5E5;
                    font-size: 14px;
                    color: rgba(0, 0, 0, 0.90);

                }

                .info-value {
                    display: inline-block;
                    vertical-align: top;
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                    color: rgba(0, 0, 0, 0.70);
                    padding-left: 16px;
                    width: ~'calc(100% - 110px)';
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }

        }

        .folder-detail-item {
            border-bottom: solid 1px #e5e5e5;
            margin-bottom: 8px;
        }

        .detail-title {
            margin-bottom: 16px;

            .detail-title-label {
                display: inline-block;
                vertical-align: middle;
                color: rgba(0, 0, 0, 0.50);
                margin-right: 10px;
            }

            .detail-title-value {
                display: inline-block;
                vertical-align: middle;
                color: rgba(0, 0, 0, 0.70);
                margin-right: 41px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                &.w-120 {
                    max-width: 130px;
                }
                &.w-700 {
                    max-width: 700px;
                }
            }

            .detail-title-type {

                width: 72px;
                height: 24px;
                display: inline-block;
                vertical-align: middle;
                font-size: 14px;
                color: #FFFFFF;
                letter-spacing: 0;
                text-align: center;
                line-height: 24px;
                font-weight: 700;
                background-image: linear-gradient(56deg, #2D72FC 0%, #C3DDFF 100%);
                border-radius: 0 4px 0 4px;
            }

        }

        .person-card-box {
            .person-card-item {
                display: inline-block;
                vertical-align: top;
                width: 31%;
                height: 152px;
                border: 1px solid rgba(0, 0, 0, 0.08);
                border-radius: 4px;
                margin-right: 3%;
                margin-bottom: 15px;
                overflow: hidden;
                padding: 10px;

                &:nth-child(3n) {
                    margin-right: 0px;
                    // background: #2D72FC;
                }

                .perosn-pic {
                    display: inline-block;
                    vertical-align: top;
                    width: 100px;
                    height: 100%;
                    margin-right: 10px;
                    background: url('../../../assets/image/photo.png') no-repeat;
                    background-size: 100% 100%;
                    .img-val {
                        display: inline-block;
                        width: 100%;
                        height: 100%;
                        // background: url('../../../assets/image/photo.png') no-repeat;
                        
                    }
                }

                .person-info {
                    display: inline-block;
                    vertical-align: top;
                    width: ~'calc(100% - 120px)';

                    .person-name {
                        font-size: 18px;
                        color: #000;
                        font-weight: 500;
                        margin-bottom: 8px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .sex-icon {}

                    .person-info-item {
                        margin-bottom: 3px;

                        .item-label {
                            width: 68px;
                            font-size: 14px;
                            color: rgba(0, 0, 0, 0.40);
                            font-weight: 400;
                            display: inline-block;
                            vertical-align: top;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }

                        .item-value {
                            width: ~'calc(100% - 75px)';
                            font-size: 14px;
                            color: rgba(0, 0, 0, 0.70);
                            font-weight: 400;
                            display: inline-block;
                            vertical-align: top;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }

                }

            }

        }

        .person-tab-box {
            margin-bottom: 20px;

            .person-tab-item {
                display: inline-block;
                vertical-align: top;
                border: 1px solid rgba(0, 0, 0, 0.12);
                font-size: 14px;
                color: rgba(0, 0, 0, 0.70);
                padding: 6px 16px;
                max-width: 100px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

                &.on {
                    border: 1px solid #2080F7;
                    border-radius: 2px 0 0 2px;
                    color: rgba(32, 128, 247, 0.90);
                }

            }
        }

        .person-tab-content {
            height: 700px;
        }

        // .process-box {
        //     .process-steps {
        //         display: inline-block;
        //         vertical-align: top;
        //         width: 190px;
        //         padding-left: 25px;

        //         .step-item {
        //             height: 85px;
        //             position: relative;

        //             &::before {
        //                 content: '';
        //                 display: inline-block;
        //                 width: 12px;
        //                 height: 12px;
        //                 border-radius: 12px;
        //                 border: solid 2px #2080f7;
        //                 position: absolute;
        //                 left: -20px;
        //                 top: 5px;
        //             }

        //             &::after {
        //                 content: '';
        //                 display: inline-block;
        //                 width: 1;
        //                 height: ~'calc(100% - 12px)';
        //                 border-left: solid 1px #2080f7;
        //                 position: absolute;
        //                 left: -15px;
        //                 top: 17px;
        //             }

        //             &:last-child {
        //                 &::after {
        //                     opacity: 0;
        //                 }
        //             }

        //             .step-content {
        //                 width: 130px;
        //                 height: 50px;
        //                 border: 1px solid rgba(0, 0, 0, 0.2);
        //                 background: #FFFFFF;
        //                 border-radius: 4px;
        //                 cursor: pointer;
        //                 padding-left: 6px;
        //                 padding-top: 4px;

        //                 &.on {
        //                     border: 1px solid #2196F3;
        //                     box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.1)
        //                 }

        //                 &:hover {
        //                     border: 1px solid #2196F3;
        //                     box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.1)
        //                 }

        //                 .step-name {
        //                     font-weight: 600;
        //                     font-size: 16px;
        //                     font-style: normal;
        //                     color: #4D4D4D;
        //                     // margin-bottom: 5px;
        //                 }

        //                 .step-time {
        //                     color: #999;
        //                     font-size: 12px;
        //                     font-weight: 400;
        //                     line-height: 20px;
        //                 }

        //             }

        //         }
        //     }

        //     .process-content {
        //         display: inline-block;
        //         vertical-align: top;
        //         width: ~'calc(100% - 190px)';
        //     }
        // }

        .record-box {
            .record-row {
                white-space: nowrap;
                height: 48px;
                line-height: 48px;
                border-bottom: 1px solid #ddd;

                .record-name {
                    display: inline-block;
                    vertical-align: top;
                    margin-right: 15px;
                    font-size: 14px;
                    color: #4D4D4D;
                    font-weight: 700;
                    width: 75px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;

                }

                .record-room {
                    display: inline-block;
                    vertical-align: top;
                    margin-right: 25px;
                    width: 110px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;

                }

                .record-item {
                    display: inline-block;
                    vertical-align: top;
                    margin-right: 25px;

                    .record-item-label {
                        display: inline-block;
                        vertical-align: top;
                        color: rgba(0, 0, 0, 0.40);
                        margin-right: 8px;
                    }

                    .record-item-value {
                        display: inline-block;
                        vertical-align: top;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        min-width: 30px;

                        &.time-value {
                            width: 275px;
                        }

                        &.long-value {
                            width: 80px;
                        }

                        &.person-value {
                            width: 185px;
                        }
                    }

                    .record-item-btn {
                        display: inline-block;
                        vertical-align: top;
                        color: #2080F7;
                        margin-right: 10px;
                    }

                }
            }

        }

        .item-table-box {
            height: 300px;

            &.jzxx {
                height: 150px;
            }
        }
    }


    .case-patrol-process-box {
        display: inline-block;
        vertical-align: top;
        width: 140px;
        height: 100%;
        border-right: solid 1px #e5e5e5;

        .process-content {
            padding-left: 43px;
            padding-top: 30px;

            .process-item {
                height: 36px;
                position: relative;

                &::before {
                    content: '';
                    display: inline-block;
                    width: 9px;
                    height: 9px;
                    border-radius: 12px;
                    // border: solid 2px #2080f7;
                    background: #e5e5e5;
                    position: absolute;
                    left: -18px;
                    top: 6px;
                }

                &::after {
                    content: '';
                    display: inline-block;
                    width: 1;
                    height: ~'calc(100% - 15px)';
                    border-left: solid 1px #e5e5e5;
                    position: absolute;
                    left: -14px;
                    top: 18px;
                }

                &:last-child {
                    &::after {
                        opacity: 0;
                    }
                }

                &.on {
                    color: #2080F7;

                    &::before {
                        width: 11px;
                        height: 11px;
                        left: -19px;
                        background: #2080F7;
                    }
                }
            }

        }

    }



    .case-patrol-form-box {
        display: inline-block;
        vertical-align: top;
        width: 570px;
        height: 100%;
        padding: 0px 16px 0px 16px;

    }

}

/deep/.case-patrol-info-scrollbar {
    height: 100%;
    overflow-x: hidden;
    padding-right: 10px;
}

/deep/.jzxx-scrollbar {
    height: 300px;
    overflow-x: hidden;
    padding-right: 10px;
}
</style>
  