<script setup lang="ts">
import { computed } from 'vue';
import tokens from '../../dist/js/theme.js';
import darkTokens from '../../dist/js/theme.dark.js';

interface Props {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  title?: string;
  dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  dismissible: false,
});

const emit = defineEmits<{
  dismiss: [];
}>();

const visible = defineModel<boolean>('visible', { default: true });

const mode = computed(() => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('yyc3-theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
});

const currentTokens = computed(() => mode.value === 'dark' ? darkTokens : tokens);

const alertStyle = computed(() => {
  const styles: Record<string, string> = {
    padding: '1rem',
    borderRadius: currentTokens.value['radius.default'] as string || '0.5rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    fontSize: currentTokens.value['font-size.body'] as string || '1rem',
    fontFamily: currentTokens.value['typography.font-sans'] as string || 'system-ui',
  };

  switch (props.variant) {
    case 'default':
      styles.backgroundColor = currentTokens.value['color.muted'] as string || '#f8f9ef';
      styles.color = currentTokens.value['color.foreground'] as string || '#000';
      styles.border = `1px solid ${currentTokens.value['color.border'] as string || '#e5e5e5'}`;
      break;
    case 'destructive':
      styles.backgroundColor = currentTokens.value['color.error'] as string || '#ef4444';
      styles.color = currentTokens.value['color.error-foreground'] as string || '#fff';
      break;
    case 'success':
      styles.backgroundColor = currentTokens.value['color.success'] as string || '#10b981';
      styles.color = '#fff';
      break;
    case 'warning':
      styles.backgroundColor = currentTokens.value['color.warning'] as string || '#f59e0b';
      styles.color = '#fff';
      break;
  }

  return styles;
});

const iconMap = {
  default: 'ℹ️',
  destructive: '⚠️',
  success: '✅',
  warning: '🔔',
};

const icon = computed(() => iconMap[props.variant]);

const handleDismiss = () => {
  visible.value = false;
  emit('dismiss');
};
</script>

<template>
  <div v-if="visible" :style="alertStyle">
    <span class="alert-icon">{{ icon }}</span>
    <div class="alert-content">
      <div v-if="title" class="alert-title">{{ title }}</div>
      <slot />
    </div>
    <button
      v-if="dismissible"
      class="alert-dismiss"
      @click="handleDismiss"
      aria-label="关闭"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.alert-icon {
  font-size: 1.25rem;
  line-height: 1;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.alert-dismiss {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0;
  margin-left: auto;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.alert-dismiss:hover {
  opacity: 1;
}
</style>
