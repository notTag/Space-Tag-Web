<script setup lang="ts">
interface Feature {
  icon: string
  iconBg: string
  iconColor: string
  title: string
  description: string
}

const coreFeatures: Feature[] = [
  {
    icon: 'account_tree',
    iconBg: 'bg-primary-container/20',
    iconColor: 'text-primary',
    title: 'Auto-tagging on cd',
    description:
      'cd into a project directory and the active space is tagged with the repo name automatically. Turn it off anytime with space-tag auto off.',
  },
  {
    icon: 'edit',
    iconBg: 'bg-secondary-container/20',
    iconColor: 'text-secondary',
    title: 'Inline Rename',
    description:
      'Right-click any pill and it becomes an editable text box in place. Enter saves, Esc cancels, clearing reverts to the space number.',
  },
  {
    icon: 'monitor',
    iconBg: 'bg-tertiary-container/20',
    iconColor: 'text-tertiary',
    title: 'Multi-display Aware',
    description:
      'Pills follow the focused display and fade in on display switches. Optimized for notched MacBooks and flat external displays.',
  },
  {
    icon: 'terminal',
    iconBg: 'bg-primary-container/20',
    iconColor: 'text-primary',
    title: 'Scriptable CLI',
    description:
      'One standalone POSIX script callable from any shell, keybinding, or automation. Tag the current space, a specific space, or clear tags.',
  },
  {
    icon: 'lock',
    iconBg: 'bg-secondary-container/20',
    iconColor: 'text-secondary',
    title: 'No SIP Changes',
    description:
      'Works without disabling System Integrity Protection. No reboot, no kernel extensions, no scary security tradeoffs.',
  },
  {
    icon: 'tune',
    iconBg: 'bg-tertiary-container/20',
    iconColor: 'text-tertiary',
    title: 'Flexible Placement',
    description:
      'Center the pills, anchor them beside the notch, or float them below the menu bar — persisted per display.',
  },
]

interface PositionMode {
  mode: string
  placement: string
}

const positions: PositionMode[] = [
  { mode: 'center', placement: 'Inside the menu bar, centered (default)' },
  { mode: 'notch-left', placement: 'Inside the menu bar, flush left of the notch' },
  { mode: 'notch-right', placement: 'Inside the menu bar, flush right of the notch' },
  { mode: 'left', placement: 'Below the menu bar, left edge' },
  { mode: 'right', placement: 'Below the menu bar, right edge' },
]
</script>

<template>
  <section class="flex flex-col items-center text-center mt-[60px]">
    <h1
      class="text-[48px] leading-[56px] font-bold tracking-tight mb-md bg-clip-text text-transparent bg-gradient-to-r from-on-surface to-on-surface-variant"
    >
      Features
    </h1>
    <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">
      Everything Space Tag does to make virtual desktops feel like yours — in the menu bar and in
      the terminal.
    </p>
  </section>

  <section class="grid grid-cols-1 md:grid-cols-3 gap-lg">
    <div
      v-for="feature in coreFeatures"
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

  <section class="grid grid-cols-1 md:grid-cols-2 gap-xl items-start">
    <div>
      <h2 class="font-display-lg text-display-lg text-on-surface mb-md">Put pills where you want</h2>
      <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
        Pill placement is set per display and persists across restarts. Notched MacBooks get
        notch-anchored modes; flat externals fall back gracefully. Set a global default, override
        per display, or clear an override to fall back.
      </p>
    </div>
    <div class="glass-panel rounded-xl p-md border-outline-variant/20">
      <div
        v-for="position in positions"
        :key="position.mode"
        class="flex items-baseline justify-between gap-md py-sm border-b border-outline-variant/10 last:border-b-0"
      >
        <code class="font-mono-code text-mono-code text-secondary shrink-0">{{ position.mode }}</code>
        <span class="font-body-sm text-body-sm text-on-surface-variant text-right">
          {{ position.placement }}
        </span>
      </div>
    </div>
  </section>
</template>
