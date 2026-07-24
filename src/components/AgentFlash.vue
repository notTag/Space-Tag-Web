<template>
  <section
    class="mt-xl glass-panel p-xl rounded-2xl relative overflow-hidden border-outline-variant/20 border-l-4 border-l-primary"
  >
    <div
      class="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary-container/10 to-transparent pointer-events-none"
    ></div>
    <div class="relative z-10 max-w-2xl">
      <div class="flex items-center gap-sm mb-md text-primary">
        <span class="material-symbols-outlined">bolt</span>
        <span class="font-mono-label text-mono-label tracking-wider uppercase"
          >Agent Completion Flash</span
        >
      </div>
      <h2 class="font-display-lg text-display-lg text-on-surface mb-md">
        Never miss a completed task.
      </h2>
      <p class="font-body-md text-body-md text-on-surface-variant mb-lg">
        Flashes a space's pill when your long-running tasks in Claude Code or other CLI agents
        finish running in the background. Stay focused without constantly checking back.
      </p>
      <div
        class="inline-flex items-center gap-xs px-sm py-xs rounded-full bg-surface-container text-on-surface font-mono-label text-mono-label border border-primary/30 shadow-[0_0_10px_rgba(75,142,255,0.2)]"
      >
        <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        Task Complete: npm run build
      </div>
    </div>
  </section>
</template>
