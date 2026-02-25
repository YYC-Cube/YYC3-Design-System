<script setup lang="ts">
import { computed, watch } from 'vue';
import tokens from '../../dist/js/theme.js';
import darkTokens from '../../dist/js/theme.dark.js';

interface Props {
  open?: boolean;
  title?: string;
  closable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  closable: true,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
  close: [];
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

const overlayStyle = computed(() => ({
  position: 'fixed' as const,
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: props.open ? 'flex' : 'none',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: '1000',
}));

const modalStyle = computed(() => ({
  backgroundColor: currentTokens.value['color.background'] as string || '#fff',
  color: currentTokens.value['color.foreground'] as string || '#000',
  borderRadius: currentTokens.value['radius.lg'] as string || '0.75rem',
  padding: '1.5rem',
  maxWidth: '500px',
  width: '90%',
  maxHeight: '90vh',
  overflowY: 'auto' as const,
  boxShadow: currentTokens.value['shadow.lg'] as string || '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
}));

const headerStyle = computed(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
  paddingBottom: '0.75rem',
  borderBottom: `1px solid ${currentTokens.value['color.border'] as string || '#e5e5e5'}`,
}));

const titleStyle = computed(() => ({
  margin: '0',
  fontSize: currentTokens.value['font-size.h2'] as string || '1.5rem',
  fontWeight: '600',
  color: currentTokens.value['color.foreground'] as string || '#000',
}));

const closeButtonStyle = computed(() => ({
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  color: currentTokens.value['color.muted-foreground'] as string || '#6b7280',
  padding: '0',
  lineHeight: '1',
}));

const handleClose = () => {
  emit('update:open', false);
  emit('close');
};

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    handleClose();
  }
};

watch(() => props.open, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}, { immediate: true });
</script>

<template>
  <div :style="overlayStyle" @click="handleOverlayClick">
    <div :style="modalStyle">
      <div :style="headerStyle">
        <h3 v-if="title" :style="titleStyle">{{ title }}</h3>
        <button
          v-if="closable"
          :style="closeButtonStyle"
          @click="handleClose"
          aria-label="关闭"
        >
          ×
        </button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div v-if="$slots.footer" class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-body {
  margin-bottom: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e5e5;
}
</style>
