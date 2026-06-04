import axios from 'axios'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '../stores/projects'
import { useToast } from './useToast'
import type { Project, ApiResponse, PaginatedResponse } from '../types'

export function useProjects() {
    const store = useProjectStore()
    const { projects, loading, error } = storeToRefs(store)
    const toast = useToast()

    async function fetchProjects(): Promise<void> {
        store.loading = true
        store.error = null
        try {
            const { data } = await axios.get<PaginatedResponse<Project>>('/api/projects')
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
            const { data } = await axios.post<ApiResponse<Project>>('/api/projects', payload)
            store.addProject(data.data)
            toast.show('Projeto criado.')
            return data.data
        } catch (e: any) {
            throw e
        } finally {
            store.loading = false
        }
    }

    return { projects, loading, error, fetchProjects, createProject }
}
