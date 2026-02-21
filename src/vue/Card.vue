<script setup lang="ts">
import { computed } from 'vue';
import tokens from '../../dist/js/theme.js';
import darkTokens from '../../dist/js/theme.dark.js';

const mode = computed(() => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('yyc3-theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
});

const currentTokens = computed(() => mode.value === 'dark' ? darkTokens : tokens);

const cardStyle = computed(() => ({
  backgroundColor: currentTokens.value['color.card'] as string || '#f8f9ef',
  borderRadius: currentTokens.value['radius.lg'] as string || '0.5rem',
  boxShadow: `0 6px 20px -4px ${currentTokens.value['shadow.card'] as string}`,
  padding: '1.5rem',
  transition: 'all 0.2s ease',
}));
</script>

<template>
  <div :style="cardStyle">
    <slot />
  </div>
</template>
