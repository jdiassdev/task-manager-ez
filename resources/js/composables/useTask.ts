import axios from 'axios'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '../stores/tasks'
import { useProjectStore } from '../stores/projects'
import { useToast } from './useToast'
import type { Task, TaskFilters, ApiResponse, PaginatedResponse } from '../types'

export function useTask() {
    const store = useTaskStore()
    const projectStore = useProjectStore()
    const { tasks, loading, error, nextCursor } = storeToRefs(store)
    const toast = useToast()

    function buildParams(filters: TaskFilters, cursor?: string) {
        return {
            ...filters,
            ...(filters.overdue ? { overdue: 1 } : {}),
            ...(cursor ? { cursor } : {}),
        }
    }

    async function fetchTasks(projectId: number, filters: TaskFilters = {}): Promise<void> {
        store.loading = true
        store.error = null
        try {
            const { data } = await axios.get<PaginatedResponse<Task>>(
                `/api/projects/${projectId}/tasks`,
                { params: buildParams(filters) },
            )
            store.setTasks(data.data)
            store.setNextCursor(data.meta?.next_cursor ?? null)
        } catch (e: any) {
            store.error = e.response?.data?.message ?? 'Erro ao carregar tarefas.'
        } finally {
            store.loading = false
        }
    }

    async function loadMoreTasks(projectId: number, filters: TaskFilters = {}): Promise<void> {
        if (!store.nextCursor) return
        store.loading = true
        store.error = null
        try {
            const { data } = await axios.get<PaginatedResponse<Task>>(
                `/api/projects/${projectId}/tasks`,
                { params: buildParams(filters, store.nextCursor) },
            )
            store.appendTasks(data.data)
            store.setNextCursor(data.meta?.next_cursor ?? null)
        } catch (e: any) {
            store.error = e.response?.data?.message ?? 'Erro ao carregar mais tarefas.'
        } finally {
            store.loading = false
        }
    }

    async function createTask(projectId: number, payload: Pick<Task, 'title' | 'description' | 'priority' | 'due_date'>): Promise<Task> {
        store.loading = true
        store.error = null
        try {
            const { data } = await axios.post<ApiResponse<Task>>(`/api/projects/${projectId}/tasks`, payload)
            store.addTask(data.data)
            projectStore.incrementTaskCount(projectId)
            toast.show('Tarefa criada.')
            return data.data
        } catch (e: any) {
            throw e
        } finally {
            store.loading = false
        }
    }

    async function updateTask(taskId: number, payload: Partial<Pick<Task, 'status' | 'priority'>>): Promise<Task> {
        const original = store.tasks.find(t => t.id === taskId)
        if (original) store.updateTask(taskId, payload)
        store.error = null
        try {
            const { data } = await axios.patch<ApiResponse<Task>>(`/api/tasks/${taskId}`, payload)
            store.updateTask(taskId, data.data)
            return data.data
        } catch (e: any) {
            if (original) store.updateTask(taskId, original)
            toast.show(e.response?.data?.message ?? 'Erro ao atualizar tarefa.', 'error')
            throw e
        }
    }

    async function deleteTask(taskId: number): Promise<void> {
        const task = store.tasks.find(t => t.id === taskId)
        store.error = null
        try {
            await axios.delete(`/api/tasks/${taskId}`)
            store.removeTask(taskId)
            if (task) projectStore.decrementTaskCount(task.project_id)
            toast.show('Tarefa eliminada.')
        } catch (e: any) {
            store.error = e.response?.data?.message ?? 'Erro ao eliminar tarefa.'
            throw e
        }
    }

    return { tasks, loading, error, nextCursor, fetchTasks, loadMoreTasks, createTask, updateTask, deleteTask }
}
