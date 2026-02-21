<script lang="ts">
  import tokens from '../../dist/js/theme.js';
  import darkTokens from '../../dist/js/theme.dark.js';

  export let type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';
  export let placeholder: string = '';
  export let disabled: boolean = false;
  export let value: string = '';
  export let oninput: (event: Event) => void = () => {};

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

  $: inputStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: currentTokens.radius?.md || currentTokens.radius?.md?.value || '0.25rem',
    border: `1px solid ${currentTokens.color?.['muted-foreground'] || '#ccc'}`,
    backgroundColor: currentTokens.color?.background?.hex || currentTokens.color?.background?.value?.hex || '#fbfbfc',
    color: currentTokens.color?.foreground || '#000',
    fontSize: currentTokens['font-size']?.body || currentTokens['font-size']?.body?.value || '1rem',
    fontFamily: currentTokens.typography?.['font-sans'] || currentTokens.typography?.['font-sans']?.value || 'system-ui',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    outline: 'none',
  };

  const handleFocus = (event: FocusEvent) => {
    const target = event.target as HTMLInputElement;
    target.style.borderColor = currentTokens.color?.primary?.hex || currentTokens.color?.primary?.value?.hex || '#d45a5f';
    target.style.boxShadow = `0 0 0 3px ${currentTokens.color?.primary?.hex || currentTokens.color?.primary?.value?.hex || '#d45a5f'}40`;
  };

  const handleBlur = (event: FocusEvent) => {
    const target = event.target as HTMLInputElement;
    target.style.borderColor = inputStyle.border;
    target.style.boxShadow = 'none';
  };
</script>

<input
  {type}
  {placeholder}
  {disabled}
  {value}
  style={inputStyle}
  on:input={oninput}
  on:focus={handleFocus}
  on:blur={handleBlur}
/>
