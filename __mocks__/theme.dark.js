module.exports = {
  color: {
    primary: { hex: '#e06a70', foreground: '#ffffff' },
    background: { hex: '#1a1a1a', foreground: '#a0a0a0' },
    card: { hex: '#2d2d2d', foreground: '#d0d0d0' },
    destructive: { hex: '#ff6b5b', foreground: '#ffffff' },
    ring: { hex: '#ff9f9a' },
    foreground: '#f0f0f0',
    'muted-foreground': '#a0a0a0'
  },
  radius: {
    default: '0.5rem',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem'
  },
  shadow: {
    card: { x: '0px', y: '6px', blur: '20px', spread: '-4px', color_hex: '#0a0a0a' },
    popover: { x: '0px', y: '10px', blur: '30px', spread: '0px', color_hex: '#0a0a0a' },
    focus: { x: '0px', y: '0px', blur: '0px', spread: '2px', color_hex: '#e06a70' }
  },
  typography: {
    'font-sans': 'Geist, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    'font-serif': 'Source Serif 4, Georgia, "Times New Roman", serif',
    'font-mono': 'Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace'
  },
  'font-size': {
    'heading-1': '2rem',
    'heading-2': '1.5rem',
    body: '1rem',
    caption: '0.875rem'
  },
  'line-height': {
    heading: '1.2',
    body: '1.5'
  }
};
