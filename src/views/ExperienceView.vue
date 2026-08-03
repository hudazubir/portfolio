<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  ArrowRight,
  Check,
  ExternalLink,
  GitPullRequest,
  LoaderCircle,
  MapPin,
  MessageSquareText,
  Rocket,
  SearchX,
  Users,
} from '@lucide/vue'
import BaseBadge from '@/components/BaseBadge.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import api from '@/services/api'

const experiences = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const visibleCount = ref(5)
const expandedExperienceIds = ref([])
const visibleExperiences = computed(() => experiences.value.slice(0, visibleCount.value))
const hasMoreExperiences = computed(() => visibleCount.value < experiences.value.length)
const remainingCount = computed(() => experiences.value.length - visibleCount.value)

function showMoreExperiences() {
  visibleCount.value += 5
}

function showLessExperiences() {
  visibleCount.value = 5
}

function isExperienceExpanded(id) {
  return expandedExperienceIds.value.includes(id)
}

function hasHiddenContent(experience) {
  return experience.description.length > 280 || experience.achievements?.length > 3
}

function visibleAchievements(experience) {
  if (isExperienceExpanded(experience.id)) return experience.achievements || []

  return experience.achievements?.slice(0, 3) || []
}

function toggleExperience(id) {
  expandedExperienceIds.value = isExperienceExpanded(id)
    ? expandedExperienceIds.value.filter((experienceId) => experienceId !== id)
    : [...expandedExperienceIds.value, id]
}

function formatDate(date) {
  if (!date) return ''

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function experiencePeriod(experience) {
  const start = formatDate(experience.start_date)
  const end = experience.is_current ? 'Present' : formatDate(experience.end_date)

  return [start, end].filter(Boolean).join(' — ')
}

async function fetchExperiences() {
  try {
    const response = await api.get('/api/experiences')
    experiences.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to load experience right now.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchExperiences)

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

        <div v-if="isLoading" class="grid min-h-64 place-items-center" role="status">
          <div class="text-center text-muted">
            <LoaderCircle :size="28" class="mx-auto animate-spin" aria-hidden="true" />
            <p class="mt-3 text-sm">Loading experience...</p>
          </div>
        </div>

        <BaseCard v-else-if="errorMessage" variant="outline" class="text-center">
          <SearchX :size="28" class="mx-auto text-danger" aria-hidden="true" />
          <h3 class="mt-4 font-semibold">Experience unavailable</h3>
          <p class="mt-2 text-sm text-muted">{{ errorMessage }}</p>
        </BaseCard>

        <div v-else-if="experiences.length">
          <ol class="relative grid gap-8 border-l border-border pl-6 sm:pl-10">
            <li v-for="role in visibleExperiences" :key="role.id" class="relative">
              <span
                class="absolute -left-[1.92rem] top-8 size-3 rounded-full border-2 border-canvas bg-primary shadow-glow sm:-left-[2.92rem]"
                aria-hidden="true"
              />

              <BaseCard variant="glass">
                <template #header>
                  <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p class="text-sm font-semibold text-primary">
                        {{ experiencePeriod(role) }}
                      </p>
                      <h3 class="mt-2 text-xl font-bold">{{ role.role }}</h3>
                      <p class="mt-1 text-sm text-muted">
                        {{ role.company }}
                        <span v-if="role.location"> · {{ role.location }}</span>
                      </p>
                    </div>
                    <BaseBadge v-if="role.employment_type">{{ role.employment_type }}</BaseBadge>
                  </div>
                </template>

                <p
                  class="whitespace-pre-line text-sm leading-7 text-muted"
                  :class="!isExperienceExpanded(role.id) && 'line-clamp-4'"
                >
                  {{ role.description }}
                </p>

                <ul v-if="role.achievements?.length" class="mt-6 grid gap-3">
                  <li
                    v-for="achievement in visibleAchievements(role)"
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

                <button
                  v-if="hasHiddenContent(role)"
                  type="button"
                  class="mt-5 text-sm font-semibold text-primary transition hover:text-primary-hover motion-reduce:transition-none"
                  :aria-expanded="isExperienceExpanded(role.id)"
                  @click="toggleExperience(role.id)"
                >
                  {{ isExperienceExpanded(role.id) ? 'Show less' : 'Read more' }}
                </button>

                <template v-if="role.company_url || role.location" #footer>
                  <div class="flex flex-wrap items-center gap-5 text-sm text-muted">
                    <span v-if="role.location" class="inline-flex items-center gap-2">
                      <MapPin :size="15" aria-hidden="true" />
                      {{ role.location }}
                    </span>
                    <a
                      v-if="role.company_url"
                      :href="role.company_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 font-semibold transition hover:text-foreground motion-reduce:transition-none"
                    >
                      Company website
                      <ExternalLink :size="14" aria-hidden="true" />
                    </a>
                  </div>
                </template>
              </BaseCard>
            </li>
          </ol>

          <div v-if="experiences.length > 5" class="mt-8 flex justify-center">
            <BaseButton v-if="hasMoreExperiences" variant="secondary" @click="showMoreExperiences">
              Show {{ Math.min(5, remainingCount) }} more
            </BaseButton>
            <BaseButton v-else variant="ghost" @click="showLessExperiences"> Show less </BaseButton>
          </div>
        </div>

        <BaseCard v-else variant="outline" class="text-center">
          <SearchX :size="28" class="mx-auto text-muted" aria-hidden="true" />
          <h3 class="mt-4 font-semibold">No published experience yet</h3>
          <p class="mt-2 text-sm text-muted">
            Professional timeline entries will appear here soon.
          </p>
        </BaseCard>
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
