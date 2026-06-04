import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useProjectStore = defineStore('projects', () => {
    const projects = ref([])
    const loading = ref(false)
    const error = ref(null)

    function setProjects(data) {
        projects.value = data
    }

    function addProject(project) {
        projects.value.unshift(project)
    }

    return { projects, loading, error, setProjects, addProject }
})
