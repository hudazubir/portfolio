<script setup>
import { computed } from 'vue'

const props = defineProps({
  as: {
    type: String,
    default: 'article',
    validator: (value) => ['article', 'div', 'section', 'aside'].includes(value),
  },
  variant: {
    type: String,
    default: 'surface',
    validator: (value) => ['surface', 'outline', 'glass'].includes(value),
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value),
  },
  hoverable: {
    type: Boolean,
    default: false,
  },
})

const variantClasses = {
  surface: 'border border-border bg-surface shadow-soft',
  outline: 'border border-border bg-transparent',
  glass: 'border border-white/10 bg-white/5 shadow-soft backdrop-blur-xl',
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const cardClasses = computed(() => [
  'overflow-hidden rounded-xl',
  variantClasses[props.variant],
  paddingClasses[props.padding],
  props.hoverable &&
    'transition duration-300 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow motion-reduce:transform-none motion-reduce:transition-none',
])
</script>

<template>
  <component :is="as" :class="cardClasses">
    <header v-if="$slots.header" class="mb-5">
      <slot name="header" />
    </header>

    <slot />

    <footer v-if="$slots.footer" class="mt-6 border-t border-border pt-5">
      <slot name="footer" />
    </footer>
  </component>
</template>
