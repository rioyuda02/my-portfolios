<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
import DetailShowProject from './DetailShowProject.vue'

const tableData1 = [
  {
    Ft:
      ' NextJS ' +
      ' VueJS ' +
      ' ReactJS ' +
      ' NuxtJS ' +
      ' Vite ' +
      ' TailwindCSS ' +
      ' Bootstrap ' +
      ' ElementPlus ' +
      ' Shadcn-UI ',
  },
]
const tableData2 = [
  {
    Be:
      ' Javascript ' +
      ' Typescript ' +
      ' NodeJS ' +
      ' ExpressJS ' +
      ' MongoDB ' +
      ' SQLite ' +
      ' Rust ' +
      ' PostgreSQL ' +
      ' MySQL ',
  },
]
const tableData3 = [
  {
    Bc: ' Foundry ' + ' Hardhat ' + ' Move ' + ' EtherJs ' + ' Solidity ' + ' Web3JS ',
  },
]
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>My Project</template>
    <DetailShowProject />
    <!-- <li>
      <a href="https://instagramsol-dapp-rioyuda02.vercel.app/">SolGram</a>
    </li> -->
    <!-- is a Dapp and web3 project. It is a project that is built on top of the NextJS, EtherJS,
    Foundry.<br />
    It aims to provide a simple and easy-to-use interface for users to interact with the blockchain.
    <a href="https://xottle.asia/" target="_blank" rel="noopener">This is official web</a>to explore
    the project. -->
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>

    <template #heading>
      <label for="heading">Tools & Program Languge</label>
      <el-table :data="tableData1" border>
        <el-table-column prop="Ft" label="Frontend"></el-table-column>
      </el-table>

      <el-table :data="tableData2" border>
        <el-table-column prop="Be" label="Backend"></el-table-column>
      </el-table>

      <el-table :data="tableData3" border>
        <el-table-column prop="Bc" label="Blockchain"></el-table-column>
      </el-table>
    </template>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Hire Me</template>
    rio.yudayanto244@gmail.com
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Social Media</template>
    <li>
      <a href="https://www.linkedin.com/in/rio-yudayanto/" target="_blank" rel="noopener noreferrer"
        >Linkedin</a
      >
    </li>
    <li><a href="https://www.instagram.com/rioyuda04/#" rel="noopener noreferrer">Instagram</a></li>
  </WelcomeItem>
</template>
