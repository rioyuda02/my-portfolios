<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import MainProfile from './components/MainProfile.vue'
import OpenCV from './components/OpenCV.vue'
import CountingCV from './components/CountingCV.vue'
import Navbar from './components/navbar.vue'
</script>

<template>
  <header>
    <Navbar style="display: flex; width: 100%;"/>
    <img alt="i-profile" class="i-profile" src="./assets/i-profile.png" />
    <div class="wrapper">
      <MainProfile msg="Hi," />
      <nav class="flex w-full">
        <RouterLink to="/">GitHub</RouterLink>
        <OpenCV />
        <CountingCV />
      </nav>
    </div>
  </header>

  <RouterView />
</template>

