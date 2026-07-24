<script setup lang="ts">
interface Feature {
  icon: string
  iconBg: string
  iconColor: string
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: 'account_tree',
    iconBg: 'bg-primary-container/20',
    iconColor: 'text-primary',
    title: 'Auto-tagging',
    description:
      'Automatically tags spaces with your repo name when you cd into a project directory.',
  },
  {
    icon: 'edit',
    iconBg: 'bg-secondary-container/20',
    iconColor: 'text-secondary',
    title: 'Inline Rename',
    description: 'Right-click any pill to rename it instantly. Enter to save, Esc to cancel.',
  },
  {
    icon: 'monitor',
    iconBg: 'bg-tertiary-container/20',
    iconColor: 'text-tertiary',
    title: 'Multi-display Aware',
    description:
      'Single bar pinned to focus. Optimized for notched MacBooks and flat external displays seamlessly.',
  },
]
</script>

<template>
  <section class="grid grid-cols-1 md:grid-cols-3 gap-lg mt-xl">
    <div
      v-for="feature in features"
      :key="feature.title"
      class="glass-panel p-lg rounded-xl flex flex-col gap-md hover:bg-surface-variant/30 transition-colors border-outline-variant/20"
    >
      <div
        class="w-12 h-12 rounded-lg flex items-center justify-center"
        :class="[feature.iconBg, feature.iconColor]"
      >
        <span class="material-symbols-outlined">{{ feature.icon }}</span>
      </div>
      <h3 class="font-title-sm text-title-sm text-on-surface">{{ feature.title }}</h3>
      <p class="font-body-sm text-body-sm text-on-surface-variant">{{ feature.description }}</p>
    </div>
  </section>
</template>
