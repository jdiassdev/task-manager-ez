<template>
    <div
        class="bg-white rounded-md border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
        @click="$emit('click')"
    >
        <div class="flex items-start justify-between gap-3">
            <h2 class="font-semibold text-gray-900 text-base leading-snug">{{ project.name }}</h2>
            <span :class="statusClass" class="shrink-0 text-xs font-medium px-2 py-0.5 rounded-sm">
                {{ project.status === 'active' ? 'Ativo' : 'Arquivado' }}
            </span>
        </div>

        <p v-if="project.description" class="text-sm text-gray-500 line-clamp-2">
            {{ project.description }}
        </p>
        <p v-else class="text-sm text-gray-300 italic">Sem descrição</p>

        <div class="mt-auto pt-3 border-t border-gray-50 flex items-center gap-1.5 text-xs text-gray-400">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {{ project.tasks_count }} {{ project.tasks_count === 1 ? 'tarefa' : 'tarefas' }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Project } from '../types'
import { computed } from 'vue'

const props = defineProps<{ project: Project }>()
defineEmits<{ click: [] }>()

const statusClass = computed(() =>
    props.project.status === 'active'
        ? 'bg-violet-50 text-violet-700'
        : 'bg-gray-100 text-gray-500'
)
</script>
