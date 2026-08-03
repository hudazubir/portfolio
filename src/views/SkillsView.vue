<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  Accessibility,
  Blocks,
  Braces,
  Database,
  GitBranch,
  Layers3,
  LoaderCircle,
  Palette,
  Route,
  ServerCog,
  SearchX,
  Sparkles,
  Store,
  TestTube2,
  Wrench,
  Zap,
} from '@lucide/vue'
import BaseBadge from '@/components/BaseBadge.vue'
import BaseCard from '@/components/BaseCard.vue'
import api from '@/services/api'

const skills = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const categoryConfig = {
  Frontend: {
    description: 'Interfaces, component architecture, and browser experiences.',
    icon: Braces,
    tone: 'primary',
  },
  Backend: {
    description: 'Server-side application logic, APIs, and authentication.',
    icon: ServerCog,
    tone: 'success',
  },
  Database: {
    description: 'Reliable data modeling, querying, and persistence.',
    icon: Database,
    tone: 'success',
  },
  DevOps: {
    description: 'Delivery workflows, environments, and version control.',
    icon: GitBranch,
    tone: 'warning',
  },
  Tools: {
    description: 'Engineering tools that improve quality and productivity.',
    icon: Wrench,
    tone: 'warning',
  },
  Design: {
    description: 'Visual systems, responsive design, and accessibility.',
    icon: Palette,
    tone: 'accent',
  },
}

const toneClasses = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
}

const skillGroups = computed(() => {
  const groups = new Map()

  for (const skill of skills.value) {
    if (!groups.has(skill.category)) {
      const config = categoryConfig[skill.category] || {
        description: 'Technical capabilities applied to real product work.',
        icon: Blocks,
        tone: 'primary',
      }

      groups.set(skill.category, {
        title: skill.category,
        ...config,
        skills: [],
      })
    }

    groups.get(skill.category).skills.push(skill)
  }

  return [...groups.values()]
})

async function fetchSkills() {
  try {
    const response = await api.get('/api/skills')
    skills.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to load skills right now.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchSkills)

const workflow = [
  {
    title: 'Understand',
    description: 'Clarify the user, outcome, constraints, and unknowns before reaching for code.',
    icon: Sparkles,
  },
  {
    title: 'Structure',
    description: 'Define data boundaries, component responsibilities, and reusable patterns.',
    icon: Layers3,
  },
  {
    title: 'Build',
    description: 'Deliver the smallest coherent slice with responsive and accessible behavior.',
    icon: Blocks,
  },
  {
    title: 'Verify',
    description: 'Test real interactions, edge states, production compilation, and device layouts.',
    icon: TestTube2,
  },
]

const toolbelt = [
  { label: 'Routing', icon: Route },
  { label: 'State', icon: Store },
  { label: 'APIs', icon: ServerCog },
  { label: 'Performance', icon: Zap },
  { label: 'Accessibility', icon: Accessibility },
  { label: 'Version control', icon: GitBranch },
]
</script>

<template>
  <div>
    <section class="relative isolate border-b border-border">
      <div
        class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_10%,rgb(139_92_246_/_0.16),transparent_30rem),radial-gradient(circle_at_80%_40%,rgb(34_211_238_/_0.1),transparent_28rem)]"
        aria-hidden="true"
      />
      <div class="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <BaseBadge tone="primary">Technical capabilities</BaseBadge>
        <h1 class="mt-7 max-w-4xl text-balance text-4xl font-bold tracking-[-0.04em] sm:text-6xl">
          Skills applied as a
          <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            connected system.
          </span>
        </h1>
        <p class="mt-7 max-w-3xl text-lg leading-8 text-muted">
          A strong product is never the result of one library. It comes from combining interface
          craft, application architecture, data, and disciplined delivery.
        </p>

        <ul class="mt-8 flex flex-wrap gap-3" aria-label="Engineering toolbelt">
          <li
            v-for="tool in toolbelt"
            :key="tool.label"
            class="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-surface/70 px-4 text-sm font-medium text-muted backdrop-blur"
          >
            <component :is="tool.icon" :size="16" class="text-accent" aria-hidden="true" />
            {{ tool.label }}
          </li>
        </ul>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <div class="max-w-2xl">
        <BaseBadge tone="accent">Capability map</BaseBadge>
        <h2 class="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          What I use—and what I use it for.
        </h2>
        <p class="mt-4 text-lg leading-8 text-muted">
          Each published skill combines practical context with a simple proficiency indicator.
        </p>
      </div>

      <div v-if="isLoading" class="grid min-h-64 place-items-center" role="status">
        <div class="text-center text-muted">
          <LoaderCircle :size="28" class="mx-auto animate-spin" aria-hidden="true" />
          <p class="mt-3 text-sm">Loading skills...</p>
        </div>
      </div>

      <BaseCard v-else-if="errorMessage" variant="outline" class="mt-12 text-center">
        <SearchX :size="28" class="mx-auto text-danger" aria-hidden="true" />
        <h3 class="mt-4 font-semibold">Skills unavailable</h3>
        <p class="mt-2 text-sm text-muted">{{ errorMessage }}</p>
      </BaseCard>

      <div v-else-if="skillGroups.length" class="mt-8 grid gap-5 lg:grid-cols-2">
        <BaseCard
          v-for="group in skillGroups"
          :key="group.title"
          variant="glass"
          class="flex flex-col"
        >
          <template #header>
            <div class="flex items-start gap-4">
              <div
                class="grid size-11 shrink-0 place-items-center rounded-md"
                :class="toneClasses[group.tone]"
              >
                <component :is="group.icon" :size="21" aria-hidden="true" />
              </div>
              <div>
                <h3 class="text-lg font-semibold">{{ group.title }}</h3>
                <p class="mt-1 text-sm text-muted">{{ group.description }}</p>
              </div>
            </div>
          </template>

          <ul class="grid gap-3">
            <li
              v-for="skill in group.skills"
              :key="skill.name"
              class="rounded-lg border border-border bg-canvas/50 p-4"
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="text-sm font-semibold text-foreground">{{ skill.name }}</p>
                    <BaseBadge v-if="skill.is_featured" tone="primary" size="sm">
                      Featured
                    </BaseBadge>
                  </div>
                  <p v-if="skill.description" class="mt-1 text-sm leading-6 text-muted">
                    {{ skill.description }}
                  </p>
                </div>
                <span class="shrink-0 text-sm font-bold text-primary">
                  {{ skill.proficiency }}%
                </span>
              </div>
              <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  :style="{ width: `${skill.proficiency}%` }"
                />
              </div>
            </li>
          </ul>
        </BaseCard>
      </div>

      <BaseCard v-else variant="outline" class="mt-12 text-center">
        <Wrench :size="28" class="mx-auto text-muted" aria-hidden="true" />
        <h3 class="mt-4 font-semibold">No published skills yet</h3>
        <p class="mt-2 text-sm text-muted">Technical capabilities will appear here soon.</p>
      </BaseCard>
    </section>

    <section class="border-y border-border bg-surface/40">
      <div class="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div class="max-w-2xl">
          <BaseBadge tone="success" dot>Working method</BaseBadge>
          <h2 class="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Technology follows the problem.
          </h2>
          <p class="mt-4 text-lg leading-8 text-muted">
            A repeatable workflow keeps implementation grounded in product needs.
          </p>
        </div>

        <ol class="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <li v-for="(step, index) in workflow" :key="step.title">
            <BaseCard variant="outline" hoverable class="h-full">
              <div class="flex items-center justify-between">
                <div class="grid size-10 place-items-center rounded-md bg-accent/10 text-accent">
                  <component :is="step.icon" :size="19" aria-hidden="true" />
                </div>
                <span class="text-sm font-bold text-border">0{{ index + 1 }}</span>
              </div>
              <h3 class="mt-5 font-semibold">{{ step.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-muted">{{ step.description }}</p>
            </BaseCard>
          </li>
        </ol>
      </div>
    </section>

    <section class="px-5 py-16 sm:px-8 sm:py-20">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-8 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/15 via-surface to-accent/10 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="max-w-2xl">
          <p class="text-sm font-semibold text-primary">Skills are best seen in context.</p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight">
            Explore how this toolset becomes finished work.
          </h2>
        </div>
        <RouterLink
          to="/projects"
          class="inline-flex min-h-12 shrink-0 items-center justify-center rounded-md bg-foreground px-5 text-sm font-semibold text-canvas transition hover:bg-white motion-reduce:transition-none"
        >
          View projects
        </RouterLink>
      </div>
    </section>
  </div>
</template>
