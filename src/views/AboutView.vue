<script setup>
import { ArrowRight, Code2, Compass, HeartHandshake, Lightbulb, MapPin } from '@lucide/vue'
import BaseBadge from '@/components/BaseBadge.vue'
import BaseCard from '@/components/BaseCard.vue'

const principles = [
  {
    title: 'Clarity over cleverness',
    description:
      'The best interface makes the next action obvious, and the best code makes future changes understandable.',
    icon: Lightbulb,
  },
  {
    title: 'Systems create quality',
    description:
      'Reusable patterns, deliberate constraints, and consistent feedback turn good screens into a coherent product.',
    icon: Code2,
  },
  {
    title: 'Collaboration is a feature',
    description:
      'Strong products emerge when design, engineering, and business decisions are discussed openly and early.',
    icon: HeartHandshake,
  },
]

const milestones = [
  {
    period: 'Foundation',
    title: 'Learning how the web works',
    description:
      'Started with semantic HTML, resilient CSS, and JavaScript fundamentals before moving into frameworks.',
  },
  {
    period: 'Specialization',
    title: 'Building deeply with Vue',
    description:
      'Focused on component architecture, state management, responsive design, and maintainable product systems.',
  },
  {
    period: 'Today',
    title: 'Delivering complete experiences',
    description:
      'Combining Vue, Laravel, and thoughtful interaction design to build products from interface to database.',
  },
]
</script>

<template>
  <div>
    <section class="relative isolate border-b border-border">
      <div
        class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_15%,rgb(139_92_246_/_0.16),transparent_32rem)]"
        aria-hidden="true"
      />

      <div class="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <BaseBadge tone="primary">About me</BaseBadge>

        <div class="mt-7 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <h1 class="max-w-4xl text-balance text-4xl font-bold tracking-[-0.04em] sm:text-6xl">
              An engineer who cares about
              <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                how products feel.
              </span>
            </h1>
            <p class="mt-7 max-w-3xl text-lg leading-8 text-muted">
              I build frontend systems that balance visual craft with practical engineering.
              DevVault is where I document that process—from shaping an interface to connecting the
              data behind it.
            </p>
          </div>

          <BaseCard variant="glass">
            <div class="flex items-center gap-3">
              <div class="grid size-10 place-items-center rounded-md bg-accent/10 text-accent">
                <MapPin :size="20" aria-hidden="true" />
              </div>
              <div>
                <p class="text-sm text-muted">Based in</p>
                <p class="font-semibold">Malaysia · Working globally</p>
              </div>
            </div>
            <p class="mt-6 border-t border-border pt-6 text-sm leading-6 text-muted">
              Currently focused on Vue.js applications, design systems, and full-stack product work
              with Laravel.
            </p>
          </BaseCard>
        </div>
      </div>
    </section>

    <section>
      <div class="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div class="max-w-2xl">
          <BaseBadge tone="accent">Working principles</BaseBadge>
          <h2 class="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            The thinking behind the interface.
          </h2>
          <p class="mt-4 text-lg leading-8 text-muted">
            Tools change quickly. These principles keep the work useful, maintainable, and human.
          </p>
        </div>

        <div class="mt-12 grid gap-5 md:grid-cols-3">
          <BaseCard
            v-for="principle in principles"
            :key="principle.title"
            variant="outline"
            hoverable
          >
            <div class="grid size-11 place-items-center rounded-md bg-primary/10 text-primary">
              <component :is="principle.icon" :size="21" aria-hidden="true" />
            </div>
            <h3 class="mt-6 text-lg font-semibold">{{ principle.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-muted">{{ principle.description }}</p>
          </BaseCard>
        </div>
      </div>
    </section>

    <section class="border-y border-border bg-surface/40">
      <div class="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <BaseBadge tone="success" dot>Still evolving</BaseBadge>
          <h2 class="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">A deliberate journey.</h2>
          <p class="mt-4 leading-7 text-muted">
            Growth is less about collecting libraries and more about developing better judgment.
          </p>
        </div>

        <ol class="relative grid gap-8 border-l border-border pl-8">
          <li v-for="milestone in milestones" :key="milestone.period" class="relative">
            <span
              class="absolute -left-[2.42rem] top-1.5 size-3 rounded-full border-2 border-canvas bg-primary shadow-glow"
              aria-hidden="true"
            />
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {{ milestone.period }}
            </p>
            <h3 class="mt-2 text-lg font-semibold">{{ milestone.title }}</h3>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-muted">
              {{ milestone.description }}
            </p>
          </li>
        </ol>
      </div>
    </section>

    <section class="px-5 py-24 sm:px-8">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-8 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/15 via-surface to-accent/10 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="max-w-2xl">
          <div class="flex items-center gap-2 text-sm font-semibold text-accent">
            <Compass :size="18" aria-hidden="true" />
            What comes next
          </div>
          <h2 class="mt-3 text-3xl font-bold tracking-tight">
            See how these principles become real products.
          </h2>
        </div>
        <RouterLink
          :to="{ path: '/', hash: '#featured-work' }"
          class="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-semibold text-canvas transition hover:bg-white motion-reduce:transition-none"
        >
          Explore selected work
          <ArrowRight :size="17" aria-hidden="true" />
        </RouterLink>
      </div>
    </section>
  </div>
</template>
