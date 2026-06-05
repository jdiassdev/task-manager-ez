import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Task } from '../types'

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref<Task[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const nextCursor = ref<string | null>(null)
    const prevCursor = ref<string | null>(null)

    function setTasks(data: Task[]) {
        tasks.value = data
    }

    function setCursors(next: string | null, prev: string | null) {
        nextCursor.value = next
        prevCursor.value = prev
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

    return { tasks, loading, error, nextCursor, prevCursor, setTasks, setCursors, addTask, updateTask, removeTask }
})
