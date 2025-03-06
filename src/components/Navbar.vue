<script lang="ts" setup>
    import { ref } from 'vue';
    import { useDark } from '@vueuse/core';
    import { ElSwitch } from 'element-plus';
    import { RouterLink } from 'vue-router';

    const isDark = useDark()
    const activeIndex = ref('1')
    const handleSelect = (key:string, keyPath: string[]) => {console.info(key, keyPath)}
</script>

<template>
    <div id="top">
        <div class="navBar">
            <el-menu :default-active="activeIndex" :ellipsis="false"
                class="el-menu-demo flex w-full" 
                mode="horizontal" active-text-color="Teal" 
                @select="handleSelect">
                <RouterLink to="/">
                    <el-menu-item index="1">Home</el-menu-item>
                </RouterLink>


            </el-menu>
        </div>
        <div class="btn_tm">
            <ElSwitch v-model="isDark" />
            <span style="margin-left: 0.4rem;">{{ isDark ? 'Dark' : 'Light' }}</span>
        </div>
    </div>

</template>

<style scoped>
    #top{
        display: flex;
        width: 100%;
        height: auto;
    }
    .navBar{
        display: flex;
        width: 100%;
        height: auto;
        justify-content: center;
        align-items: center;
    }

    .btn_tm{
        width: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>