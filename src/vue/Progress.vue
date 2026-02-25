<script setup lang="ts">
import { computed } from 'vue';
import tokens from '../../dist/js/theme.js';
import darkTokens from '../../dist/js/theme.dark.js';

interface Props {
  value?: number;
  max?: number;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  max: 100,
  showValue: false,
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

const containerStyle = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  fontSize: currentTokens.value['font-size.body'] as string || '1rem',
  fontFamily: currentTokens.value['typography.font-sans'] as string || 'system-ui',
}));

const barStyle = computed(() => ({
  flex: '1',
  height: '0.5rem',
  backgroundColor: currentTokens.value['color.muted'] as string || '#e5e7eb',
  borderRadius: currentTokens.value['radius.sm'] as string || '0.25rem',
  overflow: 'hidden',
}));

const fillStyle = computed(() => {
  const styles: Record<string, string> = {
    height: '100%',
    borderRadius: currentTokens.value['radius.sm'] as string || '0.25rem',
    transition: 'width 0.3s ease',
  };

  switch (props.variant) {
    case 'default':
      styles.backgroundColor = currentTokens.value['color.primary'] as string || '#d45a5f';
      break;
    case 'success':
      styles.backgroundColor = currentTokens.value['color.success'] as string || '#10b981';
      break;
    case 'warning':
      styles.backgroundColor = currentTokens.value['color.warning'] as string || '#f59e0b';
      break;
    case 'error':
      styles.backgroundColor = currentTokens.value['color.error'] as string || '#ef4444';
      break;
  }

  return styles;
});

const percentage = computed(() => {
  return Math.min(100, Math.max(0, (props.value / props.max) * 100));
});

const valueStyle = computed(() => ({
  color: currentTokens.value['color.foreground'] as string || '#000',
  fontWeight: '600',
  minWidth: '3rem',
  textAlign: 'right' as const,
}));
</script>

<template>
  <div :style="containerStyle">
    <div :style="barStyle">
      <div :style="fillStyle" :style="{ width: percentage + '%' }"></div>
    </div>
    <span v-if="showValue" :style="valueStyle">{{ Math.round(percentage) }}%</span>
  </div>
</template>
