<script setup>
import { computed, onMounted, ref } from 'vue'
import { CheckCheck, Inbox, Mail, RefreshCw } from '@lucide/vue'
import BaseBadge from '@/components/BaseBadge.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import api from '@/services/api'

const messages = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const unreadCount = computed(() => messages.value.filter((message) => !message.is_read).length)

const dateFormatter = new Intl.DateTimeFormat('en-MY', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function formatDate(value) {
  return dateFormatter.format(new Date(value))
}

async function fetchMessages() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get('/api/admin/contact-messages')
    messages.value = response.data.data
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to load messages from the server.'
  } finally {
    isLoading.value = false
  }
}

async function markAsRead(message) {
  if (message.is_read) return

  try {
    const response = await api.patch(`/api/admin/contact-messages/${message.id}/read`)
    Object.assign(message, response.data.message)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'The message could not be marked as read.'
  }
}

onMounted(fetchMessages)
</script>

<template>
  <main class="px-5 py-8 sm:px-8 sm:py-10">
    <div class="mx-auto max-w-7xl">
      <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-semibold text-primary">Inbox</p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight">Contact messages</h1>
          <p class="mt-2 text-muted">Review enquiries submitted through the public portfolio.</p>
        </div>

        <div class="flex items-center gap-3">
          <BaseBadge :tone="unreadCount ? 'accent' : 'neutral'" dot>
            {{ unreadCount }} unread
          </BaseBadge>
          <BaseButton variant="secondary" size="sm" :loading="isLoading" @click="fetchMessages">
            <template #leading>
              <RefreshCw :size="15" aria-hidden="true" />
            </template>
            Refresh
          </BaseButton>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="mt-8 rounded-md border border-danger/20 bg-danger/10 p-4 text-sm text-danger"
        role="alert"
      >
        {{ errorMessage }}
      </div>

      <div v-if="isLoading" class="mt-8 grid gap-4" aria-label="Loading messages">
        <div
          v-for="index in 3"
          :key="index"
          class="h-44 animate-pulse rounded-xl border border-border bg-surface motion-reduce:animate-none"
        />
      </div>

      <BaseCard v-else-if="!messages.length" variant="outline" class="mt-8 text-center">
        <Inbox :size="30" class="mx-auto text-muted" aria-hidden="true" />
        <h2 class="mt-4 text-lg font-semibold">Your inbox is empty</h2>
        <p class="mt-2 text-sm text-muted">
          New portfolio enquiries will appear here automatically.
        </p>
      </BaseCard>

      <ul v-else class="mt-8 grid gap-4">
        <li v-for="message in messages" :key="message.id">
          <BaseCard
            :variant="message.is_read ? 'outline' : 'glass'"
            :class="!message.is_read && 'border-primary/30'"
          >
            <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-3">
                  <BaseBadge :tone="message.is_read ? 'neutral' : 'primary'" size="sm">
                    {{ message.is_read ? 'Read' : 'New' }}
                  </BaseBadge>
                  <time class="text-xs text-muted" :datetime="message.created_at">
                    {{ formatDate(message.created_at) }}
                  </time>
                </div>

                <h2 class="mt-4 text-lg font-semibold">{{ message.subject }}</h2>
                <p class="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted">
                  {{ message.message }}
                </p>

                <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <span class="font-medium text-foreground">{{ message.name }}</span>
                  <a
                    :href="`mailto:${message.email}`"
                    class="inline-flex items-center gap-2 text-muted transition hover:text-accent motion-reduce:transition-none"
                  >
                    <Mail :size="15" aria-hidden="true" />
                    {{ message.email }}
                  </a>
                </div>
              </div>

              <BaseButton
                v-if="!message.is_read"
                variant="secondary"
                size="sm"
                class="shrink-0"
                @click="markAsRead(message)"
              >
                <template #leading>
                  <CheckCheck :size="16" aria-hidden="true" />
                </template>
                Mark as read
              </BaseButton>
            </div>
          </BaseCard>
        </li>
      </ul>
    </div>
  </main>
</template>
