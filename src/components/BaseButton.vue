<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost', 'danger'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
})

const variantClasses = {
  primary: 'bg-primary text-white shadow-soft hover:bg-primary-hover hover:shadow-glow',
  secondary:
    'border border-border bg-surface-raised text-foreground hover:border-primary/60 hover:bg-surface',
  ghost: 'bg-transparent text-muted hover:bg-white/5 hover:text-foreground',
  danger: 'bg-danger text-white shadow-soft hover:bg-danger/90',
}

const sizeClasses = {
  sm: 'min-h-9 gap-1.5 rounded-sm px-3 text-sm',
  md: 'min-h-11 gap-2 rounded-md px-4 text-sm',
  lg: 'min-h-13 gap-2.5 rounded-lg px-6 text-base',
}

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center font-semibold transition duration-200 ease-out',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'motion-reduce:transition-none',
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.block && 'w-full',
])

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="isDisabled"
    :aria-busy="loading || undefined"
  >
    <svg
      v-if="loading"
      class="size-4 animate-spin motion-reduce:animate-none"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" />
      <path
        class="opacity-90"
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>

    <slot v-if="!loading" name="leading" />
    <slot />
    <slot v-if="!loading" name="trailing" />
  </button>
</template>
