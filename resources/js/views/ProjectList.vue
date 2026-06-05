<template>
    <div>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">

            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-semibold text-gray-900">Projetos</h1>
                    <p class="text-sm text-gray-400 mt-0.5">{{ visibleProjects.length }} projeto{{ visibleProjects.length !== 1 ? 's' : '' }}</p>
                </div>
                <button
                    @click="showModal = true"
                    class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-sm hover:bg-primary-hover transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Novo projeto
                </button>
            </div>

            <!-- Tabs -->
            <div class="flex gap-1 bg-gray-100 rounded-md p-1 w-fit mb-6">
                <button
                    v-for="tab in tabs"
                    :key="tab.value"
                    @click="activeTab = tab.value"
                    class="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded transition-all"
                    :class="activeTab === tab.value
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'"
                >
                    {{ tab.label }}
                    <span
                        class="text-xs px-1.5 py-0.5 rounded-full font-medium"
                        :class="activeTab === tab.value ? 'bg-gray-100 text-gray-600' : 'bg-gray-200 text-gray-500'"
                    >
                        {{ counts[tab.value] }}
                    </span>
                </button>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="i in 6" :key="i" class="bg-white rounded-md border border-gray-100 p-5 h-36 animate-pulse" />
            </div>

            <!-- Error -->
            <div v-else-if="error" class="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-4 py-3">
                {{ error }}
            </div>

            <!-- Empty — sem projetos de todo -->
            <div v-else-if="projects.length === 0" class="text-center py-24">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                </div>
                <p class="text-gray-700 font-medium">Nenhum projeto ainda</p>
                <p class="text-gray-400 text-sm mt-1">Cria o teu primeiro projeto para começar.</p>
                <button
                    @click="showModal = true"
                    class="mt-4 px-4 py-2 text-sm font-medium text-white bg-primary rounded-sm hover:bg-primary-hover transition-colors"
                >
                    Criar projeto
                </button>
            </div>

            <!-- Empty — filtro sem resultados -->
            <div v-else-if="visibleProjects.length === 0" class="text-center py-24">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8" />
                    </svg>
                </div>
                <p class="text-gray-500 text-sm">Nenhum projeto {{ activeTab === 'archived' ? 'arquivado' : 'ativo' }}.</p>
            </div>

            <!-- Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ProjectCard
                    v-for="project in visibleProjects"
                    :key="project.id"
                    :project="project"
                    @click="router.push({ path: `/projects/${project.id}`, state: { name: project.name } })"
                    @archive="onArchive"
                />
            </div>
        </div>
    </div>

    <CreateProjectModal v-if="showModal" @close="showModal = false" @created="showModal = false" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjects } from '../composables/useProjects'
import ProjectCard from '../components/ProjectCard.vue'
import CreateProjectModal from '../components/CreateProjectModal.vue'
import type { ProjectStatus } from '../types'

const router = useRouter()
const { projects, loading, error, fetchProjects, archiveProject } = useProjects()
const showModal = ref(false)

type Tab = 'all' | 'active' | 'archived'
const activeTab = ref<Tab>('all')

const tabs: { label: string; value: Tab }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Ativos', value: 'active' },
    { label: 'Arquivados', value: 'archived' },
]

const counts = computed(() => ({
    all:      projects.value.length,
    active:   projects.value.filter(p => p.status === 'active').length,
    archived: projects.value.filter(p => p.status === 'archived').length,
}))

const visibleProjects = computed(() => {
    if (activeTab.value === 'active')   return projects.value.filter(p => p.status === 'active')
    if (activeTab.value === 'archived') return projects.value.filter(p => p.status === 'archived')
    return [...projects.value].sort((a, b) => {
        if (a.status === b.status) return 0
        return a.status === 'active' ? -1 : 1
    })
})

async function onArchive(id: number, status: ProjectStatus) {
    await archiveProject(id, status)
}

onMounted(fetchProjects)
</script>
