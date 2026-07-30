<script setup>
import {
  Accessibility,
  Blocks,
  Braces,
  Database,
  GitBranch,
  Layers3,
  Palette,
  Route,
  ServerCog,
  Sparkles,
  Store,
  TestTube2,
  Wrench,
  Zap,
} from '@lucide/vue'
import BaseBadge from '@/components/BaseBadge.vue'
import BaseCard from '@/components/BaseCard.vue'

const skillGroups = [
  {
    title: 'Vue engineering',
    description: 'Application structure and component behavior.',
    icon: Braces,
    tone: 'primary',
    skills: [
      { name: 'Vue 3', detail: 'Composition API, reactivity, and Single-File Components' },
      { name: 'Vue Router', detail: 'Nested layouts, lazy routes, and navigation behavior' },
      { name: 'Pinia', detail: 'Shared state, actions, getters, and store composition' },
      { name: 'Composables', detail: 'Reusable stateful logic with focused public APIs' },
    ],
  },
  {
    title: 'Interface systems',
    description: 'Consistent, responsive, and accessible product UI.',
    icon: Palette,
    tone: 'accent',
    skills: [
      { name: 'Tailwind CSS', detail: 'Token-driven utility styling and responsive composition' },
      { name: 'Design systems', detail: 'Reusable primitives, variants, and interaction states' },
      { name: 'Accessibility', detail: 'Semantic structure, keyboard support, and clear focus' },
      { name: 'Responsive design', detail: 'Content-led layouts across mobile and desktop' },
    ],
  },
  {
    title: 'Data and backend',
    description: 'Reliable interfaces connected to real application data.',
    icon: Database,
    tone: 'success',
    skills: [
      { name: 'Laravel', detail: 'Authentication, APIs, validation, storage, and Eloquent models' },
      { name: 'REST APIs', detail: 'Request lifecycles, transformation, and error handling' },
      { name: 'CRUD workflows', detail: 'Validation, optimistic feedback, and consistent states' },
      { name: 'Data modeling', detail: 'Practical schemas shaped around product requirements' },
    ],
  },
  {
    title: 'Quality and delivery',
    description: 'Tools and practices that keep software maintainable.',
    icon: Wrench,
    tone: 'warning',
    skills: [
      { name: 'Vite', detail: 'Fast development, environment configuration, and builds' },
      { name: 'Git', detail: 'Focused commits, reviewable changes, and branch workflows' },
      { name: 'Testing', detail: 'Component, integration, and user-flow verification' },
      { name: 'Code review', detail: 'Constructive feedback and shared technical context' },
    ],
  },
]

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
      <div class="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
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

        <ul class="mt-10 flex flex-wrap gap-3" aria-label="Engineering toolbelt">
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

    <section class="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div class="max-w-2xl">
        <BaseBadge tone="accent">Capability map</BaseBadge>
        <h2 class="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          What I use—and what I use it for.
        </h2>
        <p class="mt-4 text-lg leading-8 text-muted">
          Context is more useful than an arbitrary proficiency percentage, so every skill is tied to
          a practical purpose.
        </p>
      </div>

      <div class="mt-12 grid gap-6 lg:grid-cols-2">
        <BaseCard
          v-for="group in skillGroups"
          :key="group.title"
          variant="glass"
          class="flex flex-col"
        >
          <template #header>
            <div class="flex items-start gap-4">
              <div
                class="grid size-11 shrink-0 place-items-center rounded-md bg-primary/10 text-primary"
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
              <div
                class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-5"
              >
                <p class="shrink-0 text-sm font-semibold text-foreground">{{ skill.name }}</p>
                <p class="text-sm leading-6 text-muted sm:text-right">{{ skill.detail }}</p>
              </div>
            </li>
          </ul>
        </BaseCard>
      </div>
    </section>

    <section class="border-y border-border bg-surface/40">
      <div class="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div class="max-w-2xl">
          <BaseBadge tone="success" dot>Working method</BaseBadge>
          <h2 class="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Technology follows the problem.
          </h2>
          <p class="mt-4 text-lg leading-8 text-muted">
            A repeatable workflow keeps implementation grounded in product needs.
          </p>
        </div>

        <ol class="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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

    <section class="px-5 py-24 sm:px-8">
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
