<script setup>
import { ref } from "vue";
import VueTurnstile from "vue-turnstile";

const token = ref("");
const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function handleSuccess(response) {
  token.value = response;
}

async function submitToken() {
  const res = await fetch(`${backendUrl}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: token.value }),
  });

  const data = await res.json();
  console.log("Validation Response:", data);
}
</script>

<template>
  <div>
    <VueTurnstile :siteKey="siteKey" @success="handleSuccess" />
    <button :disabled="!token" @click="submitToken">Submit</button>
  </div>
</template>
