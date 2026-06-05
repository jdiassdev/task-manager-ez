import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Task } from '../types'

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref<Task[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const currentPage = ref(1)
    const lastPage = ref(1)

    function setTasks(data: Task[]) {
        tasks.value = data
    }

    function setPage(current: number, last: number) {
        currentPage.value = current
        lastPage.value = last
    }

    function addTask(task: Task) {
        tasks.value.unshift(task)
    }

    function updateTask(id: number, patch: Partial<Task>) {
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
            tasks.value[index] = { ...tasks.value[index], ...patch }
        }
    }

    function removeTask(id: number) {
        tasks.value = tasks.value.filter(t => t.id !== id)
    }

    return { tasks, loading, error, currentPage, lastPage, setTasks, setPage, addTask, updateTask, removeTask }
})
