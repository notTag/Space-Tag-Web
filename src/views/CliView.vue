<script setup lang="ts">
import CliExperience from '../components/CliExperience.vue'

interface CliCommand {
  command: string
  description: string
}

const commands: CliCommand[] = [
  { command: 'space-tag nagamaki', description: 'Tag the current space manually' },
  { command: 'space-tag nagamaki 2', description: 'Tag space 2 regardless of which is active' },
  { command: 'cd ~/code/foo', description: 'Active space tagged "foo" automatically' },
  { command: 'space-tag clear', description: "Clear the current space's tag" },
  { command: 'space-tag auto off', description: 'Stop auto-tagging on cd (persists; "on" re-enables)' },
  { command: 'space-tag display all', description: 'Show every space across all displays' },
  { command: 'space-tag position <mode>', description: 'Set pill placement for the focused display' },
  { command: 'space-tag -- clear', description: 'Tag with a literal name that collides with a subcommand' },
  { command: 'space-tag reload', description: 'Reload sketchybar after config/theme edits' },
  { command: 'space-tag help', description: 'Full usage' },
]

const requirements = [
  'macOS with yabai, sketchybar, and jq installed',
  'Xcode command line tools',
  'zsh, bash, or fish (for the optional auto-tag-on-cd hook)',
]
</script>

<template>
  <section class="flex flex-col items-center text-center mt-[60px]">
    <h1
      class="text-[48px] leading-[56px] font-bold tracking-tight mb-md bg-clip-text text-transparent bg-gradient-to-r from-on-surface to-on-surface-variant"
    >
      Space Tag CLI
    </h1>
    <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">
      One standalone POSIX script. Rename spaces from any shell, keybinding, or automation — no
      reboot, no SIP changes.
    </p>
  </section>

  <CliExperience />

  <section class="grid grid-cols-1 md:grid-cols-2 gap-xl items-start">
    <div>
      <h2 class="font-display-lg text-display-lg text-on-surface mb-md">Command Reference</h2>
      <p class="font-body-md text-body-md text-on-surface-variant mb-lg leading-relaxed">
        Everything ships in a single script — <code class="font-mono-code text-secondary">bin/space-tag</code>.
        Only auto-tag-on-cd needs shell integration, via thin hooks for zsh, bash, and fish.
      </p>
      <h3 class="font-title-sm text-title-sm text-on-surface mb-sm">Requirements</h3>
      <ul class="flex flex-col gap-xs">
        <li
          v-for="requirement in requirements"
          :key="requirement"
          class="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-sm"
        >
          <span class="material-symbols-outlined text-[16px] text-primary">check_circle</span>
          {{ requirement }}
        </li>
      </ul>
    </div>
    <div class="glass-panel rounded-xl p-md border-outline-variant/20 flex flex-col">
      <div
        v-for="entry in commands"
        :key="entry.command"
        class="flex flex-col gap-xs py-sm border-b border-outline-variant/10 last:border-b-0"
      >
        <code class="font-mono-code text-mono-code text-secondary">{{ entry.command }}</code>
        <span class="font-body-sm text-body-sm text-on-surface-variant">{{ entry.description }}</span>
      </div>
    </div>
  </section>

  <section class="glass-panel rounded-xl p-lg border-outline-variant/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-md">
    <div>
      <h2 class="font-title-sm text-title-sm text-on-surface mb-xs">Open source on GitHub</h2>
      <p class="font-body-sm text-body-sm text-on-surface-variant">
        Read the source, file issues, or contribute. MIT-style simplicity — it's one script.
      </p>
    </div>
    <a
      href="https://github.com/notTag/Space-Tag-CLI"
      target="_blank"
      rel="noopener"
      class="glass-panel text-on-surface px-xl py-md rounded-lg font-title-sm text-title-sm hover:bg-surface-variant transition-all flex items-center gap-sm shrink-0"
    >
      <span class="material-symbols-outlined">code</span>
      Space-Tag-CLI
    </a>
  </section>
</template>
