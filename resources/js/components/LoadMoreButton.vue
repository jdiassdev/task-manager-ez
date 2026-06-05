<template>
    <div v-if="visible" class="text-center mt-4">
        <button
            @click="$emit('load')"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
            {{ loading ? 'A carregar...' : 'Carregar mais' }}
        </button>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ visible: boolean; loading?: boolean }>(), { loading: false })
defineEmits<{ load: [] }>()
</script>
