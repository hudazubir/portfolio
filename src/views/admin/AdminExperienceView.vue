<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { BriefcaseBusiness, MapPin, Pencil, Plus, Trash2 } from '@lucide/vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseModal from '@/components/BaseModal.vue'
import api from '@/services/api'

const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']
const experiences = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const isDeleting = ref(false)
const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingExperienceId = ref(null)
const experienceToDelete = ref(null)
const errorMessage = ref('')
const successMessage = ref('')
const validationErrors = ref({})

const isEditing = computed(() => editingExperienceId.value !== null)
const modalTitle = computed(() => (isEditing.value ? 'Edit experience' : 'Add experience'))

const form = reactive({
  role: '',
  company: '',
  location: '',
  employment_type: 'Full-time',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  achievements: '',
  company_url: '',
  is_published: false,
  sort_order: 0,
})

watch(
  () => form.is_current,
  (isCurrent) => {
    if (isCurrent) form.end_date = ''
  },
)

function resetForm() {
  Object.assign(form, {
    role: '',
    company: '',
    location: '',
    employment_type: 'Full-time',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    achievements: '',
    company_url: '',
    is_published: false,
    sort_order: 0,
  })
  validationErrors.value = {}
}

function fieldError(field) {
  return validationErrors.value[field]?.[0] || ''
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

function openCreateModal() {
  resetForm()
  editingExperienceId.value = null
  errorMessage.value = ''
  successMessage.value = ''
  isFormModalOpen.value = true
}

function openEditModal(experience) {
  resetForm()
  editingExperienceId.value = experience.id
  Object.assign(form, {
    role: experience.role,
    company: experience.company,
    location: experience.location || '',
    employment_type: experience.employment_type || 'Full-time',
    start_date: experience.start_date,
    end_date: experience.end_date || '',
    is_current: Boolean(experience.is_current),
    description: experience.description,
    achievements: experience.achievements?.join('\n') || '',
    company_url: experience.company_url || '',
    is_published: Boolean(experience.is_published),
    sort_order: experience.sort_order ?? 0,
  })
  errorMessage.value = ''
  successMessage.value = ''
  isFormModalOpen.value = true
}

async function fetchExperiences() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get('/api/admin/experiences')
    experiences.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to load experience entries.'
  } finally {
    isLoading.value = false
  }
}

async function saveExperience() {
  isSaving.value = true
  validationErrors.value = {}
  errorMessage.value = ''

  const payload = {
    role: form.role,
    company: form.company,
    location: form.location || null,
    employment_type: form.employment_type || null,
    start_date: form.start_date,
    is_current: form.is_current,
    description: form.description,
    achievements: form.achievements
      .split('\n')
      .map((achievement) => achievement.trim())
      .filter(Boolean),
    company_url: form.company_url || null,
    is_published: form.is_published,
    sort_order: Number(form.sort_order),
  }

  if (!form.is_current && form.end_date) {
    payload.end_date = form.end_date
  }

  try {
    if (isEditing.value) {
      await api.put(`/api/admin/experiences/${editingExperienceId.value}`, payload)
    } else {
      await api.post('/api/admin/experiences', payload)
    }

    successMessage.value = isEditing.value
      ? 'Experience updated successfully.'
      : 'Experience created successfully.'
    isFormModalOpen.value = false
    resetForm()
    await fetchExperiences()
  } catch (error) {
    if (error.response?.status === 422) {
      validationErrors.value = error.response.data.errors || {}
      return
    }

    errorMessage.value = error.response?.data?.message || 'Unable to save this experience.'
  } finally {
    isSaving.value = false
  }
}

function openDeleteModal(experience) {
  experienceToDelete.value = experience
  errorMessage.value = ''
  successMessage.value = ''
  isDeleteModalOpen.value = true
}

async function deleteExperience() {
  if (!experienceToDelete.value) return

  isDeleting.value = true

  try {
    await api.delete(`/api/admin/experiences/${experienceToDelete.value.id}`)
    isDeleteModalOpen.value = false
    experienceToDelete.value = null
    successMessage.value = 'Experience deleted successfully.'
    await fetchExperiences()
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to delete this experience.'
  } finally {
    isDeleting.value = false
  }
}

onMounted(fetchExperiences)
</script>

<template>
  <main class="px-5 py-8 sm:px-8 sm:py-10">
    <div class="mx-auto max-w-7xl">
      <header class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-semibold text-primary">Portfolio content</p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight">Experience</h1>
          <p class="mt-2 text-muted">Manage your professional timeline and achievements.</p>
        </div>

        <BaseButton @click="openCreateModal">
          <template #leading><Plus :size="17" aria-hidden="true" /></template>
          Add experience
        </BaseButton>
      </header>

      <div
        v-if="successMessage"
        class="mt-6 rounded-lg border border-success/20 bg-success/10 p-4 text-sm text-success"
        role="status"
      >
        {{ successMessage }}
      </div>

      <div
        v-if="errorMessage"
        class="mt-6 rounded-lg border border-danger/20 bg-danger/10 p-4 text-sm text-danger"
        role="alert"
      >
        {{ errorMessage }}
      </div>

      <p v-if="isLoading" class="mt-8 text-muted">Loading experience...</p>

      <div
        v-else-if="experiences.length === 0"
        class="mt-8 rounded-xl border border-border bg-white/5 p-10 text-center"
      >
        <div class="mx-auto grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
          <BriefcaseBusiness :size="22" aria-hidden="true" />
        </div>
        <h2 class="mt-4 text-lg font-semibold">No experience entries yet</h2>
        <p class="mt-2 text-sm text-muted">
          Add your first role, internship, or freelance position.
        </p>
        <BaseButton class="mt-5" size="sm" @click="openCreateModal"> Add experience </BaseButton>
      </div>

      <div v-else class="mt-8 grid gap-4">
        <article
          v-for="experience in experiences"
          :key="experience.id"
          class="rounded-xl border border-border bg-white/5 p-5 sm:p-6"
        >
          <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-lg font-semibold">{{ experience.role }}</h2>
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="
                    experience.is_published
                      ? 'bg-success/10 text-success'
                      : 'bg-warning/10 text-warning'
                  "
                >
                  {{ experience.is_published ? 'Published' : 'Draft' }}
                </span>
              </div>

              <p class="mt-1 font-medium text-primary">
                {{ experience.company }}
                <span v-if="experience.employment_type" class="font-normal text-muted">
                  · {{ experience.employment_type }}
                </span>
              </p>

              <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                <span>{{ experiencePeriod(experience) }}</span>
                <span v-if="experience.location" class="inline-flex items-center gap-1.5">
                  <MapPin :size="14" aria-hidden="true" />
                  {{ experience.location }}
                </span>
              </div>

              <p class="mt-4 line-clamp-2 max-w-3xl text-sm leading-6 text-muted">
                {{ experience.description }}
              </p>
            </div>

            <div class="flex shrink-0 gap-2">
              <BaseButton variant="secondary" size="sm" @click="openEditModal(experience)">
                <template #leading><Pencil :size="15" aria-hidden="true" /></template>
                Edit
              </BaseButton>
              <BaseButton variant="danger" size="sm" @click="openDeleteModal(experience)">
                <template #leading><Trash2 :size="15" aria-hidden="true" /></template>
                Delete
              </BaseButton>
            </div>
          </div>
        </article>
      </div>
    </div>
  </main>

  <BaseModal
    v-model="isFormModalOpen"
    :title="modalTitle"
    description="Add a professional role to your public career timeline."
    size="lg"
    :close-on-backdrop="!isSaving"
  >
    <form id="experience-form" class="grid gap-5" @submit.prevent="saveExperience">
      <div class="grid gap-5 sm:grid-cols-2">
        <BaseInput
          v-model="form.role"
          label="Role"
          placeholder="Frontend Developer"
          :error="fieldError('role')"
          required
        />
        <BaseInput
          v-model="form.company"
          label="Company"
          placeholder="Example Studio"
          :error="fieldError('company')"
          required
        />
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <BaseInput
          v-model="form.location"
          label="Location"
          placeholder="Kuala Lumpur or Remote"
          :error="fieldError('location')"
        />
        <div class="grid content-start gap-2">
          <label for="employment-type" class="text-sm font-medium">Employment type</label>
          <select
            id="employment-type"
            v-model="form.employment_type"
            class="min-h-11 rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-accent focus:ring-3 focus:ring-accent/15"
          >
            <option v-for="type in employmentTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div class="grid content-start gap-2">
          <label for="start-date" class="text-sm font-medium">
            Start date <span class="text-danger">*</span>
          </label>
          <input
            id="start-date"
            v-model="form.start_date"
            type="date"
            required
            class="min-h-11 rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-accent focus:ring-3 focus:ring-accent/15"
          />
          <p v-if="fieldError('start_date')" class="text-sm text-danger">
            {{ fieldError('start_date') }}
          </p>
        </div>

        <div class="grid content-start gap-2">
          <label for="end-date" class="text-sm font-medium">End date</label>
          <input
            id="end-date"
            v-model="form.end_date"
            type="date"
            :disabled="form.is_current"
            class="min-h-11 rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-accent focus:ring-3 focus:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p v-if="fieldError('end_date')" class="text-sm text-danger">
            {{ fieldError('end_date') }}
          </p>
        </div>
      </div>

      <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4">
        <input v-model="form.is_current" type="checkbox" class="mt-1 accent-primary" />
        <span>
          <span class="block text-sm font-semibold">I currently work here</span>
          <span class="block text-xs leading-5 text-muted"
            >The end date will display as Present.</span
          >
        </span>
      </label>

      <div class="grid gap-2">
        <label for="experience-description" class="text-sm font-medium">
          Description <span class="text-danger">*</span>
        </label>
        <textarea
          id="experience-description"
          v-model="form.description"
          rows="5"
          maxlength="5000"
          required
          placeholder="Describe your responsibilities and the value you contributed."
          class="w-full resize-y rounded-md border border-border bg-surface px-3 py-3 text-sm outline-none focus:border-accent focus:ring-3 focus:ring-accent/15"
        />
        <p v-if="fieldError('description')" class="text-sm text-danger">
          {{ fieldError('description') }}
        </p>
      </div>

      <div class="grid gap-2">
        <label for="experience-achievements" class="text-sm font-medium">Achievements</label>
        <textarea
          id="experience-achievements"
          v-model="form.achievements"
          rows="4"
          placeholder="Improved page performance by 30%&#10;Created a reusable component library"
          class="w-full resize-y rounded-md border border-border bg-surface px-3 py-3 text-sm outline-none focus:border-accent focus:ring-3 focus:ring-accent/15"
        />
        <p class="text-sm text-muted">Enter one achievement per line.</p>
        <p v-if="fieldError('achievements')" class="text-sm text-danger">
          {{ fieldError('achievements') }}
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <BaseInput
          v-model="form.company_url"
          type="url"
          label="Company URL"
          placeholder="https://example.com"
          :error="fieldError('company_url')"
        />
        <BaseInput
          v-model="form.sort_order"
          type="number"
          min="0"
          label="Sort order"
          hint="Lower numbers appear first."
          :error="fieldError('sort_order')"
        />
      </div>

      <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4">
        <input v-model="form.is_published" type="checkbox" class="mt-1 accent-primary" />
        <span>
          <span class="block text-sm font-semibold">Publish this experience</span>
          <span class="block text-xs leading-5 text-muted"
            >Make it visible on the public timeline.</span
          >
        </span>
      </label>
    </form>

    <template #footer>
      <BaseButton variant="ghost" :disabled="isSaving" @click="isFormModalOpen = false">
        Cancel
      </BaseButton>
      <BaseButton type="submit" form="experience-form" :loading="isSaving">
        {{ isEditing ? 'Save changes' : 'Add experience' }}
      </BaseButton>
    </template>
  </BaseModal>

  <BaseModal
    v-model="isDeleteModalOpen"
    title="Delete experience?"
    :description="`This will permanently remove ${experienceToDelete?.role || 'this role'} at ${experienceToDelete?.company || 'this company'}.`"
    size="sm"
    :close-on-backdrop="!isDeleting"
  >
    <div class="rounded-lg border border-danger/20 bg-danger/10 p-4 text-sm text-danger">
      This action cannot be undone.
    </div>

    <template #footer>
      <BaseButton variant="ghost" :disabled="isDeleting" @click="isDeleteModalOpen = false">
        Cancel
      </BaseButton>
      <BaseButton variant="danger" :loading="isDeleting" @click="deleteExperience">
        Delete experience
      </BaseButton>
    </template>
  </BaseModal>
</template>
