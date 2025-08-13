<script setup lang="ts">
interface Props {
  title: string
  showBackButton?: boolean
  onBackClick?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false
})

const emit = defineEmits<{
  back: []
}>()

const handleBackClick = () => {
  if (props.onBackClick) {
    props.onBackClick()
  } else {
    emit('back')
  }
}
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button
          v-if="showBackButton"
          @click="handleBackClick"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Zpět"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div v-else class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
      </div>
      <slot name="right">
        <!-- Výchozí slot pro pravé tlačítko/obsah -->
      </slot>
    </div>
  </header>
</template>
