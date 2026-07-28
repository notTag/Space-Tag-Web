<script setup lang="ts">
import { ref } from 'vue'

type InstallMethod = 'Homebrew' | 'Curl'

const commands: Record<InstallMethod, string> = {
  Homebrew: 'brew tap notTag/tap && brew install notTag/tap/space-tag',
  Curl: 'curl -fsSL https://spacetag.app/install.sh | sh',
}

const activeTab = ref<InstallMethod>('Homebrew')
const copied = ref(false)

async function copyCommand() {
  await navigator.clipboard.writeText(commands[activeTab.value])
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <section class="grid grid-cols-1 md:grid-cols-2 gap-xl items-center mt-xl">
    <div>
      <h2 class="font-display-lg text-display-lg text-on-surface mb-md">The CLI Experience</h2>
      <p class="font-body-md text-body-md text-on-surface-variant mb-lg leading-relaxed">
        Rename spaces on the fly directly from your terminal. Space Tag CLI works instantly without
        requiring System Integrity Protection (SIP) modifications. Perfect for script automation
        and power user workflows.
      </p>
    </div>
    <div class="glass-panel rounded-xl p-md border-outline-variant/20 font-mono-code text-mono-code">
      <div class="flex gap-sm mb-md border-b border-outline-variant/20 pb-sm">
        <button
          v-for="tab in (Object.keys(commands) as InstallMethod[])"
          :key="tab"
          class="px-xs pb-xs transition-colors"
          :class="
            activeTab === tab
              ? 'text-primary border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          "
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>
      <div class="bg-surface-container-lowest p-md rounded-lg flex items-center justify-between group">
        <code class="text-secondary">{{ commands[activeTab] }}</code>
        <button
          class="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
          :aria-label="copied ? 'Copied' : 'Copy command'"
          @click="copyCommand"
        >
          <span class="material-symbols-outlined text-[16px]">{{
            copied ? 'check' : 'content_copy'
          }}</span>
        </button>
      </div>
    </div>
  </section>
</template>
