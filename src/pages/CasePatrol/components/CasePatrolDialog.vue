<template>
  <div>
    <el-dialog
      :area="[900, 700]"
      top="middle"
      title="问题信息"
      :visible.sync="dialogFormVisible"
      :before-close="beforeClose"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        grid-layout
        :label-grid="labelGrid"
        :content-grid="contentGrid"
      >
        <el-form-item label="案件编号" prop="caseNo">
          <el-input v-model="form.caseNo" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="案件名称" prop="caseName">
          <el-input v-model="form.caseName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="简要案情" prop="briefCase">
          <el-input
            v-model="form.briefCase"
            :disabled="true"
            type="textarea"
            :rows="3"
            resize
          ></el-input>
        </el-form-item>
        <el-form-item label="存在问题" prop="content">
          <el-select
            v-model="form.content"
            placeholder="请选择"
            multiple
            filterable
          >
            <el-option
              v-for="item in existProblemList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题等级" prop="alarmLevel">
          <el-select
            v-model="form.alarmLevel"
            placeholder="请选择"
          >
            <el-option
              v-for="item in problemLevelList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="alertInfo">
          <el-input
            v-model="form.alertInfo"
            type="textarea"
            :rows="3"
            placeholder="请输入"
            :count="200"
          ></el-input>
        </el-form-item>
        <el-form-item label="督办人" prop="confirmName">
          <el-input v-model="form.confirmName" :maxlength="64" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="督办时间" prop="confirmTime">
          <el-date-picker
            v-model="form.confirmTime"
            type="datetime"
            :picker-options="pickerOptions"
            placeholder="请选择"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">
          提交
        </el-button>
        <el-button @click="beforeClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import server from "../../../server/casePatrol"
export default {
  props: {
    casePatrolDialogParams: {
      type: Object,
      default: () => {
        return {
          dialogFormVisible: false,
          caseNo: "",
          caseName: "",
          briefCase: "",
          confirmName: '',
          confirmDeptName: '',
          confirmDeptIndexCode: '',
          sourceIndexCode: ''
        };
      },
    },
  },
  watch: {
    casePatrolDialogParams: {
      handler: function (newV, oldV) {
        if (newV.dialogFormVisible) {
          this.dialogFormVisible = true;
          this.form = {
            ...this.form,
            caseNo: newV.caseNo,
            caseName: newV.caseName,
            briefCase: newV.briefCase,
            confirmName: newV.confirmName,
            confirmDeptName: newV.confirmDeptName,
            confirmDeptIndexCode: newV.confirmDeptIndexCode,
            sourceIndexCode: newV.sourceIndexCode
          }
          this.existProblemList = newV.caseInspectProblem
          this.form.confirmTime = new Date()
        }
      },
      immediate: true,
      deep: true
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        caseNo: '',
        caseName: '',
        confirmName: '',
        confirmDeptName: '',
        confirmDeptIndexCode: '',
        briefCase: '',
        alarmLevel: '',
        alertInfo: '',
        confirmTime: '',
        content: [],
        sourceIndexCode: ''
      },
      existParams: {
        dealStatus: 2,
        sourceType: 'case',
        type: '900001003'
      },
      problemLevelList: [
       {
        key: '0',
        label: '低'
       },
       {
        key: '1',
        label: '中'
       },
       {
        key: '2',
        label: '高'
       },
      ],
      existProblemList: [
      ],
      pickerOptions: {
        disabledDate: (date) => {
          if (date <= new Date()){
            return false
          } else{
            return true
          }
        }
      },
      rules: {
        content: [{ required: true, message: "请选择" }],
        alarmLevel: [{ required: true, message: "请选择" }],
        confirmName: [{ required: true, message: "请输入" }],
        confirmTime: [{ required: true, message: "请选择" }]
      },
      labelGrid: {
        xl: 4,
        lg: 4,
        md: 4,
        sm: 4,
        xs: 4,
      },
      contentGrid: {
        xl: 16,
        lg: 16,
        md: 16,
        sm: 16,
        xs: 16,
      },
    };
  },
  methods: {
    beforeClose (done) {
      this.$refs['form'].resetFields()
      this.dialogFormVisible = false
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.onSubmit()
        }
      })
    },
    async onSubmit () {
      let confirmTime = this.form.confirmTime ? this.$moment(this.form.confirmTime).format("YYYY-MM-DDTHH:mm:ss.SSS+08:00") : ''
      let params = {
        ...this.form,
        ...this.existParams,
        confirmTime: confirmTime,
        dealTime: confirmTime,
        content: this.form.content.length ? this.form.content.join(',') : ''
      }
      const result = await server.submit(params)
      const { data } = result
      if (data.code === "0") {
        this.$message({
          type: "success",
          message: "提交成功",
        })
        this.dialogFormVisible = false
      } else {
        this.$messagebox(result)
      }
    },
  }
};
</script>
<style lang="less" rel="stylesheet/less">
</style>