<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { FolderKanban, Pencil, Plus, Trash2 } from '@lucide/vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseModal from '@/components/BaseModal.vue'
import api from '@/services/api'

const projects = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const isFormModalOpen = ref(false)
const editingProjectId = ref(null)
const projectToDelete = ref(null)
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const validationErrors = ref({})
const lastGeneratedSlug = ref('')
const imageFile = ref(null)
const imagePreviewUrl = ref('')
const isEditing = computed(() => editingProjectId.value !== null)
const formModalTitle = computed(() => (isEditing.value ? 'Edit project' : 'Create project'))
const formModalDescription = computed(() =>
  isEditing.value
    ? 'Update this project and control whether visitors can see it.'
    : 'Add a project to your portfolio. You can keep it as a draft until it is ready.',
)

const form = reactive({
  title: '',
  slug: '',
  description: '',
  project_url: '',
  github_url: '',
  technologies: '',
  is_featured: false,
  is_published: false,
  sort_order: 0,
})

function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

watch(
  () => form.title,
  (title) => {
    if (!form.slug || form.slug === lastGeneratedSlug.value) {
      const generatedSlug = makeSlug(title)
      form.slug = generatedSlug
      lastGeneratedSlug.value = generatedSlug
    }
  },
)

function resetForm() {
  if (imagePreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreviewUrl.value)
  }

  Object.assign(form, {
    title: '',
    slug: '',
    description: '',
    project_url: '',
    github_url: '',
    technologies: '',
    is_featured: false,
    is_published: false,
    sort_order: 0,
  })
  validationErrors.value = {}
  lastGeneratedSlug.value = ''
  imageFile.value = null
  imagePreviewUrl.value = ''
}

function openCreateModal() {
  resetForm()
  editingProjectId.value = null
  errorMessage.value = ''
  successMessage.value = ''
  isFormModalOpen.value = true
}

function openEditModal(project) {
  resetForm()
  editingProjectId.value = project.id
  Object.assign(form, {
    title: project.title,
    slug: project.slug,
    description: project.description,
    project_url: project.project_url || '',
    github_url: project.github_url || '',
    technologies: project.technologies?.join(', ') || '',
    is_featured: Boolean(project.is_featured),
    is_published: Boolean(project.is_published),
    sort_order: project.sort_order ?? 0,
  })
  lastGeneratedSlug.value = project.slug
  imagePreviewUrl.value = project.image_url || ''
  errorMessage.value = ''
  successMessage.value = ''
  isFormModalOpen.value = true
}

function fieldError(field) {
  return validationErrors.value[field]?.[0] || ''
}

function handleImageChange(event) {
  const [file] = event.target.files

  if (imagePreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreviewUrl.value)
  }

  imageFile.value = file || null
  imagePreviewUrl.value = file ? URL.createObjectURL(file) : ''
  validationErrors.value.image = []
}

function buildProjectFormData() {
  const payload = new FormData()

  payload.append('title', form.title)
  payload.append('slug', form.slug)
  payload.append('description', form.description)
  payload.append('is_featured', form.is_featured ? '1' : '0')
  payload.append('is_published', form.is_published ? '1' : '0')
  payload.append('sort_order', String(Number(form.sort_order)))

  if (form.project_url) payload.append('project_url', form.project_url)
  if (form.github_url) payload.append('github_url', form.github_url)
  if (imageFile.value) payload.append('image', imageFile.value)

  form.technologies
    .split(',')
    .map((technology) => technology.trim())
    .filter(Boolean)
    .forEach((technology, index) => {
      payload.append(`technologies[${index}]`, technology)
    })

  return payload
}

async function fetchProjects() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get('/api/admin/projects')
    projects.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to load projects.'
  } finally {
    isLoading.value = false
  }
}

async function saveProject() {
  isSaving.value = true
  validationErrors.value = {}
  errorMessage.value = ''

  try {
    const payload = buildProjectFormData()

    if (isEditing.value) {
      payload.append('_method', 'PUT')
      await api.post(`/api/admin/projects/${editingProjectId.value}`, payload)
    } else {
      await api.post('/api/admin/projects', payload)
    }

    successMessage.value = isEditing.value
      ? 'Project updated successfully.'
      : 'Project created successfully.'
    isFormModalOpen.value = false
    resetForm()
    await fetchProjects()
  } catch (error) {
    if (error.response?.status === 422) {
      validationErrors.value = error.response.data.errors || {}
      return
    }

    errorMessage.value = error.response?.data?.message || 'Unable to save the project.'
  } finally {
    isSaving.value = false
  }
}

function openDeleteModal(project) {
  projectToDelete.value = project
  errorMessage.value = ''
  successMessage.value = ''
  isDeleteModalOpen.value = true
}

async function deleteProject() {
  if (!projectToDelete.value) return

  isDeleting.value = true

  try {
    await api.delete(`/api/admin/projects/${projectToDelete.value.id}`)
    isDeleteModalOpen.value = false
    successMessage.value = 'Project deleted successfully.'
    projectToDelete.value = null
    await fetchProjects()
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to delete the project.'
  } finally {
    isDeleting.value = false
  }
}

onMounted(fetchProjects)
</script>

<template>
  <main class="px-5 py-8 sm:px-8 sm:py-10">
    <div class="mx-auto max-w-7xl">
      <header class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-semibold text-primary">Portfolio content</p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight">Projects</h1>
          <p class="mt-2 text-muted">Manage the projects displayed on your public portfolio.</p>
        </div>

        <BaseButton @click="openCreateModal">
          <template #leading>
            <Plus :size="17" aria-hidden="true" />
          </template>
          Add project
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

      <p v-if="isLoading" class="mt-8 text-muted">Loading projects...</p>

      <div
        v-else-if="projects.length === 0"
        class="mt-8 rounded-xl border border-border bg-white/5 p-10 text-center"
      >
        <div class="mx-auto grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
          <FolderKanban :size="22" aria-hidden="true" />
        </div>
        <h2 class="mt-4 text-lg font-semibold">No projects yet</h2>
        <p class="mt-2 text-sm text-muted">Create your first portfolio project to get started.</p>
        <BaseButton class="mt-5" size="sm" @click="openCreateModal">Add project</BaseButton>
      </div>

      <div v-else class="mt-8 grid gap-4">
        <article
          v-for="project in projects"
          :key="project.id"
          class="rounded-xl border border-border bg-white/5 p-5"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-lg font-semibold">{{ project.title }}</h2>
                <span
                  v-if="project.is_featured"
                  class="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                >
                  Featured
                </span>
              </div>
              <p class="mt-1 line-clamp-2 text-sm leading-6 text-muted">
                {{ project.description }}
              </p>
              <div v-if="project.technologies?.length" class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="technology in project.technologies"
                  :key="technology"
                  class="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
                >
                  {{ technology }}
                </span>
              </div>
            </div>

            <div class="flex shrink-0 flex-col items-end gap-3">
              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="
                  project.is_published ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                "
              >
                {{ project.is_published ? 'Published' : 'Draft' }}
              </span>

              <div class="flex items-center gap-2">
                <BaseButton
                  variant="secondary"
                  size="sm"
                  :aria-label="`Edit ${project.title}`"
                  @click="openEditModal(project)"
                >
                  <template #leading>
                    <Pencil :size="15" aria-hidden="true" />
                  </template>
                  Edit
                </BaseButton>
                <BaseButton
                  variant="danger"
                  size="sm"
                  :aria-label="`Delete ${project.title}`"
                  @click="openDeleteModal(project)"
                >
                  <template #leading>
                    <Trash2 :size="15" aria-hidden="true" />
                  </template>
                  Delete
                </BaseButton>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </main>

  <BaseModal
    v-model="isFormModalOpen"
    :title="formModalTitle"
    :description="formModalDescription"
    size="lg"
    :close-on-backdrop="!isSaving"
  >
    <form id="project-form" class="grid gap-5" @submit.prevent="saveProject">
      <div class="grid gap-5 sm:grid-cols-2">
        <BaseInput
          v-model="form.title"
          label="Project title"
          placeholder="DevVault"
          :error="fieldError('title')"
          required
        />
        <BaseInput
          v-model="form.slug"
          label="Slug"
          placeholder="devvault"
          hint="Used as the project's URL-friendly identifier."
          :error="fieldError('slug')"
          required
        />
      </div>

      <div class="grid gap-2">
        <label for="project-description" class="text-sm font-medium">
          Description <span class="text-danger">*</span>
        </label>
        <textarea
          id="project-description"
          v-model="form.description"
          rows="5"
          maxlength="5000"
          required
          placeholder="What problem does this project solve?"
          class="w-full resize-y rounded-md border bg-surface px-3 py-3 text-sm outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-3 focus:ring-accent/15"
          :class="fieldError('description') ? 'border-danger' : 'border-border'"
        />
        <p v-if="fieldError('description')" class="text-sm text-danger">
          {{ fieldError('description') }}
        </p>
      </div>

      <div class="grid gap-2">
        <label for="project-image" class="text-sm font-medium">Project image</label>
        <label
          for="project-image"
          class="group relative grid min-h-44 cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed bg-surface text-center transition hover:border-primary/60"
          :class="fieldError('image') ? 'border-danger' : 'border-border'"
        >
          <img
            v-if="imagePreviewUrl"
            :src="imagePreviewUrl"
            alt="Selected project preview"
            class="absolute inset-0 size-full object-cover"
          />
          <div
            class="relative z-10 rounded-lg px-5 py-3"
            :class="imagePreviewUrl ? 'bg-canvas/85 backdrop-blur-sm' : ''"
          >
            <p class="text-sm font-semibold">
              {{ imagePreviewUrl ? 'Choose a different image' : 'Choose project image' }}
            </p>
            <p class="mt-1 text-xs text-muted">JPG, PNG or WebP · maximum 2 MB</p>
          </div>
        </label>
        <input
          id="project-image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="sr-only"
          @change="handleImageChange"
        />
        <p v-if="fieldError('image')" class="text-sm text-danger">
          {{ fieldError('image') }}
        </p>
      </div>

      <BaseInput
        v-model="form.technologies"
        label="Technologies"
        placeholder="Vue.js, Laravel, MySQL"
        hint="Separate each technology with a comma."
        :error="fieldError('technologies') || fieldError('technologies.0')"
      />

      <div class="grid gap-5 sm:grid-cols-2">
        <BaseInput
          v-model="form.project_url"
          type="url"
          label="Live project URL"
          placeholder="https://example.com"
          :error="fieldError('project_url')"
        />
        <BaseInput
          v-model="form.github_url"
          type="url"
          label="GitHub URL"
          placeholder="https://github.com/username/project"
          :error="fieldError('github_url')"
        />
      </div>

      <BaseInput
        v-model="form.sort_order"
        type="number"
        min="0"
        label="Sort order"
        hint="Lower numbers appear first."
        :error="fieldError('sort_order')"
      />

      <div class="grid gap-3 rounded-lg border border-border bg-white/3 p-4 sm:grid-cols-2">
        <label class="flex cursor-pointer items-start gap-3">
          <input v-model="form.is_featured" type="checkbox" class="mt-1 accent-primary" />
          <span>
            <span class="block text-sm font-semibold">Featured project</span>
            <span class="block text-xs leading-5 text-muted">Highlight it on the homepage.</span>
          </span>
        </label>

        <label class="flex cursor-pointer items-start gap-3">
          <input v-model="form.is_published" type="checkbox" class="mt-1 accent-primary" />
          <span>
            <span class="block text-sm font-semibold">Publish now</span>
            <span class="block text-xs leading-5 text-muted">Make it visible to visitors.</span>
          </span>
        </label>
      </div>
    </form>

    <template #footer>
      <BaseButton variant="ghost" :disabled="isSaving" @click="isFormModalOpen = false">
        Cancel
      </BaseButton>
      <BaseButton type="submit" form="project-form" :loading="isSaving">
        {{ isEditing ? 'Save changes' : 'Create project' }}
      </BaseButton>
    </template>
  </BaseModal>

  <BaseModal
    v-model="isDeleteModalOpen"
    title="Delete project?"
    :description="`This will permanently remove ${projectToDelete?.title || 'this project'} from your portfolio.`"
    size="sm"
    :close-on-backdrop="!isDeleting"
  >
    <div class="rounded-lg border border-danger/20 bg-danger/10 p-4 text-sm leading-6 text-danger">
      This action cannot be undone. The project will also disappear from the public portfolio if it
      is currently published.
    </div>

    <template #footer>
      <BaseButton variant="ghost" :disabled="isDeleting" @click="isDeleteModalOpen = false">
        Cancel
      </BaseButton>
      <BaseButton variant="danger" :loading="isDeleting" @click="deleteProject">
        Delete project
      </BaseButton>
    </template>
  </BaseModal>
</template>
