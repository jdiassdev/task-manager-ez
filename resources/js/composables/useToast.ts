import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: number
    message: string
    type: ToastType
}

const toasts = ref<Toast[]>([])
let counter = 0

export function useToast() {
    function show(message: string, type: ToastType = 'success') {
        const id = ++counter
        toasts.value.push({ id, message, type })
        setTimeout(() => dismiss(id), 3200)
    }

    function dismiss(id: number) {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    return { toasts, show, dismiss }
}
