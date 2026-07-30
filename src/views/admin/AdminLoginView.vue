<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, LockKeyhole, ShieldCheck } from '@lucide/vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const generalError = ref('')

function validateForm() {
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email address.'
  errors.password = form.password ? '' : 'Enter your password.'

  return !errors.email && !errors.password
}

async function submitLogin() {
  generalError.value = ''
  if (!validateForm()) return

  try {
    await auth.login(form)

    const redirect =
      typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/admin')
        ? route.query.redirect
        : '/admin'

    await router.push(redirect)
  } catch (error) {
    const validationErrors = error.response?.data?.errors
    errors.email = validationErrors?.email?.[0] || ''
    errors.password = validationErrors?.password?.[0] || ''

    if (!errors.email && !errors.password) {
      generalError.value =
        error.response?.data?.message ||
        'Unable to connect to the admin service. Check that Laravel is running.'
    }
  }
}
</script>

<template>
  <main class="relative isolate grid min-h-screen place-items-center px-5 py-12">
    <div
      class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_15%,rgb(139_92_246_/_0.18),transparent_30rem),radial-gradient(circle_at_75%_80%,rgb(34_211_238_/_0.1),transparent_28rem)]"
      aria-hidden="true"
    />

    <div class="w-full max-w-md">
      <RouterLink
        to="/"
        class="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-foreground motion-reduce:transition-none"
      >
        <ArrowLeft :size="16" aria-hidden="true" />
        Back to portfolio
      </RouterLink>

      <BaseCard variant="glass" padding="lg">
        <template #header>
          <div class="flex items-start gap-4">
            <div
              class="grid size-11 shrink-0 place-items-center rounded-md bg-primary text-white shadow-glow"
            >
              <ShieldCheck :size="22" aria-hidden="true" />
            </div>
            <div>
              <p class="text-sm font-semibold text-primary">DevVault Admin</p>
              <h1 class="mt-1 text-2xl font-bold">Welcome back</h1>
            </div>
          </div>
        </template>

        <p class="mb-6 text-sm leading-6 text-muted">
          Sign in with the administrator account stored in Laravel.
        </p>

        <div
          v-if="generalError"
          class="mb-5 rounded-md border border-danger/20 bg-danger/10 p-3 text-sm text-danger"
          role="alert"
        >
          {{ generalError }}
        </div>

        <form class="grid gap-5" novalidate @submit.prevent="submitLogin">
          <BaseInput
            v-model="form.email"
            label="Email address"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            :error="errors.email"
            required
          />

          <BaseInput
            v-model="form.password"
            label="Password"
            name="password"
            type="password"
            autocomplete="current-password"
            placeholder="Enter your password"
            :error="errors.password"
            required
          >
            <template #leading>
              <LockKeyhole :size="17" aria-hidden="true" />
            </template>
          </BaseInput>

          <BaseButton type="submit" block :loading="auth.isLoading">Sign in</BaseButton>
        </form>
      </BaseCard>
    </div>
  </main>
</template>
