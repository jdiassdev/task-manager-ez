<template>
    <div v-if="lastPage > 1" class="flex items-center justify-center gap-1 mt-6">
        <button
            @click="$emit('change', currentPage - 1)"
            :disabled="currentPage === 1"
            class="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default transition-colors"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <template v-for="(item, i) in pageItems" :key="i">
            <span v-if="item === '...'" class="w-8 h-8 flex items-center justify-center text-gray-400 text-sm select-none">
                …
            </span>
            <button
                v-else
                @click="$emit('change', item)"
                class="w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors"
                :class="item === currentPage
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'"
            >
                {{ item }}
            </button>
        </template>

        <button
            @click="$emit('change', currentPage + 1)"
            :disabled="currentPage === lastPage"
            class="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default transition-colors"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ currentPage: number; lastPage: number }>()
defineEmits<{ change: [page: number] }>()

const pageItems = computed((): (number | '...')[] => {
    const { currentPage, lastPage } = props
    const items: (number | '...')[] = []

    if (lastPage <= 7) {
        for (let i = 1; i <= lastPage; i++) items.push(i)
        return items
    }

    items.push(1)
    if (currentPage > 3) items.push('...')

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(lastPage - 1, currentPage + 1)
    for (let i = start; i <= end; i++) items.push(i)

    if (currentPage < lastPage - 2) items.push('...')
    items.push(lastPage)

    return items
})
</script>
