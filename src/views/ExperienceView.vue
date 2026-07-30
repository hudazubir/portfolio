<script setup>
import { ArrowRight, Check, GitPullRequest, MessageSquareText, Rocket, Users } from '@lucide/vue'
import BaseBadge from '@/components/BaseBadge.vue'
import BaseCard from '@/components/BaseCard.vue'

const experience = [
  {
    period: '2024 — Present',
    role: 'Senior Frontend Engineer',
    company: 'Independent Product Studio',
    type: 'Consulting',
    summary:
      'Partnering with product teams to shape and deliver maintainable Vue applications from early architecture through production polish.',
    achievements: [
      'Created reusable frontend foundations that reduced repeated implementation across product modules.',
      'Translated ambiguous product requirements into clear, responsive interaction flows.',
      'Connected authenticated interfaces to structured backend services and reliable loading states.',
    ],
    technologies: ['Vue 3', 'Pinia', 'Tailwind CSS', 'Laravel'],
  },
  {
    period: '2022 — 2024',
    role: 'Frontend Engineer',
    company: 'Digital Product Team',
    type: 'Full time',
    summary:
      'Built customer-facing workflows and internal product tools while improving consistency across a growing frontend codebase.',
    achievements: [
      'Introduced composable UI patterns for forms, feedback states, and shared navigation.',
      'Improved responsive behavior across high-traffic application screens.',
      'Collaborated closely with designers and backend engineers to reduce delivery uncertainty.',
    ],
    technologies: ['Vue', 'Vue Router', 'REST APIs', 'CSS'],
  },
  {
    period: '2020 — 2022',
    role: 'Frontend Developer',
    company: 'Creative Technology Studio',
    type: 'Full time',
    summary:
      'Turned visual concepts into accessible websites and interactive campaign experiences across a wide range of screen sizes.',
    achievements: [
      'Developed component-based interfaces from design specifications.',
      'Established reliable browser and device testing practices.',
      'Strengthened foundations in semantic markup, performance, and interaction design.',
    ],
    technologies: ['JavaScript', 'HTML', 'CSS', 'Animation'],
  },
]

const contributions = [
  {
    title: 'Product thinking',
    description: 'I connect technical choices to user outcomes and business constraints.',
    icon: Rocket,
  },
  {
    title: 'Clear collaboration',
    description: 'I surface tradeoffs early and make implementation decisions easy to follow.',
    icon: MessageSquareText,
  },
  {
    title: 'Team leverage',
    description:
      'I build patterns, documentation, and tools that help the entire team move faster.',
    icon: Users,
  },
  {
    title: 'Thoughtful review',
    description: 'I use code review to improve shared understanding, not only catch mistakes.',
    icon: GitPullRequest,
  },
]
</script>

<template>
  <div>
    <section class="relative isolate border-b border-border">
      <div
        class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_15%,rgb(139_92_246_/_0.16),transparent_32rem)]"
        aria-hidden="true"
      />
      <div class="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <BaseBadge tone="success" dot>Professional journey</BaseBadge>
        <h1 class="mt-7 max-w-4xl text-balance text-4xl font-bold tracking-[-0.04em] sm:text-6xl">
          Experience built through
          <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            shipping real products.
          </span>
        </h1>
        <p class="mt-7 max-w-3xl text-lg leading-8 text-muted">
          A progression from crafting individual interfaces to designing the systems, workflows, and
          engineering practices behind complete product experiences.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div class="grid gap-14 lg:grid-cols-[0.36fr_0.64fr]">
        <div class="lg:sticky lg:top-28 lg:self-start">
          <BaseBadge tone="primary">Timeline</BaseBadge>
          <h2 class="mt-5 text-3xl font-bold tracking-tight">Work that compounds.</h2>
          <p class="mt-4 leading-7 text-muted">
            Each role added a new layer: visual craft, component architecture, product judgment, and
            technical leadership.
          </p>
        </div>

        <ol class="relative grid gap-8 border-l border-border pl-6 sm:pl-10">
          <li v-for="role in experience" :key="`${role.company}-${role.period}`" class="relative">
            <span
              class="absolute -left-[1.92rem] top-8 size-3 rounded-full border-2 border-canvas bg-primary shadow-glow sm:-left-[2.92rem]"
              aria-hidden="true"
            />

            <BaseCard variant="glass">
              <template #header>
                <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p class="text-sm font-semibold text-primary">{{ role.period }}</p>
                    <h3 class="mt-2 text-xl font-bold">{{ role.role }}</h3>
                    <p class="mt-1 text-sm text-muted">{{ role.company }}</p>
                  </div>
                  <BaseBadge>{{ role.type }}</BaseBadge>
                </div>
              </template>

              <p class="text-sm leading-6 text-muted">{{ role.summary }}</p>

              <ul class="mt-6 grid gap-3">
                <li
                  v-for="achievement in role.achievements"
                  :key="achievement"
                  class="flex gap-3 text-sm leading-6 text-muted"
                >
                  <span
                    class="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-success/10 text-success"
                  >
                    <Check :size="12" stroke-width="3" aria-hidden="true" />
                  </span>
                  {{ achievement }}
                </li>
              </ul>

              <template #footer>
                <ul class="flex flex-wrap gap-2" :aria-label="`${role.role} technologies`">
                  <li v-for="technology in role.technologies" :key="technology">
                    <BaseBadge size="sm">{{ technology }}</BaseBadge>
                  </li>
                </ul>
              </template>
            </BaseCard>
          </li>
        </ol>
      </div>
    </section>

    <section class="border-y border-border bg-surface/40">
      <div class="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div class="max-w-2xl">
          <BaseBadge tone="accent">How I contribute</BaseBadge>
          <h2 class="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            More than implementation.
          </h2>
          <p class="mt-4 text-lg leading-8 text-muted">
            Senior engineering means improving both the product and the environment in which it is
            built.
          </p>
        </div>

        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <BaseCard
            v-for="contribution in contributions"
            :key="contribution.title"
            variant="outline"
            hoverable
          >
            <div class="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
              <component :is="contribution.icon" :size="19" aria-hidden="true" />
            </div>
            <h3 class="mt-5 font-semibold">{{ contribution.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-muted">{{ contribution.description }}</p>
          </BaseCard>
        </div>
      </div>
    </section>

    <section class="px-5 py-24 sm:px-8">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-8 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/15 via-surface to-accent/10 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="max-w-2xl">
          <p class="text-sm font-semibold text-primary">Looking for the work itself?</p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight">
            Explore the products behind the experience.
          </h2>
        </div>
        <RouterLink
          to="/projects"
          class="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-semibold text-canvas transition hover:bg-white motion-reduce:transition-none"
        >
          View projects
          <ArrowRight :size="17" aria-hidden="true" />
        </RouterLink>
      </div>
    </section>
  </div>
</template>
