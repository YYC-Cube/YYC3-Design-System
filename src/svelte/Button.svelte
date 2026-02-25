<script lang="ts">
  import { onMount } from 'svelte';
  import tokens from '../../dist/js/theme.js';
  import darkTokens from '../../dist/js/theme.dark.js';

  export let variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' = 'default';
  export let size: 'default' | 'sm' | 'lg' | 'icon' = 'default';
  export let disabled = false;

  let mode = 'light';
  let currentTokens = tokens;

  function handleClick(event: MouseEvent) {
    if (!disabled) {
      dispatch('click', event);
    }
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

  $: styles = {
    padding: '0.5rem 1rem',
    borderRadius: currentTokens['radius.default'] || '0.5rem',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    fontSize: currentTokens['font-size.body'] || '1rem',
    fontFamily: currentTokens['typography.font-sans'] || 'system-ui',
    transition: 'all 0.2s ease',
    ...(variant === 'default' ? {
      backgroundColor: currentTokens['color.primary'] || '#d45a5f',
      color: currentTokens['color.foreground'] || '#fff',
    } : variant === 'destructive' ? {
      backgroundColor: currentTokens['color.destructive'] || '#e05a3f',
      color: currentTokens['color.foreground'] || '#fff',
    } : variant === 'outline' ? {
      backgroundColor: 'transparent',
      color: currentTokens['color.primary'] || '#d45a5f',
      border: `1px solid ${currentTokens['color.primary'] || '#d45a5f'}`,
    } : variant === 'secondary' ? {
      backgroundColor: currentTokens['color.muted-foreground'] || '#ccc',
      color: currentTokens['color.foreground'] || '#fbfbfc',
    } : variant === 'ghost' ? {
      backgroundColor: 'transparent',
      color: currentTokens['color.foreground'] || '#000',
    } : variant === 'link' ? {
      backgroundColor: 'transparent',
      color: currentTokens['color.primary'] || '#d45a5f',
      textDecoration: 'underline',
      padding: '0',
    } : {}),
    ...(size === 'sm' ? {
      padding: '0.25rem 0.5rem',
      fontSize: '0.875rem',
    } : size === 'lg' ? {
      padding: '0.75rem 1.5rem',
      fontSize: '1.125rem',
    } : size === 'icon' ? {
      padding: '0.5rem',
    } : {}),
  };
</script>

<button
  style={styles}
  {disabled}
  on:click={handleClick}
>
  <slot />
</button>
