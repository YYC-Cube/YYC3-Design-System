<script lang="ts">
  import { onMount } from 'svelte';
  import tokens from '../../dist/js/theme.js';
  import darkTokens from '../../dist/js/theme.dark.js';

  export let value = 0;
  export let max = 100;
  export let showValue = false;
  export let variant: 'default' | 'success' | 'warning' | 'error' = 'default';

  let mode = 'light';
  let currentTokens = tokens;

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

  $: percentage = Math.min(100, Math.max(0, (value / max) * 100));

  $: containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: currentTokens['font-size.body'] || '1rem',
    fontFamily: currentTokens['typography.font-sans'] || 'system-ui',
  };

  $: barStyle = {
    flex: '1',
    height: '0.5rem',
    backgroundColor: currentTokens['color.muted'] || '#e5e7eb',
    borderRadius: currentTokens['radius.sm'] || '0.25rem',
    overflow: 'hidden',
  };

  $: fillStyle = {
    height: '100%',
    borderRadius: currentTokens['radius.sm'] || '0.25rem',
    transition: 'width 0.3s ease',
    ...(variant === 'default' ? {
      backgroundColor: currentTokens['color.primary'] || '#d45a5f',
    } : variant === 'success' ? {
      backgroundColor: currentTokens['color.success'] || '#10b981',
    } : variant === 'warning' ? {
      backgroundColor: currentTokens['color.warning'] || '#f59e0b',
    } : variant === 'error' ? {
      backgroundColor: currentTokens['color.error'] || '#ef4444',
    } : {}),
  };

  $: valueStyle = {
    color: currentTokens['color.foreground'] || '#000',
    fontWeight: '600',
    minWidth: '3rem',
    textAlign: 'right',
  };
</script>

<div style={containerStyle}>
  <div style={barStyle}>
    <div style={fillStyle} style:width={percentage + '%'}></div>
  </div>
  {#if showValue}
    <span style={valueStyle}>{Math.round(percentage)}%</span>
  {/if}
</div>
