<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  BriefcaseBusiness,
  ExternalLink,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  Wrench,
  X,
} from '@lucide/vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const isSidebarOpen = ref(false)

const navigation = [
  { label: 'Overview', icon: LayoutDashboard, to: '/admin', available: true },
  { label: 'Projects', icon: FolderKanban, available: false },
  { label: 'Skills', icon: Wrench, available: false },
  { label: 'Experience', icon: BriefcaseBusiness, available: false },
  { label: 'Posts', icon: FileText, available: false },
  { label: 'Messages', icon: MessagesSquare, to: '/admin/messages', available: true },
]

const adminTitle = computed(() => route.meta.adminTitle || 'Overview')

watch(
  () => route.fullPath,
  () => {
    isSidebarOpen.value = false
  },
)

async function logout() {
  await auth.logout()
  await router.push('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-canvas lg:grid lg:grid-cols-[17rem_1fr]">
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
      aria-hidden="true"
      @click="isSidebarOpen = false"
    />

    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-68 flex-col border-r border-border bg-surface/95 backdrop-blur-xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 motion-reduce:transition-none"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      aria-label="Admin navigation"
    >
      <div class="flex min-h-18 items-center justify-between border-b border-border px-5">
        <RouterLink to="/admin" class="inline-flex items-center gap-3">
          <span
            class="grid size-9 place-items-center rounded-md bg-primary text-xs font-bold text-white shadow-glow"
            aria-hidden="true"
          >
            DV
          </span>
          <span>
            <span class="block text-sm font-bold">DevVault</span>
            <span class="block text-xs text-muted">Admin workspace</span>
          </span>
        </RouterLink>

        <button
          type="button"
          class="grid size-9 place-items-center rounded-md text-muted hover:bg-white/5 hover:text-foreground lg:hidden"
          aria-label="Close navigation"
          @click="isSidebarOpen = false"
        >
          <X :size="19" aria-hidden="true" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-5">
        <p class="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Workspace</p>

        <ul class="mt-3 grid gap-1">
          <li v-for="item in navigation" :key="item.label">
            <RouterLink
              v-if="item.available"
              :to="item.to"
              class="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-foreground motion-reduce:transition-none"
              active-class="bg-primary/10 text-primary"
            >
              <component :is="item.icon" :size="18" aria-hidden="true" />
              {{ item.label }}
            </RouterLink>

            <div
              v-else
              class="flex min-h-11 cursor-not-allowed items-center gap-3 rounded-md px-3 text-sm text-muted/55"
              :aria-label="`${item.label}, coming soon`"
            >
              <component :is="item.icon" :size="18" aria-hidden="true" />
              <span>{{ item.label }}</span>
              <span
                class="ml-auto rounded-full border border-border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide"
              >
                Soon
              </span>
            </div>
          </li>
        </ul>
      </nav>

      <div class="border-t border-border p-4">
        <div class="mb-4 flex min-w-0 items-center gap-3 px-2">
          <span
            class="grid size-9 shrink-0 place-items-center rounded-full bg-accent/10 text-sm font-bold text-accent"
            aria-hidden="true"
          >
            {{ auth.user?.name?.charAt(0)?.toUpperCase() || 'A' }}
          </span>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold">{{ auth.user?.name }}</p>
            <p class="truncate text-xs text-muted">{{ auth.user?.email }}</p>
          </div>
        </div>

        <BaseButton variant="ghost" size="sm" block :loading="auth.isLoading" @click="logout">
          <template #leading>
            <LogOut :size="16" aria-hidden="true" />
          </template>
          Sign out
        </BaseButton>
      </div>
    </aside>

    <div class="min-w-0">
      <header
        class="sticky top-0 z-30 flex min-h-18 items-center justify-between border-b border-border bg-canvas/80 px-5 backdrop-blur-xl sm:px-8"
      >
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="grid size-10 place-items-center rounded-md border border-border text-muted hover:text-foreground lg:hidden"
            aria-label="Open navigation"
            :aria-expanded="isSidebarOpen"
            @click="isSidebarOpen = true"
          >
            <Menu :size="20" aria-hidden="true" />
          </button>
          <div>
            <p class="text-xs font-medium text-muted">Admin</p>
            <p class="text-sm font-semibold">{{ adminTitle }}</p>
          </div>
        </div>

        <RouterLink
          to="/"
          target="_blank"
          class="inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-muted transition hover:border-primary/40 hover:text-foreground motion-reduce:transition-none"
        >
          <span class="hidden sm:inline">View portfolio</span>
          <ExternalLink :size="16" aria-hidden="true" />
        </RouterLink>
      </header>

      <RouterView />
    </div>
  </div>
</template>
