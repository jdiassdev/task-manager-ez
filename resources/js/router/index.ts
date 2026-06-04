import { createRouter, createWebHistory } from 'vue-router'
import ProjectList from '../views/ProjectList.vue'
import ProjectDetail from '../views/ProjectDetail.vue'

const routes = [
    { path: '/', name: 'project-list', component: ProjectList },
    { path: '/projects/:id', name: 'project-detail', component: ProjectDetail },
]

export default createRouter({
    history: createWebHistory(),
    routes,
})
