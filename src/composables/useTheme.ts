import {ref, watch, onMounted} from 'vue'

export function useTheme() {
    const isDark = ref(false)
    onMounted(() => {
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
        applyTheme(isDark.value)
    })

    const applyTheme = (dark:any) => {
        if(dark) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'light')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    const toggleTheme = () => {
        isDark.value = !isDark.value
        applyTheme(isDark.value)
    }

    watch(isDark, (newVal) => {
        applyTheme(newVal)
    })
    return {isDark, toggleTheme}
}