<template>
    <div class="min-h-screen">
        <header class="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
                <RouterLink to="/" class="font-semibold text-gray-900 hover:text-primary transition-colors text-sm">
                    Task Manager
                </RouterLink>

                <template v-if="route.name === 'project-detail'">
                    <span class="text-gray-300">/</span>
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
