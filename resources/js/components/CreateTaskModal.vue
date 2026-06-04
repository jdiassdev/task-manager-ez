<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('close')" />

        <div class="relative w-full max-w-md bg-white rounded-md shadow-xl p-6 flex flex-col gap-5">
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Nova tarefa</h2>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form @submit.prevent="submit" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700">Título <span class="text-red-500">*</span></label>
                    <input
                        v-model="form.title"
                        type="text"
                        placeholder="Título da tarefa"
                        maxlength="255"
                        class="border border-gray-200 rounded-sm px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                        :class="{ 'border-red-400': errors.title }"
                    />
                    <p v-if="errors.title" class="text-xs text-red-500">{{ errors.title }}</p>
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

                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-medium text-gray-700">Prioridade</label>
                        <select
                            v-model="form.priority"
                            class="border border-gray-200 rounded-sm px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                        >
                            <option value="low">Baixa</option>
                            <option value="medium">Média</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-medium text-gray-700">Data limite</label>
                        <input
                            v-model="form.due_date"
                            type="date"
                            class="border border-gray-200 rounded-sm px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                        />
                    </div>
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
                        {{ loading ? 'A criar...' : 'Criar tarefa' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useTask } from '../composables/useTask'
import type { TaskPriority } from '../types'

const props = defineProps<{ projectId: number }>()
const emit = defineEmits<{ close: [], created: [] }>()

const { createTask, loading } = useTask()

const form = reactive({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    due_date: '',
})

const errors = reactive<{ title?: string }>({})
const apiError = ref<string | null>(null)

function validate(): boolean {
    errors.title = undefined
    if (!form.title.trim()) {
        errors.title = 'O título da tarefa é obrigatório.'
        return false
    }
    return true
}

async function submit() {
    if (!validate()) return
    apiError.value = null
    try {
        await createTask(props.projectId, {
            title: form.title.trim(),
            description: form.description || null,
            priority: form.priority,
            due_date: form.due_date || null,
        })
        emit('created')
        emit('close')
    } catch (e: any) {
        apiError.value = e.response?.data?.message ?? 'Erro ao criar tarefa.'
    }
}
</script>
