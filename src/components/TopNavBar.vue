<script setup lang="ts">
import { DMG_DOWNLOAD_URL, GITHUB_EXTERNAL_LINK } from '../links'

interface NavLink {
  label: string
  to: string
}

const links: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/features' },
  { label: 'CLI', to: '/cli' },
  { label: 'Documentation', to: '/docs' },
]

</script>

<template>
  <nav
    class="fixed top-0 w-full z-50 flex justify-between items-center px-lg py-sm bg-surface/70 backdrop-blur-xl border-b border-outline-variant/10"
  >
    <RouterLink
      to="/"
      class="flex items-center gap-sm font-display-lg text-display-lg font-bold text-on-surface"
    >
      <img src="/space-tag-icon.png" alt="" class="h-[1.1em] w-auto" />
      Space Tag
    </RouterLink>
    <div class="hidden md:flex gap-xl">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="text-on-surface-variant hover:text-primary transition-colors font-title-sm text-title-sm"
        exact-active-class="text-primary"
      >
        {{ link.label }}
      </RouterLink>
      <a
        :href="GITHUB_EXTERNAL_LINK"
        target="_blank"
        rel="noopener"
        class="text-on-surface-variant hover:text-primary transition-colors font-title-sm text-title-sm"
      >
        GitHub
      </a>
    </div>
    <a
      :href="DMG_DOWNLOAD_URL"
      download
      class="bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-title-sm text-title-sm hover:opacity-80 transition-all btn-glow flex items-center gap-sm"
    >
      <span class="material-symbols-outlined text-[18px]">download</span>
      Download
    </a>
  </nav>
</template>
