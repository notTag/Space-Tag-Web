<script setup lang="ts">
interface DocSection {
  id: string
  icon: string
  title: string
  body: string
  code?: string[]
}

const sections: DocSection[] = [
  {
    id: 'install-app',
    icon: 'download',
    title: 'Install the App',
    body: 'Download the DMG, drag Space Tag to Applications, and launch it. Pills appear in your menu bar immediately. The app is the zero-config path — no terminal required.',
  },
  {
    id: 'install-cli',
    icon: 'terminal',
    title: 'Install the CLI',
    body: 'The CLI builds on yabai and sketchybar. Install the dependencies, clone the repo, and run the installer.',
    code: [
      'brew install yabai sketchybar jq',
      'xcode-select --install',
      'git clone https://github.com/notTag/Space-Tag-CLI.git && cd Space-Tag-CLI',
      './install.sh',
      'yabai --start-service',
      'brew services start sketchybar',
      'exec $SHELL',
    ],
  },
  {
    id: 'first-tag',
    icon: 'label',
    title: 'Your First Tag',
    body: 'Tag the current space by name, or cd into a repo and let auto-tagging do it for you. Right-click a pill in the menu bar to rename it inline — Enter saves, Esc cancels.',
    code: ['space-tag my-space', 'cd ~/code/my-project   # auto-tags the space "my-project"'],
  },
  {
    id: 'positioning',
    icon: 'open_with',
    title: 'Positioning Pills',
    body: 'Placement is persisted per display. Choose center, notch-left, notch-right, left, or right. Set a default for displays without their own setting, or list every override.',
    code: [
      'space-tag position notch-right',
      'space-tag position default center',
      'space-tag position list',
    ],
  },
  {
    id: 'customization',
    icon: 'palette',
    title: 'Customization',
    body: 'Theming lives in sketchybar config. Copy the theme to a local override file — it is sourced last, so your values win — then reload.',
    code: [
      'cp ~/.config/sketchybar/theme.sh ~/.config/sketchybar/theme.local.sh',
      '# edit theme.local.sh, then:',
      'space-tag reload',
    ],
  },
  {
    id: 'troubleshooting',
    icon: 'build',
    title: 'Troubleshooting',
    body: 'The doctor command reports per-tool install state, deployed script presence, sketchybar item registration, and the recent log tail. Exits 0 when healthy. For a one-off auto-tag override without changing persisted state, export SPACE_TAG_AUTO=off in the current shell.',
    code: ['space-tag doctor', 'SPACE_TAG_AUTO=off  # per-shell override, wins over space-tag auto'],
  },
]
</script>

<template>
  <section class="flex flex-col items-center text-center mt-[60px]">
    <h1
      class="text-[48px] leading-[56px] font-bold tracking-tight mb-md bg-clip-text text-transparent bg-gradient-to-r from-on-surface to-on-surface-variant"
    >
      Documentation
    </h1>
    <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">
      From zero to named spaces in five minutes. App first, CLI when you want the power tools.
    </p>
  </section>

  <section class="flex flex-col gap-lg max-w-3xl mx-auto w-full">
    <article
      v-for="section in sections"
      :id="section.id"
      :key="section.id"
      class="glass-panel p-lg rounded-xl flex flex-col gap-md border-outline-variant/20"
    >
      <div class="flex items-center gap-sm">
        <span class="material-symbols-outlined text-primary">{{ section.icon }}</span>
        <h2 class="font-title-sm text-title-sm text-on-surface">{{ section.title }}</h2>
      </div>
      <p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        {{ section.body }}
      </p>
      <div
        v-if="section.code"
        class="bg-surface-container-lowest p-md rounded-lg font-mono-code text-mono-code flex flex-col gap-xs overflow-x-auto"
      >
        <code v-for="line in section.code" :key="line" class="text-secondary whitespace-pre">{{
          line
        }}</code>
      </div>
    </article>
  </section>

  <section class="text-center">
    <p class="font-body-sm text-body-sm text-on-surface-variant">
      Full reference lives in the
      <a
        href="https://github.com/notTag/Space-Tag-CLI"
        target="_blank"
        rel="noopener"
        class="text-primary hover:underline"
        >Space-Tag-CLI README</a
      >.
    </p>
  </section>
</template>
