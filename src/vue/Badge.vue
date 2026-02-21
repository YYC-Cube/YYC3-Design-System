<script setup lang="ts">
import { computed } from 'vue';
import tokens from '../../dist/js/theme.js';
import darkTokens from '../../dist/js/theme.dark.js';

interface Props {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
});

const mode = computed(() => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('yyc3-theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
});

const currentTokens = computed(() => mode.value === 'dark' ? darkTokens : tokens);

const badgeStyle = computed(() => {
  const styles: Record<string, string> = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.75rem',
    borderRadius: currentTokens.value['radius.sm'] as string || '0.125rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  };

  switch (props.variant) {
    case 'default':
      styles.backgroundColor = currentTokens.value['color.primary'] as string || '#d45a5f';
      styles.color = currentTokens.value['color.foreground'] as string || '#fff';
      break;
    case 'secondary':
      styles.backgroundColor = currentTokens.value['color.muted-foreground'] as string || '#ccc';
      styles.color = currentTokens.value['color.background'] as string || '#fbfbfc';
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
  }

  return styles;
});
</script>

<template>
  <span :style="badgeStyle">
    <slot />
  </span>
</template>
