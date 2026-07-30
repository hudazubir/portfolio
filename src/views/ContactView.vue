<script setup>
import { computed, reactive, ref } from 'vue'
import { CheckCircle2, Clock3, Mail, MapPin, MessageSquareText, Send } from '@lucide/vue'
import BaseBadge from '@/components/BaseBadge.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import api from '@/services/api'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const isSubmitted = ref(false)
const isSubmitting = ref(false)
const submissionError = ref('')

const messageCount = computed(() => form.message.length)

function validateForm() {
  errors.name = form.name.trim() ? '' : 'Please enter your name.'
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email address.'
  errors.subject = form.subject.trim() ? '' : 'Please add a short subject.'
  errors.message =
    form.message.trim().length >= 20 ? '' : 'Tell me a little more—at least 20 characters.'

  return !Object.values(errors).some(Boolean)
}

async function submitForm() {
  isSubmitted.value = false
  submissionError.value = ''
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    await api.post('/api/contact-messages', form)
    isSubmitted.value = true
  } catch (error) {
    const validationErrors = error.response?.data?.errors

    errors.name = validationErrors?.name?.[0] || ''
    errors.email = validationErrors?.email?.[0] || ''
    errors.subject = validationErrors?.subject?.[0] || ''
    errors.message = validationErrors?.message?.[0] || ''

    if (!Object.values(errors).some(Boolean)) {
      submissionError.value =
        error.response?.data?.message ||
        'Your message could not be sent. Please try again in a moment.'
    }
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  Object.assign(form, {
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
  submissionError.value = ''
  isSubmitted.value = false
}
</script>

<template>
  <div>
    <section class="relative isolate border-b border-border">
      <div
        class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgb(139_92_246_/_0.16),transparent_30rem),radial-gradient(circle_at_80%_30%,rgb(34_211_238_/_0.1),transparent_28rem)]"
        aria-hidden="true"
      />
      <div class="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <BaseBadge tone="success" dot>Open to thoughtful work</BaseBadge>
        <h1 class="mt-7 max-w-4xl text-balance text-4xl font-bold tracking-[-0.04em] sm:text-6xl">
          Let’s make the next product
          <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            clearer and stronger.
          </span>
        </h1>
        <p class="mt-7 max-w-3xl text-lg leading-8 text-muted">
          Share what you are building, where the difficult parts are, and what a successful outcome
          looks like. A focused message is enough to start.
        </p>
      </div>
    </section>

    <section class="mx-auto grid max-w-7xl gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[0.72fr_1.28fr]">
      <aside>
        <BaseBadge tone="accent">Contact details</BaseBadge>
        <h2 class="mt-5 text-3xl font-bold tracking-tight">Start with context.</h2>
        <p class="mt-4 leading-7 text-muted">
          A useful first message usually includes the product stage, the problem, the timeline, and
          where you need help.
        </p>

        <div class="mt-8 grid gap-4">
          <BaseCard variant="outline">
            <div class="flex items-start gap-4">
              <div
                class="grid size-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary"
              >
                <Mail :size="19" aria-hidden="true" />
              </div>
              <div>
                <p class="text-sm text-muted">Email</p>
                <a
                  href="mailto:hello@example.com"
                  class="mt-1 inline-block font-semibold transition hover:text-accent motion-reduce:transition-none"
                >
                  hello@example.com
                </a>
              </div>
            </div>
          </BaseCard>

          <BaseCard variant="outline">
            <div class="flex items-start gap-4">
              <div
                class="grid size-10 shrink-0 place-items-center rounded-md bg-accent/10 text-accent"
              >
                <MapPin :size="19" aria-hidden="true" />
              </div>
              <div>
                <p class="text-sm text-muted">Location</p>
                <p class="mt-1 font-semibold">Malaysia · Remote friendly</p>
              </div>
            </div>
          </BaseCard>

          <BaseCard variant="outline">
            <div class="flex items-start gap-4">
              <div
                class="grid size-10 shrink-0 place-items-center rounded-md bg-success/10 text-success"
              >
                <Clock3 :size="19" aria-hidden="true" />
              </div>
              <div>
                <p class="text-sm text-muted">Typical response</p>
                <p class="mt-1 font-semibold">Within two working days</p>
              </div>
            </div>
          </BaseCard>
        </div>
      </aside>

      <BaseCard variant="glass" padding="lg">
        <template #header>
          <div class="flex items-start gap-4">
            <div
              class="grid size-11 shrink-0 place-items-center rounded-md bg-primary/10 text-primary"
            >
              <MessageSquareText :size="21" aria-hidden="true" />
            </div>
            <div>
              <h2 class="text-xl font-semibold">Tell me about the project</h2>
              <p class="mt-1 text-sm text-muted">All fields are required.</p>
            </div>
          </div>
        </template>

        <div
          v-if="isSubmitted"
          class="rounded-lg border border-success/20 bg-success/10 p-6"
          role="status"
        >
          <CheckCircle2 :size="28" class="text-success" aria-hidden="true" />
          <h3 class="mt-4 text-lg font-semibold">Message received.</h3>
          <p class="mt-2 text-sm leading-6 text-muted">
            Thanks for reaching out. Your message is now safely recorded and ready for review.
          </p>
          <BaseButton class="mt-5" variant="secondary" size="sm" @click="resetForm">
            Write another message
          </BaseButton>
        </div>

        <form v-else class="grid gap-5" novalidate @submit.prevent="submitForm">
          <div
            v-if="submissionError"
            class="rounded-md border border-danger/20 bg-danger/10 p-3 text-sm text-danger"
            role="alert"
          >
            {{ submissionError }}
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <BaseInput
              v-model="form.name"
              label="Your name"
              name="name"
              autocomplete="name"
              placeholder="Jane Smith"
              :error="errors.name"
              required
            />
            <BaseInput
              v-model="form.email"
              label="Email address"
              name="email"
              type="email"
              autocomplete="email"
              placeholder="jane@company.com"
              :error="errors.email"
              required
            />
          </div>

          <BaseInput
            v-model="form.subject"
            label="Subject"
            name="subject"
            placeholder="Vue product development"
            :error="errors.subject"
            required
          />

          <div class="grid gap-2">
            <label for="contact-message" class="text-sm font-medium text-foreground">
              Project details
              <span class="text-danger" aria-hidden="true">*</span>
            </label>
            <textarea
              id="contact-message"
              v-model="form.message"
              name="message"
              rows="7"
              maxlength="1000"
              placeholder="What are you building, and where could I help?"
              required
              :aria-invalid="errors.message ? 'true' : undefined"
              :aria-describedby="errors.message ? 'contact-message-error' : 'contact-message-hint'"
              class="w-full resize-y rounded-md border bg-surface px-3 py-3 text-sm text-foreground transition placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/15 motion-reduce:transition-none"
              :class="errors.message ? 'border-danger' : 'border-border'"
            />
            <div class="flex items-start justify-between gap-4">
              <p
                v-if="errors.message"
                id="contact-message-error"
                class="text-sm text-danger"
                aria-live="polite"
              >
                {{ errors.message }}
              </p>
              <p v-else id="contact-message-hint" class="text-sm text-muted">
                Include goals, constraints, and timing if known.
              </p>
              <p class="shrink-0 text-xs text-muted">{{ messageCount }}/1000</p>
            </div>
          </div>

          <div
            class="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <p class="max-w-md text-xs leading-5 text-muted">
              Your details are used only to review and respond to this enquiry.
            </p>
            <BaseButton type="submit" :loading="isSubmitting">
              <template #leading>
                <Send :size="16" aria-hidden="true" />
              </template>
              Send message
            </BaseButton>
          </div>
        </form>
      </BaseCard>
    </section>
  </div>
</template>
