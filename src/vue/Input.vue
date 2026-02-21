<script setup lang="ts">
import { computed } from 'vue';
import tokens from '../../dist/js/theme.js';
import darkTokens from '../../dist/js/theme.dark.js';

interface Props {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  disabled?: boolean;
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const mode = computed(() => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('yyc3-theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
});

const currentTokens = computed(() => mode.value === 'dark' ? darkTokens : tokens);

const inputStyle = computed(() => ({
  width: '100%',
  padding: '0.5rem 0.75rem',
  borderRadius: currentTokens.value['radius.md'] as string || '0.25rem',
  border: `1px solid ${currentTokens.value['color.muted-foreground'] as string || '#ccc'}`,
  backgroundColor: currentTokens.value['color.background'] as string || '#fbfbfc',
  color: currentTokens.value['color.foreground'] as string || '#000',
  fontSize: currentTokens.value['font-size.body'] as string || '1rem',
  fontFamily: currentTokens.value['typography.font-sans'] as string || 'system-ui',
  opacity: props.disabled ? 0.5 : 1,
  transition: 'all 0.2s ease',
  outline: 'none',
}));

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :value="modelValue"
    :style="inputStyle"
    @input="handleInput"
  />
</template>
