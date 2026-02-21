<script setup lang="ts">
import { computed } from 'vue';
import tokens from '../../dist/js/theme.js';
import darkTokens from '../../dist/js/theme.dark.js';

interface Props {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
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

const sizeStyles = computed(() => {
  const sizes: Record<string, { width: string; height: string; fontSize: string }> = {
    sm: { width: '2rem', height: '2rem', fontSize: '0.75rem' },
    md: { width: '3rem', height: '3rem', fontSize: '1rem' },
    lg: { width: '4rem', height: '4rem', fontSize: '1.25rem' },
    xl: { width: '5rem', height: '5rem', fontSize: '1.5rem' },
  };
  return sizes[props.size];
});

const avatarStyle = computed(() => ({
  ...sizeStyles.value,
  borderRadius: '50%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: currentTokens.value['color.muted-foreground'] as string || '#ccc',
  color: currentTokens.value['color.foreground'] as string || '#000',
  fontWeight: '500',
  transition: 'all 0.2s ease',
}));

const imageStyle = computed(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const,
}));

const showFallback = computed(() => !props.src);
</script>

<template>
  <div :style="avatarStyle">
    <img v-if="!showFallback" :src="src" :alt="alt" :style="imageStyle" />
    <span v-if="showFallback">{{ fallback }}</span>
  </div>
</template>
