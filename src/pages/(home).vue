<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import PWABadge from '../components/PWABadge.vue'
import ConnectionStatus from '../components/ConnectionStatus.vue'
import OfflineBanner from '../components/OfflineBanner.vue'

interface FileWithPreview {
  file: File
  preview: string
}

const router = useRouter()
const isOnline = ref(navigator.onLine)
const selectedFiles = ref<FileWithPreview[]>([])

// Sledování stavu připojení
const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})

// Výběr souborů z galerie
const selectFromGallery = async () => {
  try {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = 'image/jpeg,image/png,image/heic,image/heif'
    
    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement
      if (!target.files || target.files.length === 0) return
      
      const files = Array.from(target.files)
      
      // Kontrola velikosti souborů (max 20 MB)
      const validFiles = files.filter(file => file.size <= 20 * 1024 * 1024)
      
      if (validFiles.length === 0) {
        alert('Všechny vybrané soubory jsou příliš velké. Maximální velikost je 20 MB.')
        return
      }
      
      // Kontrola počtu souborů (max 10)
      if (validFiles.length > 10) {
        alert('Můžete vybrat maximálně 10 souborů.')
        return
      }
      
      // Generování náhledů
      const filesWithPreviews = await Promise.all(
        validFiles.map(async (file) => {
          const preview = await createFilePreview(file)
          return { file, preview }
        })
      )
      
      selectedFiles.value = filesWithPreviews
      
      // Navigace na obrazovku náhledu (pokud je online nebo offline)
      if (isOnline.value) {
        // Online - přejít na náhled
        router.push('/preview')
      } else {
        // Offline - uložit do lokální fronty a zůstat zde
        saveToLocalQueue(filesWithPreviews)
        alert('Fotky byly uloženy a budou odeslány, až budete online.')
      }
    }
    
    input.click()
  } catch (error) {
    console.error('Chyba při výběru souborů:', error)
    alert('Nepodařilo se otevřít galerii. Zkuste to prosím znovu.')
  }
}

// Vytvoření náhledu souboru
const createFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

// Uložení do lokální fronty pro offline režim
const saveToLocalQueue = (files: FileWithPreview[]) => {
  try {
    const queue = JSON.parse(localStorage.getItem('uploadQueue') || '[]')
    const newItems = files.map(({ file, preview }) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      preview,
      timestamp: Date.now()
    }))
    
    localStorage.setItem('uploadQueue', JSON.stringify([...queue, ...newItems]))
  } catch (error) {
    console.error('Chyba při ukládání do lokální fronty:', error)
  }
}

// Haptická odezva (pokud je podporována)
const triggerHapticFeedback = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50)
  }
}

const handleGalleryClick = () => {
  triggerHapticFeedback()
  selectFromGallery()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- App Bar -->
    <header class="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
            </svg>
          </div>
          <h1 class="text-xl font-semibold text-gray-900">SnapHub</h1>
        </div>
        <ConnectionStatus :is-online="isOnline" />
      </div>
    </header>

    <!-- Offline Banner -->
    <OfflineBanner v-if="!isOnline" />

    <!-- Hlavní obsah -->
    <main class="flex-1 flex items-center justify-center px-4 py-8">
      <div class="text-center max-w-md">
        <!-- CTA Tlačítko -->
        <button
          @click="handleGalleryClick"
          class="w-64 h-64 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center space-y-4 group"
          aria-label="Vybrat fotky z galerie"
        >
          <!-- Ikona obrázku -->
          <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-200">
            <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <!-- Text tlačítka -->
          <span class="text-white text-xl font-medium">Vybrat z galerie</span>
        </button>

        <!-- Podtitul -->
        <p class="mt-6 text-sm text-gray-600 max-w-xs mx-auto">
          JPG/PNG/HEIC, max 20 MB/ks, až 10 fotek
        </p>
      </div>
    </main>

    <!-- PWA Badge (pro vývoj) -->
    <div class="absolute bottom-4 right-4">
      <PWABadge />
    </div>
  </div>
</template>

<style scoped>
/* Jemná animace při zobrazení */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

main {
  animation: fadeInScale 0.3s ease-out;
}
</style>