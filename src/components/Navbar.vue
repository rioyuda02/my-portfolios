<script lang="ts" setup>
    import { ref } from 'vue';
    import { useDark } from '@vueuse/core';
    import { ElSwitch } from 'element-plus';

    const isDark = useDark()
    const activeIndex = ref('1')
    const handleSelect = (key:string, keyPath: string[]) => {console.info(key, keyPath)}
</script>

<template>
    <el-menu :default-active="activeIndex" 
    class="el-menu-demo flex w-full" mode="horizontal" active-text-color="Teal" @select="handleSelect">
        <el-menu-item index="1">
            Home
        </el-menu-item>
        <el-menu-item index="2">
            Certifcate
        </el-menu-item>
        <el-menu-item>
            <ElSwitch v-model="isDark" />
            <span style="margin-left: 0.4rem;">{{ isDark ? 'Dark' : 'Light' }}</span>
        </el-menu-item>
    </el-menu>
</template>