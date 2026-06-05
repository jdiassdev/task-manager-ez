<template>
    <div
        class="group bg-white rounded-md border border-gray-100 border-l-4 pl-4 pr-4 py-4 flex flex-col gap-2.5 hover:shadow-sm transition-shadow duration-150"
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
                class="shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded p-1 transition-all"
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
                <span v-if="isOverdue" class="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                    <span class="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                    Em atraso
                </span>
                <span v-if="task.due_date" class="text-xs text-gray-400">
                    {{ formatDate(task.due_date) }}
                </span>
                <span class="text-xs font-medium px-1.5 py-0.5 rounded-full" :class="priorityBadge">
                    {{ priorityLabel }}
                </span>
            </div>

            <!-- Status dropdown -->
            <div class="relative">
                <div v-if="statusOpen" class="fixed inset-0 z-10" @click.stop="statusOpen = false" />
                <button
                    @click.stop="statusOpen = !statusOpen"
                    class="relative z-20 flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors"
                    :class="statusBadge"
                >
                    {{ statusLabel }}
                    <svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div
                    v-if="statusOpen"
                    class="absolute right-0 bottom-full mb-1.5 bg-white border border-gray-100 rounded-md shadow-lg z-20 py-1 min-w-[150px]"
                >
                    <button
                        v-for="opt in statusOptions"
                        :key="opt.value"
                        @click.stop="selectStatus(opt.value)"
                        class="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left transition-colors"
                        :class="task.status === opt.value
                            ? 'opacity-40 cursor-default'
                            : optionHoverClass(opt.value)"
                    >
                        <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="statusDotClass(opt.value)" />
                        {{ opt.label }}
                    </button>
                </div>
            </div>
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

const props = defineProps<{ task: Task }>()

const emit = defineEmits<{
    delete: [id: number]
    'status-change': [id: number, status: Task['status']]
}>()

const showConfirm = ref(false)
const statusOpen = ref(false)

const statusOptions: { value: Task['status']; label: string }[] = [
    { value: 'todo',        label: 'A fazer' },
    { value: 'in_progress', label: 'Em progresso' },
    { value: 'done',        label: 'Concluído' },
]

function handleDelete() {
    showConfirm.value = false
    emit('delete', props.task.id)
}

function selectStatus(status: Task['status']) {
    statusOpen.value = false
    if (status !== props.task.status) emit('status-change', props.task.id, status)
}

const isOverdue = computed(() => props.task.is_overdue)

const statusLabel = computed(() => ({
    todo: 'A fazer', in_progress: 'Em progresso', done: 'Concluído',
}[props.task.status]))

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
    'bg-gray-100 text-gray-500':  props.task.status === 'todo',
    'bg-violet-50 text-primary':  props.task.status === 'in_progress',
    'bg-green-50 text-green-600': props.task.status === 'done',
}))

function optionHoverClass(status: Task['status']) {
    return {
        'hover:bg-gray-50 text-gray-600':    status === 'todo',
        'hover:bg-violet-50 text-primary':   status === 'in_progress',
        'hover:bg-green-50 text-green-600':  status === 'done',
    }
}

function statusDotClass(status: Task['status']) {
    return {
        'bg-gray-400':   status === 'todo',
        'bg-primary':    status === 'in_progress',
        'bg-green-500':  status === 'done',
    }
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
</script>
