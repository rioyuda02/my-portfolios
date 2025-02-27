<script setup lang="ts">
import { Counter } from './OpenCV.vue'

const { count } = Counter()
</script>

<template>
  <div class="flex text-center w-full" style="margin-top: 1.4rem">
    <p>
      CV has been viewed <span>{{ count }}</span> times
    </p>
  </div>
</template>
