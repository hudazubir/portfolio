<script setup>
import { computed, useId } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  id: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) =>
      ['text', 'email', 'password', 'url', 'search', 'tel', 'number'].includes(value),
  },
  placeholder: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const model = defineModel({
  type: [String, Number],
  default: '',
})

const generatedId = useId()
const inputId = computed(() => props.id || generatedId)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
const describedBy = computed(() => {
  if (props.error) return errorId.value
  if (props.hint) return hintId.value
  return undefined
})
</script>

<template>
  <div class="grid gap-2">
    <label :for="inputId" class="text-sm font-medium text-foreground">
      {{ label }}
      <span v-if="required" class="text-danger" aria-hidden="true">*</span>
    </label>

    <div class="relative">
      <div
        v-if="$slots.leading"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted"
      >
        <slot name="leading" />
      </div>

      <input
        :id="inputId"
        v-model="model"
        v-bind="$attrs"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        class="min-h-11 w-full rounded-md border bg-surface px-3 text-sm text-foreground transition placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
        :class="[
          error ? 'border-danger' : 'border-border',
          $slots.leading && 'pl-10',
          $slots.trailing && 'pr-10',
        ]"
      />

      <div
        v-if="$slots.trailing"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-muted"
      >
        <slot name="trailing" />
      </div>
    </div>

    <p v-if="error" :id="errorId" class="text-sm text-danger" aria-live="polite">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="hintId" class="text-sm text-muted">
      {{ hint }}
    </p>
  </div>
</template>
