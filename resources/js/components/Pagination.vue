<template>
    <div v-if="hasPrev || hasNext" class="flex items-center justify-center gap-3 mt-6">
        <button
            @click="$emit('prev')"
            :disabled="!hasPrev"
            class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default transition-colors"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
        </button>

        <button
            @click="$emit('next')"
            :disabled="!hasNext"
            class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default transition-colors"
        >
            Próxima
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
defineProps<{ hasPrev: boolean; hasNext: boolean }>()
defineEmits<{ prev: []; next: [] }>()
</script>
