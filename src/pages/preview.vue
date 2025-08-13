<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import ConnectionStatus from '../components/ConnectionStatus.vue'
import AppBar from '../components/AppBar.vue'

interface FileData {
  name: string
  size: number
  type: string
  lastModified: number
  base64Data: string
}

const router = useRouter()
const isOnline = ref(navigator.onLine)
const selectedFiles = ref<FileData[]>([])
const isUploading = ref(false)
const isLoading = ref(true)

// Počet vybraných souborů
const fileCount = computed(() => selectedFiles.value.length)

onMounted(async () => {
  try {
    // Načtení dat o vybraných souborech ze sessionStorage
    const fileData = sessionStorage.getItem('selectedFiles')
    const count = sessionStorage.getItem('fileCount')
    
    if (fileData && count) {
      const files: FileData[] = JSON.parse(fileData)
      const fileCount = parseInt(count)
      
      if (files.length === fileCount) {
        selectedFiles.value = files
      }
    }
  } catch (error) {
    console.error('Chyba při načítání souborů:', error)
  } finally {
    isLoading.value = false
  }
})

// Formátování velikosti souboru
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Formátování data změny
const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goBack = () => {
  // Vyčistit sessionStorage
  sessionStorage.removeItem('selectedFiles')
  sessionStorage.removeItem('fileCount')
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
  goBack()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- App Bar -->
    <AppBar 
      title="Náhled & odeslání" 
      :show-back-button="true"
      :on-back-click="goBack"
    >
      <template #right>
        <ConnectionStatus :is-online="isOnline" />
      </template>
    </AppBar>

    <!-- Hlavní obsah -->
    <main class="flex-1 p-4">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">
            Vybrané fotky ({{ fileCount }})
          </h2>
          
          <!-- Loading stav -->
          <div v-if="isLoading" class="text-center py-12 text-gray-500">
            <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Načítám náhledy...</p>
          </div>
          
          <!-- Náhledy souborů -->
          <div v-else-if="selectedFiles.length > 0" class="space-y-4 mb-6">
            <div 
              v-for="(file, index) in selectedFiles" 
              :key="index"
              class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <!-- Náhled obrázku -->
              <div class="flex-shrink-0">
                <img 
                  :src="file.base64Data" 
                  :alt="file.name"
                  class="w-20 h-20 object-cover rounded-lg border border-gray-300"
                  @error="(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAyMEMyOS4wMDAxIDIwIDIwIDI5LjAwMDEgMjAgNDBDMjAgNTAuOTk5OSAyOS4wMDAxIDYwIDQwIDYwQzUwLjk5OTkgNjAgNjAgNTAuOTk5OSA2MCA0MEM2MCAyOS4wMDAxIDUwLjk5OTkgMjAgNDAgMjBaIiBmaWxsPSIjOUNDM0FGIi8+CjxwYXRoIGQ9Ik0yOCAzNkMyOCAzMS41ODE3IDMxLjU4MTcgMjggMzYgMjhINDJDNjYuNjI3NCAyOCA2OCAzMS41ODE3IDY4IDM2VjQ0QzY4IDQ4LjQxODMgNjYuNjI3NCA1MiA2MiA1MkgxNEM5LjU4MTcyIDUyIDggNDguNDE4MyA4IDQ0VjM2WiIgZmlsbD0iIzlDQzNBRiIvPgo8L3N2Zz4K'
                  }"
                />
              </div>
              
              <!-- Informace o souboru -->
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-gray-900 truncate" :title="file.name">
                  {{ file.name }}
                </h3>
                <div class="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                  <span>{{ formatFileSize(file.size) }}</span>
                  <span>{{ file.type.split('/')[1].toUpperCase() }}</span>
                  <span>{{ formatDate(file.lastModified) }}</span>
                </div>
              </div>
              
              <!-- Pořadové číslo -->
              <div class="flex-shrink-0">
                <span class="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-600 bg-gray-200 rounded-full">
                  {{ index + 1 }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Prázdný stav -->
          <div v-else class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
            </svg>
            <p>Žádné fotky nebyly vybrány</p>
          </div>
          
          <!-- Souhrn -->
          <div v-if="selectedFiles.length > 0" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex justify-between items-center text-sm">
              <span class="text-blue-800">
                Celkem: {{ fileCount }} {{ fileCount === 1 ? 'fotka' : fileCount < 5 ? 'fotky' : 'fotek' }}
              </span>
              <span class="text-blue-800 font-medium">
                {{ formatFileSize(selectedFiles.reduce((total, file) => total + file.size, 0)) }}
              </span>
            </div>
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
              :disabled="isUploading || !isOnline || selectedFiles.length === 0"
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
