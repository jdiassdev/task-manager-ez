import axios from 'axios'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '../stores/tasks'
import type { Task, TaskFilters } from '../types'

export function useTask() {
    const store = useTaskStore()
    const { tasks, loading, error } = storeToRefs(store)

    async function fetchTasks(projectId: number, filters: TaskFilters = {}): Promise<void> {
        store.loading = true
        store.error = null
        try {
            const { data } = await axios.get(`/api/projects/${projectId}/tasks`, { params: filters })
            store.setTasks(data.data)
        } catch (e: any) {
            store.error = e.response?.data?.message ?? 'Erro ao carregar tarefas.'
        } finally {
            store.loading = false
        }
    }

    async function createTask(projectId: number, payload: Pick<Task, 'title' | 'description' | 'priority' | 'due_date'>): Promise<Task> {
        store.loading = true
        store.error = null
        try {
            const { data } = await axios.post(`/api/projects/${projectId}/tasks`, payload)
            store.addTask(data.data)
            return data.data
        } catch (e: any) {
            store.error = e.response?.data?.message ?? 'Erro ao criar tarefa.'
            throw e
        } finally {
            store.loading = false
        }
    }

    async function updateTask(taskId: number, payload: Partial<Pick<Task, 'status' | 'priority'>>): Promise<Task> {
        store.error = null
        try {
            const { data } = await axios.patch(`/api/tasks/${taskId}`, payload)
            store.updateTask(taskId, data.data)
            return data.data
        } catch (e: any) {
            store.error = e.response?.data?.message ?? 'Erro ao atualizar tarefa.'
            throw e
        }
    }

    async function deleteTask(taskId: number): Promise<void> {
        store.error = null
        try {
            await axios.delete(`/api/tasks/${taskId}`)
            store.removeTask(taskId)
        } catch (e: any) {
            store.error = e.response?.data?.message ?? 'Erro ao eliminar tarefa.'
            throw e
        }
    }

    return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask }
}
