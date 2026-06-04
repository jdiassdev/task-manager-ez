import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref([])
    const loading = ref(false)
    const error = ref(null)

    function setTasks(data) {
        tasks.value = data
    }

    function addTask(task) {
        tasks.value.unshift(task)
    }

    function updateTask(id, patch) {
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
            tasks.value[index] = { ...tasks.value[index], ...patch }
        }
    }

    function removeTask(id) {
        tasks.value = tasks.value.filter(t => t.id !== id)
    }

    return { tasks, loading, error, setTasks, addTask, updateTask, removeTask }
})
