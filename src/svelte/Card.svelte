<script lang="ts">
  import tokens from '../../dist/js/theme.js';
  import darkTokens from '../../dist/js/theme.dark.js';

  let mode: 'light' | 'dark' = 'light';

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('yyc3-theme');
    if (stored === 'light' || stored === 'dark') {
      mode = stored;
    } else {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  }

  $: currentTokens = mode === 'dark' ? darkTokens : tokens;

  $: cardStyle = {
    backgroundColor: currentTokens.color?.card?.hex || currentTokens.color?.card?.value?.hex || '#f8f9ef',
    borderRadius: currentTokens.radius?.lg || currentTokens.radius?.lg?.value || '0.5rem',
    boxShadow: `0 6px 20px -4px ${currentTokens.shadow?.card?.color_hex || '#d6cbd0'}`,
    padding: '1.5rem',
    transition: 'all 0.2s ease',
  };
</script>

<div style={cardStyle}>
  <slot />
</div>
