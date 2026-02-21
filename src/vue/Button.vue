<script setup lang="ts">
import { computed } from 'vue';
import tokens from '../../dist/js/theme.js';
import darkTokens from '../../dist/js/theme.dark.js';

interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
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

const buttonStyle = computed(() => {
  const styles: Record<string, string | number> = {
    padding: '0.5rem 1rem',
    borderRadius: currentTokens.value['radius.default'] as string || '0.5rem',
    border: 'none',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    opacity: props.disabled ? 0.5 : 1,
    fontSize: currentTokens.value['font-size.body'] as string || '1rem',
    fontFamily: currentTokens.value['typography.font-sans'] as string || 'system-ui',
    transition: 'all 0.2s ease',
  };

  switch (props.variant) {
    case 'default':
      styles.backgroundColor = currentTokens.value['color.primary'] as string || '#d45a5f';
      styles.color = currentTokens.value['color.foreground'] as string || '#fff';
      break;
    case 'destructive':
      styles.backgroundColor = currentTokens.value['color.destructive'] as string || '#e05a3f';
      styles.color = currentTokens.value['color.foreground'] as string || '#fff';
      break;
    case 'outline':
      styles.backgroundColor = 'transparent';
      styles.color = currentTokens.value['color.primary'] as string || '#d45a5f';
      styles.border = `1px solid ${currentTokens.value['color.primary'] as string || '#d45a5f'}`;
      break;
    case 'secondary':
      styles.backgroundColor = currentTokens.value['color.muted-foreground'] as string || '#ccc';
      styles.color = currentTokens.value['color.foreground'] as string || '#fbfbfc';
      break;
    case 'ghost':
      styles.backgroundColor = 'transparent';
      styles.color = currentTokens.value['color.foreground'] as string || '#000';
      break;
    case 'link':
      styles.backgroundColor = 'transparent';
      styles.color = currentTokens.value['color.primary'] as string || '#d45a5f';
      styles.textDecoration = 'underline';
      styles.padding = '0';
      break;
  }

  switch (props.size) {
    case 'sm':
      styles.padding = '0.25rem 0.5rem';
      styles.fontSize = '0.875rem';
      break;
    case 'lg':
      styles.padding = '0.75rem 1.5rem';
      styles.fontSize = '1.125rem';
      break;
    case 'icon':
      styles.padding = '0.5rem';
      break;
  }

  return styles;
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    :style="buttonStyle"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
