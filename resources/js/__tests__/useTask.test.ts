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

const pageMeta = (currentPage = 1, lastPage = 1) => ({
    current_page: currentPage,
    last_page: lastPage,
    per_page: 20,
    total: lastPage * 20,
    from: 1,
    to: 20,
    path: '/api/projects/1/tasks',
})

const pagedResponse = (items: Task[], currentPage = 1, lastPage = 1) => ({
    data: { data: items, meta: pageMeta(currentPage, lastPage), links: null, message: 'OK', code: 200 },
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
                { params: { status: 'todo', priority: 'high', page: 1 } },
            )
        })

        it('converte o filtro overdue de boolean para 1', async () => {
            vi.mocked(axios.get).mockResolvedValue(pagedResponse([]))

            const { fetchTasks } = useTask()
            await fetchTasks(1, { overdue: true })

            expect(axios.get).toHaveBeenCalledWith(
                '/api/projects/1/tasks',
                { params: { overdue: 1, page: 1 } },
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

    describe('fetchTasks — paginação', () => {
        it('guarda currentPage e lastPage devolvidos pela API', async () => {
            vi.mocked(axios.get).mockResolvedValue(pagedResponse([mockTask], 2, 5))

            const { currentPage, lastPage, fetchTasks } = useTask()
            await fetchTasks(1)

            expect(currentPage.value).toBe(2)
            expect(lastPage.value).toBe(5)
        })

        it('envia o número de página como parâmetro de query', async () => {
            vi.mocked(axios.get).mockResolvedValue(pagedResponse([]))

            const { fetchTasks } = useTask()
            await fetchTasks(1, {}, 3)

            expect(axios.get).toHaveBeenCalledWith(
                '/api/projects/1/tasks',
                { params: { page: 3 } },
            )
        })

        it('substitui a lista ao navegar para outra página', async () => {
            const task2: Task = { ...mockTask, id: 2 }

            vi.mocked(axios.get)
                .mockResolvedValueOnce(pagedResponse([mockTask], 1, 2))
                .mockResolvedValueOnce(pagedResponse([task2], 2, 2))

            const { tasks, fetchTasks } = useTask()
            await fetchTasks(1, {}, 1)
            expect(tasks.value[0].id).toBe(1)

            await fetchTasks(1, {}, 2)
            expect(tasks.value).toHaveLength(1)
            expect(tasks.value[0].id).toBe(2)
        })

        it('inclui os filtros ativos ao mudar de página', async () => {
            vi.mocked(axios.get).mockResolvedValue(pagedResponse([]))

            const { fetchTasks } = useTask()
            await fetchTasks(1, { status: 'todo' }, 2)

            expect(axios.get).toHaveBeenCalledWith(
                '/api/projects/1/tasks',
                { params: { status: 'todo', page: 2 } },
            )
        })

        it('repõe para página 1 em novo fetch sem página explícita', async () => {
            vi.mocked(axios.get).mockResolvedValue(pagedResponse([], 1, 1))

            const { currentPage, fetchTasks } = useTask()
            await fetchTasks(1)

            expect(currentPage.value).toBe(1)
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

            let resolveUpdate!: (v: unknown) => void
            vi.mocked(axios.patch).mockReturnValue(
                new Promise(r => { resolveUpdate = r }) as any,
            )

            const updatePromise = updateTask(1, { status: 'done' })

            // Neste momento a API ainda está "em voo", mas o store já reflecte a alteração
            expect(tasks.value[0].status).toBe('done')

            resolveUpdate(singleResponse({ ...mockTask, status: 'done' }))
            await updatePromise
        })

        /**
         * Se a API falhar, o estado original é restaurado automaticamente.
         * O utilizador vê o card reverter — como se nunca tivesse clicado.
         */
        it('reverte a alteração quando a API falha', async () => {
            vi.mocked(axios.get).mockResolvedValue(pagedResponse([mockTask]))

            const { tasks, fetchTasks, updateTask } = useTask()
            await fetchTasks(1)

            vi.mocked(axios.patch).mockRejectedValue({
                response: { data: { message: 'Erro de servidor.' } },
            })

            await expect(updateTask(1, { status: 'done' })).rejects.toBeDefined()

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
