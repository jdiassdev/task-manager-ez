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

    function incrementTaskCount(projectId: number) {
        const project = projects.value.find(p => p.id === projectId)
        if (project) project.tasks_count++
    }

    function decrementTaskCount(projectId: number) {
        const project = projects.value.find(p => p.id === projectId)
        if (project && project.tasks_count > 0) project.tasks_count--
    }

    return { projects, loading, error, setProjects, addProject, incrementTaskCount, decrementTaskCount }
})
