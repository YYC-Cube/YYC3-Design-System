<script setup lang="ts">
import { computed } from 'vue';
import tokens from '../../dist/js/theme.js';
import darkTokens from '../../dist/js/theme.dark.js';

interface Props {
  modelValue?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  indeterminate: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
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

const checkboxStyle = computed(() => {
  const styles: Record<string, string> = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    opacity: props.disabled ? 0.5 : 1,
    fontSize: currentTokens.value['font-size.body'] as string || '1rem',
    fontFamily: currentTokens.value['typography.font-sans'] as string || 'system-ui',
  };

  return styles;
});

const inputStyle = computed(() => {
  const styles: Record<string, string> = {
    width: '1.125rem',
    height: '1.125rem',
    borderRadius: currentTokens.value['radius.sm'] as string || '0.25rem',
    border: `2px solid ${currentTokens.value['color.primary'] as string || '#d45a5f'}`,
    backgroundColor: props.modelValue ? currentTokens.value['color.primary'] as string || '#d45a5f' : 'transparent',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  return styles;
});

const checkStyle = computed(() => ({
  color: '#fff',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  display: props.modelValue ? 'block' : 'none',
}));

const labelStyle = computed(() => ({
  color: currentTokens.value['color.foreground'] as string || '#000',
}));

const handleClick = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
  }
};
</script>

<template>
  <div :style="checkboxStyle" @click="handleClick">
    <div :style="inputStyle">
      <span v-if="modelValue" :style="checkStyle">✓</span>
    </div>
    <span v-if="label" :style="labelStyle">{{ label }}</span>
  </div>
</template>
<style scoped>
input {
  display: none;
}
</style>
