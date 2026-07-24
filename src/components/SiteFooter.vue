<script setup lang="ts">
interface FooterLink {
  label: string
  to?: string
  href?: string
}

const links: FooterLink[] = [
  { label: 'GitHub', href: 'https://github.com/notTag/Space-Tag-CLI' },
  { label: 'Docs', to: '/docs' },
  { label: 'Installers', to: '/cli' },
  { label: 'Changelog', href: 'https://github.com/notTag/Space-Tag-CLI/releases' },
  { label: 'Privacy', to: '/privacy' },
]
</script>

<template>
  <footer
    class="w-full py-xl px-margin-page flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-lowest border-t border-outline-variant/20 mt-xl"
  >
    <div class="flex flex-col gap-sm items-center md:items-start">
      <div class="font-headline-md text-headline-md text-on-surface">Space Tag</div>
      <p class="font-body-sm text-body-sm text-on-surface-variant">
        © 2026 Space Tag. Built for macOS.
      </p>
    </div>
    <div class="flex flex-wrap justify-center gap-md">
      <template v-for="link in links" :key="link.label">
        <RouterLink
          v-if="link.to"
          :to="link.to"
          class="font-body-sm text-body-sm text-on-surface-variant hover:text-primary underline transition-all"
        >
          {{ link.label }}
        </RouterLink>
        <a
          v-else
          :href="link.href"
          target="_blank"
          rel="noopener"
          class="font-body-sm text-body-sm text-on-surface-variant hover:text-primary underline transition-all"
        >
          {{ link.label }}
        </a>
      </template>
    </div>
  </footer>
</template>
