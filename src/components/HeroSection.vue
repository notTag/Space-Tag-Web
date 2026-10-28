<script setup lang="ts">
import { DMG_DOWNLOAD_URL, GITHUB_EXTERNAL_LINK } from '../links'
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
      <a
        :href="DMG_DOWNLOAD_URL"
        download
        class="bg-primary-container text-on-primary-container px-xl py-md rounded-lg font-title-sm text-title-sm hover:opacity-80 transition-all btn-glow flex items-center gap-sm shadow-lg shadow-primary-container/20"
      >
        <span class="material-symbols-outlined">download</span>
        Download
      </a>
      <a
        :href="GITHUB_EXTERNAL_LINK"
        target="_blank"
        rel="noopener"
        class="glass-panel text-on-surface px-xl py-md rounded-lg font-title-sm text-title-sm hover:bg-surface-variant transition-all flex items-center gap-sm"
      >
        <span class="material-symbols-outlined">code</span>
        View on GitHub
      </a>
    </div>
  </section>
</template>
