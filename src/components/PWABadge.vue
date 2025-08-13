<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

// check for updates every minute
const period = 60 * 1000

const swActivated = ref(false)

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(swUrl: string, r: ServiceWorkerRegistration) {
  if (period <= 0) return

  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine)
      return

    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        'cache': 'no-store',
        'cache-control': 'no-cache',
      },
    })

    if (resp?.status === 200)
      await r.update()
  }, period)
}

const { needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    if (period <= 0) return
    if (r?.active?.state === 'activated') {
      swActivated.value = true
      registerPeriodicSync(swUrl, r)
    }
    else if (r?.installing) {
      r.installing.addEventListener('statechange', (e) => {
        const sw = e.target as ServiceWorker
        swActivated.value = sw.state === 'activated'
        if (swActivated.value)
          registerPeriodicSync(swUrl, r)
      })
    }
  },
})

const title = computed(() => {
  
    
  if (needRefresh.value)
    return 'New content available, click on reload button to update.'
  return ''
})

function close() {
  
  needRefresh.value = false
}
</script>

<template>
  <div
      v-if="needRefresh"
      class="fixed right-0 bottom-0 m-4 p-3 border border-gray-400/50 rounded z-10 text-left shadow-lg bg-white"
      aria-labelledby="toast-message"
      role="alert"
  >
    <div class="mb-2">
      <span id="toast-message">
        {{ title }}
      </span>
    </div>
    <div class="flex">
      <button type="button" class="border border-gray-400/50 outline-none mr-1 rounded px-2.5 py-0.5 block" @click="updateServiceWorker()">
        Reload
      </button>
      <button type="button" class="border border-gray-400/50 outline-none mr-1 rounded px-2.5 py-0.5" @click="close">
        Close
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
