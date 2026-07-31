<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Menu, Moon, Sun, X } from '@lucide/vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)
const theme = ref(localStorage.getItem('devvault-site-theme') || 'dark')
const isLightTheme = computed(() => theme.value === 'light')

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Experience', to: '/experience' },
  { label: 'Skills', to: '/skills' },
  { label: 'Contact', to: '/contact' },
]

function isCurrentRoute(path) {
  if (path === '/') return route.path === '/'

  return route.path === path || route.path.startsWith(`${path}/`)
}

function applyTheme() {
  document.documentElement.classList.toggle('site-light', isLightTheme.value)
}

function toggleTheme() {
  theme.value = isLightTheme.value ? 'dark' : 'light'
}

watch(theme, () => {
  localStorage.setItem('devvault-site-theme', theme.value)
  applyTheme()
})

onMounted(applyTheme)

onBeforeUnmount(() => {
  document.documentElement.classList.remove('site-light')
})

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  },
)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border bg-canvas/75 backdrop-blur-xl">
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
          :class="isCurrentRoute(item.to) && 'bg-primary/10 text-foreground'"
          :aria-current="isCurrentRoute(item.to) ? 'page' : undefined"
        >
          {{ item.label }}
        </RouterLink>
      </div>

      <div class="hidden items-center gap-2 lg:flex">
        <button
          type="button"
          class="grid size-10 place-items-center rounded-md border border-border bg-surface text-muted transition hover:border-primary/40 hover:text-foreground motion-reduce:transition-none"
          :aria-label="isLightTheme ? 'Use dark theme' : 'Use light theme'"
          :title="isLightTheme ? 'Use dark theme' : 'Use light theme'"
          @click="toggleTheme"
        >
          <Moon v-if="isLightTheme" :size="17" aria-hidden="true" />
          <Sun v-else :size="17" aria-hidden="true" />
        </button>

        <a
          href="mailto:hello@example.com"
          class="inline-flex min-h-10 items-center rounded-md border border-primary/30 bg-primary/10 px-4 text-sm font-semibold text-primary transition hover:border-primary/60 hover:bg-primary/15 motion-reduce:transition-none"
        >
          Start a conversation
        </a>
      </div>

      <div class="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          class="grid size-10 place-items-center rounded-md border border-border bg-surface text-muted"
          :aria-label="isLightTheme ? 'Use dark theme' : 'Use light theme'"
          @click="toggleTheme"
        >
          <Moon v-if="isLightTheme" :size="18" aria-hidden="true" />
          <Sun v-else :size="18" aria-hidden="true" />
        </button>

        <button
          type="button"
          class="grid size-10 place-items-center rounded-md border border-border text-muted"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation"
          @click="isMenuOpen = !isMenuOpen"
        >
          <X v-if="isMenuOpen" :size="20" aria-hidden="true" />
          <Menu v-else :size="20" aria-hidden="true" />
        </button>
      </div>
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
          :class="isCurrentRoute(item.to) && 'bg-primary/10 text-foreground'"
          :aria-current="isCurrentRoute(item.to) ? 'page' : undefined"
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
