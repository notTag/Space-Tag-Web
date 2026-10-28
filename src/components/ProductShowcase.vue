<script setup lang="ts">
import { ref } from 'vue'
import ProductDemo from './ProductDemo.vue'
import TerminalDemo from './TerminalDemo.vue'
import { GITHUB_EXTERNAL_LINK } from '../links'

const tabs = [
  { name: 'App', icon: 'desktop_mac' },
  { name: 'Code', icon: 'code' },
  { name: 'Terminal', icon: 'terminal' },
] as const
const activeTab = ref<(typeof tabs)[number]['name']>('App')
function moveTab(event: KeyboardEvent, index: number) {
  let next: number
  if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
  else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = tabs.length - 1
  else return
  event.preventDefault()
  activeTab.value = tabs[next]!.name
  const buttons = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll('button')
  buttons?.[next]?.focus()
}
</script>

<template>
  <section class="showcase" aria-label="Explore Space Tag">
    <div class="showcase-tabs" role="tablist" aria-label="Space Tag previews">
      <button v-for="(tab, index) in tabs" :id="`showcase-tab-${tab.name}`" :key="tab.name" type="button" role="tab" :aria-selected="activeTab === tab.name" :aria-controls="`showcase-panel-${tab.name}`" :tabindex="activeTab === tab.name ? 0 : -1" @click="activeTab = tab.name" @keydown="moveTab($event, index)">
        <span class="material-symbols-outlined" aria-hidden="true">{{ tab.icon }}</span>{{ tab.name }}
      </button>
    </div>
    <div v-for="tab in tabs" v-show="activeTab === tab.name" :id="`showcase-panel-${tab.name}`" :key="tab.name" role="tabpanel" :aria-labelledby="`showcase-tab-${tab.name}`" tabindex="0">
      <ProductDemo v-if="tab.name === 'App' && activeTab === 'App'" />
      <a v-if="tab.name === 'Code'" class="repository-preview" :href="GITHUB_EXTERNAL_LINK" target="_blank" rel="noopener noreferrer" aria-label="Open Space Tag CLI repository on GitHub (opens in a new tab)">
        <img src="/github-repo-preview.svg" alt="Repository preview: notTag / Space-Tag-CLI, source folders and README" width="1040" height="620" />
        <span>Explore the source on GitHub <span aria-hidden="true">↗</span></span>
      </a>
      <TerminalDemo v-if="tab.name === 'Terminal' && activeTab === 'Terminal'" />
    </div>
  </section>
</template>

<style scoped>
.showcase { width: 100%; max-width: 1040px; margin: 0 auto; }
.showcase-tabs { display: flex; width: fit-content; max-width: 100%; gap: 5px; padding: 6px; margin: 0 auto 30px; border: 1px solid #ffffff18; border-radius: 40px; background: #16191ec0; }
.showcase-tabs button { display: flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid #ffffff12; border-radius: 30px; padding: 10px 22px; font: 14px ui-monospace, monospace; color: #d3d6de; background: #ffffff05; cursor: pointer; }
.showcase-tabs button[aria-selected='true'] { background: #203657; color: #b5cdff; border-color: #4b8eff99; box-shadow: 0 0 12px #4b8eff20; }
.showcase-tabs .material-symbols-outlined { font-size: 20px; }
button:focus-visible, [role='tabpanel']:focus-visible, a:focus-visible { outline: 2px solid #adc6ff; outline-offset: 5px; }
.repository-preview { display: block; border-radius: 18px; overflow: hidden; border: 1px solid #ffffff25; background: #0d1117; }
.repository-preview img { display: block; width: 100%; height: auto; }
.repository-preview > span { display: flex; justify-content: space-between; padding: 18px 24px; color: #adc6ff; font-size: 14px; background: #161b22; }
@media (max-width: 500px) { .showcase-tabs button { padding: 10px 14px; font-size: 12px; } }
</style>
