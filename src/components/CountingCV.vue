<script setup lang="ts">
import { Counter } from './OpenCV.vue'

const { count } = Counter()
</script>

<template>
  <div style="margin-top: 2rem;">
    <p style="font-size: medium;">
      <span>CV Viewed {{ count }} times</span>
    </p>
  </div>
</template>
