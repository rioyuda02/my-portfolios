<script setup lang="ts">
import { Counter } from './OpenCV.vue'

const { count } = Counter()
</script>

<template>
    <p class="text-base">
      <span>CV Viewed {{ count }} times</span>
    </p>
</template>
