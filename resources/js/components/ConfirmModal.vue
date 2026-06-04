<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('cancel')" />

            <div class="relative w-full max-w-sm bg-white rounded-md shadow-xl p-6 flex flex-col gap-4">
                <div>
                    <h2 class="text-base font-semibold text-gray-900">{{ title }}</h2>
                    <p class="text-sm text-gray-500 mt-1">{{ message }}</p>
                </div>

                <div class="flex justify-end gap-2">
                    <button
                        @click="$emit('cancel')"
                        class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        @click="$emit('confirm')"
                        class="px-4 py-2 text-sm font-medium text-white rounded-sm transition-colors"
                        :class="destructive ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-hover'"
                    >
                        {{ confirmLabel }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    title: string
    message: string
    confirmLabel?: string
    destructive?: boolean
}>(), {
    confirmLabel: 'Confirmar',
    destructive: false,
})

defineEmits<{ confirm: [], cancel: [] }>()
</script>
