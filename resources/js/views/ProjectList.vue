<template>
    <div>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">

            <!-- Header -->
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-2xl font-semibold text-gray-900">Projetos</h1>
                    <p class="text-sm text-gray-400 mt-0.5">{{ projects.length }} projeto{{ projects.length !== 1 ? 's' : '' }}</p>
                </div>
                <button
                    @click="showModal = true"
                    class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-sm hover:bg-[#a800b8] transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Novo projeto
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

            <!-- Empty -->
            <div v-else-if="projects.length === 0" class="text-center py-24">
                <p class="text-gray-400 text-sm">Nenhum projeto criado ainda.</p>
                <button @click="showModal = true" class="mt-3 text-sm text-primary hover:underline">
                    Criar o primeiro projeto
                </button>
            </div>

            <!-- Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ProjectCard
                    v-for="project in projects"
                    :key="project.id"
                    :project="project"
                    @click="router.push({ path: `/projects/${project.id}`, state: { name: project.name } })"
                />
            </div>
        </div>
    </div>

    <CreateProjectModal v-if="showModal" @close="showModal = false" @created="showModal = false" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjects } from '../composables/useProjects'
import ProjectCard from '../components/ProjectCard.vue'
import CreateProjectModal from '../components/CreateProjectModal.vue'

const router = useRouter()
const { projects, loading, error, fetchProjects } = useProjects()
const showModal = ref(false)

onMounted(fetchProjects)
</script>
