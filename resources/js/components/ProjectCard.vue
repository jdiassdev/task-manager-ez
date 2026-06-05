<template>
    <div
        class="bg-white rounded-md border border-gray-100 border-l-4 p-5 flex flex-col gap-4 hover:shadow-md transition-all duration-200 cursor-pointer"
        :class="project.status === 'active' ? 'border-l-primary' : 'border-l-gray-200 opacity-60 hover:opacity-80'"
        @click="$emit('click')"
    >
        <div class="flex items-start justify-between gap-3">
            <h2 class="font-semibold text-gray-900 text-base leading-snug">{{ project.name }}</h2>
            <span :class="statusClass" class="shrink-0 text-xs font-medium px-2 py-0.5 rounded-sm">
                {{ project.status === 'active' ? 'Ativo' : 'Arquivado' }}
            </span>
        </div>

        <p v-if="project.description" class="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {{ project.description }}
        </p>
        <p v-else class="text-sm text-gray-300">—</p>

        <div class="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-xs text-gray-400">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {{ project.tasks_count }} {{ project.tasks_count === 1 ? 'tarefa' : 'tarefas' }}
            </div>

            <button
                @click.stop="showConfirm = true"
                class="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded p-1 transition-colors"
                :title="project.status === 'active' ? 'Arquivar projeto' : 'Restaurar projeto'"
            >
                <svg v-if="project.status === 'active'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            </button>
        </div>
    </div>

    <ConfirmModal
        v-if="showConfirm"
        :title="project.status === 'active' ? 'Arquivar projeto' : 'Restaurar projeto'"
        :message="project.status === 'active'
            ? 'O projeto ficará oculto da lista principal.'
            : 'O projeto voltará a aparecer na lista principal.'"
        :confirm-label="project.status === 'active' ? 'Arquivar' : 'Restaurar'"
        @confirm="handleArchive"
        @cancel="showConfirm = false"
    />
</template>

<script setup lang="ts">
import type { Project, ProjectStatus } from '../types'
import { ref, computed } from 'vue'
import ConfirmModal from './ConfirmModal.vue'

const props = defineProps<{ project: Project }>()

const emit = defineEmits<{
    click: []
    archive: [id: number, status: ProjectStatus]
}>()

const showConfirm = ref(false)

function handleArchive() {
    showConfirm.value = false
    emit('archive', props.project.id, props.project.status === 'active' ? 'archived' : 'active')
}

const statusClass = computed(() =>
    props.project.status === 'active'
        ? 'bg-violet-50 text-violet-700'
        : 'bg-gray-100 text-gray-500'
)
</script>
