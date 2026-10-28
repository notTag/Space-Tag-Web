<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const initialState = { labels: ['1', '2', '3'], position: 'center' }
const scenes = [
  { command: 'space-tag Website 1', description: 'Name space 1 “Website”. Watch its label update in the menu bar.', labels: ['Website', '2', '3'], position: 'center' },
  { command: 'space-tag clear', description: 'Clear the current space’s name and return to its number.', labels: ['1', '2', '3'], position: 'center' },
  { command: 'space-tag display all', description: 'Show spaces from every display. Spaces 4 and 5 belong to a second display in this preview.', labels: ['1', '2', '3', '4', '5'], position: 'center' },
  { command: 'space-tag position right', description: 'Move the tags below the menu bar, aligned to the right edge.', labels: ['1', '2', '3', '4', '5'], position: 'right' },
]
const sceneIndex = ref(0)
const characters = ref(0)
const complete = ref(false)
const paused = ref(false)
const reducedMotion = ref(false)
const scene = computed(() => scenes[sceneIndex.value]!)
const previous = computed(() => sceneIndex.value === 0 ? initialState : scenes[sceneIndex.value - 1]!)
const labels = computed(() => complete.value ? scene.value.labels : previous.value.labels)
const position = computed(() => complete.value ? scene.value.position : previous.value.position)
let timer: ReturnType<typeof setInterval> | undefined
let hold = 0
function replay() {
  sceneIndex.value = 0
  characters.value = reducedMotion.value ? scene.value.command.length : 0
  complete.value = reducedMotion.value
  paused.value = false
  hold = 0
}
function showScene(index: number) {
  sceneIndex.value = index
  characters.value = scene.value.command.length
  complete.value = true
  paused.value = true
  hold = 0
}
onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion.value) {
    showScene(0)
    return
  }
  timer = setInterval(() => {
    if (paused.value) return
    if (characters.value < scene.value.command.length) {
      characters.value++
    } else if (!complete.value) {
      complete.value = true
    } else if (++hold >= 36) {
      if (sceneIndex.value === scenes.length - 1) { paused.value = true; return }
      sceneIndex.value++
      characters.value = 0
      complete.value = false
      hold = 0
    }
  }, 65)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="terminal-demo">
    <div class="desktop" aria-label="macOS desktop with a terminal and Space Tag menu bar">
      <div class="menu-bar">
        <div class="menu-left" aria-hidden="true"><span class="apple-mark">&#63743;</span><strong>Terminal</strong><span class="menu-extra">Shell &nbsp; Edit &nbsp; View</span></div>
        <div class="menu-right" aria-hidden="true"><span class="material-symbols-outlined">wifi</span><span class="material-symbols-outlined">battery_horiz_075</span><span class="menu-clock">9:41 AM</span><img src="/space-tag-icon.png" alt="" /></div>
      </div>
      <div class="space-labels" :class="{ right: position === 'right' }" aria-label="Space Tag labels">
        <span v-for="(label, index) in labels" :key="index" :class="{ selected: index === 0, external: index > 2 }">{{ label }}</span>
      </div>
      <div class="terminal-window">
        <header><span class="lights" aria-hidden="true"><i></i><i></i><i></i></span><span>Space Tag — zsh</span><span class="window-size" aria-hidden="true">⌘ 1</span></header>
        <div class="terminal-screen" aria-label="Animated command example">
          <p class="welcome">Last login: Tue Oct 28 09:41:00 on ttys001</p>
          <template v-for="(past, index) in scenes.slice(0, sceneIndex)" :key="past.command">
            <p class="history"><span class="prompt">❯ </span>{{ past.command }}</p>
            <p class="history-note">{{ index === 0 ? 'Name a specific space' : index === 1 ? 'Clear the current label' : 'Show spaces across all displays' }}</p>
          </template>
          <p class="command"><span class="prompt">❯ </span>{{ scene.command.slice(0, characters) }}<span v-if="!complete" aria-hidden="true" class="cursor">▍</span><span v-else class="executed" aria-hidden="true"> ↵</span></p>
          <p v-if="complete" class="next-prompt" aria-hidden="true"><span class="prompt">❯ </span>▍</p>
        </div>
      </div>
    </div>
    <div class="controls">
      <span>{{ sceneIndex + 1 }} / {{ scenes.length }} · Simulated preview</span>
      <div>
        <button type="button" :disabled="sceneIndex === 0" @click="showScene(sceneIndex - 1)" aria-label="Previous command">←</button>
        <button v-if="!reducedMotion" type="button" @click="paused = !paused">{{ paused ? 'Play' : 'Pause' }}</button>
        <button type="button" @click="replay">Replay</button>
        <button type="button" :disabled="sceneIndex === scenes.length - 1" @click="showScene(sceneIndex + 1)" aria-label="Next command">→</button>
      </div>
    </div>
    <p class="caption" aria-live="polite">{{ scene.description }}</p>
  </div>
</template>

<style scoped>
.terminal-demo { max-width: 1040px; margin: auto; border: 1px solid #303640; border-radius: 18px; overflow: hidden; background: #0d1119; color: #dce4f3; }
.desktop { height: 550px; position: relative; overflow: hidden; background: radial-gradient(ellipse at 75% 85%, #5d74906b, transparent 60%), radial-gradient(ellipse at 15% 100%, #384e6b, transparent 75%), linear-gradient(140deg, #111c2b, #273e59 65%, #172436); }
.menu-bar { height: 36px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; font-size: 10px; background: #0b1429a8; border-bottom: 1px solid #ffffff0c; }
.menu-left, .menu-right { display: flex; align-items: center; gap: 12px; }
.apple-mark { font-size: 18px; }
.menu-right .material-symbols-outlined { font-size: 15px; }
.menu-right img { width: 19px; height: 19px; object-fit: contain; }
.space-labels { position: absolute; top: 5px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; max-width: 45%; }
.space-labels.right { top: 43px; left: auto; right: 10px; transform: none; }
.space-labels span { padding: 4px 10px; border: 1px solid #ffffff18; border-radius: 15px; background: #192437; font: 10px ui-monospace, monospace; white-space: nowrap; }
.space-labels .selected { background: #294470; border-color: #739cff; color: #c0d4ff; }
.space-labels .external { border-color: #88a6ad66; }
.terminal-window { position: absolute; top: 108px; left: 12%; width: 76%; border: 1px solid #ffffff30; border-radius: 12px; overflow: hidden; box-shadow: 0 28px 65px #0007; background: #10151eef; }
header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; font-size: 11px; color: #b6bdcb; background: #242c38; border-bottom: 1px solid #ffffff0a; }
.lights { display: flex; gap: 7px; }
.lights i { width: 10px; height: 10px; border-radius: 50%; background: #ff6059; }
.lights i:nth-child(2) { background: #ffbd2e; }
.lights i:nth-child(3) { background: #28c840; }
.window-size { color: #7b879b; }
.terminal-screen { padding: 22px; min-height: 275px; font: 13px/1.8 ui-monospace, monospace; }
.welcome { color: #7d8a9d; font-size: 11px; margin-bottom: 22px; }
.command, .history { overflow-wrap: anywhere; color: #dce8ff; }
.history { color: #b7c3d4; }
.history-note { color: #728198; font-size: 11px; margin: 0 0 12px 15px; }
.prompt { color: #93d9b2; }
.cursor, .next-prompt { color: #adc6ff; }
.executed { color: #667890; font-size: 11px; }
.controls { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 22px; font-size: 12px; color: #9daabd; background: #171d28; flex-wrap: wrap; }
.controls button { padding: 6px 10px; border-radius: 6px; border: 1px solid #ffffff25; margin-left: 6px; cursor: pointer; }
button:disabled { opacity: .3; cursor: default; }
button:focus-visible { outline: 2px solid #adc6ff; outline-offset: 3px; }
.caption { padding: 18px 24px; font-size: 13px; color: #aabbd1; min-height: 75px; }
@media (max-width: 700px) { .menu-extra, .menu-clock, .menu-right .material-symbols-outlined { display: none; } .menu-left { gap: 6px; } .space-labels { max-width: 62%; left: 57%; } .space-labels span { padding: 4px 6px; font-size: 9px; } .terminal-window { left: 5%; width: 90%; } .terminal-screen { padding: 18px; font-size: 11px; } .welcome { font-size: 9px; } }
</style>
