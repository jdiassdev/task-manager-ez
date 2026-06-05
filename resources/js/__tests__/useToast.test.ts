import { describe, it, expect, afterEach, vi } from 'vitest'
import { useToast } from '../composables/useToast'

afterEach(() => {
    const { toasts, dismiss } = useToast()
    ;[...toasts.value].forEach(t => dismiss(t.id))
    vi.clearAllTimers()
})

describe('useToast', () => {
    it('adiciona um toast ao chamar show()', () => {
        const { toasts, show } = useToast()
        show('Projeto criado.')
        expect(toasts.value).toHaveLength(1)
        expect(toasts.value[0].message).toBe('Projeto criado.')
    })

    it('usa "success" como tipo por defeito', () => {
        const { toasts, show } = useToast()
        show('OK')
        expect(toasts.value[0].type).toBe('success')
    })

    it('aceita tipo personalizado', () => {
        const { toasts, show } = useToast()
        show('Algo correu mal.', 'error')
        expect(toasts.value[0].type).toBe('error')
    })

    it('remove o toast ao chamar dismiss()', () => {
        const { toasts, show, dismiss } = useToast()
        show('Mensagem')
        const id = toasts.value[0].id
        dismiss(id)
        expect(toasts.value).toHaveLength(0)
    })

    it('atribui ids únicos a toasts consecutivos', () => {
        const { toasts, show } = useToast()
        show('Primeiro')
        show('Segundo')
        const ids = toasts.value.map(t => t.id)
        expect(new Set(ids).size).toBe(2)
    })

    it('remove automaticamente o toast após o tempo limite', () => {
        vi.useFakeTimers()
        const { toasts, show } = useToast()
        show('Auto-dismiss')
        expect(toasts.value).toHaveLength(1)
        vi.advanceTimersByTime(3200)
        expect(toasts.value).toHaveLength(0)
        vi.useRealTimers()
    })
})
