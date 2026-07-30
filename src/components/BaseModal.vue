<script setup>
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
})

const isOpen = defineModel({
  type: Boolean,
  default: false,
})

const dialog = ref(null)
const titleId = useId()
const descriptionId = useId()
const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
}

let previouslyFocusedElement
let previousBodyOverflow = ''

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function close() {
  isOpen.value = false
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) close()
}

function handleDocumentKeydown(event) {
  if (event.key === 'Escape') close()
}

function trapFocus(event) {
  if (event.key !== 'Tab') return

  const focusableElements = [...dialog.value.querySelectorAll(focusableSelector)]
  const firstElement = focusableElements[0]
  const lastElement = focusableElements.at(-1)

  if (!firstElement) {
    event.preventDefault()
    dialog.value.focus()
    return
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

watch(isOpen, async (open) => {
  if (open) {
    previouslyFocusedElement = document.activeElement
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleDocumentKeydown)

    await nextTick()
    const firstFocusableElement = dialog.value.querySelector(focusableSelector)
    ;(firstFocusableElement || dialog.value).focus()
    return
  }

  document.body.style.overflow = previousBodyOverflow
  document.removeEventListener('keydown', handleDocumentKeydown)
  previouslyFocusedElement?.focus()
})

onBeforeUnmount(() => {
  document.body.style.overflow = previousBodyOverflow
  document.removeEventListener('keydown', handleDocumentKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
        @mousedown.self="handleBackdropClick"
      >
        <section
          ref="dialog"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="description ? descriptionId : undefined"
          :class="sizeClasses[size]"
          class="my-8 w-full rounded-xl border border-white/10 bg-surface-raised shadow-soft outline-none"
          tabindex="-1"
          @keydown="trapFocus"
        >
          <header class="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
            <div>
              <h2 :id="titleId" class="text-lg font-semibold text-foreground">
                {{ title }}
              </h2>
              <p v-if="description" :id="descriptionId" class="mt-1 text-sm text-muted">
                {{ description }}
              </p>
            </div>

            <button
              type="button"
              class="grid size-9 shrink-0 place-items-center rounded-md text-muted transition hover:bg-white/5 hover:text-foreground motion-reduce:transition-none"
              aria-label="Close dialog"
              @click="close"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
                class="size-5"
              >
                <path d="m6 6 12 12M18 6 6 18" stroke-linecap="round" />
              </svg>
            </button>
          </header>

          <div class="px-6 py-5">
            <slot />
          </div>

          <footer
            v-if="$slots.footer"
            class="flex flex-wrap justify-end gap-3 border-t border-border px-6 py-4"
          >
            <slot name="footer" :close="close" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
