export type ProjectStatus = 'active' | 'archived'
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Project {
    id: number
    name: string
    description: string | null
    status: ProjectStatus
    tasks_count: number
    created_at: string
    updated_at: string
}

export interface Task {
    id: number
    project_id: number
    title: string
    description: string | null
    status: TaskStatus
    priority: TaskPriority
    due_date: string | null
    is_overdue: boolean
    created_at: string
    updated_at: string
}

export interface TaskFilters {
    status?: TaskStatus
    priority?: TaskPriority
    overdue?: boolean
    due_date?: string
}

export interface ApiResponse<T> {
    message: string
    code: number
    data: T
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    meta: Record<string, unknown> | null
    links: Record<string, unknown> | null
}
