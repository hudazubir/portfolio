<script setup>
import { computed } from 'vue'

const props = defineProps({
  tone: {
    type: String,
    default: 'neutral',
    validator: (value) =>
      ['neutral', 'primary', 'accent', 'success', 'warning', 'danger'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md'].includes(value),
  },
  dot: {
    type: Boolean,
    default: false,
  },
})

const toneClasses = {
  neutral: 'border-border bg-surface-raised text-muted',
  primary: 'border-primary/20 bg-primary/10 text-primary',
  accent: 'border-accent/20 bg-accent/10 text-accent',
  success: 'border-success/20 bg-success/10 text-success',
  warning: 'border-warning/20 bg-warning/10 text-warning',
  danger: 'border-danger/20 bg-danger/10 text-danger',
}

const dotClasses = {
  neutral: 'bg-muted',
  primary: 'bg-primary',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
}

const sizeClasses = {
  sm: 'min-h-5 gap-1.5 px-2 text-xs',
  md: 'min-h-6 gap-2 px-2.5 text-xs',
}

const badgeClasses = computed(() => [
  'inline-flex w-fit items-center rounded-full border font-medium',
  toneClasses[props.tone],
  sizeClasses[props.size],
])
</script>

<template>
  <span :class="badgeClasses">
    <span v-if="dot" class="size-1.5 shrink-0 rounded-full" :class="dotClasses[tone]" />
    <slot />
  </span>
</template>
