import axios from 'axios'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '../stores/projects'
import { useToast } from './useToast'
import type { Project, ProjectStatus, ApiResponse, PaginatedResponse } from '../types'

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

    async function archiveProject(projectId: number, status: ProjectStatus): Promise<Project> {
        try {
            const { data } = await axios.patch<ApiResponse<Project>>(`/api/projects/${projectId}`, { status })
            store.updateProject(projectId, data.data)
            toast.show(status === 'archived' ? 'Projeto arquivado.' : 'Projeto restaurado.')
            return data.data
        } catch (e: any) {
            toast.show(e.response?.data?.message ?? 'Erro ao atualizar projeto.', 'error')
            throw e
        }
    }

    return { projects, loading, error, fetchProjects, createProject, archiveProject }
}
