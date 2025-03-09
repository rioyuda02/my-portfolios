<template>
    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <!-- Your form fields here -->
        <div class="form-group">
          <label for="NameofInsitusion">Name of Institution</label>
          <input 
            type="text" 
            id="NameofInstitution" 
            v-model="NameofInstitution" 
            placeholder="Company"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email"
            id="email" 
            v-model="email" 
            placeholder="Email"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="reason">Reason</label>
          <input 
            type="text" 
            id="reason" 
            v-model="reason" 
            placeholder="Reason"
            required
          />
        </div>
        <!-- Turnstile container -->
        <div ref="turnstileContainer" class="turnstile-container"></div>
        
        <button type="submit" :disabled="!turnstileToken">Request..</button>
        
        <div v-if="message" class="message" :class="{ error: isError }">
          {{ message }}
        </div>
      </form>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount, h } from 'vue'
  import { ElNotification } from 'element-plus'
  
  const NameofInstitution = ref('')
  const email = ref('')
  const reason = ref('')
  const turnstileToken = ref<string | null>(null)
  const turnstileWidget = ref(null)
  const message = ref('')
  const isError = ref(false)
  const turnstileContainer = ref(null)
  
  const renderTurnstile = () => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  
    turnstileWidget.value = window.turnstile.render(turnstileContainer.value, {
      sitekey: siteKey,
      callback: (token: string) => {
        turnstileToken.value = token
      },
      'expired-callback': () => {
        turnstileToken.value = null
      },
      'error-callback': () => {
        message.value = 'Error loading CAPTCHA'
        isError.value = true
        turnstileToken.value = null
      }
    })
  }
  
  const handleSubmit = async () => {
    if (!turnstileToken.value) {
      message.value = 'Please complete the CAPTCHA verification'
      isError.value = true
      return
    }
  
    try {
      message.value = 'Submitting...'
      isError.value = false
  
      // Create form data with the turnstile token
      const formData = new FormData()
      formData.append('Name of Institution', NameofInstitution.value)
      formData.append('Email', email.value)
      formData.append('Reason', reason.value)
      formData.append('cf-turnstile-response', turnstileToken.value)
  
      // Send to your Cloudflare Worker endpoint
      const response = await fetch(import.meta.env.VITE_BACKEND_URL, {
        method: 'POST',
        body: formData
      })
  
      const result = await response.json()
  
      if (!response.ok) {
        throw new Error(result.message || 'Verification failed')
      }
  
      message.value = result.message || 'Authentication successful'
      isError.value = false

      Notify_page()
  
      // Reset form after successful submission
      NameofInstitution.value = ''
      email.value = ''
      reason.value = ''
  
    } catch (error) {
      message.value = (error as Error).message || 'An error occurred'
      isError.value = true
  
      // Reset turnstile widget
      window.turnstile.reset(turnstileWidget.value)
      turnstileToken.value = null
    }
  }
  
  onMounted(() => {
    if (!window.turnstile) {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.onload = renderTurnstile
      document.head.appendChild(script)
    } else {
      renderTurnstile()
    }
  })
  
  onBeforeUnmount(() => {
    // Clean up turnstile widget if it exists
    if (turnstileWidget.value) {
      window.turnstile.remove(turnstileWidget.value)
    }
  })

const Notify_page = async () => {
  ElNotification.success({
    title: 'Processed',
    message: h('i', { style: 'color: teal' }, 'Thank you! Mr/Ms,'),
    offset: 100,
    duration: 1900,
  })
  setTimeout(()=>{
  }, 2300)
}
  </script>
  
  <style scoped>
  .form-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .turnstile-container {
    margin: 20px 0;
  }
  
  button {
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .message {
    margin-top: 15px;
    padding: 10px;
    border-radius: 4px;
    background-color: #d4edda;
    color: #155724;
  }
  
  .message.error {
    background-color: #f8d7da;
    color: #721c24;
  }
  </style>