import axios from 'axios'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '../stores/projects'
import type { Project } from '../types'

export function useProjects() {
    const store = useProjectStore()
    const { projects, loading, error } = storeToRefs(store)

    async function fetchProjects(): Promise<void> {
        store.loading = true
        store.error = null
        try {
            const { data } = await axios.get('/api/projects')
            store.setProjects(data.data)
        } catch (e: any) {
            store.error = e.response?.data?.message ?? 'Erro ao carregar projetos.'
        } finally {
            store.loading = false
        }
    }

    async function createProject(payload: Pick<Project, 'name' | 'description'>): Promise<Project> {
        store.loading = true
        store.error = null
        try {
            const { data } = await axios.post('/api/projects', payload)
            store.addProject(data.data)
            return data.data
        } catch (e: any) {
            store.error = e.response?.data?.message ?? 'Erro ao criar projeto.'
            throw e
        } finally {
            store.loading = false
        }
    }

    return { projects, loading, error, fetchProjects, createProject }
}
