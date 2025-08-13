<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ConnectionStatus from '../components/ConnectionStatus.vue'

interface FileWithPreview {
  file: File
  preview: string
}

const router = useRouter()
const isOnline = ref(navigator.onLine)
const selectedFiles = ref<FileWithPreview[]>([])
const isUploading = ref(false)

onMounted(() => {
  // Zde by se načetly vybrané soubory z router state nebo localStorage
  // Pro demonstraci vytvoříme prázdný stav
  console.log('Náhled stránka načtena')
})

const goBack = () => {
  router.push('/')
}

const uploadFiles = async () => {
  if (!isOnline.value) {
    alert('Jste offline. Fotky budou odeslány, až budete online.')
    return
  }
  
  isUploading.value = true
  // Zde by se implementovala logika uploadu
  await new Promise(resolve => setTimeout(resolve, 2000))
  isUploading.value = false
  alert('Fotky byly úspěšně odeslány!')
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- App Bar -->
    <header class="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <button
            @click="goBack"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Zpět"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-xl font-semibold text-gray-900">Náhled & odeslání</h1>
        </div>
        <ConnectionStatus :is-online="isOnline" />
      </div>
    </header>

    <!-- Hlavní obsah -->
    <main class="flex-1 p-4">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">
            Vybrané fotky ({{ selectedFiles.length }})
          </h2>
          
          <!-- Placeholder pro náhledy -->
          <div class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
            </svg>
            <p>Zde se zobrazí náhledy vybraných fotek</p>
          </div>
          
          <!-- Tlačítka akcí -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="goBack"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Zpět
            </button>
            <button
              @click="uploadFiles"
              :disabled="isUploading || !isOnline"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="isUploading">Odesílám...</span>
              <span v-else>Odeslat fotky</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
