<script setup lang="ts">
import { ref } from 'vue'

interface SpacePill {
  icon: string
  label: string
}

const pills: SpacePill[] = [
  { icon: 'palette', label: 'Design' },
  { icon: 'terminal', label: 'Code' },
  { icon: 'chat', label: 'Chat' },
  { icon: 'dns', label: 'Terminal' },
]

const activePill = ref(1)
</script>

<template>
  <section class="flex flex-col items-center text-center mt-[60px]">
    <h1
      class="text-[64px] leading-[72px] font-bold tracking-tight mb-md bg-clip-text text-transparent bg-gradient-to-r from-on-surface to-on-surface-variant"
    >
      Name your Spaces.
    </h1>
    <p class="text-headline-md font-headline-md text-on-surface-variant max-w-2xl mb-xl">
      Give your virtual desktops a soul with Space Tag. Seamlessly integrated into your macOS menu
      bar.
    </p>
    <div class="flex gap-md mb-[60px]">
      <button
        class="bg-primary-container text-on-primary-container px-xl py-md rounded-lg font-title-sm text-title-sm hover:opacity-80 transition-all btn-glow flex items-center gap-sm shadow-lg shadow-primary-container/20"
      >
        <span class="material-symbols-outlined">download</span>
        Download DMG
      </button>
      <button
        class="glass-panel text-on-surface px-xl py-md rounded-lg font-title-sm text-title-sm hover:bg-surface-variant transition-all flex items-center gap-sm"
      >
        <span class="material-symbols-outlined">code</span>
        View on GitHub
      </button>
    </div>
    <!-- Menu bar mockup — click a pill to switch the active space -->
    <div
      class="glass-panel rounded-full px-sm py-xs flex gap-xs items-center shadow-2xl backdrop-blur-3xl transform scale-125 my-md border-outline-variant/30"
    >
      <button
        v-for="(pill, i) in pills"
        :key="pill.label"
        class="px-md py-xs rounded-full font-mono-label text-mono-label flex items-center gap-xs cursor-pointer transition-all"
        :class="
          i === activePill
            ? 'pill-active text-primary'
            : 'bg-surface-container text-on-surface border border-outline-variant/20'
        "
        @click="activePill = i"
      >
        <span class="material-symbols-outlined text-[14px]">{{ pill.icon }}</span>
        {{ pill.label }}
      </button>
    </div>
  </section>
</template>
