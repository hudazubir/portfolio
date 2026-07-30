<script setup>
import {
  ArrowRight,
  Blocks,
  Code2,
  Database,
  ExternalLink,
  Layers3,
  Mail,
  Sparkles,
} from '@lucide/vue'
import BaseBadge from '@/components/BaseBadge.vue'
import BaseCard from '@/components/BaseCard.vue'

const capabilities = [
  {
    title: 'Frontend systems',
    description:
      'Scalable Vue architecture, reusable components, and polished responsive interfaces.',
    icon: Code2,
  },
  {
    title: 'Product experiences',
    description:
      'Clear interaction design, thoughtful motion, and interfaces built around real user needs.',
    icon: Layers3,
  },
  {
    title: 'Full-stack delivery',
    description:
      'Laravel-backed products with authentication, structured data, storage, and reliable CRUD flows.',
    icon: Database,
  },
]

const technologies = ['Vue 3', 'Laravel', 'MySQL', 'Pinia', 'Tailwind CSS']
</script>

<template>
  <div>
    <section class="relative isolate">
      <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div
          class="absolute left-[8%] top-20 size-72 rounded-full bg-primary/15 blur-3xl motion-safe:animate-pulse"
        />
        <div
          class="absolute right-[5%] top-40 size-80 rounded-full bg-accent/10 blur-3xl motion-safe:animate-pulse"
        />
        <div
          class="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#2a2a33_1px,transparent_1px),linear-gradient(to_bottom,#2a2a33_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
        />
      </div>

      <div
        class="mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-7xl items-center gap-16 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8"
      >
        <div class="max-w-3xl">
          <BaseBadge tone="success" dot>Available for select projects</BaseBadge>

          <h1
            class="mt-7 text-balance text-5xl font-bold tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl"
          >
            I build digital products that feel
            <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              exceptionally clear.
            </span>
          </h1>

          <p class="mt-7 max-w-2xl text-pretty text-lg leading-8 text-muted sm:text-xl">
            Frontend engineer specializing in Vue.js, design systems, and full-stack product
            experiences—turning complex ideas into fast, accessible software.
          </p>

          <div class="mt-10 flex flex-wrap gap-3">
            <a
              href="#featured-work"
              class="inline-flex min-h-12 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-hover hover:shadow-glow motion-reduce:transition-none"
            >
              Explore my work
              <ArrowRight :size="17" aria-hidden="true" />
            </a>
            <a
              href="mailto:hello@example.com"
              class="inline-flex min-h-12 items-center gap-2 rounded-md border border-border bg-surface/70 px-5 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:bg-surface-raised motion-reduce:transition-none"
            >
              <Mail :size="17" aria-hidden="true" />
              Let’s work together
            </a>
          </div>

          <ul class="mt-10 flex flex-wrap gap-x-5 gap-y-2" aria-label="Primary technologies">
            <li
              v-for="technology in technologies"
              :key="technology"
              class="text-sm font-medium text-muted"
            >
              {{ technology }}
            </li>
          </ul>
        </div>

        <div class="relative mx-auto w-full max-w-lg lg:mx-0 lg:justify-self-end">
          <div class="absolute -inset-8 -z-10 rounded-full bg-primary/10 blur-3xl" />
          <BaseCard variant="glass" padding="lg" class="relative">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm text-muted">
                <span class="size-2 rounded-full bg-success shadow-[0_0_14px_#34d399]" />
                Building in public
              </div>
              <Sparkles :size="19" class="text-accent" aria-hidden="true" />
            </div>

            <div class="mt-10 grid gap-4">
              <div class="rounded-lg border border-border bg-canvas/80 p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Current focus
                </p>
                <p class="mt-3 text-xl font-semibold">Premium Vue product systems</p>
                <p class="mt-2 text-sm leading-6 text-muted">
                  Architecture, interaction, and data working as one coherent experience.
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="rounded-lg border border-border bg-canvas/60 p-4">
                  <p class="text-2xl font-bold text-foreground">5+</p>
                  <p class="mt-1 text-sm text-muted">Core technologies</p>
                </div>
                <div class="rounded-lg border border-border bg-canvas/60 p-4">
                  <p class="text-2xl font-bold text-foreground">100%</p>
                  <p class="mt-1 text-sm text-muted">Product mindset</p>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </section>

    <section id="expertise" class="scroll-mt-24 border-y border-border bg-surface/40">
      <div class="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <BaseBadge tone="primary">Expertise</BaseBadge>
        <div class="mt-5 max-w-2xl">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Built beyond the surface.</h2>
          <p class="mt-4 text-lg leading-8 text-muted">
            Strong visual work matters, but maintainability, accessibility, and dependable data
            flows are what make a product last.
          </p>
        </div>

        <div class="mt-12 grid gap-5 md:grid-cols-3">
          <BaseCard
            v-for="capability in capabilities"
            :key="capability.title"
            variant="outline"
            hoverable
          >
            <div class="grid size-11 place-items-center rounded-md bg-primary/10 text-primary">
              <component :is="capability.icon" :size="21" aria-hidden="true" />
            </div>
            <h3 class="mt-6 text-lg font-semibold">{{ capability.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-muted">{{ capability.description }}</p>
          </BaseCard>
        </div>
      </div>
    </section>

    <section id="featured-work" class="scroll-mt-24">
      <div class="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <BaseBadge tone="accent">Selected work</BaseBadge>
            <h2 class="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Products with purpose.
            </h2>
          </div>
          <p class="max-w-md text-sm leading-6 text-muted">
            DevVault itself is the first case study: a portfolio platform designed like a polished
            SaaS product rather than a static résumé.
          </p>
        </div>

        <BaseCard variant="glass" padding="none" hoverable class="mt-12">
          <div class="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div
              class="relative min-h-80 overflow-hidden border-b border-border p-8 lg:border-b-0 lg:border-r"
            >
              <div
                class="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgb(139_92_246_/_0.28),transparent_38%),radial-gradient(circle_at_80%_70%,rgb(34_211_238_/_0.16),transparent_36%)]"
              />
              <div class="relative grid h-full place-items-center">
                <div
                  class="w-full max-w-md rounded-xl border border-white/10 bg-canvas/70 p-5 shadow-soft backdrop-blur-xl"
                >
                  <div class="flex items-center gap-2 border-b border-border pb-4">
                    <span class="size-2.5 rounded-full bg-danger" />
                    <span class="size-2.5 rounded-full bg-warning" />
                    <span class="size-2.5 rounded-full bg-success" />
                  </div>
                  <div class="mt-5 grid grid-cols-[5rem_1fr] gap-4">
                    <div class="rounded-md bg-white/5" />
                    <div class="grid gap-3">
                      <div class="h-6 w-2/3 rounded bg-white/10" />
                      <div class="h-3 rounded bg-white/5" />
                      <div class="h-3 w-4/5 rounded bg-white/5" />
                      <div class="mt-3 h-20 rounded-md border border-primary/20 bg-primary/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col justify-center p-8 sm:p-10">
              <div class="flex items-center gap-2 text-sm font-medium text-accent">
                <Blocks :size="18" aria-hidden="true" />
                Flagship project
              </div>
              <h3 class="mt-5 text-2xl font-bold">DevVault Platform</h3>
              <p class="mt-4 leading-7 text-muted">
                A full-stack portfolio and content platform with a refined public experience, secure
                administration, and reusable design system.
              </p>
              <div class="mt-6 flex flex-wrap gap-2">
                <BaseBadge v-for="technology in technologies" :key="technology" size="sm">
                  {{ technology }}
                </BaseBadge>
              </div>
              <a
                href="#contact"
                class="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-foreground transition hover:text-accent motion-reduce:transition-none"
              >
                Discuss the build
                <ExternalLink :size="16" aria-hidden="true" />
              </a>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>

    <section id="contact" class="scroll-mt-24 px-5 pb-24 sm:px-8">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-8 overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/15 via-surface to-accent/10 p-8 shadow-glow sm:p-12 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="max-w-2xl">
          <p class="text-sm font-semibold text-primary">Have a product in mind?</p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Let’s turn the difficult parts into a clear experience.
          </h2>
        </div>
        <a
          href="mailto:hello@example.com"
          class="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-semibold text-canvas transition hover:bg-white motion-reduce:transition-none"
        >
          Send an email
          <ArrowRight :size="17" aria-hidden="true" />
        </a>
      </div>
    </section>
  </div>
</template>
