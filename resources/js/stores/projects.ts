import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Project } from '../types'

export const useProjectStore = defineStore('projects', () => {
    const projects = ref<Project[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    function setProjects(data: Project[]) {
        projects.value = data
    }

    function addProject(project: Project) {
        projects.value.unshift(project)
    }

    return { projects, loading, error, setProjects, addProject }
})
