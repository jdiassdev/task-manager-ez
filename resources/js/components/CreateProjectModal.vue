<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('close')" />

        <div class="relative w-full max-w-md bg-white rounded-md shadow-xl p-6 flex flex-col gap-5">
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Novo projeto</h2>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form @submit.prevent="submit" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700">Nome <span class="text-red-500">*</span></label>
                    <input
                        v-model="form.name"
                        type="text"
                        placeholder="Nome do projeto"
                        maxlength="255"
                        class="border border-gray-200 rounded-sm px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                        :class="{ 'border-red-400': errors.name }"
                    />
                    <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
                </div>

                <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700">Descrição</label>
                    <textarea
                        v-model="form.description"
                        placeholder="Descrição opcional"
                        rows="3"
                        maxlength="2000"
                        class="border border-gray-200 rounded-sm px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none"
                    />
                </div>

                <p v-if="apiError" class="text-xs text-red-500">{{ apiError }}</p>

                <div class="flex justify-end gap-2 pt-1">
                    <button
                        type="button"
                        @click="$emit('close')"
                        class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        :disabled="loading"
                        class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-sm hover:bg-primary-hover disabled:opacity-50 transition-colors"
                    >
                        {{ loading ? 'A criar...' : 'Criar projeto' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useProjects } from '../composables/useProjects'

const emit = defineEmits<{ close: [], created: [] }>()

const { createProject, loading } = useProjects()

const form = reactive({ name: '', description: '' })
const errors = reactive<{ name?: string }>({})
const apiError = ref<string | null>(null)

function validate(): boolean {
    errors.name = undefined
    if (!form.name.trim()) {
        errors.name = 'O nome do projeto é obrigatório.'
        return false
    }
    return true
}

async function submit() {
    if (!validate()) return
    apiError.value = null
    try {
        await createProject({ name: form.name.trim(), description: form.description || null })
        emit('created')
        emit('close')
    } catch (e: any) {
        apiError.value = e.response?.data?.message ?? 'Erro ao criar projeto.'
    }
}
</script>
