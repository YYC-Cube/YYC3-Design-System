<script lang="ts">
  import tokens from '../../dist/js/theme.js';
  import darkTokens from '../../dist/js/theme.dark.js';

  export let src: string | undefined = undefined;
  export let alt: string = '';
  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  export let fallback: string = '';

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

  const sizeStyles: Record<string, { width: string; height: string; fontSize: string }> = {
    sm: { width: '2rem', height: '2rem', fontSize: '0.75rem' },
    md: { width: '3rem', height: '3rem', fontSize: '1rem' },
    lg: { width: '4rem', height: '4rem', fontSize: '1.25rem' },
    xl: { width: '5rem', height: '5rem', fontSize: '1.5rem' },
  };

  $: avatarStyle = {
    ...sizeStyles[size],
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: currentTokens.color?.['muted-foreground'] || '#ccc',
    color: currentTokens.color?.foreground || '#000',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  };

  $: imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  $: showFallback = !src;
</script>

<div style={avatarStyle}>
  {#if !showFallback}
    <img {src} {alt} style={imageStyle} />
  {/if}
  {#if showFallback}
    <span>{fallback}</span>
  {/if}
</div>
