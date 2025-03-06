<script lang="ts" setup>
    import { ref } from 'vue';
    import { RouterLink } from 'vue-router';
    import { useTheme } from '../composables/useTheme';

    const {isDark} = useTheme()
    const activeIndex = ref('1')
    const handleSelect = (key:string, keyPath: string[]) => {console.info(key, keyPath)}
</script>

<template>
    <div class="flex w-75 justify-center items-center">
        <div class="flex">
            <el-menu :default-active="activeIndex" :ellipsis="false"
                class="el-menu-demo flex w-full" 
                mode="horizontal" active-text-color="Teal" 
                @select="handleSelect">
                <RouterLink to="/" >
                    <el-menu-item class="border-transparent dark:bg-none" index="1">Home</el-menu-item>
                </RouterLink>
            </el-menu>
        </div>
        <div class="flex gap-2 items-center justify-end w-full">
            <el-switch v-model="isDark"  
                active-color="#409EFF"
                inactive-color="#DCDFE6"
                class="flex"
            />
            <span class="flex dark:text-gray-200">{{ isDark ? 'Dark' : 'Light' }}</span>
        </div>
    </div>
</template>
