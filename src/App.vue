<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { watch } from 'vue'
import MainProfile from './components/MainProfile.vue'
import OpenCV from './components/OpenCV.vue'
import CountingCV from './components/CountingCV.vue'
import Navbar from './components/Navbar.vue'
import { useTheme } from './composables/useTheme'

const {isDark } = useTheme()

watch(isDark, (dark) => {
  document.documentElement.style.setProperty('--el-color-primary', dark? '#409EFF' : '#1890FF')
}, {immediate: true})
</script>

<template>
  <header>
    <div class="flex items-center flex-col text-gray-700 dark:text-white">
    <Navbar/>
    <img alt="i-profile" class="i-profile" src="./assets/i-profile.png" />
    <div class="wrapper">
      <MainProfile msg="Hi," />
      <nav class="flex items-center flex-col gap-3">
        <div class="flex items-center">
          <RouterLink to="/github">GitHub</RouterLink>
          <OpenCV />
        </div>
        <div class="flex items-center">
          <CountingCV />
        </div>
      </nav>
    </div>
    </div>
  </header>

  <RouterView />
</template>

