<script lang="ts">

// Define the type for our IP storage
interface IPStorage {
  addresses: string[];
  lastFetched: number;
}

// Function to get client IP and store it
async function getAndStoreClientIp(): Promise<string> {
  try {
    // First check if we already have IPs stored
    const storedData = localStorage.getItem('ipData');
    let ipData: IPStorage = storedData 
      ? JSON.parse(storedData) 
      : { addresses: [], lastFetched: 0 };
    
    // Fetch new IP
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    const currentIp = data.ip;
    // console.log(`${currentIp}`)
    
    // Check if the IP already exists in our storage array
    if (currentIp && !ipData.addresses.includes(currentIp)) {
      // Only add IP if it's not already in the array
      ipData.addresses.push(currentIp);
      increment();
    }
    
    // Update timestamp
    ipData.lastFetched = Date.now();
    
    // Save back to localStorage
    localStorage.setItem('ipData', JSON.stringify(ipData));
    
    return currentIp;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return '';
  }
}

// Function to get stored IPs without fetching new ones
function getStoredIps(): string[] {
  const storedData = localStorage.getItem('ipData');
  if (!storedData) return [];
  
  const ipData: IPStorage = JSON.parse(storedData);
  return ipData.addresses;
}

// Get the last stored IP
function getLastStoredIp(): string {
  const ips = getStoredIps();
  return ips.length > 0 ? ips[ips.length - 1] : '';
}

const Num_View = ref(0)

export function Counter() {
  // Load from localStorage on component mount
  onMounted(() => {
    const storedValue = localStorage.getItem('num_view')
    if (storedValue !== null) {
      Num_View.value = parseInt(storedValue, 10)
    }
  })

  watch(Num_View, (newValue) => {
    localStorage.setItem('num_view', newValue.toString())
  })

  return {
    __memory: Num_View,
    count: Num_View
  }
}

const increment = () => {
  Num_View.value++
}
</script>

<script lang="ts" setup>
import { h, ref, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'

const dialogVisible = ref(false)
Counter()

const route = useRoute()

const Notify_page = () => {
  ElNotification.success({
    title: 'Already',
    message: h('i', { style: 'color: teal' }, 'Openend my CV'),
    offset: 100,
    duration: 1200,
  })
}

const Pop_Show = () => {
  if (route.path !== '/my-cv') {
    dialogVisible.value = true
  } else {
    dialogVisible.value = false
    Notify_page()
  }
}
</script>

<template>
  <el-button plain @click="Pop_Show" style="color: var(--color-text-link-1)"> CV </el-button>

  <el-dialog v-model="dialogVisible" tittle="Curriculum Vitae" width="450" draggable>
    <span> Thank you for your interest in my CV</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <RouterLink to="/my-cv" style="background: none">
          <el-button type="primary" @click="(getAndStoreClientIp(),getLastStoredIp(), (dialogVisible = false))"
            >View</el-button
          >
        </RouterLink>
      </div>
    </template>
  </el-dialog>
</template>
