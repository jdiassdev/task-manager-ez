<template>
    <div
        class="bg-white rounded-md border border-gray-100 border-l-4 pl-4 pr-4 py-4 flex flex-col gap-2.5 hover:shadow-sm transition-shadow duration-150"
        :class="[isOverdue ? 'border-l-red-400' : priorityBorder, { 'opacity-55': task.status === 'done' }]"
    >
        <!-- Título + delete -->
        <div class="flex items-start justify-between gap-3">
            <p
                class="text-sm font-medium text-gray-900 leading-snug"
                :class="{ 'line-through text-gray-400': task.status === 'done' }"
            >
                {{ task.title }}
            </p>
            <button
                @click.stop="showConfirm = true"
                class="shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded p-1 transition-colors"
                title="Eliminar tarefa"
            >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>

        <!-- Descrição -->
        <p v-if="task.description" class="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {{ task.description }}
        </p>

        <!-- Footer -->
        <div class="flex items-center justify-between gap-2 flex-wrap pt-1">
            <div class="flex items-center gap-2">
                <!-- Em atraso -->
                <span v-if="isOverdue" class="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                    <span class="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                    Em atraso
                </span>
                <!-- Data -->
                <span v-if="task.due_date" class="text-xs text-gray-400">
                    {{ formatDate(task.due_date) }}
                </span>
                <!-- Prioridade -->
                <span class="text-xs font-medium px-1.5 py-0.5 rounded-full" :class="priorityBadge">
                    {{ priorityLabel }}
                </span>
            </div>

            <!-- Status -->
            <select
                :value="task.status"
                @change="$emit('status-change', task.id, ($event.target as HTMLSelectElement).value as Task['status'])"
                class="text-xs font-medium px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer appearance-none"
                :class="statusBadge"
            >
                <option value="todo">A fazer</option>
                <option value="in_progress">Em progresso</option>
                <option value="done">Concluído</option>
            </select>
        </div>
    </div>
    <ConfirmModal
        v-if="showConfirm"
        title="Eliminar tarefa"
        message="Esta ação é permanente e não pode ser revertida."
        confirm-label="Eliminar"
        :destructive="true"
        @confirm="handleDelete"
        @cancel="showConfirm = false"
    />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task } from '../types'
import ConfirmModal from './ConfirmModal.vue'

/** Cartão de tarefa com indicação visual de prioridade, atraso e controlo de status. */
const props = defineProps<{ task: Task }>()

const emit = defineEmits<{
    delete: [id: number]
    'status-change': [id: number, status: Task['status']]
}>()

const showConfirm = ref(false)

function handleDelete() {
    showConfirm.value = false
    emit('delete', props.task.id)
}

const isOverdue = computed(() => props.task.is_overdue)

const priorityBorder = computed(() => ({
    'border-l-red-400':    props.task.priority === 'high',
    'border-l-yellow-400': props.task.priority === 'medium',
    'border-l-gray-200':   props.task.priority === 'low',
}))

const priorityBadge = computed(() => ({
    'bg-red-50 text-red-500':       props.task.priority === 'high',
    'bg-yellow-50 text-yellow-600': props.task.priority === 'medium',
    'bg-gray-100 text-gray-400':    props.task.priority === 'low',
}))

const priorityLabel = computed(() => ({
    high: 'Alta', medium: 'Média', low: 'Baixa',
}[props.task.priority]))

const statusBadge = computed(() => ({
    'bg-gray-100 text-gray-500':       props.task.status === 'todo',
    'bg-violet-50 text-primary':       props.task.status === 'in_progress',
    'bg-green-50 text-green-600':      props.task.status === 'done',
}))

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
</script>
