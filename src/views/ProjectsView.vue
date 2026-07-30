<script setup>
import { computed, ref } from 'vue'
import { ArrowUpRight, Code2, GitFork, Layers3, SearchX } from '@lucide/vue'
import BaseBadge from '@/components/BaseBadge.vue'
import BaseCard from '@/components/BaseCard.vue'

const filters = ['All', 'Full stack', 'Frontend', 'Design systems']
const activeFilter = ref('All')

const projects = [
  {
    title: 'DevVault Platform',
    category: 'Full stack',
    summary:
      'A premium portfolio and content platform with secure administration, structured content, and media storage.',
    technologies: ['Vue 3', 'Laravel', 'MySQL', 'Tailwind CSS'],
    accent: 'violet',
    featured: true,
  },
  {
    title: 'Pulse Analytics',
    category: 'Frontend',
    summary:
      'A responsive analytics workspace that turns complex product metrics into focused, actionable views.',
    technologies: ['Vue 3', 'Charts', 'REST API'],
    accent: 'cyan',
  },
  {
    title: 'Orbit UI',
    category: 'Design systems',
    summary:
      'A documented component system with accessible interaction patterns, composable APIs, and shared design tokens.',
    technologies: ['Vue 3', 'Storybook', 'Accessibility'],
    accent: 'amber',
  },
  {
    title: 'Flowboard',
    category: 'Frontend',
    summary:
      'A collaborative planning interface with flexible boards, keyboard-friendly controls, and optimistic updates.',
    technologies: ['Vue 3', 'Pinia', 'Drag and drop'],
    accent: 'rose',
  },
  {
    title: 'Atlas CMS',
    category: 'Full stack',
    summary:
      'A compact publishing workflow with role-based access, content drafts, asset uploads, and live previews.',
    technologies: ['Vue Router', 'Laravel', 'MySQL'],
    accent: 'emerald',
  },
  {
    title: 'Beacon Components',
    category: 'Design systems',
    summary:
      'Reusable product primitives designed for consistent theming, validation states, and responsive composition.',
    technologies: ['Vue SFC', 'Tailwind CSS', 'Design tokens'],
    accent: 'blue',
  },
]

const filteredProjects = computed(() => {
  if (activeFilter.value === 'All') return projects
  return projects.filter((project) => project.category === activeFilter.value)
})

const accentClasses = {
  violet: 'from-primary/30 via-primary/10 to-canvas',
  cyan: 'from-accent/25 via-accent/5 to-canvas',
  amber: 'from-warning/25 via-warning/5 to-canvas',
  rose: 'from-danger/25 via-danger/5 to-canvas',
  emerald: 'from-success/25 via-success/5 to-canvas',
  blue: 'from-blue-500/25 via-blue-500/5 to-canvas',
}
</script>

<template>
  <div>
    <section class="relative isolate border-b border-border">
      <div
        class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgb(34_211_238_/_0.12),transparent_30rem),radial-gradient(circle_at_80%_30%,rgb(139_92_246_/_0.14),transparent_32rem)]"
        aria-hidden="true"
      />
      <div class="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <BaseBadge tone="accent">Project archive</BaseBadge>
        <h1 class="mt-7 max-w-4xl text-balance text-4xl font-bold tracking-[-0.04em] sm:text-6xl">
          Selected products, systems, and
          <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            experiments.
          </span>
        </h1>
        <p class="mt-7 max-w-3xl text-lg leading-8 text-muted">
          A collection of work exploring frontend architecture, product design, and the systems that
          connect a polished interface to real data.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div
        class="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p class="text-sm font-semibold text-primary">Browse the work</p>
          <h2 class="mt-2 text-2xl font-bold">Projects by discipline</h2>
        </div>

        <div class="flex flex-wrap gap-2" aria-label="Filter projects">
          <button
            v-for="filter in filters"
            :key="filter"
            type="button"
            class="min-h-10 rounded-full border px-4 text-sm font-medium transition motion-reduce:transition-none"
            :class="
              activeFilter === filter
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-surface text-muted hover:border-primary/50 hover:text-foreground'
            "
            :aria-pressed="activeFilter === filter"
            @click="activeFilter = filter"
          >
            {{ filter }}
          </button>
        </div>
      </div>

      <TransitionGroup
        v-if="filteredProjects.length"
        tag="div"
        class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        enter-active-class="transition duration-300 ease-out motion-reduce:transition-none"
        enter-from-class="translate-y-3 opacity-0 motion-reduce:translate-y-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in motion-reduce:transition-none"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <BaseCard
          v-for="project in filteredProjects"
          :key="project.title"
          padding="none"
          hoverable
          class="group flex flex-col"
        >
          <div
            class="relative min-h-56 overflow-hidden border-b border-border bg-gradient-to-br p-6"
            :class="accentClasses[project.accent]"
          >
            <div
              class="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,#fff_1px,transparent_1px)] [background-size:22px_22px]"
            />
            <div class="relative flex h-full min-h-44 items-center justify-center">
              <div
                class="w-full max-w-xs rounded-lg border border-white/10 bg-canvas/75 p-4 shadow-soft backdrop-blur"
              >
                <div class="flex items-center gap-2 border-b border-border pb-3">
                  <span class="size-2 rounded-full bg-danger" />
                  <span class="size-2 rounded-full bg-warning" />
                  <span class="size-2 rounded-full bg-success" />
                </div>
                <div class="mt-4 grid grid-cols-[3rem_1fr] gap-3">
                  <div class="rounded bg-white/5" />
                  <div class="grid gap-2">
                    <div class="h-4 w-2/3 rounded bg-white/15" />
                    <div class="h-2 rounded bg-white/5" />
                    <div class="h-2 w-4/5 rounded bg-white/5" />
                    <div class="mt-2 h-12 rounded border border-white/10 bg-white/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-1 flex-col p-6">
            <div class="flex items-center justify-between gap-4">
              <BaseBadge :tone="project.featured ? 'primary' : 'neutral'" size="sm">
                {{ project.featured ? 'Featured' : project.category }}
              </BaseBadge>
              <component
                :is="project.category === 'Design systems' ? Layers3 : Code2"
                :size="18"
                class="text-muted"
                aria-hidden="true"
              />
            </div>

            <h3 class="mt-5 text-xl font-semibold">{{ project.title }}</h3>
            <p class="mt-3 flex-1 text-sm leading-6 text-muted">{{ project.summary }}</p>

            <ul
              class="mt-6 flex flex-wrap gap-x-4 gap-y-2"
              :aria-label="`${project.title} technologies`"
            >
              <li
                v-for="technology in project.technologies"
                :key="technology"
                class="text-xs font-medium text-muted"
              >
                {{ technology }}
              </li>
            </ul>

            <div class="mt-6 flex items-center gap-5 border-t border-border pt-5">
              <a
                href="#"
                class="inline-flex items-center gap-1.5 text-sm font-semibold transition hover:text-accent motion-reduce:transition-none"
                @click.prevent
              >
                Case study
                <ArrowUpRight :size="15" aria-hidden="true" />
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-foreground motion-reduce:transition-none"
              >
                <GitFork :size="15" aria-hidden="true" />
                Source
              </a>
            </div>
          </div>
        </BaseCard>
      </TransitionGroup>

      <BaseCard v-else variant="outline" class="mt-10 text-center">
        <SearchX :size="28" class="mx-auto text-muted" aria-hidden="true" />
        <h3 class="mt-4 font-semibold">No projects found</h3>
        <p class="mt-2 text-sm text-muted">Try another category to see more work.</p>
      </BaseCard>
    </section>
  </div>
</template>
