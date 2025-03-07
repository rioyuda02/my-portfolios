<script lang="ts" setup>
import { reactive, ref, h } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { RouterLink } from 'vue-router'
import { ElNotification } from 'element-plus'

interface RuleForm {
  name: string
  email: string
  region: string
  desc: string
  domains: DomainItem[]
}
interface DomainItem{
  key: number
  value: string
}

const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: '',
  email: '',
  region: '',
  desc: '',
  domains: [{
    key: 1,
    value: '',
  }],
})

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: 'Please input Company Name', trigger: 'blur' },
    { min: 6, max: 30, message: 'Length should be 10  to 40', trigger: 'blur' },
  ],
  region: [
    {
      required: true,
      message: 'Please input the Region',
      trigger: 'change',
    },
  ],
  desc: [
    { required: true, message: 'Please input the Reason', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      Notify_page()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const Notify_page = () => {
  ElNotification.success({
    title: 'Processed',
    message: h('i', { style: 'color: teal' }, 'Thank you! Mr/Ms,'),
    offset: 100,
    duration: 1900,
  })
}
</script>

<template>
  <div class="about">
  <el-form
    ref="ruleFormRef"
    style="width: 100%;"
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="Name of Institution" prop="name">
      <el-input v-model="ruleForm.name" placeholder="Company"/>
    </el-form-item>

    <el-form-item prop="email" label="Email"
    :rules="[{
        required: true,
        message: 'Please input email address',
        trigger: 'blur',
      },
      {
        type: 'email',
        message: 'please input correct email address',
        trigger: ['blur', 'change'],
      },
    ]">
      <el-input v-model="ruleForm.email" placeholder="Email"/>
    </el-form-item>

    <el-form-item label="Regional" prop="region">
      <el-select v-model="ruleForm.region" placeholder="Region">
        <el-option label="Indonesia" value="Indonesia" />
        <el-option label="Singapore" value="Singapore" />
        <el-option label="Canada" value="Canada" />
        <el-option label="US" value="Unites Stated" />
        <el-option label="Australia" value="Australia" />
        <el-option label="Czech Republic" value="Ceko" />
        <el-option label="Other Country" value="Other" />
      </el-select>
    </el-form-item>

    <el-form-item label="Reason" prop="desc">
      <el-input v-model="ruleForm.desc" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        Request..
      </el-button>
      <RouterLink to="/">
        <el-button>Cancel</el-button>
      </RouterLink>
    </el-form-item>
  </el-form>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
@media (max-width: 1028px) {
  .about{
    width: 100%;
    height: auto;
  }
  .el-form{
    width: 100%!important;
  }
  .el-form-item{
    display: flex;
    flex-direction: column!important;
  }
  .el-form-item__label-wrap {
    display: flex;
    align-items: center;
    width: 100% !important;
    justify-content: center;
    margin-left: 0!important;
  }
}
</style>
