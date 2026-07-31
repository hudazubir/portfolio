<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowUpRight, Code2, GitFork, LoaderCircle, SearchX } from '@lucide/vue'
import BaseBadge from '@/components/BaseBadge.vue'
import BaseCard from '@/components/BaseCard.vue'
import api from '@/services/api'

const filters = ['All', 'Featured']
const activeFilter = ref('All')
const projects = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const filteredProjects = computed(() => {
  if (activeFilter.value === 'Featured') {
    return projects.value.filter((project) => project.is_featured)
  }

  return projects.value
})

const accentClasses = [
  'from-primary/30 via-primary/10 to-canvas',
  'from-accent/25 via-accent/5 to-canvas',
  'from-warning/25 via-warning/5 to-canvas',
  'from-danger/25 via-danger/5 to-canvas',
  'from-success/25 via-success/5 to-canvas',
  'from-blue-500/25 via-blue-500/5 to-canvas',
]

function projectAccent(index) {
  return accentClasses[index % accentClasses.length]
}

async function fetchProjects() {
  try {
    const response = await api.get('/api/projects')
    projects.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to load projects right now.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchProjects)
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

      <div v-if="isLoading" class="grid min-h-72 place-items-center" role="status">
        <div class="text-center text-muted">
          <LoaderCircle :size="28" class="mx-auto animate-spin" aria-hidden="true" />
          <p class="mt-3 text-sm">Loading projects...</p>
        </div>
      </div>

      <BaseCard v-else-if="errorMessage" variant="outline" class="mt-10 text-center">
        <SearchX :size="28" class="mx-auto text-danger" aria-hidden="true" />
        <h3 class="mt-4 font-semibold">Projects unavailable</h3>
        <p class="mt-2 text-sm text-muted">{{ errorMessage }}</p>
      </BaseCard>

      <TransitionGroup
        v-else-if="filteredProjects.length"
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
          v-for="(project, index) in filteredProjects"
          :key="project.id"
          padding="none"
          hoverable
          class="group flex flex-col"
        >
          <div
            class="relative min-h-56 overflow-hidden border-b border-border bg-gradient-to-br p-6"
            :class="projectAccent(index)"
          >
            <img
              v-if="project.image_url"
              :src="project.image_url"
              :alt="`${project.title} preview`"
              class="absolute inset-0 size-full object-cover opacity-75 transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
            />
            <div
              v-if="!project.image_url"
              class="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,#fff_1px,transparent_1px)] [background-size:22px_22px]"
            />
            <div
              v-if="!project.image_url"
              class="relative flex h-full min-h-44 items-center justify-center"
            >
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
              <BaseBadge :tone="project.is_featured ? 'primary' : 'neutral'" size="sm">
                {{ project.is_featured ? 'Featured' : 'Project' }}
              </BaseBadge>
              <Code2 :size="18" class="text-muted" aria-hidden="true" />
            </div>

            <h3 class="mt-5 text-xl font-semibold">{{ project.title }}</h3>
            <p class="mt-3 line-clamp-3 min-h-18 flex-1 text-sm leading-6 text-muted">
              {{ project.description }}
            </p>

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

            <div class="mt-6 flex flex-wrap items-center gap-5 border-t border-border pt-5">
              <RouterLink
                :to="{ name: 'project-details', params: { slug: project.slug } }"
                class="inline-flex items-center gap-1.5 text-sm font-semibold transition hover:text-primary motion-reduce:transition-none"
              >
                View case study
                <ArrowUpRight :size="15" aria-hidden="true" />
              </RouterLink>
              <a
                v-if="project.project_url"
                :href="project.project_url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-sm font-semibold transition hover:text-accent motion-reduce:transition-none"
              >
                Live
                <ArrowUpRight :size="15" aria-hidden="true" />
              </a>
              <a
                v-if="project.github_url"
                :href="project.github_url"
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
        <h3 class="mt-4 font-semibold">
          {{ projects.length ? 'No featured projects yet' : 'No published projects yet' }}
        </h3>
        <p class="mt-2 text-sm text-muted">
          {{
            projects.length
              ? 'Choose All to view the complete project archive.'
              : 'Published work will appear here soon.'
          }}
        </p>
      </BaseCard>
    </section>
  </div>
</template>
