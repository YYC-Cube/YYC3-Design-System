<script lang="ts">
  import tokens from '../../dist/js/theme.js';
  import darkTokens from '../../dist/js/theme.dark.js';

  export let variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' = 'default';
  export let size: 'default' | 'sm' | 'lg' | 'icon' = 'default';
  export let disabled: boolean = false;
  export let onclick: (event: MouseEvent) => void = () => {};

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

  $: buttonStyle = (() => {
    const styles: Record<string, string> = {
      padding: '0.5rem 1rem',
      borderRadius: currentTokens.radius?.md || currentTokens.radius?.md?.value || '0.25rem',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontSize: currentTokens['font-size']?.body || currentTokens['font-size']?.body?.value || '1rem',
      fontFamily: currentTokens.typography?.['font-sans'] || currentTokens.typography?.['font-sans']?.value || 'system-ui',
      transition: 'all 0.2s ease',
    };

    switch (variant) {
      case 'default':
        styles.backgroundColor = currentTokens.color?.primary?.hex || currentTokens.color?.primary?.value?.hex || '#d45a5f';
        styles.color = currentTokens.color?.primary?.foreground || '#fff';
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
      case 'secondary':
        styles.backgroundColor = currentTokens.color?.['muted-foreground'] || '#ccc';
        styles.color = currentTokens.color?.background?.hex || currentTokens.color?.background?.value?.hex || '#fbfbfc';
        break;
      case 'ghost':
        styles.backgroundColor = 'transparent';
        styles.color = currentTokens.color?.foreground || '#000';
        break;
      case 'link':
        styles.backgroundColor = 'transparent';
        styles.color = currentTokens.color?.primary?.hex || currentTokens.color?.primary?.value?.hex || '#d45a5f';
        styles.textDecoration = 'underline';
        styles.padding = '0';
        break;
    }

    switch (size) {
      case 'sm':
        styles.padding = '0.25rem 0.5rem';
        styles.fontSize = '0.875rem';
        break;
      case 'lg':
        styles.padding = '0.75rem 1.5rem';
        styles.fontSize = '1.125rem';
        break;
      case 'icon':
        styles.padding = '0.5rem';
        break;
    }

    return styles;
  })();

  const handleClick = (event: MouseEvent) => {
    if (!disabled) {
      onclick(event);
    }
  };
</script>

<button
  style={buttonStyle}
  {disabled}
  on:click={handleClick}
>
  <slot />
</button>
