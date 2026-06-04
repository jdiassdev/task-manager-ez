<template>
    <AppLayout :project-name="projectName">
        <RouterView v-slot="{ Component }">
            <component :is="Component" @project-name="projectName = $event" />
        </RouterView>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppLayout from './components/AppLayout.vue'

const projectName = ref<string | undefined>(undefined)
</script>
