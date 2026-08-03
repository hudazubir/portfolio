<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { Pencil, Plus, Trash2, Wrench } from '@lucide/vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseModal from '@/components/BaseModal.vue'
import api from '@/services/api'

const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Design']
const skills = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const isDeleting = ref(false)
const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingSkillId = ref(null)
const skillToDelete = ref(null)
const errorMessage = ref('')
const successMessage = ref('')
const validationErrors = ref({})
const lastGeneratedSlug = ref('')

const isEditing = computed(() => editingSkillId.value !== null)
const modalTitle = computed(() => (isEditing.value ? 'Edit skill' : 'Add skill'))

const form = reactive({
  name: '',
  slug: '',
  category: 'Frontend',
  proficiency: 75,
  description: '',
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
  () => form.name,
  (name) => {
    if (!form.slug || form.slug === lastGeneratedSlug.value) {
      const slug = makeSlug(name)
      form.slug = slug
      lastGeneratedSlug.value = slug
    }
  },
)

function resetForm() {
  Object.assign(form, {
    name: '',
    slug: '',
    category: 'Frontend',
    proficiency: 75,
    description: '',
    is_featured: false,
    is_published: false,
    sort_order: 0,
  })
  validationErrors.value = {}
  lastGeneratedSlug.value = ''
}

function fieldError(field) {
  return validationErrors.value[field]?.[0] || ''
}

function openCreateModal() {
  resetForm()
  editingSkillId.value = null
  errorMessage.value = ''
  successMessage.value = ''
  isFormModalOpen.value = true
}

function openEditModal(skill) {
  resetForm()
  editingSkillId.value = skill.id
  Object.assign(form, {
    name: skill.name,
    slug: skill.slug,
    category: skill.category,
    proficiency: skill.proficiency,
    description: skill.description || '',
    is_featured: Boolean(skill.is_featured),
    is_published: Boolean(skill.is_published),
    sort_order: skill.sort_order ?? 0,
  })
  lastGeneratedSlug.value = skill.slug
  errorMessage.value = ''
  successMessage.value = ''
  isFormModalOpen.value = true
}

async function fetchSkills() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get('/api/admin/skills')
    skills.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to load skills.'
  } finally {
    isLoading.value = false
  }
}

async function saveSkill() {
  isSaving.value = true
  validationErrors.value = {}
  errorMessage.value = ''

  const payload = {
    ...form,
    proficiency: Number(form.proficiency),
    sort_order: Number(form.sort_order),
    description: form.description || null,
  }

  try {
    if (isEditing.value) {
      await api.put(`/api/admin/skills/${editingSkillId.value}`, payload)
    } else {
      await api.post('/api/admin/skills', payload)
    }

    successMessage.value = isEditing.value
      ? 'Skill updated successfully.'
      : 'Skill created successfully.'
    isFormModalOpen.value = false
    resetForm()
    await fetchSkills()
  } catch (error) {
    if (error.response?.status === 422) {
      validationErrors.value = error.response.data.errors || {}
      return
    }

    errorMessage.value = error.response?.data?.message || 'Unable to save the skill.'
  } finally {
    isSaving.value = false
  }
}

function openDeleteModal(skill) {
  skillToDelete.value = skill
  errorMessage.value = ''
  successMessage.value = ''
  isDeleteModalOpen.value = true
}

async function deleteSkill() {
  if (!skillToDelete.value) return

  isDeleting.value = true

  try {
    await api.delete(`/api/admin/skills/${skillToDelete.value.id}`)
    isDeleteModalOpen.value = false
    skillToDelete.value = null
    successMessage.value = 'Skill deleted successfully.'
    await fetchSkills()
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to delete the skill.'
  } finally {
    isDeleting.value = false
  }
}

onMounted(fetchSkills)
</script>

<template>
  <main class="px-5 py-8 sm:px-8 sm:py-10">
    <div class="mx-auto max-w-7xl">
      <header class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-semibold text-primary">Portfolio content</p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight">Skills</h1>
          <p class="mt-2 text-muted">Manage your technical skills and proficiency levels.</p>
        </div>

        <BaseButton @click="openCreateModal">
          <template #leading><Plus :size="17" aria-hidden="true" /></template>
          Add skill
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

      <p v-if="isLoading" class="mt-8 text-muted">Loading skills...</p>

      <div
        v-else-if="skills.length === 0"
        class="mt-8 rounded-xl border border-border bg-white/5 p-10 text-center"
      >
        <div class="mx-auto grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
          <Wrench :size="22" aria-hidden="true" />
        </div>
        <h2 class="mt-4 text-lg font-semibold">No skills yet</h2>
        <p class="mt-2 text-sm text-muted">Add the technologies you use confidently.</p>
        <BaseButton class="mt-5" size="sm" @click="openCreateModal">Add skill</BaseButton>
      </div>

      <div v-else class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="skill in skills"
          :key="skill.id"
          class="rounded-xl border border-border bg-white/5 p-5"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="font-semibold">{{ skill.name }}</h2>
                <span
                  v-if="skill.is_featured"
                  class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"
                >
                  Featured
                </span>
              </div>
              <p class="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
                {{ skill.category }}
              </p>
            </div>

            <span
              class="rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="
                skill.is_published ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              "
            >
              {{ skill.is_published ? 'Published' : 'Draft' }}
            </span>
          </div>

          <div class="mt-5">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted">Proficiency</span>
              <span class="font-semibold">{{ skill.proficiency }}%</span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-border">
              <div
                class="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                :style="{ width: `${skill.proficiency}%` }"
              />
            </div>
          </div>

          <p v-if="skill.description" class="mt-4 line-clamp-2 text-sm leading-6 text-muted">
            {{ skill.description }}
          </p>

          <div class="mt-5 flex gap-2 border-t border-border pt-4">
            <BaseButton variant="secondary" size="sm" @click="openEditModal(skill)">
              <template #leading><Pencil :size="15" aria-hidden="true" /></template>
              Edit
            </BaseButton>
            <BaseButton variant="danger" size="sm" @click="openDeleteModal(skill)">
              <template #leading><Trash2 :size="15" aria-hidden="true" /></template>
              Delete
            </BaseButton>
          </div>
        </article>
      </div>
    </div>
  </main>

  <BaseModal
    v-model="isFormModalOpen"
    :title="modalTitle"
    description="Set how this skill appears in your portfolio."
    size="lg"
    :close-on-backdrop="!isSaving"
  >
    <form id="skill-form" class="grid gap-5" @submit.prevent="saveSkill">
      <div class="grid gap-5 sm:grid-cols-2">
        <BaseInput
          v-model="form.name"
          label="Skill name"
          placeholder="Vue.js"
          :error="fieldError('name')"
          required
        />
        <BaseInput
          v-model="form.slug"
          label="Slug"
          placeholder="vue-js"
          :error="fieldError('slug')"
          required
        />
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div class="grid content-start gap-2">
          <label for="skill-category" class="text-sm font-medium">Category *</label>
          <select
            id="skill-category"
            v-model="form.category"
            class="min-h-11 rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-accent focus:ring-3 focus:ring-accent/15"
          >
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <p v-if="fieldError('category')" class="text-sm text-danger">
            {{ fieldError('category') }}
          </p>
        </div>

        <BaseInput
          v-model="form.sort_order"
          type="number"
          min="0"
          label="Sort order"
          hint="Lower numbers appear first."
          :error="fieldError('sort_order')"
        />
      </div>

      <div class="grid gap-2">
        <div class="flex items-center justify-between">
          <label for="skill-proficiency" class="text-sm font-medium">Proficiency</label>
          <span class="text-sm font-semibold text-primary">{{ form.proficiency }}%</span>
        </div>
        <input
          id="skill-proficiency"
          v-model.number="form.proficiency"
          type="range"
          min="0"
          max="100"
          step="5"
          class="w-full accent-primary"
        />
        <p v-if="fieldError('proficiency')" class="text-sm text-danger">
          {{ fieldError('proficiency') }}
        </p>
      </div>

      <div class="grid gap-2">
        <label for="skill-description" class="text-sm font-medium">Description</label>
        <textarea
          id="skill-description"
          v-model="form.description"
          rows="4"
          maxlength="1000"
          placeholder="How do you use this skill in real projects?"
          class="w-full resize-y rounded-md border border-border bg-surface px-3 py-3 text-sm outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-3 focus:ring-accent/15"
        />
        <p v-if="fieldError('description')" class="text-sm text-danger">
          {{ fieldError('description') }}
        </p>
      </div>

      <div class="grid gap-3 rounded-lg border border-border bg-white/3 p-4 sm:grid-cols-2">
        <label class="flex cursor-pointer items-start gap-3">
          <input v-model="form.is_featured" type="checkbox" class="mt-1 accent-primary" />
          <span>
            <span class="block text-sm font-semibold">Featured skill</span>
            <span class="block text-xs leading-5 text-muted">Give it stronger emphasis.</span>
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
      <BaseButton type="submit" form="skill-form" :loading="isSaving">
        {{ isEditing ? 'Save changes' : 'Add skill' }}
      </BaseButton>
    </template>
  </BaseModal>

  <BaseModal
    v-model="isDeleteModalOpen"
    title="Delete skill?"
    :description="`This will permanently remove ${skillToDelete?.name || 'this skill'}.`"
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
      <BaseButton variant="danger" :loading="isDeleting" @click="deleteSkill">
        Delete skill
      </BaseButton>
    </template>
  </BaseModal>
</template>
