<script setup>
import { ref, watch } from 'vue'
import { ArrowLeft, ArrowUpRight, Code2, GitFork, LoaderCircle, SearchX } from '@lucide/vue'
import { useRoute } from 'vue-router'
import BaseBadge from '@/components/BaseBadge.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import api from '@/services/api'

const route = useRoute()
const project = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

async function fetchProject() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get(`/api/projects/${route.params.slug}`)
    project.value = response.data
  } catch (error) {
    project.value = null
    errorMessage.value =
      error.response?.status === 404
        ? 'This project is unavailable or has not been published.'
        : 'Unable to load this case study right now.'
  } finally {
    isLoading.value = false
  }
}

watch(() => route.params.slug, fetchProject, { immediate: true })
</script>

<template>
  <main>
    <div v-if="isLoading" class="grid min-h-[70vh] place-items-center" role="status">
      <div class="text-center text-muted">
        <LoaderCircle :size="30" class="mx-auto animate-spin" aria-hidden="true" />
        <p class="mt-3 text-sm">Loading case study...</p>
      </div>
    </div>

    <section v-else-if="errorMessage" class="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
      <BaseCard variant="outline">
        <SearchX :size="32" class="mx-auto text-muted" aria-hidden="true" />
        <h1 class="mt-5 text-2xl font-bold">Project not found</h1>
        <p class="mt-3 text-muted">{{ errorMessage }}</p>
        <RouterLink to="/projects" class="mt-6 inline-block">
          <BaseButton variant="secondary">Back to projects</BaseButton>
        </RouterLink>
      </BaseCard>
    </section>

    <template v-else-if="project">
      <section class="relative isolate overflow-hidden border-b border-border">
        <div
          class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgb(139_92_246_/_0.18),transparent_32rem),radial-gradient(circle_at_85%_25%,rgb(34_211_238_/_0.12),transparent_30rem)]"
          aria-hidden="true"
        />

        <div class="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
          <RouterLink
            to="/projects"
            class="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-foreground motion-reduce:transition-none"
          >
            <ArrowLeft :size="16" aria-hidden="true" />
            All projects
          </RouterLink>

          <div class="mt-7 grid items-end gap-7 lg:grid-cols-[1fr_auto]">
            <div>
              <BaseBadge :tone="project.is_featured ? 'primary' : 'neutral'">
                {{ project.is_featured ? 'Featured case study' : 'Case study' }}
              </BaseBadge>
              <h1
                class="mt-6 max-w-4xl text-balance text-4xl font-bold tracking-[-0.04em] sm:text-6xl"
              >
                {{ project.title }}
              </h1>
            </div>

            <div class="flex flex-wrap gap-3">
              <a
                v-if="project.project_url"
                :href="project.project_url"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BaseButton>
                  <template #leading>
                    <ArrowUpRight :size="17" aria-hidden="true" />
                  </template>
                  Visit live project
                </BaseButton>
              </a>
              <a
                v-if="project.github_url"
                :href="project.github_url"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BaseButton variant="secondary">
                  <template #leading>
                    <GitFork :size="16" aria-hidden="true" />
                  </template>
                  View source
                </BaseButton>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div
          v-if="project.image_url"
          class="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft"
        >
          <img
            :src="project.image_url"
            :alt="`${project.title} project preview`"
            class="aspect-video w-full object-cover"
          />
        </div>

        <div class="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
          <article>
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              About the project
            </p>
            <h2 class="mt-4 text-3xl font-bold">The full case study</h2>
            <p class="mt-6 whitespace-pre-line text-lg leading-9 text-muted">
              {{ project.description }}
            </p>
          </article>

          <aside>
            <BaseCard variant="glass">
              <div class="flex items-center gap-3">
                <div class="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
                  <Code2 :size="19" aria-hidden="true" />
                </div>
                <div>
                  <p class="font-semibold">Technology stack</p>
                  <p class="text-xs text-muted">Tools used to build it</p>
                </div>
              </div>

              <ul v-if="project.technologies?.length" class="mt-6 flex flex-wrap gap-2">
                <li
                  v-for="technology in project.technologies"
                  :key="technology"
                  class="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted"
                >
                  {{ technology }}
                </li>
              </ul>
              <p v-else class="mt-5 text-sm text-muted">Technology details coming soon.</p>
            </BaseCard>
          </aside>
        </div>
      </section>
    </template>
  </main>
</template>
