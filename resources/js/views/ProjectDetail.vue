<template>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <!-- Loading -->
        <div v-if="loading && tasks.length === 0" class="flex flex-col gap-3">
            <div v-for="i in 4" :key="i" class="bg-white rounded-md border border-gray-100 p-4 h-24 animate-pulse" />
        </div>

        <template v-else>
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <p class="text-xs text-gray-400">{{ tasks.length }} tarefa{{ tasks.length !== 1 ? 's' : '' }}</p>
                <button @click="showModal = true"
                    class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-sm hover:bg-primary-hover transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Nova tarefa
                </button>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-end gap-3 mb-6">
                <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-gray-400 uppercase tracking-wide">Estado</span>
                    <select v-model="filters.status"
                        class="border border-gray-200 rounded-sm px-3 py-1.5 text-sm outline-none focus:border-primary bg-white text-gray-600">
                        <option value="">Todos</option>
                        <option value="todo">A fazer</option>
                        <option value="in_progress">Em progresso</option>
                        <option value="done">Concluído</option>
                    </select>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-gray-400 uppercase tracking-wide">Prioridade</span>
                    <select v-model="filters.priority"
                        class="border border-gray-200 rounded-sm px-3 py-1.5 text-sm outline-none focus:border-primary bg-white text-gray-600">
                        <option value="">Todas</option>
                        <option value="high">Alta</option>
                        <option value="medium">Média</option>
                        <option value="low">Baixa</option>
                    </select>
                </div>

                <label class="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none pb-1.5">
                    <input type="checkbox" v-model="filters.overdue" class="accent-primary" />
                    Em atraso
                </label>
            </div>

            <!-- Error -->
            <div v-if="error" class="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-4 py-3 mb-4">
                {{ error }}
            </div>

            <!-- Empty -->
            <div v-if="tasks.length === 0 && !loading" class="text-center py-20">
                <div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12l2 2 4-4" />
                    </svg>
                </div>
                <p class="text-gray-700 font-medium">Nenhuma tarefa encontrada</p>
                <p class="text-gray-400 text-sm mt-1">Adiciona a primeira tarefa a este projeto.</p>
                <button
                    @click="showModal = true"
                    class="mt-4 px-4 py-2 text-sm font-medium text-white bg-primary rounded-sm hover:bg-primary-hover transition-colors"
                >
                    Nova tarefa
                </button>
            </div>

            <!-- Task list + paginação -->
            <template v-else>
                <Pagination :has-prev="!!prevCursor" :has-next="!!nextCursor" @prev="load(prevCursor!)" @next="load(nextCursor!)" />

                <TransitionGroup
                    tag="div"
                    name="task"
                    class="flex flex-col gap-2 relative transition-opacity duration-150 mt-3"
                    :class="{ 'opacity-40 pointer-events-none': loading && tasks.length > 0 }"
                >
                    <TaskCard v-for="task in sortedTasks" :key="task.id" :task="task" @status-change="onStatusChange"
                        @delete="deleteTask" />
                </TransitionGroup>

                <Pagination :has-prev="!!prevCursor" :has-next="!!nextCursor" @prev="load(prevCursor!)" @next="load(nextCursor!)" />
            </template>
        </template>
    </div>

    <CreateTaskModal v-if="showModal" :project-id="projectId" @close="showModal = false" @created="showModal = false" />
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTask } from '../composables/useTask'
import { useProjects } from '../composables/useProjects'
import TaskCard from '../components/TaskCard.vue'
import CreateTaskModal from '../components/CreateTaskModal.vue'
import Pagination from '../components/Pagination.vue'
import type { Task, TaskFilters } from '../types'

const emit = defineEmits<{ 'project-name': [name: string] }>()

const route = useRoute()
const projectId = computed(() => Number(route.params.id))

const { tasks, loading, error, nextCursor, prevCursor, fetchTasks, updateTask, deleteTask } = useTask()

const sortedTasks = computed(() => [...tasks.value].sort((a, b) => {
    if (a.status === 'done' && b.status !== 'done') return 1
    if (a.status !== 'done' && b.status === 'done') return -1
    return 0
}))

const { projects, fetchProjects } = useProjects()
const showModal = ref(false)
const filters = reactive({ status: '', priority: '', overdue: false })

function activeFilters(): TaskFilters {
    const params: TaskFilters = {}
    if (filters.status)   params.status = filters.status as TaskFilters['status']
    if (filters.priority) params.priority = filters.priority as TaskFilters['priority']
    if (filters.overdue)  params.overdue = filters.overdue
    return params
}

async function load(cursor?: string) {
    await fetchTasks(projectId.value, activeFilters(), cursor)
}

async function onStatusChange(id: number, status: Task['status']) {
    await updateTask(id, { status })
}

async function resolveProjectName() {
    const nameFromState = (history.state as Record<string, unknown>)?.name as string | undefined
    if (nameFromState) { emit('project-name', nameFromState); return }

    if (projects.value.length === 0) await fetchProjects()
    const project = projects.value.find(p => p.id === projectId.value)
    if (project) emit('project-name', project.name)
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(filters, () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => load(), 300)
})
onUnmounted(() => { if (debounceTimer) clearTimeout(debounceTimer) })
onMounted(() => { resolveProjectName(); load() })
</script>
