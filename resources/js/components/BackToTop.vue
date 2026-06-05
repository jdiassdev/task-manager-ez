<template>
    <Transition name="fade">
        <button
            v-if="visible"
            @click="scrollToTop"
            class="fixed bottom-6 right-6 z-30 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-md text-gray-500 hover:text-gray-800 hover:shadow-lg transition-all"
            title="Voltar ao topo"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
        </button>
    </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function onScroll() {
    visible.value = window.scrollY > 300
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>
