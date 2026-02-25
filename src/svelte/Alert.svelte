<script lang="ts">
  import { onMount } from 'svelte';
  import tokens from '../../dist/js/theme.js';
  import darkTokens from '../../dist/js/theme.dark.js';

  export let variant: 'default' | 'destructive' | 'success' | 'warning' = 'default';
  export let title = '';
  export let dismissible = false;
  export let visible = true;

  let mode = 'light';
  let currentTokens = tokens;

  function handleDismiss() {
    visible = false;
    dispatch('dismiss');
  }

  onMount(() => {
    function updateMode() {
      const stored = localStorage.getItem('yyc3-theme');
      if (stored === 'light' || stored === 'dark') {
        mode = stored;
      } else {
        mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      currentTokens = mode === 'dark' ? darkTokens : tokens;
    }

    updateMode();
    window.addEventListener('storage', updateMode);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateMode);

    return () => {
      window.removeEventListener('storage', updateMode);
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateMode);
    };
  });

  const iconMap = {
    default: 'ℹ️',
    destructive: '⚠️',
    success: '✅',
    warning: '🔔',
  };

  $: icon = iconMap[variant];

  $: styles = {
    padding: '1rem',
    borderRadius: currentTokens['radius.default'] || '0.5rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    fontSize: currentTokens['font-size.body'] || '1rem',
    fontFamily: currentTokens['typography.font-sans'] || 'system-ui',
    ...(variant === 'default' ? {
      backgroundColor: currentTokens['color.muted'] || '#f8f9ef',
      color: currentTokens['color.foreground'] || '#000',
      border: `1px solid ${currentTokens['color.border'] || '#e5e5e5'}`,
    } : variant === 'destructive' ? {
      backgroundColor: currentTokens['color.error'] || '#ef4444',
      color: currentTokens['color.error-foreground'] || '#fff',
    } : variant === 'success' ? {
      backgroundColor: currentTokens['color.success'] || '#10b981',
      color: '#fff',
    } : variant === 'warning' ? {
      backgroundColor: currentTokens['color.warning'] || '#f59e0b',
      color: '#fff',
    } : {}),
  };
</script>

{#if visible}
  <div style={styles}>
    <span class="alert-icon">{icon}</span>
    <div class="alert-content">
      {#if title}
        <div class="alert-title">{title}</div>
      {/if}
      <slot />
    </div>
    {#if dismissible}
      <button
        class="alert-dismiss"
        on:click={handleDismiss}
        aria-label="关闭"
      >
        ×
      </button>
    {/if}
  </div>
{/if}

<style>
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
