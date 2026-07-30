<script setup>
import { ref, watch } from 'vue'
import { Menu, X } from '@lucide/vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Experience', to: '/experience' },
  { label: 'Skills', to: '/skills' },
  { label: 'Contact', to: '/contact' },
]

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  },
)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-white/5 bg-canvas/75 backdrop-blur-xl">
    <nav
      class="mx-auto flex min-h-18 max-w-7xl items-center justify-between px-5 sm:px-8"
      aria-label="Primary navigation"
    >
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-foreground"
        aria-label="DevVault home"
      >
        <span
          class="grid size-8 place-items-center rounded-md bg-primary text-xs text-white shadow-glow"
          aria-hidden="true"
        >
          DV
        </span>
        DevVault
      </RouterLink>

      <div class="hidden items-center gap-1 lg:flex">
        <RouterLink
          v-for="item in navigation"
          :key="item.label"
          :to="item.to"
          class="rounded-md px-4 py-2 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-foreground motion-reduce:transition-none"
          active-class="bg-white/5 text-foreground"
        >
          {{ item.label }}
        </RouterLink>
      </div>

      <a
        href="mailto:hello@example.com"
        class="hidden min-h-10 items-center rounded-md border border-primary/30 bg-primary/10 px-4 text-sm font-semibold text-primary transition hover:border-primary/60 hover:bg-primary/15 lg:inline-flex motion-reduce:transition-none"
      >
        Start a conversation
      </a>

      <button
        type="button"
        class="grid size-10 place-items-center rounded-md border border-border text-muted lg:hidden"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-navigation"
        aria-label="Toggle navigation"
        @click="isMenuOpen = !isMenuOpen"
      >
        <X v-if="isMenuOpen" :size="20" aria-hidden="true" />
        <Menu v-else :size="20" aria-hidden="true" />
      </button>
    </nav>

    <div
      v-if="isMenuOpen"
      id="mobile-navigation"
      class="border-t border-border bg-canvas px-5 py-4 lg:hidden"
    >
      <div class="mx-auto grid max-w-7xl gap-1">
        <RouterLink
          v-for="item in navigation"
          :key="item.label"
          :to="item.to"
          class="rounded-md px-3 py-3 text-sm font-medium text-muted hover:bg-white/5 hover:text-foreground"
          active-class="bg-white/5 text-foreground"
          @click="isMenuOpen = false"
        >
          {{ item.label }}
        </RouterLink>
        <a
          href="mailto:hello@example.com"
          class="mt-2 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white"
        >
          Start a conversation
        </a>
      </div>
    </div>
  </header>
</template>
