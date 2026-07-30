<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  Activity,
  BriefcaseBusiness,
  Database,
  FolderKanban,
  MessagesSquare,
  ServerCog,
  ShieldCheck,
  Wrench,
} from '@lucide/vue'
import BaseCard from '@/components/BaseCard.vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const messageCount = ref(0)

const summaries = computed(() => [
  { label: 'Projects', value: 0, icon: FolderKanban, tone: 'primary' },
  { label: 'Skills', value: 0, icon: Wrench, tone: 'accent' },
  { label: 'Experience', value: 0, icon: BriefcaseBusiness, tone: 'success' },
  { label: 'Messages', value: messageCount.value, icon: MessagesSquare, tone: 'warning' },
])

const upcomingModules = [
  {
    title: 'Project management',
    description: 'Create case studies, organize technologies, and control published work.',
    icon: FolderKanban,
  },
  {
    title: 'Portfolio content',
    description: 'Manage skills, experience entries, and public profile information.',
    icon: Database,
  },
  {
    title: 'Inbox and writing',
    description: 'Review contact messages and publish long-form project notes.',
    icon: MessagesSquare,
  },
]

const toneClasses = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
}

async function fetchSummary() {
  try {
    const response = await api.get('/api/admin/contact-messages')
    messageCount.value = response.data.total
  } catch {
    messageCount.value = 0
  }
}

onMounted(fetchSummary)
</script>

<template>
  <main class="px-5 py-8 sm:px-8 sm:py-10">
    <div class="mx-auto max-w-7xl">
      <div>
        <p class="text-sm font-semibold text-primary">Dashboard</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight">
          Welcome back, {{ auth.user?.name || 'Admin' }}.
        </h1>
        <p class="mt-2 text-muted">
          Your content workspace is connected and ready for its first management module.
        </p>
      </div>

      <section class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Content summary">
        <BaseCard v-for="summary in summaries" :key="summary.label" variant="outline">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm text-muted">{{ summary.label }}</p>
              <p class="mt-3 text-3xl font-bold">{{ summary.value }}</p>
            </div>
            <div
              class="grid size-10 place-items-center rounded-md"
              :class="toneClasses[summary.tone]"
            >
              <component :is="summary.icon" :size="19" aria-hidden="true" />
            </div>
          </div>
        </BaseCard>
      </section>

      <div class="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section>
          <div class="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold">Upcoming modules</h2>
              <p class="mt-1 text-sm text-muted">We will activate these one at a time.</p>
            </div>
            <span
              class="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-semibold text-success"
            >
              <Activity :size="14" aria-hidden="true" />
              System online
            </span>
          </div>

          <div class="grid gap-4">
            <BaseCard
              v-for="module in upcomingModules"
              :key="module.title"
              variant="outline"
              hoverable
            >
              <div class="flex items-start gap-4">
                <div
                  class="grid size-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary"
                >
                  <component :is="module.icon" :size="19" aria-hidden="true" />
                </div>
                <div>
                  <h3 class="font-semibold">{{ module.title }}</h3>
                  <p class="mt-1 text-sm leading-6 text-muted">{{ module.description }}</p>
                </div>
              </div>
            </BaseCard>
          </div>
        </section>

        <section>
          <h2 class="text-lg font-semibold">System status</h2>
          <p class="mt-1 text-sm text-muted">Current application connections.</p>

          <BaseCard variant="glass" class="mt-4">
            <ul class="grid gap-5">
              <li class="flex items-center gap-4">
                <div class="grid size-10 place-items-center rounded-md bg-success/10 text-success">
                  <ShieldCheck :size="19" aria-hidden="true" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold">Authentication</p>
                  <p class="text-xs text-muted">Laravel Sanctum session active</p>
                </div>
                <span class="ml-auto size-2 rounded-full bg-success shadow-[0_0_12px_#34d399]" />
              </li>

              <li class="flex items-center gap-4">
                <div class="grid size-10 place-items-center rounded-md bg-accent/10 text-accent">
                  <Database :size="19" aria-hidden="true" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold">Database</p>
                  <p class="text-xs text-muted">MySQL connected through Laravel</p>
                </div>
                <span class="ml-auto size-2 rounded-full bg-success shadow-[0_0_12px_#34d399]" />
              </li>

              <li class="flex items-center gap-4">
                <div class="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
                  <ServerCog :size="19" aria-hidden="true" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold">API</p>
                  <p class="text-xs text-muted">Vue and Laravel communicating</p>
                </div>
                <span class="ml-auto size-2 rounded-full bg-success shadow-[0_0_12px_#34d399]" />
              </li>
            </ul>
          </BaseCard>
        </section>
      </div>

      <BaseCard variant="glass" class="mt-8">
        <div class="flex items-start gap-4">
          <div
            class="grid size-11 shrink-0 place-items-center rounded-md bg-success/10 text-success"
          >
            <ShieldCheck :size="21" aria-hidden="true" />
          </div>
          <div>
            <h2 class="text-lg font-semibold">Foundation complete</h2>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-muted">
              The protected layout, responsive navigation, authentication, and API connection are
              ready. Project Management will be the first complete CRUD module.
            </p>
          </div>
        </div>
      </BaseCard>
    </div>
  </main>
</template>
