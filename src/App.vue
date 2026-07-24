<script setup lang="ts">
import TopNavBar from './components/TopNavBar.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <TopNavBar />
  <main class="max-w-7xl mx-auto px-lg py-xl flex flex-col gap-[80px]">
    <RouterView />
  </main>
  <SiteFooter />
</template>
