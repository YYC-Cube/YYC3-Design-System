<script lang="ts">
  import tokens from '../../dist/js/theme.js';
  import darkTokens from '../../dist/js/theme.dark.js';

  export let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';

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

  $: badgeStyle = (() => {
    const styles: Record<string, string> = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: currentTokens.radius?.sm || currentTokens.radius?.sm?.value || '0.125rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    };

    switch (variant) {
      case 'default':
        styles.backgroundColor = currentTokens.color?.primary?.hex || currentTokens.color?.primary?.value?.hex || '#d45a5f';
        styles.color = currentTokens.color?.primary?.foreground || '#fff';
        break;
      case 'secondary':
        styles.backgroundColor = currentTokens.color?.['muted-foreground'] || '#ccc';
        styles.color = currentTokens.color?.background?.hex || currentTokens.color?.background?.value?.hex || '#fbfbfc';
        break;
      case 'destructive':
        styles.backgroundColor = currentTokens.color?.destructive?.hex || currentTokens.color?.destructive?.value?.hex || '#e05a3f';
        styles.color = currentTokens.color?.destructive?.foreground || '#fff';
        break;
      case 'outline':
        styles.backgroundColor = 'transparent';
        styles.color = currentTokens.color?.primary?.hex || currentTokens.color?.primary?.value?.hex || '#d45a5f';
        styles.border = `1px solid ${currentTokens.color?.primary?.hex || currentTokens.color?.primary?.value?.hex || '#d45a5f'}`;
        break;
    }

    return styles;
  })();
</script>

<span style={badgeStyle}>
  <slot />
</span>
