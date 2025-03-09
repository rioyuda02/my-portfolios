<script lang="ts" setup>
import { ref, computed, h, onMounted } from "vue";
import VueTurnstile from "vue-turnstile";
import { ElNotification, ElLoading } from "element-plus";

const token = ref("");
const loading = ref(false);

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Ensure environment variables exist
onMounted(() => {
  if (!siteKey || !backendUrl) {
    ElNotification.error({
      title: "Configuration Error",
      message: "Missing environment variables: VITE_TURNSTILE_SITE_KEY or VITE_BACKEND_URL.",
    });
  }
});

function handleSuccess(response: string) {
  token.value = response;
}

// Disable button if no token
const isSubmitDisabled = computed(() => !token.value || loading.value);

async function submitToken() {
  if (!token.value) {
    ElNotification.warning({
      title: "Incomplete",
      message: "Please complete the CAPTCHA first.",
    });
    return;
  }

  try {
    loading.value = true;
    const loadingInstance = ElLoading.service({ fullscreen: true, text: "Verifying..." });
    loadingInstance.originalPosition
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token.value }),
    });

    const data = await res.json();
    console.log("Validation Response:", data);

    if (data.success) {
      ElNotification.success({
        title: "Verification Successful",
        message: h("i", { style: "color: teal" }, "Thank you! Mr/Ms"),
      });
    } else {
      ElNotification.error({
        title: "Verification Failed",
        message: "CAPTCHA verification failed. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error verifying captcha:", error);
    ElNotification.error({
      title: "Error",
      message: "Something went wrong. Please try again later.",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <VueTurnstile :site-key="siteKey" :model-value="token" @success="handleSuccess" />
    <el-button :disabled="isSubmitDisabled" @click="submitToken">Submit</el-button>
  </div>
</template>

