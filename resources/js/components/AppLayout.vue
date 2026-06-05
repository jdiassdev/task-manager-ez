<template>
    <div class="min-h-screen">
        <header class="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
                <RouterLink to="/" class="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                    <div class="w-7 h-7 bg-primary rounded-sm flex items-center justify-center shrink-0">
                        <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <span class="font-semibold text-gray-900 text-sm tracking-tight">Task Manager</span>
                </RouterLink>

                <template v-if="route.name === 'project-detail'">
                    <span class="text-gray-200">/</span>
                    <span class="text-sm text-gray-500 truncate max-w-[200px]">{{ projectName }}</span>
                </template>
            </div>
        </header>

        <main>
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

defineProps<{ projectName?: string }>()

const route = useRoute()
</script>
