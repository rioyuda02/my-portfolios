<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import MainProfile from './components/MainProfile.vue'
import OpenCV from './components/OpenCV.vue'
import CountingCV from './components/CountingCV.vue'
</script>

<template>
  <header>
    <img alt="i-profile" class="i-profile" src="./assets/i-profile.png" />

    <div class="wrapper">
      <MainProfile msg="Hello, " />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <OpenCV />
      </nav>
      <div class="flex text-center w-full">
        <CountingCV />
      </div>
    </div>
  </header>

  <RouterView />
</template>
