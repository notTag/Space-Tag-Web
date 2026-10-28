<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef,
} from 'vue'

const projects = [
  {
    name: 'Etsy Store',
    app: 'Shop Manager',
    url: 'etsy.com / your shop',
    title: 'Made with a little love.',
    subtitle: 'Your next bestsellers start here.',
    icon: 'local_florist',
    color: '#edac86',
    cards: ['Ceramic vase', 'Linen tote', 'Art print'],
    note: 'Shop launch',
    tasks: [
      'Photograph the new collection',
      'Write product descriptions',
      'Pack this week’s orders',
    ],
  },
  {
    name: 'Website Build',
    app: 'Browser',
    url: 'localhost:3000',
    title: 'Ideas into interfaces.',
    subtitle: 'A new home for your next big thing.',
    icon: 'code',
    color: '#a9baff',
    cards: ['Design system', 'Homepage', 'Components'],
    note: 'Launch checklist',
    tasks: [
      'Polish the homepage',
      'Check the mobile layout',
      'Ship something great',
    ],
  },
  {
    name: 'Trip Planning',
    app: 'Travel Guide',
    url: 'weekend.travel / kyoto',
    title: 'Somewhere new awaits.',
    subtitle: 'A few days away. A whole new perspective.',
    icon: 'landscape',
    color: '#a4d5bd',
    cards: ['Stay', 'Explore', 'Eat well'],
    note: 'Kyoto itinerary',
    tasks: [
      'Book a quiet place to stay',
      'Explore the bamboo forest',
      'Find a favorite coffee spot',
    ],
  },
]
const labels = ref(['1', '2', '3'])
const active = ref(0)
const tick = ref(0)
const cursorLeft = ref(50)
const slideDirection = ref(1)
const playing = ref(false)
const finished = ref(false)
const manual = ref(false)
const menuOpen = ref(false)
const menuButton = useTemplateRef<HTMLButtonElement>('menu-button')
const editing = ref(false)
const draft = ref('')
const input = ref<HTMLInputElement | null>(null)
const root = useTemplateRef<HTMLElement>('demo')
const project = computed(() => projects[active.value]!)
const localTick = computed(() => tick.value % 64)
const autoEditing = computed(
  () =>
    !manual.value &&
    !finished.value &&
    localTick.value >= 20 &&
    localTick.value < 49,
)
const typedLabel = computed(() =>
  project.value.name.slice(
    0,
    Math.max(0, Math.floor((localTick.value - 25) / 1.5)),
  ),
)
const caption = computed(() =>
  manual.value
    ? 'Your turn. Switch spaces, then choose “Rename tag” to make one your own.'
    : finished.value
      ? 'Three projects. Three names. Find your focus at a glance.'
      : localTick.value < 20
        ? `Space ${active.value + 1}: all the windows for your ${project.value.name.toLowerCase()} project.`
        : `Right-click the tag to edit inline. Enter saves; Esc cancels.`,
)
let timer: ReturnType<typeof setInterval> | undefined
let observer: IntersectionObserver | undefined
let motion: MediaQueryList | undefined
function pause() {
  playing.value = false
}
function toggleMenu() {
  pause()
  manual.value = true
  menuOpen.value = !menuOpen.value
}
function closeMenu() {
  if (!menuOpen.value) return
  menuOpen.value = false
  menuButton.value?.focus()
}
function pointAtTag(index: number) {
  const tag =
    root.value?.querySelector<HTMLElement>('.tag-bar')?.children[index]
  const desktop = root.value?.querySelector<HTMLElement>('.desktop')
  if (tag && desktop) {
    const tagBounds = tag.getBoundingClientRect()
    const desktopBounds = desktop.getBoundingClientRect()
    cursorLeft.value =
      ((tagBounds.left + tagBounds.width / 2 - desktopBounds.left) /
        desktopBounds.width) *
      100
  }
}
function replay() {
  slideDirection.value = -1
  labels.value = ['1', '2', '3']
  active.value = 0
  tick.value = 0
  menuOpen.value = false
  finished.value = false
  manual.value = false
  editing.value = false
  playing.value = true
}
function selectSpace(index: number) {
  menuOpen.value = false
  pause()
  manual.value = true
  editing.value = false
  slideDirection.value = index >= active.value ? 1 : -1
  active.value = index
}
function renameSpace(index: number) {
  selectSpace(index)
  void rename()
}
async function rename() {
  menuOpen.value = false
  pause()
  manual.value = true
  draft.value = labels.value[active.value]!
  editing.value = true
  await nextTick()
  input.value?.focus()
  input.value?.select()
}
function save() {
  const name = draft.value.trim()
  if (!name) {
    input.value?.focus()
    return
  }
  labels.value[active.value] = name
  editing.value = false
}
function togglePlayback() {
  if (playing.value) pause()
  else if (finished.value || manual.value) replay()
  else playing.value = true
}
function motionChanged(event: MediaQueryListEvent) {
  if (event.matches) pause()
}
onMounted(() => {
  motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  motion.addEventListener('change', motionChanged)
  observer = new IntersectionObserver(
    ([entry]) => {
      if (
        entry?.isIntersecting &&
        !motion?.matches &&
        !manual.value &&
        !finished.value &&
        tick.value === 0
      )
        playing.value = true
      if (!entry?.isIntersecting) pause()
    },
    { threshold: 0.35 },
  )
  if (root.value) observer.observe(root.value)
  timer = setInterval(() => {
    if (!playing.value || document.hidden) return
    tick.value++
    if (localTick.value === 12) pointAtTag(active.value)
    if (localTick.value === 54 && active.value < projects.length - 1)
      pointAtTag(active.value + 1)
    if (localTick.value === 49) labels.value[active.value] = project.value.name
    if (tick.value >= 192) {
      finished.value = true
      pause()
      return
    }
    slideDirection.value = 1
    active.value = Math.floor(tick.value / 64)
  }, 100)
})
onUnmounted(() => {
  clearInterval(timer)
  observer?.disconnect()
  motion?.removeEventListener('change', motionChanged)
})
</script>

<template>
  <section
    ref="demo"
    class="product-demo"
    aria-label="Interactive Space Tag walkthrough"
  >
    <div class="demo-heading">
      <span class="eyebrow"
        ><span class="live-dot"></span> A LITTLE CLARITY GOES A LONG WAY</span
      >
      <h2>Same spaces. A sense of place.</h2>
      <p>From a number to a name. See your projects find their space.</p>
    </div>
    <div
      class="demo-frame"
      :style="{
        '--accent': project.color,
        '--slide-direction': slideDirection,
      }"
    >
      <div class="desktop" @keydown.esc="closeMenu">
        <div class="menu-bar">
          <div class="menu-left" aria-hidden="true">
            <span class="apple-mark">&#63743;</span
            ><strong>{{ project.app }}</strong
            ><span class="menu-extra">File &nbsp; Edit &nbsp; View</span>
          </div>
          <div class="menu-right">
            <span class="status-icons" aria-hidden="true"
              ><span class="material-symbols-outlined">wifi</span
              ><span class="material-symbols-outlined">battery_horiz_075</span
              ><span class="material-symbols-outlined">search</span></span
            >
            <span class="menu-clock" aria-hidden="true">Tue 9:41 AM</span>
            <button
              ref="menu-button"
              class="spacetag-menu-button"
              aria-label="SpaceTag demo menu"
              :aria-expanded="menuOpen"
              aria-controls="spacetag-demo-menu"
              @click="toggleMenu"
            >
              <img src="/space-tag-icon.png" alt="" />
            </button>
          </div>
        </div>
        <template v-if="menuOpen">
          <div class="menu-dismiss" @click="menuOpen = false"></div>
          <div
            id="spacetag-demo-menu"
            class="spacetag-dropdown"
            aria-label="SpaceTag demo options"
          >
            <span class="dropdown-title"
              >SpaceTag <small>Interactive demo</small></span
            >
            <div class="dropdown-divider"></div>
            <span class="dropdown-section">Spaces</span>
            <button
              v-for="(label, index) in labels"
              :key="index"
              :aria-pressed="active === index"
              @click="selectSpace(index)"
            >
              <span class="space-indicator">{{
                active === index ? '●' : '○'
              }}</span
              >{{ index + 1 }} &nbsp; {{ label
              }}<span class="dropdown-chevron">›</span>
            </button>
            <div class="dropdown-divider"></div>
            <button @click="rename">Rename current space…</button>
            <button @click="replay">
              Replay walkthrough<span class="dropdown-chevron">↺</span>
            </button>
            <p>Try switching or renaming a space.</p>
          </div>
        </template>
        <div class="tag-bar" aria-label="Demo spaces">
          <template v-for="(label, index) in labels" :key="index">
            <form
              v-if="editing && active === index"
              class="inline-tag-editor"
              @submit.prevent="save"
            >
              <input
                :ref="
                  (element) => {
                    input = element as HTMLInputElement | null
                  }
                "
                v-model="draft"
                aria-label="Rename this space"
                maxlength="24"
                autocomplete="off"
                :style="{ width: `${Math.max(3, draft.length)}ch` }"
                @keydown.esc.stop.prevent="editing = false"
                @blur="editing = false"
              />
            </form>
            <span
              v-else-if="autoEditing && active === index"
              class="inline-tag-editor simulated-editor"
              aria-hidden="true"
            >
              <span v-if="localTick < 26" class="selected-text">{{
                label
              }}</span>
              <span v-else>{{ typedLabel }}<i class="text-caret"></i></span>
            </span>
            <button
              v-else
              :class="{ selected: active === index }"
              :aria-pressed="active === index"
              :aria-label="`Switch to space ${index + 1}: ${label}`"
              @click="selectSpace(index)"
              @contextmenu.prevent="renameSpace(index)"
            >
              {{ label }}
            </button>
          </template>
        </div>
        <Transition name="space">
          <div :key="active" class="workspace">
            <article class="browser-window">
              <div class="window-chrome">
                <span class="traffic" aria-hidden="true"
                  ><i></i><i></i><i></i></span
                ><span class="address">{{ project.url }}</span
                ><span aria-hidden="true">＋</span>
              </div>
              <div class="browser-content">
                <div class="mini-brand">
                  <span class="material-symbols-outlined">{{
                    project.icon
                  }}</span
                  >{{
                    active === 0
                      ? 'STUDIO / FOLK'
                      : active === 1
                        ? 'FORM & FIELD'
                        : 'THE SLOW WAY'
                  }}<span>EST. 2026</span>
                </div>
                <div class="project-hero">
                  <span class="eyebrow">{{
                    active === 0
                      ? 'THE EVERYDAY COLLECTION'
                      : active === 1
                        ? 'A WORK IN PROGRESS'
                        : 'OFF THE BEATEN PATH'
                  }}</span>
                  <h3>{{ project.title }}</h3>
                  <p>{{ project.subtitle }}</p>
                  <div
                    class="abstract-art"
                    :class="`art-${active}`"
                    aria-hidden="true"
                  >
                    <i></i><i></i><i></i>
                  </div>
                </div>
                <div class="project-cards">
                  <div v-for="(card, index) in project.cards" :key="card">
                    <span>0{{ index + 1 }}</span
                    >{{ card }}<span>↗</span>
                  </div>
                </div>
              </div>
            </article>
            <article class="notes-window">
              <div class="window-chrome">
                <span class="traffic" aria-hidden="true"
                  ><i></i><i></i><i></i></span
                ><span>Notes</span>
              </div>
              <div class="notes-content">
                <span class="eyebrow">{{
                  active === 0
                    ? 'SMALL BUSINESS, BIG PLANS'
                    : active === 1
                      ? 'ONE STEP AT A TIME'
                      : 'MAKE ROOM FOR ADVENTURE'
                }}</span>
                <h4>{{ project.note }}</h4>
                <p v-for="(task, index) in project.tasks" :key="task">
                  <span class="check" :class="{ checked: index === 0 }">{{
                    index === 0 ? '✓' : ''
                  }}</span
                  >{{ task }}
                </p>
                <div class="note-footer">
                  Everything for this project.<br />One dedicated space.
                </div>
              </div>
            </article>
          </div>
        </Transition>
        <svg
          v-if="playing && !finished"
          class="demo-cursor"
          :style="{ left: tick >= 13 ? `${cursorLeft}%` : '74%' }"
          :class="{
            targeting: tick >= 13,
            clicking:
              (localTick >= 19 && localTick < 24) ||
              (active < 2 && localTick >= 62) ||
              (active > 0 && localTick < 2),
          }"
          viewBox="0 0 24 30"
          aria-hidden="true"
        >
          <path
            d="M2 2v23l6-6 5 10 4-2-5-10h9Z"
            fill="white"
            stroke="#141821"
            stroke-width="1.7"
          />
        </svg>
        <div class="desktop-label">
          SPACE {{ active + 1 }}<span>{{ labels[active] }}</span>
        </div>
      </div>
      <div class="demo-toolbar">
        <div class="playback">
          <button
            :aria-label="
              playing
                ? 'Pause walkthrough'
                : finished || manual
                  ? 'Play walkthrough again'
                  : 'Play walkthrough'
            "
            @click="togglePlayback"
          >
            <span class="material-symbols-outlined">{{
              playing ? 'pause' : 'play_arrow'
            }}</span></button
          ><button aria-label="Replay walkthrough" @click="replay">
            <span class="material-symbols-outlined">replay</span></button
          ><span class="playback-label">{{
            manual
              ? 'Explore the demo'
              : finished
                ? 'Your spaces, named.'
                : 'Watch it come together'
          }}</span>
        </div>
        <button class="rename-button" @click="rename">
          <span class="material-symbols-outlined">edit</span>Rename tag
        </button>
      </div>
      <div
        class="demo-progress"
        role="progressbar"
        aria-label="Walkthrough progress"
        :aria-valuenow="Math.min(100, Math.round((tick / 192) * 100))"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span
          :style="{ width: `${Math.min(100, (tick / 192) * 100)}%` }"
        ></span>
      </div>
    </div>
    <p class="demo-caption" aria-live="polite">{{ caption }}</p>
    <p class="demo-footnote">
      Click a tag to explore · Right-click to rename · Click the SpaceTag icon
      for more
    </p>
  </section>
</template>

<style scoped>
.product-demo {
  width: 100%;
  max-width: 1040px;
  margin: auto;
}
.demo-heading {
  text-align: center;
  margin: 12px 0 28px;
}
.eyebrow {
  font-size: 10px;
  letter-spacing: 1.8px;
  font-weight: 600;
}
.demo-heading .eyebrow {
  color: #adc6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #adc6ff;
  box-shadow: 0 0 12px #7ba5ff;
}
.demo-heading h2 {
  font-size: clamp(25px, 4vw, 36px);
  line-height: 1.2;
  letter-spacing: -1.3px;
  margin: 14px 0 10px;
}
.demo-heading p {
  color: #9fa6b9;
}
.demo-frame {
  overflow: hidden;
  border: 1px solid #ffffff24;
  border-radius: 16px;
  box-shadow: 0 24px 100px #0005;
}
.desktop {
  aspect-ratio: 1.85;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 70% 90%, #687ca377, transparent 60%),
    radial-gradient(ellipse at 10% 90%, #7777aa88, transparent 65%),
    linear-gradient(140deg, #182331, #36435f 70%, #786d88);
  container-type: inline-size;
}
.menu-bar {
  height: 32px;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 18px;
  background: #10172575;
  color: #e3e7f2;
  font-size: 10px;
}
.apple-mark {
  font-size: 17px;
}
.menu-clock {
  margin-left: auto;
  font-size: 9px;
}
.menu-left,
.menu-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.menu-right {
  margin-left: auto;
  gap: 10px;
}
.status-icons {
  display: flex;
  gap: 10px;
  align-items: center;
}
.status-icons .material-symbols-outlined {
  font-size: 15px;
}
.spacetag-menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 28px;
  padding: 3px;
  border: 0;
  border-radius: 4px;
  background: transparent;
}
.spacetag-menu-button:hover,
.spacetag-menu-button[aria-expanded='true'] {
  background: #ffffff24;
}
.spacetag-menu-button img {
  width: 23px;
  filter: grayscale(1) brightness(0) invert(1);
}
.menu-dismiss {
  position: absolute;
  inset: 32px 0 0;
  z-index: 7;
}
.spacetag-dropdown {
  position: absolute;
  top: 34px;
  right: 12px;
  z-index: 8;
  width: 238px;
  padding: 7px;
  color: #eeeef4;
  border: 1px solid #ffffff35;
  border-radius: 10px;
  background: #25252bf5;
  backdrop-filter: blur(20px);
  box-shadow: 0 15px 40px #0007;
  font-size: 12px;
}
.dropdown-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 8px;
  font-weight: 600;
}
.dropdown-title small {
  font-size: 9px;
  color: #a5a5b4;
  font-weight: 400;
}
.dropdown-divider {
  height: 1px;
  margin: 5px;
  background: #ffffff20;
}
.dropdown-section {
  display: block;
  padding: 3px 8px;
  font-size: 10px;
  color: #9999a5;
}
.spacetag-dropdown button {
  width: 100%;
  display: flex;
  align-items: center;
  text-align: left;
  padding: 5px 8px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font: inherit;
}
.spacetag-dropdown button:hover,
.spacetag-dropdown button:focus-visible {
  background: #5388d7;
  color: white;
}
.space-indicator {
  width: 16px;
  font-size: 10px;
}
.dropdown-chevron {
  margin-left: auto;
}
.spacetag-dropdown p {
  margin: 5px 8px;
  color: #a5a5b4;
  font-size: 10px;
}
@container (max-width: 740px) {
  .menu-extra,
  .menu-left strong,
  .status-icons,
  .menu-clock {
    display: none;
  }
  .menu-bar {
    padding: 0 10px;
  }
}
.tag-bar {
  max-width: calc(100% - 90px);
  width: max-content;
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
  z-index: 3;
}
.tag-bar button,
.inline-tag-editor {
  box-sizing: border-box;
  border: 1px solid transparent;
  background: #303044;
  border-radius: 3px;
  color: #d4d5e9;
  padding: 1px 10px;
  font-size: 12px;
  line-height: 18px;
  min-height: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 0 1 auto;
  min-width: 0;
  text-align: center;
}
.tag-bar button.selected {
  background: #83b9f4;
  color: #17243c;
}
.inline-tag-editor {
  margin: 0;
  padding: 0 8px;
  border-color: #a6ccff;
  box-shadow: 0 0 0 1px #131823;
  background: #434551;
}
.inline-tag-editor input {
  display: block;
  box-sizing: content-box;
  min-width: 0;
  max-width: min(24ch, 100%);
  border: 0;
  outline: 0;
  background: transparent;
  color: #fff;
  font: inherit;
  line-height: 20px;
  text-align: center;
  padding: 0;
}
.inline-tag-editor input::selection,
.selected-text {
  background: #8b8058;
  color: white;
}
.selected-text {
  font-weight: 600;
}
.text-caret {
  border-right: 1px solid white;
  margin-left: 1px;
}
.workspace {
  position: absolute;
  inset: 68px 6% 44px;
}
.browser-window,
.notes-window {
  overflow: hidden;
  position: absolute;
  border-radius: 9px;
  border: 1px solid #ffffff33;
  box-shadow: 0 16px 40px #0004;
}
.browser-window {
  left: 0;
  top: 0;
  width: 78%;
  background: #f5f1e9;
  color: #303b36;
}
.window-chrome {
  height: 30px;
  background: #e6e4e1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  color: #676967;
  font-size: 9px;
}
.traffic {
  display: flex;
  gap: 4px;
}
.traffic i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ed7169;
}
.traffic i:nth-child(2) {
  background: #e7bd58;
}
.traffic i:nth-child(3) {
  background: #65bd80;
}
.address {
  padding: 2px 30px;
  background: #ffffff85;
  border-radius: 4px;
  font-size: 8px;
}
.browser-content {
  padding: 17px 22px 22px;
}
.mini-brand {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  letter-spacing: 1.5px;
  font-weight: 700;
}
.mini-brand .material-symbols-outlined {
  font-size: 18px;
}
.mini-brand > span:last-child {
  margin-left: auto;
  font-size: 7px;
  color: #80857a;
}
.project-hero {
  position: relative;
  padding: 30px 0 23px;
  min-height: 180px;
}
.project-hero > .eyebrow {
  font-size: 7px;
  letter-spacing: 1px;
}
.project-hero h3 {
  font-family: Georgia, serif;
  font-size: clamp(18px, 4cqw, 42px);
  line-height: 1.05;
  letter-spacing: -1.2px;
  max-width: 52%;
  margin: 12px 0;
}
.project-hero p {
  font-size: 9px;
  color: #747a70;
  max-width: 55%;
  line-height: 1.5;
}
.abstract-art {
  position: absolute;
  right: 3%;
  top: 24px;
  width: 35%;
  height: 155px;
  background: #dedbce;
  border-radius: 48% 48% 4px 4px;
  overflow: hidden;
}
.abstract-art i {
  position: absolute;
  bottom: -5%;
  left: 20%;
  height: 75%;
  width: 55%;
  border-radius: 40% 40% 25% 25%;
  background: var(--accent);
  box-shadow:
    inset -14px 0 20px #0002,
    10px 10px 20px #0002;
  transform: rotate(-8deg);
}
.abstract-art i:nth-child(2) {
  height: 45%;
  left: 58%;
  width: 30%;
  background: #9ea98a;
  transform: rotate(12deg);
}
.abstract-art i:nth-child(3) {
  height: 110%;
  width: 2%;
  left: 44%;
  background: #718068;
  transform: rotate(-20deg);
  box-shadow: none;
}
.art-1 {
  border-radius: 10px;
  background: #d6daed;
  transform: rotate(4deg);
}
.art-1 i {
  border-radius: 5px;
  transform: rotate(0);
  height: 65%;
  width: 75%;
  left: 12%;
  bottom: 15%;
}
.art-1 i:nth-child(2) {
  height: 6%;
  width: 45%;
  left: 20%;
  bottom: 60%;
  background: white;
}
.art-1 i:nth-child(3) {
  height: 25%;
  width: 55%;
  left: 20%;
  bottom: 25%;
  background: #edf0fa;
  transform: none;
}
.art-2 {
  background: #d9e5d9;
}
.art-2 i {
  transform: rotate(45deg);
  border-radius: 8px;
  height: 100%;
  width: 90%;
  bottom: -55%;
  left: 0;
  background: #739c83;
}
.art-2 i:nth-child(2) {
  left: 50%;
  bottom: -45%;
  background: #49725e;
}
.art-2 i:nth-child(3) {
  width: 28%;
  height: 28%;
  border-radius: 50%;
  left: 18%;
  top: 18%;
  background: #f5dfb0;
}
.project-cards {
  display: flex;
  gap: 8px;
}
.project-cards > div {
  display: flex;
  gap: 8px;
  align-items: center;
  border-top: 1px solid #303b3625;
  flex: 1;
  padding-top: 12px;
  font-size: 9px;
}
.project-cards span {
  font-size: 7px;
  opacity: 0.55;
}
.project-cards span:last-child {
  margin-left: auto;
}
.notes-window {
  right: 0;
  bottom: 0;
  width: 33%;
  background: #fffcf1;
  color: #37392f;
  transform: rotate(2deg);
}
.notes-window .window-chrome {
  background: #f0ecdd;
  justify-content: start;
  gap: 20px;
}
.notes-content {
  padding: 20px;
}
.notes-content > .eyebrow {
  font-size: 6px;
  letter-spacing: 1px;
  color: #8b8671;
}
.notes-content h4 {
  font-size: 20px;
  line-height: 1.2;
  font-family: Georgia, serif;
  margin: 10px 0 20px;
}
.notes-content p {
  display: flex;
  align-items: start;
  gap: 7px;
  font-size: 9px;
  margin: 12px 0;
  line-height: 1.4;
}
.check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #bbb9a3;
  border-radius: 3px;
  min-width: 11px;
  height: 11px;
  font-size: 8px;
}
.checked {
  background: #d9dfbe;
}
.note-footer {
  border-top: 1px solid #dfdece;
  margin-top: 20px;
  padding-top: 14px;
  font-size: 8px;
  line-height: 1.6;
  color: #8b8671;
}
.desktop-label {
  position: absolute;
  bottom: 13px;
  left: 6%;
  font-size: 8px;
  letter-spacing: 2px;
  color: #dde4f5a0;
}
.desktop-label span {
  margin-left: 12px;
  letter-spacing: 0.3px;
  color: #e2e9ff;
}
.demo-cursor {
  position: absolute;
  width: 23px;
  height: 30px;
  left: 74%;
  top: 72%;
  z-index: 5;
  pointer-events: none;
  filter: drop-shadow(0 2px 2px #0006);
  transition:
    left 1s ease,
    top 1s ease,
    transform 0.2s;
}
.demo-cursor.targeting {
  left: 51%;
  top: 16px;
}
.demo-cursor.clicking {
  transform: scale(0.8);
}
.demo-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 18px;
  background: #181c25;
}
.playback {
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-toolbar button {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9d4ea;
  cursor: pointer;
  border: 0;
  background: transparent;
  min-height: 32px;
  min-width: 32px;
  border-radius: 6px;
}
.demo-toolbar button:hover {
  background: #ffffff10;
}
.demo-toolbar .material-symbols-outlined {
  font-size: 19px;
}
.playback-label {
  font-size: 11px;
  color: #a8b1c4;
}
.rename-button {
  gap: 7px;
  font-size: 11px;
  padding: 0 10px !important;
  border: 1px solid #ffffff20 !important;
}
.demo-progress {
  height: 3px;
  background: #ffffff10;
}
.demo-progress > span {
  display: block;
  height: 100%;
  background: #adc6ff;
  transition: width 0.1s linear;
}
.demo-caption {
  text-align: center;
  font-size: 13px;
  color: #c1c6d7;
  margin: 20px auto 6px;
  min-height: 40px;
  max-width: 650px;
}
.demo-footnote {
  text-align: center;
  font-size: 10px;
  color: #7e879c;
  margin: 0;
}
button {
  cursor: pointer;
}
button:focus-visible,
input:focus-visible {
  outline: 2px solid #adc6ff;
  outline-offset: 3px;
}
.space-enter-active,
.space-leave-active {
  transition: transform 0.65s cubic-bezier(0.65, 0, 0.35, 1);
  will-change: transform;
}
.space-enter-from {
  transform: translateX(calc(var(--slide-direction) * 120%));
}
.space-leave-to {
  transform: translateX(calc(var(--slide-direction) * -120%));
}

@media (min-width: 900px) {
  .project-hero {
    min-height: 210px;
    padding-top: 40px;
  }
  .abstract-art {
    height: 180px;
  }
  .browser-content {
    padding: 22px 28px 30px;
  }
  .notes-content {
    padding: 24px;
  }
  .notes-content p {
    font-size: 11px;
  }
  .notes-content h4 {
    font-size: 25px;
  }
  .notes-content > .eyebrow {
    font-size: 7px;
  }
}

@media (max-width: 640px) {
  .desktop {
    aspect-ratio: 1.3;
  }
  .menu-extra,
  .menu-bar strong,
  .menu-clock {
    display: none;
  }
  .workspace {
    inset: 65px 4% 38px;
  }
  .browser-window {
    width: 90%;
  }
  .browser-content {
    padding: 12px;
  }
  .project-hero {
    padding-top: 17px;
    min-height: 145px;
  }
  .abstract-art {
    height: 110px;
    top: 20px;
  }
  .project-hero p {
    font-size: 8px;
  }
  .notes-window {
    width: 44%;
    bottom: 0;
  }
  .notes-content {
    padding: 12px;
  }
  .notes-content h4 {
    font-size: 16px;
    margin-bottom: 12px;
  }
  .notes-content p {
    font-size: 7px;
    margin: 8px 0;
  }
  .notes-content > .eyebrow,
  .note-footer {
    display: none;
  }
  .project-cards > div {
    font-size: 7px;
    gap: 3px;
  }
  .window-chrome {
    height: 24px;
    padding: 0 8px;
  }
  .address {
    padding: 2px 8px;
  }
  .playback-label {
    display: none;
  }
  .demo-toolbar {
    padding: 9px 12px;
  }
  .demo-caption {
    font-size: 12px;
    padding: 0 12px;
  }
  .tag-bar button,
  .inline-tag-editor {
    font-size: 9px;
    padding: 2px 7px;
  }
  .demo-footnote {
    font-size: 9px;
  }
  .demo-heading .eyebrow {
    font-size: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition: none !important;
    animation: none !important;
  }
}
</style>
