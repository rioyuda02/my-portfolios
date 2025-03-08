<script lang="ts" setup>
import { reactive, ref, h } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { RouterLink } from 'vue-router'
import { ElNotification } from 'element-plus'
import VueTurnstile from 'vue-turnstile'

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

const turnstileToken = ref('')
const isCaptchaVerified = ref(false)
const captchaError = ref('')
const isSubmitting = ref(false)

// Update this with your Cloudflare Worker URL
const captchaVerifierUrl = import.meta.env.VITE_BACKEND_URL
const siteKey =  import.meta.env.VITE_TURNSTILE_SITE_KEY // Use test key as fallback

const onVerified = (token: string) => {
  turnstileToken.value = token
  isCaptchaVerified.value = true
  captchaError.value = ''
}

const onExpired = () => {
  turnstileToken.value = ''
  isCaptchaVerified.value = false
  captchaError.value = 'CAPTCHA expired. Please try again!'
}

const onError = (error: string) => {
  turnstileToken.value = ''
  isCaptchaVerified.value = false
  captchaError.value = `CAPTCHA error: ${error}`
}

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

  // Fix: Add return statement to prevent form submission when CAPTCHA is not verified
  if (!isCaptchaVerified.value) {
    captchaError.value = 'Please complete the CAPTCHA verification'
    return
  }

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        isSubmitting.value = true
        
        // Verify CAPTCHA token with Cloudflare Worker
        const verifyResponse = await fetch(captchaVerifierUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: turnstileToken.value })
        });
        
        const verifyResult = await verifyResponse.json();
        
        if (!verifyResult.success) {
          captchaError.value = 'CAPTCHA verification failed: ' + (verifyResult.message || 'Please try again')
          isSubmitting.value = false
          return
        }
        
        // CAPTCHA is valid, prepare form data
        const formData = {
          ...ruleForm,
          captchaToken: turnstileToken.value
        }
        
        console.log('Form submitted with data:', formData)
        Notify_page(formEl)
      } catch (error) {
        console.error('Submission error:', error)
        captchaError.value = 'An error occurred while processing your request'
      } finally {
        isSubmitting.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const Notify_page = async (formEl: FormInstance | undefined) => {
  ElNotification.success({
    title: 'Processed',
    message: h('i', { style: 'color: teal' }, 'Thank you! Mr/Ms,'),
    offset: 100,
    duration: 1900,
  })
  setTimeout(()=>{
    formEl?.resetFields()
    // Reset CAPTCHA state
    turnstileToken.value = ''
    isCaptchaVerified.value = false
  }, 2300)
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

    <!-- CAPTCHA -->
     <el-form-item label="Verification">
      <div class="captcha-container">
        <vue-turnstile 
          v-model="turnstileToken" 
          :site-key="siteKey" 
          @verified="onVerified" 
          @expired="onExpired" 
          @error="onError"
        />
        <div v-if="captchaError" class="captcha-error">{{ captchaError }}</div>
      </div>
     </el-form-item>

    <el-form-item>
      <el-button 
        type="primary" 
        @click="submitForm(ruleFormRef)"
        :loading="isSubmitting"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Processing...' : 'Request..' }}
      </el-button>
      <RouterLink to="/">
        <el-button :disabled="isSubmitting">Cancel</el-button>
      </RouterLink>
    </el-form-item>
  </el-form>
  </div>
</template>

<style scoped>
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

/* Move these out of the media query so they're always applied */
.captcha-container{
  margin: 10px 0;
}
.captcha-error {
  color: rgb(208, 8, 8);
  margin-top: 5px;
  font-size: 0.85rem;
}
</style>