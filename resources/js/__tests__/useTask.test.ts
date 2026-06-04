import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTask } from '../composables/useTask'
import axios from 'axios'
import type { Task } from '../types'

vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}))

vi.mock('../composables/useToast', () => ({
    useToast: () => ({ show: vi.fn(), toasts: { value: [] } }),
}))

const mockTask: Task = {
    id: 1,
    project_id: 1,
    title: 'Tarefa de teste',
    description: null,
    status: 'todo',
    priority: 'medium',
    due_date: null,
    is_overdue: false,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
}

const pagedResponse = (items: Task[]) => ({
    data: { data: items, meta: null, links: null, message: 'OK', code: 200 },
})

const singleResponse = (item: Task) => ({
    data: { data: item, message: 'OK', code: 200 },
})

describe('useTask', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    describe('fetchTasks', () => {
        it('armazena as tarefas devolvidas pela API', async () => {
            vi.mocked(axios.get).mockResolvedValue(pagedResponse([mockTask]))

            const { tasks, fetchTasks } = useTask()
            await fetchTasks(1)

            expect(tasks.value).toEqual([mockTask])
        })

        it('passa os filtros como parâmetros de query', async () => {
            vi.mocked(axios.get).mockResolvedValue(pagedResponse([]))

            const { fetchTasks } = useTask()
            await fetchTasks(1, { status: 'todo', priority: 'high' })

            expect(axios.get).toHaveBeenCalledWith(
                '/api/projects/1/tasks',
                { params: { status: 'todo', priority: 'high' } },
            )
        })

        it('converte o filtro overdue de boolean para 1', async () => {
            vi.mocked(axios.get).mockResolvedValue(pagedResponse([]))

            const { fetchTasks } = useTask()
            await fetchTasks(1, { overdue: true })

            expect(axios.get).toHaveBeenCalledWith(
                '/api/projects/1/tasks',
                { params: { overdue: 1 } },
            )
        })

        it('define error quando a API falha', async () => {
            vi.mocked(axios.get).mockRejectedValue({
                response: { data: { message: 'Sem ligação.' } },
            })

            const { error, fetchTasks } = useTask()
            await fetchTasks(1)

            expect(error.value).toBe('Sem ligação.')
        })
    })

    describe('updateTask — optimistic update', () => {
        /**
         * Optimistic update: a UI actualiza imediatamente, sem esperar pela API.
         * O utilizador vê o resultado ao instante; a API confirma (ou rejeita) em background.
         *
         * Para testar isto, a Promise do axios.patch fica deliberadamente pendente —
         * o teste verifica o estado do store ANTES de a "rede" responder.
         */
        it('aplica a alteração no store antes da resposta da API', async () => {
            vi.mocked(axios.get).mockResolvedValue(pagedResponse([mockTask]))

            const { tasks, fetchTasks, updateTask } = useTask()
            await fetchTasks(1)

            // A Promise nunca resolve por si própria — simulamos latência de rede
            let resolveUpdate!: (v: unknown) => void
            vi.mocked(axios.patch).mockReturnValue(
                new Promise(r => { resolveUpdate = r }) as any,
            )

            // Chamamos updateTask mas NÃO fazemos await — a API ainda não respondeu
            const updatePromise = updateTask(1, { status: 'done' })

            // Neste momento a API ainda está "em voo", mas o store já reflecte a alteração
            expect(tasks.value[0].status).toBe('done')

            // Agora simulamos a resposta da API e terminamos o await
            resolveUpdate(singleResponse({ ...mockTask, status: 'done' }))
            await updatePromise
        })

        /**
         * Se a API falhar, o estado original é restaurado automaticamente.
         * O utilizador via o card reverter — como se nunca tivesse clicado.
         */
        it('reverte a alteração quando a API falha', async () => {
            vi.mocked(axios.get).mockResolvedValue(pagedResponse([mockTask]))

            const { tasks, fetchTasks, updateTask } = useTask()
            await fetchTasks(1)

            vi.mocked(axios.patch).mockRejectedValue({
                response: { data: { message: 'Erro de servidor.' } },
            })

            await expect(updateTask(1, { status: 'done' })).rejects.toBeDefined()

            // O status voltou ao valor anterior à tentativa de actualização
            expect(tasks.value[0].status).toBe('todo')
        })
    })

    describe('deleteTask', () => {
        it('remove a tarefa do store após eliminação', async () => {
            vi.mocked(axios.get).mockResolvedValue(pagedResponse([mockTask]))
            vi.mocked(axios.delete).mockResolvedValue({})

            const { tasks, fetchTasks, deleteTask } = useTask()
            await fetchTasks(1)
            expect(tasks.value).toHaveLength(1)

            await deleteTask(1)
            expect(tasks.value).toHaveLength(0)
        })
    })
})
