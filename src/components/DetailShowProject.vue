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
          font-size: 1.2rem;
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
          font-size: 1.2rem;
        "
        @click="modal2 = true"
      >
        {{ activity2.content }}
      </el-button>
    </el-timeline-item>
  </el-timeline>

  <el-tour v-model="modal1" close-icon target-area-clickable>
    <el-tour-step target="#btn-1" title="About" description="Decentralize Application / Web3" />
    <el-tour-step target="#btn-1" title="Technology" description="Lisk Network (Ethereum L2), Solidity, NextJS, Etherjs, Typescript, Foundry." />
    <el-tour-step target="#btn-1" title="Explore to" description="https://xottle.asia"/>
  </el-tour>

  <el-tour v-model="modal2" close-icon target-area-clickable>
    <el-tour-step target="#btn-2" title="About"
      description="Solana Instagram is a Web3 on Solana Network"
    />
    <el-tour-step target="#btn-2" title="Technology" description="Solana Network, Rust, NextJS, Typescript" />
    <el-tour-step target="#btn-2" title="Explore to" description="https://instagramsol-dapp-rioyuda02.vercel.app" />
  </el-tour>
</template>
