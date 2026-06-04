import { createRouter, createWebHistory } from 'vue-router'
import ProjectList from '../views/ProjectList.vue'
import ProjectDetail from '../views/ProjectDetail.vue'

const routes = [
    { path: '/', component: ProjectList },
    { path: '/projects/:id', component: ProjectDetail },
]

export default createRouter({
    history: createWebHistory(),
    routes,
})
