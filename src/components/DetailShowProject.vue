<script setup lang="ts">
import { ref } from 'vue'

const modal1 = ref(false)
const modal2 = ref(false)

// <!--MY PROJECT -->
const project_1 = [
  {
    content: 'Xottle',
    timestamp: '2024-August',
  },
]
const project_2 = [
  {
    content: 'SolGram',
    timestamp: '2024-November',
  },
]
</script>

<template>
  <el-divider />
  <!-- Project 1 -->
  <el-timeline style="max-width: 600px">
    <el-timeline-item
      v-for="(activity1, index) in project_1"
      :key="index"
      :timestamp="activity1.timestamp"
    >
      <el-button
        id="btn-1"
        style="
          text-align: center;
          border: none;
          margin: 0;
          padding: 0 0.4rem;
          color: var(--color-text-link-1);
          font-size: 1rem;
        "
        @click="modal1 = true"
      >
        {{ activity1.content }}
      </el-button>
    </el-timeline-item>
  </el-timeline>
  <!-- Project 2 -->
  <el-timeline>
    <el-timeline-item
      v-for="(activity2, index) in project_2"
      :key="index"
      :timestamp="activity2.timestamp"
    >
      <el-button
        id="btn-2"
        style="
          text-align: center;
          border: none;
          margin: 0;
          padding: 0 0.4rem;
          color: var(--color-text-link-1);
          font-size: 1rem;
        "
        @click="modal2 = true"
      >
        {{ activity2.content }}
      </el-button>
    </el-timeline-item>
  </el-timeline>

  <el-tour v-model="modal1">
    <el-tour-step target="#btn-1" title="Upload File" description="Put you files here." />
    <el-tour-step target="#btn-1" title="Save" description="Save your changes" />
    <el-tour-step target="#btn-1" title="Other Actions" description="Click to see other" />
  </el-tour>

  <el-tour v-model="modal2">
    <el-tour-step
      target="#btn-2"
      title="Solana Instagram"
      description="Web3 Build with rust and Solana Network"
    />
    <el-tour-step target="#btn-2" title="Save" description="Save your changes" />
    <el-tour-step target="#btn-2" title="Other Actions" description="Click to see other" />
  </el-tour>
</template>
