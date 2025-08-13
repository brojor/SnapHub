<script setup lang="ts">
interface Props {
  isOnline: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center space-x-2">
    <div
      :class="[
        'w-3 h-3 rounded-full',
        isOnline ? 'bg-green-500' : 'bg-gray-400'
      ]"
      :aria-label="isOnline ? 'Online' : 'Offline'"
    />
    <span class="sr-only">
      {{ isOnline ? 'Online' : 'Offline' }}
    </span>
  </div>
</template>
