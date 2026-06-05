<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('cancel')" />

            <div class="relative w-full max-w-sm bg-white rounded-md shadow-xl p-6 flex flex-col gap-5">
                <div class="flex flex-col items-center text-center gap-3">
                    <div
                        class="w-11 h-11 rounded-full flex items-center justify-center"
                        :class="destructive ? 'bg-red-50' : 'bg-violet-50'"
                    >
                        <svg v-if="destructive" class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <svg v-else class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <div>
                        <h2 class="text-base font-semibold text-gray-900">{{ title }}</h2>
                        <p class="text-sm text-gray-500 mt-1">{{ message }}</p>
                    </div>
                </div>

                <div class="flex gap-2">
                    <button
                        @click="$emit('cancel')"
                        class="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-sm hover:bg-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        @click="$emit('confirm')"
                        class="flex-1 px-4 py-2 text-sm font-medium text-white rounded-sm transition-colors"
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
