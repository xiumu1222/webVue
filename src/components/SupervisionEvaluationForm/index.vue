<template>
    <div class="case-patrol-form">
        <div class="form-title">巡查信息</div>
        <div class="form-tab-box">
            <div class="form-tab-item fqdb" :class="{ 'on': formTabIndex === '1' }" @click="formTabClickHandle('1')">
                <div class="tab-name">发起督办</div>
                <div class="tab-desc">下发给当事人整改</div>
            </div>
            <div class="form-tab-item fqkp" :class="{ 'on': formTabIndex === '2' }" @click="formTabClickHandle('2')">
                <div class="tab-name">发起考评</div>
                <div class="tab-desc">对当事人扣分处罚</div>
            </div>
        </div>
        <div class="form-layout">
            <el-scrollbar wrap-class="case-patrol-form-scrollbar-wrap" v-show="formTabIndex === '1'">
                <el-form ref="casePatrolForm" label-width="90px" :rules="casePatrolFormRules" label-position="top"
                    :model="casePatrolForm">
                    <div class="form-left">
                        <el-form-item label="存在问题" prop="type">
                            <el-select v-model="casePatrolForm.type" placeholder="请选择" @change="alarmRuleChange">
                                <el-option v-for="(item, index) in alarmRuleList" :label="item.name"
                                    :value="item.indexCode"></el-option>
                            </el-select>
                        </el-form-item>

                    </div>
                    <div class="form-right">
                        <el-form-item label="问题等级" prop="alarmLevel">
                            <el-radio-group v-model="casePatrolForm.alarmLevel" type="simple">
                                <el-radio-button :label="0">低</el-radio-button>
                                <el-radio-button :label="1">中</el-radio-button>
                                <el-radio-button :label="2">高</el-radio-button>
                            </el-radio-group>
                        </el-form-item>

                    </div>
                    <el-form-item label="问题描述">
                        <el-input type="textarea" :rows="3" :count="150" placeholder="请输入"
                            v-model="casePatrolForm.content">
                        </el-input>
                    </el-form-item>

                    <div class="form-left">
                        <el-form-item label="违规单位" prop="violationDeptIndexCode">
                            <SelectWithTreeNewDept v-model="violationDept" @deptChange="casePatrolDeptChange"
                                :tree-data="orgData" :default-props="defaultOrgProps" node-key="indexCode" clear>
                            </SelectWithTreeNewDept>
                        </el-form-item>
                    </div>
                    <div class="form-right">
                        <el-form-item label="违规人" prop="violationName">
                            <!-- <el-select v-model="violationPerson" filterable @change="violationChange" placeholder="请选择">
                                <el-option v-for="(item, index) in violationPersonList" :key="item.personIndexCode"
                                    :label="item.personName"
                                    :value="item.personName + ',' + item.personIndexCode + ',' + item.certificateType + ',' + item.certificateNumber">
                                </el-option>
                            </el-select> -->

                            <ElMoreSelect
                                v-model="violationPerson"
                                :options="violationPersonList"
                                :defaultProps="{
                                    name:'personName',
                                    key:'personIndexCode'
                                }"
                                @selectChange="violationChange"
                            ></ElMoreSelect>
                        </el-form-item>
                    </div>
                    <el-form-item label="问题图片">
                        <el-alert title="支持上传jpg，jpeg格式图片，最多10个。" type="info" show-icon simple :closable="false">
                        </el-alert>
                        <div class="upload-box">
                            <div class="upload-img-item" v-for="(item, index) in casePatrolForm.attachmentInfoList"
                                :key="index">
                                <img :src="item.url" alt="" srcset="">
                                <div class="img-btn-box">
                                    <i class="h-icon-zoom_in"
                                        @click="showBigPicHandle(casePatrolForm.attachmentInfoList, index)"></i>
                                    <i class="h-icon-delete" @click="casePicDelHandle(index)"></i>
                                </div>
                            </div>
                            <div class="upload-item"  v-show="casePatrolForm.attachmentInfoList.length<10">
                                <el-upload :action="`/person/uploadPhoto.do`" list-type="picture-card" ref="fileInput"
                                    class="fileInput" accept="image/jpg, image/jpeg"
                                    :http-request="casePatrolUploadFile" :multiple="false" :show-file-list="false"> <i
                                        class="h-icon-upload" style="margin-top: 32px;"></i></el-upload>
                            </div>


                        </div>

                    </el-form-item>
                </el-form>
            </el-scrollbar>
            <el-scrollbar wrap-class="case-patrol-form-scrollbar-wrap" v-show="formTabIndex === '2'">
                <el-form ref="evaluationForm" label-width="90px" label-position="top" :model="evaluationForm"
                    :rules="evaluationFormRules">
                    <div class="form-left">
                        <el-form-item label="考评规则" prop="evaluateConfigIndexCode">
                            <el-select v-model="evaluateConfig" @change="evaluateConfigChange" placeholder="请选择">
                                <el-option v-for="(item, index) in evaluateRuleList" :label="item.evaluateConfigName"
                                    :value="item.indexCode"></el-option>
                            </el-select>
                        </el-form-item>

                    </div>
                    <div class="form-right">
                        <el-form-item label="考评标题" prop="evaluateTitle">
                            <el-input placeholder="请输入" v-model="evaluationForm.evaluateTitle"></el-input>
                        </el-form-item>

                    </div>
                    <el-form-item label="扣分值" prop="deductionValue" :rules="[{ required: true, message: '请输入', type: 'number', trigger: 'change' },
                    { validator: deductionValueRule, trigger: 'change,blur' },]">
                        <div class="deduction-min">{{ deductionMin }}≤</div>
                        <el-input class="deduction-val" placeholder="请输入" v-model.number="evaluationForm.deductionValue">
                        </el-input>
                        <div class="deduction-max">≤{{ deductionMax }}</div>
                    </el-form-item>
                    <el-form-item label="问题描述">
                        <el-input type="textarea" :rows="3" :count="150" placeholder="请输入"
                            v-model="evaluationForm.evaluateDetail"></el-input>
                    </el-form-item>

                    <div class="form-left">
                        <el-form-item label="责任单位" prop="deptIndexCode">
                            <SelectWithTreeNewDept v-model="evaluationDept" @deptChange="evaluateDeptChange"
                                :tree-data="orgData" :default-props="defaultOrgProps" node-key="indexCode" clear>
                            </SelectWithTreeNewDept>
                        </el-form-item>
                    </div>
                    <div class="form-right">
                        <el-form-item label="责任人" prop="personIndexCode">
                            <!-- <el-select v-model="evaluationPerson" filterable @change="evaluationChange" placeholder="请选择">
                                <el-option v-for="(item, index) in evaluationPersonList" :key="item.personIndexCode"
                                    :label="item.personName"
                                    :value="item.personName + ',' + item.personIndexCode + ',' + item.certificateType + ',' + item.certificateNumber">
                                </el-option>
                            </el-select> -->

                            <ElMoreSelect
                                v-model="evaluationPerson"
                                :options="evaluationPersonList"
                                :defaultProps="{
                                    name:'personName',
                                    key:'personIndexCode'
                                }"
                                @selectChange="evaluationChange"
                            ></ElMoreSelect>
                        </el-form-item>
                    </div>
                    <el-form-item label="问题图片">
                        <el-alert title="支持上传jpg，jpeg格式图片，最多10个。" type="info" show-icon simple :closable="false">
                        </el-alert>
                        <div class="upload-box">
                            <div class="upload-img-item" v-for="(item, index) in evaluationForm.attachmentInfoList"
                                :key="index">
                                <img :src="item.url" alt="" srcset="">
                                <div class="img-btn-box">
                                    <i class="h-icon-zoom_in"
                                        @click="showBigPicHandle(evaluationForm.attachmentInfoList, index)"></i>
                                    <i class="h-icon-delete" @click="evaluationPicDelHandle(index)"></i>
                                </div>
                            </div>
                            <div class="upload-item" v-show="evaluationForm.attachmentInfoList.length<10">
                                <el-upload :action="`/person/uploadPhoto.do`" list-type="picture-card" ref="fileInput"
                                    class="fileInput" accept="image/jpg, image/jpeg"
                                    :http-request="evaluationUploadFile" :multiple="false" :show-file-list="false"> <i
                                        class="h-icon-upload" style="margin-top: 32px;"></i></el-upload>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </el-scrollbar>
        </div>
        <div class="form-btn-box" v-if="formTabIndex === '1'">
            <el-button type="primary" @click="casePatrolFormSunmit">提交</el-button>
        </div>
        <div class="form-btn-box" v-else>
            <el-button type="primary" @click="evaluationFormSunmit">提交</el-button>
        </div>
        <ImgBigPic ref="ImgBigPic"></ImgBigPic>
    </div>
</template>
<script>

import server from "../../server/casePatrol";
import SelectWithTreeNewDept from '../SelectWithTreeNewDept.vue'
import ImgBigPic from "../ImgBigPic/index.vue"
import ElMoreSelect from '../ElMoreSelect/ElMoreSelect'
export default {
    props: {

    },
    data() {
        let queryParam = this.$route.query;
        return {
            queryParam: queryParam,
            orgData: [],
            personList: [],
            defaultOrgProps: {
                children: 'children',
                label: 'label',
                id: 'id',
                icon: 'icon',
            },
            applicableScenes: [1], //'0': '警情巡查','1': '行政案件巡查','2': '刑事案件巡查','3': '场所巡查',
            sourceType: '', //联数据源类型(case-案件、inquest-审讯、register-入区记录、archive-卷宗、goods-物品、policesituation-警情)
            sourceIndexCode: '', //关联数据源标识

            /**
             * 发起督办
             */
            violationPersonList: [],
            violationDept: {},
            violationPerson: '',
            casePatrolForm: {
                "indexCode": "", //报警编号
                "areaType": "", //办案区域类型(数据字典:areaType.3-办案区,areaType.6-涉案物品管理区,areaType.7-案卷卷宗管理区)
                "areaIndexCode": "", //办案区域编码
                "orgIndexCode": "", //组织机构编码(对应于市局、分局、派出所的组织机构编码)
                type: "", //报警类型(数据字典)
                "time": "", //报警时间
                "areaName": "", //报警区域
                "content": "", //报警内容
                "picUrl": "", //报警截图url
                "videoUrl": "", //报警录像播放url
                alarmLevel: 0, //报警级别(数据字典0-低,1-中,2-高)
                "roomIndexCode": "", //功能室编号
                "roomName": "", //功能室名称
                "roomType": "", //功能室类型(数据字典)
                "caseNo": "", //关联案件编号
                "noticeStatus": "", //消息通知状态未知 2，已查阅：1，未查阅：0 )
                "dealStatus": "", //信息处理状态(1已处理,2未处理)
                "createTime": "", //创建时间,格式yyyy-MM-dd’T’HH:mm:ss.SSSXXX
                "updateTime": "",//更新时间格式yyyy-MM-dd’T’HH:mm:ss.SSSXXX
                "alertInfo": "", //预警信息描述
                violationPoliceNo: "", //违规人警号
                violationCardNo: "", //违规人身份证号
                violationName: "", //违规人姓名
                violationIndexCode: "", //违规人编号
                violationDeptName: "", //违规人单位
                violationDeptIndexCode: "", //违规人单位编号
                rectificationInfo: "", //整改信息描述
                content: "", //问题信息描述
                sourceType: "case", ////关联数据源类型(case-案件、inquest-审讯、register-入区记录、archive-卷宗、goods-物品、policesituation-警情)
                sourceIndexCode: queryParam.indexCode, //关联数据源标识
                attachmentInfoList: [
                    // {
                    //     "fileName": "",
                    //     "fileType": "",
                    //     "path": ""
                    // }
                ]
            },
            applicableSceneMap: {
                '0': '警情巡查',
                '1': '行政案件巡查',
                '2': '刑事案件巡查',
                '3': '场所巡查',
            },
            formTabIndex: '1',
            imgFileList: [],
            alarmRuleList: [],
            casePatrolFormRules: {
                type: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                alarmLevel: [
                    { required: true, message: '请输入', type: 'number', trigger: 'change' }
                ],
                violationDeptIndexCode: [
                    { required: true, message: '请输入', trigger: 'change' }
                ],
                violationName: [
                    { required: true, message: '请输入', trigger: 'change' }
                ],
            },

            /**
             * 发起考评
             */
            evaluationPersonList: [],
            evaluationDept: {},
            evaluationPerson: '',
            evaluateRuleList: [],
            evaluateConfig: '',
            deductionMin: 0,
            deductionMax: 100,
            evaluationForm: {
                "indexCode": "",                 // 考评记录编码
                evaluateConfigIndexCode: "",   // 考评规则编码
                evaluateConfigName: "",        // 考评规则名称
                evaluateTitle: "",             // 考评标题
                deductionValue: "",            // 扣分值
                evaluateDetail: "",            // 问题描述
                deptIndexCode: "",             // 责任部门编码
                deptName: "",                  // 责任部门名称
                personIndexCode: "",           // 责任人编码
                personName: "",                // 责任人名称
                sourceType: "case",                // 源数据类型case-案件、inquest-审讯、register-入区记录、archive-卷宗、goods-物品、policesituation-警情
                sourceIndexCode: queryParam.indexCode,           // 源数据编码
                "createTime": "",
                attachmentInfoList: [
                    // {
                    //     "fileName": "",
                    //     "fileType": "",
                    //     "path": ""
                    // }
                ] //附件信息
            },
            evaluationFormRules: {
                evaluateConfigIndexCode: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                evaluateTitle: [
                    { required: true, message: '请输入', trigger: 'change' }
                ],
                // deductionValue: [
                //     { required: true, message: '请输入', type: 'number', trigger: 'change' },
                //     { validator: deductionMaxRule, trigger: 'change,blur' },
                // ],
                deptIndexCode: [
                    { required: true, message: '请输入', trigger: 'change' }
                ],
                personIndexCode: [
                    { required: true, message: '请输入', trigger: 'change' }
                ],
            },
        }
    },
    async mounted() {
        this.loadUnitTree()

        this.queryEvaluateConfig()
    },
    methods: {
        init(sourceType, sourceIndexCode, applicableScenes) {
            this.sourceType = sourceType
            this.sourceIndexCode = sourceIndexCode
            this.applicableScenes = applicableScenes
            this.queryAlarmConfigDtail()

        },
        formTabClickHandle(formTabIndex) {
            this.formTabIndex = formTabIndex

        },
        //获取部门列表
        async loadUnitTree() {
            let params = {
            }
            const res = await server.loadUnitTree(params)
            let data = res.data
            if (data.code === '0') {
                this.orgData = data.data
            } else {
                this.$messagebox(res)
            }

        },
        alarmRuleChange(indexCode) {
            if(!indexCode){
                this.casePatrolForm.alarmLevel = 0
                return false
            }

            let alarmItem = (this.alarmRuleList.filter((item) => {
                return item.indexCode === indexCode
            }))[0]

            this.casePatrolForm.alarmLevel = alarmItem.alarmLevel

            // console.log(alarmItem)

        },
        deductionValueRule(rule, value, callback) {
            // if (!/^[0-9a-zA-Z]{0,}$/g.test(value)) {
            if (value < this.deductionMin || value>this.deductionMax) {
                callback(new Error(`${this.deductionMin}~${this.deductionMax}之间的整数`))
            } else {
                callback()
            }
        },
        casePatrolDeptChange(deptCode) {
            this.casePatrolForm.violationDeptName = this.violationDept.label
            this.casePatrolForm.violationDeptIndexCode = this.violationDept.id
            this.violationPersonList = []
            if (deptCode) {
                this.queryPagePersonsByUnitCode(deptCode, 'violationPersonList')
            } else {
                this.violationPerson = ''
                this.casePatrolForm.violationName = ''
                this.casePatrolForm.violationIndexCode = ''
            
                this.casePatrolForm.violationDeptName = ''
                this.casePatrolForm.violationDeptIndexCode = ''
            }

        },
        evaluateDeptChange(deptCode) {
            console.log(deptCode)
            this.evaluationForm.deptName = this.evaluationDept.label
            this.evaluationForm.deptIndexCode = this.evaluationDept.id
            this.evaluationPersonList = []
            if (deptCode) {
                this.queryPagePersonsByUnitCode(deptCode, 'evaluationPersonList')
            }else {
                this.evaluationPerson = ''
                this.evaluationForm.personName = ''
                this.evaluationForm.personIndexCode = ''
                this.evaluationForm.deptName = ''
                this.evaluationForm.deptIndexCode = ''
            }

        },
        //获取部门人员信息
        async queryPagePersonsByUnitCode(deptCode, type) {
            let params = {
                unitCode: deptCode,
                // deptCodeList: [this.casePatrolForm.violationDept[this.defaultOrgProps.id]],
                // personName: this.tableFilterVal,
                pageNo: 1,
                pageSize: 1000
            }
            const result = await server.queryPagePersonsByUnitCode(params)
            const { data } = result
            if (data.code === '0') {
                this[type] = data.data.list
            } else {
                this.$messagebox(result)
            }
        },
        violationChange(personIndexCode) {
           
            let psersonItem = (this.violationPersonList.filter((item)=>{
                return item.personIndexCode === personIndexCode
            }))[0]
            this.casePatrolForm.violationName = psersonItem.personName
            this.casePatrolForm.violationIndexCode = psersonItem.personIndexCode
            let cardType = psersonItem.certificateType
            if (cardType && cardType.indexOf('111') > 0) {
                this.casePatrolForm.violationCardNo = psersonItem.certificateNumber
            }
            if (cardType && cardType.indexOf('123') > 0) {
                this.casePatrolForm.violationPoliceNo = psersonItem.certificateNumber
            }

        },
        evaluationChange(personIndexCode) {
            let psersonItem = (this.evaluationPersonList.filter((item)=>{
                return item.personIndexCode === personIndexCode
            }))[0]
            this.evaluationForm.personName = psersonItem.personName
            this.evaluationForm.personIndexCode = psersonItem.personIndexCode
     



            // let evaluationPersonArr = data.split(',')
            //  = evaluationPersonArr[0]
            //  = evaluationPersonArr[1]
            // let cardType = violationPersonArr[2]
            // if (cardType && cardType.indexOf('111') > 0) {
            //     this.casePatrolForm.violationCardNo = violationPersonArr[3]
            // }
            // if (cardType && cardType.indexOf('123') > 0) {
            //     this.casePatrolForm.violationPoliceNo = violationPersonArr[3]
            // }
        },

        evaluateConfigChange(indexCode) {
            if(!indexCode){
                this.deductionMin =  0
                this.deductionMax = 100
                return false
            }
            //evaluateConfigName
            // let evaluateConfigArr = data.split(',')
            // this.evaluationForm.evaluateConfigName = evaluateConfigArr[0]
            // this.evaluationForm.evaluateConfigIndexCode = evaluateConfigArr[1]

            let evaluateRuleItem = (this.evaluateRuleList.filter((item) => {
                return item.indexCode === indexCode
            }))[0]

            this.evaluationForm.evaluateConfigName = evaluateRuleItem.evaluateConfigName
            this.evaluationForm.evaluateConfigIndexCode = evaluateRuleItem.indexCode

            this.deductionMin = evaluateRuleItem.deductionMin || 0
            this.deductionMax = evaluateRuleItem.deductionMax || 100
        },
        //查询告警规则
        async queryAlarmConfigDtail() {

            let params = {
                type: "1",
                pageNo: 1,
                pageSize: 1000,
                applicableScenes: this.applicableScenes,         // 适用场景
                manualFlag: 1
                // parentIndexCode: [this.queryParam.parentIndexCode],
                // indexCodes: [this.queryParam.indexCode],
            }


            const res = await server.queryAlarmConfig(params)
            let data = res.data
            if (data.code === '0') {
                let list = data.data.list
                this.alarmRuleList = list.filter((item)=>{
                    return item.useFlag !== 0

                })
            } else {
                this.$messagebox(res)
            }

        },
        //发起督办提交
        casePatrolFormSunmit() {
            this.$refs['casePatrolForm'].validate((valid, invalidFields) => {
                if (valid) {
                    this.savePreAlarmInfo()
                } else {
                }
            });
        },
        //保存督办信息
        async savePreAlarmInfo() {
            let params = {
                ...this.casePatrolForm,
                sourceType: this.sourceType,
                sourceIndexCode: this.sourceIndexCode,
                attachmentInfoList: this.casePatrolForm.attachmentInfoList.map((item) => {
                    return {
                        fileName: item.fileName,
                        fileType: item.fileType,
                        path: item.path,
                    }
                })
            }
            const res = await server.savePreAlarmInfo(params)
            let data = res.data
            if (data.code === '0') {
                this.$message.success('督办成功')
                this.casePatrolForm.content = ''
                this.violationDept = {}
                this.violationPerson = ''
                this.violationPersonList = []
                this.$refs['casePatrolForm'].resetFields(true)

            } else {
                this.$messagebox(res)
            }

        },

        //查询考评规则 queryEvaluateConfig
        //查询考评规则列表
        async queryEvaluateConfig() {

            let params = {
                pageNo: 1,
                pageSize: 1000,
            }


            const res = await server.queryEvaluateConfig(params)
            let data = res.data
            if (data.code === '0') {
                let list = data.data.list || []
                // this.warnConfigList = list
                this.evaluateRuleList = list.filter((item)=>{
                    return item.useFlag !== 0

                })
            } else {
                this.$messagebox(res)
            }

        },
        //发起考评
        evaluationFormSunmit() {
            this.$refs['evaluationForm'].validate((valid, invalidFields) => {
                if (valid) {
                    this.saveOrUpdateEvaluateInfo()
                } else {
                }
            });

        },


        //保存考评信息 saveOrUpdateEvaluateInfo
        async saveOrUpdateEvaluateInfo() {
            let params = {
                ...this.evaluationForm,
                sourceType: this.sourceType,
                sourceIndexCode: this.sourceIndexCode,
                attachmentInfoList: this.evaluationForm.attachmentInfoList.map((item) => {
                    return {
                        fileName: item.fileName,
                        fileType: item.fileType,
                        path: item.path,
                    }
                })
            }
            const res = await server.saveOrUpdateEvaluateInfo(params)
            let data = res.data
            if (data.code === '0') {
                this.$message.success('考评成功')
                this.evaluationPersonList = []
                this.evaluationDept = {}
                this.evaluationPerson = ''
                this.evaluateConfig = ''
                this.evaluationForm.evaluateDetail = ''
                // evaluationForm: {
                //     "indexCode": "",                 // 考评记录编码
                //     evaluateConfigIndexCode: "",   // 考评规则编码
                //     evaluateConfigName: "",        // 考评规则名称
                //     evaluateTitle: "",             // 考评标题
                //     deductionValue: "",            // 扣分值
                //     evaluateDetail: "",            // 问题描述
                //     deptIndexCode: "",             // 责任部门编码
                //     deptName: "",                  // 责任部门名称
                //     personIndexCode: "",           // 责任人编码
                //     personName: "",                // 责任人名称
                //     sourceType: "case",                // 源数据类型case-案件、inquest-审讯、register-入区记录、archive-卷宗、goods-物品、policesituation-警情
                //     sourceIndexCode: queryParam.indexCode,           // 源数据编码
                //     "createTime": "",
                //     attachmentInfoList: [
                //         // {
                //         //     "fileName": "",
                //         //     "fileType": "",
                //         //     "path": ""
                //         // }
                //     ] //附件信息
                // },
                this.$refs['evaluationForm'].resetFields(true)
                // this.onBack()
                // this.queryEvaluateConfig()
                // let list = data.data.list
                // this.warnConfigList = list
                // this.warningConfigLevelSaveParamList = list
            } else {
                this.$messagebox(res)
            }

        },


        // 自定义上传
        async casePatrolUploadFile(value) {
            console.log(value)
            
            let file = value.file
            if(file.size>=1048576){
                return this.$message('图片大小不能大于1M')
            }
            if(file.type !== 'image/jpeg' && file.type !== 'image/jpeg'){
                return this.$message('仅支持上传jpg，jpeg格式图片')
            }
            let formData = new FormData()
            formData.append('file', file)
            let uploadSuccess = false
            const res = await server.uploadFile(formData, {
                transformRequest: [
                    function (data) {
                        return data
                    }
                ],
                headers: {
                    post: { 'Content-Type': 'multipart/form-data' }
                }
            })
            const { data } = res
            if (data.code === '0') {
                // console.log('file',data)
                // let picObj = {}
                if (data.data.imgRealUrl) {
                    this.casePatrolForm.attachmentInfoList.push({
                        fileName: file.name,
                        fileType: 2,
                        path: data.data.imgUrl,
                        url: data.data.imgRealUrl,
                    })
                }
            } else {
                this.$messagebox(res)
            }
        },
        casePicDelHandle(delIndex) {
            this.casePatrolForm.attachmentInfoList = this.casePatrolForm.attachmentInfoList.filter((item, index) => {
                return delIndex !== index
            })
        },
        async evaluationUploadFile(value) {
            console.log(value)
            let file = value.file
            if(file.size>=1048576){
                return this.$message('图片大小不能大于1M')
            }
            if(file.type !== 'image/jpeg' && file.type !== 'image/jpeg'){
                return this.$message('仅支持上传jpg，jpeg格式图片')
            }
            let formData = new FormData()
            formData.append('file', file)
            let uploadSuccess = false
            const res = await server.uploadFile(formData, {
                transformRequest: [
                    function (data) {
                        return data
                    }
                ],
                headers: {
                    post: { 'Content-Type': 'multipart/form-data' }
                }
            })
            const { data } = res
            if (data.code === '0') {
                // console.log('file',data)
                // let picObj = {}
                if (data.data.imgRealUrl) {
                    this.evaluationForm.attachmentInfoList.push({
                        fileName: file.name,
                        fileType: 2,
                        path: data.data.imgUrl,
                        url: data.data.imgRealUrl,
                    })
                }
            } else {
                this.$messagebox(res)
            }
        },
        evaluationPicDelHandle(delIndex) {
            this.evaluationForm.attachmentInfoList = this.evaluationForm.attachmentInfoList.filter((item, index) => {
                return delIndex !== index
            })
        },

        showBigPicHandle(attachmentInfoList, index) {
            let imgList = attachmentInfoList.map((imgItem) => {
                return imgItem.url
            })
            this.$refs.ImgBigPic.init(imgList, index)
        },
    },
    components: {
        SelectWithTreeNewDept,
        ImgBigPic,
        ElMoreSelect
    },
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.case-patrol-form {
    width: 100%;
    height: 100%;

    .form-title {
        padding-top: 24px;
        // margin-bottom: 22px;
        font-size: 16px;
        color: #1A1A1A;
        font-weight: 700;

    }

    .form-tab-box {
        height: 103px;

        position: relative;
        margin-bottom: 24px;

        &::after {
            content: '';
            display: inline-block;
            position: absolute;
            bottom: 0px;
            left: 0px;
            width: 100%;
            height: 59px;

            background: rgba(170, 188, 209, 0.20);
            border-radius: 4px;
        }

        .form-tab-item {
            display: inline-block;
            vertical-align: bottom;
            position: relative;
            color: #FFFFFF;
            height: 59px;
            width: ~'calc(100% - 285px)';
            cursor: pointer;
            z-index: 1;

            .tab-name {
                font-size: 16px;
                color: rgba(0, 0, 0, 0.70);
                text-align: left;
                font-weight: 400;
                padding-top: 10px;
                padding-left: 31px;
            }

            .tab-desc {
                font-size: 12px;
                color: rgba(0, 0, 0, 0.40);
                text-align: left;
                font-weight: 400;
                padding-top: 3px;
                padding-left: 31px;
            }

            &.fqdb {
                &.on {
                    width: 285px;
                    height: 103px;
                    background: url('../../assets/image/faqiduban-back-2.png') no-repeat;
                    // background-position-x: 154px;
                    background-position: bottom;

                    overflow: hidden;

                    &::after {
                        content: '';
                        display: inline-block;
                        width: 103px;
                        height: 103px;
                        border-radius: 4px;
                        background: url('../../assets/image/faqiduban-back-1.png') no-repeat;
                        background-size: contain;
                        background-position: bottom;
                        position: absolute;
                        right: 31px;
                        bottom: 0px;

                    }

                    .tab-name {
                        color: #ffffff;
                        font-weight: 700;
                        padding-top: 51px;
                    }

                    .tab-desc {
                        color: #ffffff;
                    }
                }

            }

            &.fqkp {
                &.on {

                    width: 285px;
                    height: 103px;
                    background: url('../../assets/image/faqikaoping-back-2.png') no-repeat;
                    // background-position-x: 154px;
                    background-position: bottom;

                    overflow: hidden;

                    &::after {

                        content: '';
                        display: inline-block;
                        width: 103px;
                        height: 103px;
                        border-radius: 4px;
                        background: url('../../assets/image/faqikaoping-back-1.png') no-repeat;
                        background-size: contain;
                        background-position: bottom;
                        position: absolute;
                        right: 31px;
                        bottom: 0px;

                    }

                    .tab-name {
                        color: #ffffff;
                        font-weight: 700;
                        padding-top: 51px;
                    }

                    .tab-desc {
                        color: #ffffff;
                    }
                }
            }



        }

    }

    .form-layout {
        height: ~'calc(100% - 213px)';

        .form-left {
            display: inline-block;
            vertical-align: top;
            width: 50%;
            padding-right: 28px;

        }

        .form-right {
            display: inline-block;
            vertical-align: top;
            width: 50%;
            padding-left: 28px;
        }

    }

    .upload-box {
        margin-top: 20px;

        .upload-img-item {
            width: 102px;
            height: 102px;
            border: solid 1px rgba(0, 0, 0, 0.10);
            display: inline-block;
            vertical-align: top;
            margin-right: 7px;
            margin-bottom: 10px;
            position: relative;

            >img {
                width: 100%;
                height: 100%;
            }

            &:hover {
                .img-btn-box {
                    display: block;
                }
            }

            .img-btn-box {
                width: 100%;
                height: 100%;
                display: none;
                position: absolute;
                left: 0px;
                top: 0px;
                background: rgba(0, 0, 0, 0.7);
                text-align: center;
                padding-top: 30px;

                .h-icon-zoom_in {
                    font-size: 30px;
                    color: #fff;
                    cursor: pointer;
                    margin-right: 5px;
                }

                .h-icon-delete {
                    font-size: 30px;
                    color: #fff;
                    cursor: pointer;
                }
            }

            &:nth-child(5n) {
                margin-right: 0px;
            }
        }

        .upload-item {
            width: 102px;
            height: 102px;
            // border: solid 1px rgba(0, 0, 0, 0.40);
            display: inline-block;
            vertical-align: top;
            margin-right: 7px;
            margin-bottom: 10px;

            &:nth-child(5n) {
                margin-right: 0px;
            }
        }
    }

    .form-btn-box {
        text-align: center;
    }

    .fileInput {}

    .deduction-min {
        display: inline-block;
        vertical-align: top;
    }

    .deduction-val {
        display: inline-block;
        vertical-align: top;
        width: 100px;
        margin-left: 10px;
        margin-right: 10px;
    }

    .deduction-max {
        display: inline-block;
        vertical-align: top;
    }
}

/deep/.case-patrol-form-scrollbar-wrap {
    height: 100%;
    padding-right: 10px;
    overflow-x: hidden;
}
</style>