<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import tokens from '../../dist/js/theme.js';
  import darkTokens from '../../dist/js/theme.dark.js';

  export let open = false;
  export let title = '';
  export let closable = true;

  let mode = 'light';
  let currentTokens = tokens;

  function handleClose() {
    open = false;
    dispatch('close');
  }

  function handleOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleClose();
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

  $: if (open) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }

  $: overlayStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: open ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1000',
  };

  $: modalStyle = {
    backgroundColor: currentTokens['color.background'] || '#fff',
    color: currentTokens['color.foreground'] || '#000',
    borderRadius: currentTokens['radius.lg'] || '0.75rem',
    padding: '1.5rem',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: currentTokens['shadow.lg'] || '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  };

  $: headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: `1px solid ${currentTokens['color.border'] || '#e5e5e5'}`,
  };

  $: titleStyle = {
    margin: '0',
    fontSize: currentTokens['font-size.h2'] || '1.5rem',
    fontWeight: '600',
    color: currentTokens['color.foreground'] || '#000',
  };

  $: closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: currentTokens['color.muted-foreground'] || '#6b7280',
    padding: '0',
    lineHeight: '1',
  };
</script>

<div style={overlayStyle} on:click={handleOverlayClick}>
  <div style={modalStyle}>
    <div style={headerStyle}>
      {#if title}
        <h3 style={titleStyle}>{title}</h3>
      {/if}
      {#if closable}
        <button
          style={closeButtonStyle}
          on:click={handleClose}
          aria-label="关闭"
        >
          ×
        </button>
      {/if}
    </div>
    <div class="modal-body">
      <slot />
    </div>
    {#if $$slots.footer}
      <div class="modal-footer">
        <slot name="footer" />
      </div>
    {/if}
  </div>
</div>

<style>
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
