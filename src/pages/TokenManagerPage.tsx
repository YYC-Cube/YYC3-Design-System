/**
 * YYC³ Design System — Custom Token Manager Page
 *
 * Token Reference:
 *   background:   var(--background), var(--card), var(--muted)
 *   foreground:   var(--foreground), var(--muted-foreground), var(--primary)
 *   border:       var(--border)
 *   success:      var(--success), var(--success-foreground)
 *   destructive:  var(--destructive), var(--destructive-foreground)
 *   warning:      var(--warning)
 *   shadow:       var(--shadow-sm)
 *   animation:    var(--duration-fast), var(--duration-normal), var(--easing-default), var(--easing-out)
 *   a11y:         outline: 2px solid var(--ring) on focus, aria-label on all interactive elements
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Upload,
  FileJson,
  Edit3,
  Download,
  History,
  ChevronRight,
  ChevronLeft,
  FileUp,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Trash2,
  Plus,
  RotateCcw,
  Search,
  X,
  Home,
} from 'lucide-react';
import { Link } from 'react-router';

// ─── Types ───
interface TokenEntry {
  id: string;
  key: string;
  type: 'color' | 'spacing' | 'radius' | 'shadow' | 'animation' | 'other';
  value: string;
  fallbackHex?: string;
}

interface HistoryEntry {
  id: string;
  timestamp: string;
  author: string;
  summary: string;
  added: number;
  modified: number;
  deleted: number;
}

// ─── Mock Data ───
const MOCK_TOKENS: TokenEntry[] = [
  {
    id: '1',
    key: 'color-primary',
    type: 'color',
    value: 'oklch(0.55 0.18 260)',
    fallbackHex: '#2563eb',
  },
  {
    id: '2',
    key: 'color-primary-foreground',
    type: 'color',
    value: 'oklch(1 0 0)',
    fallbackHex: '#ffffff',
  },
  {
    id: '3',
    key: 'color-primary-highlight',
    type: 'color',
    value: 'oklch(0.72 0.14 240)',
    fallbackHex: '#60a5fa',
  },
  {
    id: '4',
    key: 'color-background',
    type: 'color',
    value: 'oklch(1 0 0)',
    fallbackHex: '#ffffff',
  },
  {
    id: '5',
    key: 'color-destructive',
    type: 'color',
    value: 'oklch(0.52 0.21 25)',
    fallbackHex: '#dc2626',
  },
  {
    id: '6',
    key: 'color-success',
    type: 'color',
    value: 'oklch(0.60 0.18 145)',
    fallbackHex: '#16a34a',
  },
  { id: '7', key: 'spacing-1', type: 'spacing', value: '0.25rem' },
  { id: '8', key: 'spacing-2', type: 'spacing', value: '0.5rem' },
  { id: '9', key: 'spacing-4', type: 'spacing', value: '1rem' },
  { id: '10', key: 'radius-sm', type: 'radius', value: 'calc(var(--radius) - 4px)' },
  { id: '11', key: 'radius-md', type: 'radius', value: 'calc(var(--radius) - 2px)' },
  { id: '12', key: 'shadow-sm', type: 'shadow', value: '0 1px 2px 0 rgba(0,0,0,0.05)' },
  { id: '13', key: 'shadow-glow', type: 'shadow', value: '0 0 20px var(--glow-color)' },
  { id: '14', key: 'duration-fast', type: 'animation', value: '120ms' },
  { id: '15', key: 'duration-normal', type: 'animation', value: '200ms' },
  { id: '16', key: 'easing-default', type: 'animation', value: 'cubic-bezier(0.25, 0.8, 0.25, 1)' },
];

const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: 'h1',
    timestamp: '2026-02-26 14:30',
    author: 'YYC\u00b3 AI',
    summary:
      '\u521d\u59cb\u5316\u4ee4\u724c\u7cfb\u7edf\uff0c\u5bfc\u5165\u4e09\u5957\u4e3b\u9898\u57fa\u7840\u53d8\u91cf',
    added: 48,
    modified: 0,
    deleted: 0,
  },
  {
    id: 'h2',
    timestamp: '2026-02-25 10:15',
    author: 'Designer A',
    summary: '\u66f4\u65b0 Cyber \u4e3b\u9898\u9709\u8679\u706f\u6548\u679c\u53c2\u6570',
    added: 3,
    modified: 8,
    deleted: 0,
  },
  {
    id: 'h3',
    timestamp: '2026-02-24 16:45',
    author: 'Designer B',
    summary:
      '\u4f18\u5316 Business \u4e3b\u9898\u5bf9\u6bd4\u5ea6\uff0c\u8c03\u6574\u524d\u666f\u8272',
    added: 0,
    modified: 12,
    deleted: 2,
  },
  {
    id: 'h4',
    timestamp: '2026-02-23 09:00',
    author: 'YYC\u00b3 AI',
    summary: '\u6dfb\u52a0\u52a8\u753b\u4ee4\u724c\uff08duration / easing\uff09',
    added: 6,
    modified: 0,
    deleted: 0,
  },
  {
    id: 'h5',
    timestamp: '2026-02-22 11:30',
    author: 'Designer A',
    summary:
      '\u91cd\u6784\u9634\u5f71\u4ee4\u724c\uff0c\u7edf\u4e00\u4f7f\u7528 OKLCH \u4eae\u5ea6\u57fa\u51c6',
    added: 0,
    modified: 6,
    deleted: 4,
  },
];

const MOCK_JSON = `{
  "$schema": "https://yyc3.design/tokens.schema.json",
  "version": "1.0.0",
  "themes": {
    "future": {
      "light": {
        "color": {
          "primary": { "oklch": "oklch(0.55 0.18 260)", "hex": "#2563eb" },
          "primary-foreground": { "oklch": "oklch(1 0 0)", "hex": "#ffffff" },
          "primary-highlight": { "oklch": "oklch(0.72 0.14 240)", "hex": "#60a5fa" }
        },
        "spacing": { "1": "0.25rem", "2": "0.5rem", "4": "1rem" }
      }
    }
  }
}`;

type TabId = 'import' | 'edit' | 'export' | 'history';

// ─── FileImportBox ───
function FileImportBox({ onImport }: { onImport: (content: string, filename: string) => void }) {
  const { t } = useLanguage();
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importedFile, setImportedFile] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'json' && ext !== 'yaml' && ext !== 'yml') {
        setError(t('tokenManager.onlyJsonYaml'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          if (ext === 'json') JSON.parse(content);
          setImportedFile(file.name);
          onImport(content, file.name);
        } catch {
          setError(t('tokenManager.parseFailed'));
        }
      };
      reader.readAsText(file);
    },
    [t, onImport]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          isDragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
        }`}
        onClick={() => fileRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={t('tokenManager.dragUploadLabel')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click();
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".json,.yaml,.yml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <FileUp className="size-10 mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm">{t('tokenManager.dragOrClick')}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={(e) => {
            e.stopPropagation();
            fileRef.current?.click();
          }}
        >
          <Upload className="size-4" />
          {t('tokenManager.chooseFile')}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">{t('tokenManager.supportedFormats')}</p>
      </div>
      {error && (
        <div
          className="flex items-center gap-2 p-3 rounded-lg text-sm"
          style={{ background: 'var(--destructive)', color: 'var(--destructive-foreground)' }}
          role="alert"
        >
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}
      {importedFile && !error && (
        <div
          className="flex items-center gap-2 p-3 rounded-lg text-sm"
          style={{ background: 'var(--success)', color: 'var(--success-foreground)' }}
          role="status"
        >
          <CheckCircle2 className="size-4 shrink-0" />
          {t('tokenManager.imported')}: {importedFile}
        </div>
      )}
    </div>
  );
}

// ─── JSONEditor (Monaco-style) ───
function JSONEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const lines = value.split('\n');
  return (
    <div
      className="rounded-xl border border-border overflow-hidden font-mono text-xs"
      style={{ background: 'var(--card)' }}
    >
      <div className="flex">
        <div
          className="py-3 px-2 text-right select-none shrink-0 border-r border-border"
          style={{ color: 'var(--muted-foreground)', minWidth: '3rem' }}
        >
          {lines.map((_, i) => (
            <div key={i} style={{ lineHeight: '1.5rem' }}>
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 p-3 bg-transparent resize-none outline-none"
          style={{
            lineHeight: '1.5rem',
            color: 'var(--foreground)',
            minHeight: `${Math.max(lines.length, 10) * 1.5}rem`,
          }}
          spellCheck={false}
          aria-label="JSON Editor"
        />
      </div>
    </div>
  );
}

// ─── TokenTable ───
function TokenTable({
  tokens,
  onEdit,
  onDelete,
  onCopyAll,
}: {
  tokens: TokenEntry[];
  onEdit: (id: string, field: 'key' | 'value' | 'fallbackHex', val: string) => void;
  onDelete: (id: string) => void;
  onCopyAll: () => void;
}) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = tokens.filter(
    (tk) =>
      tk.key.toLowerCase().includes(filter.toLowerCase()) || tk.type.includes(filter.toLowerCase())
  );

  const copyRow = (tk: TokenEntry) => {
    navigator.clipboard.writeText(
      JSON.stringify({ key: tk.key, type: tk.type, value: tk.value, fallbackHex: tk.fallbackHex })
    );
    setCopiedId(tk.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={t('tokenManager.filterTokens')}
            className="h-8 pl-8 text-xs"
            aria-label={t('common.filter')}
          />
        </div>
        <Button variant="outline" size="sm" onClick={onCopyAll}>
          <Copy className="size-3.5" />
          {t('common.copyAll')}
        </Button>
        <Badge variant="secondary" className="text-xs">
          {filtered.length} / {tokens.length}
        </Badge>
      </div>
      <ScrollArea className="max-h-[400px]">
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border" style={{ background: 'var(--muted)' }}>
                <th className="text-left px-3 py-2">{t('tokenManager.key')}</th>
                <th className="text-left px-3 py-2">{t('tokenManager.type')}</th>
                <th className="text-left px-3 py-2">{t('tokenManager.value')}</th>
                <th className="text-left px-3 py-2">HEX</th>
                <th className="text-right px-3 py-2">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tk) => (
                <tr
                  key={tk.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-3 py-2">
                    <input
                      value={tk.key}
                      onChange={(e) => onEdit(tk.id, 'key', e.target.value)}
                      className="bg-transparent outline-none font-mono w-full focus:text-primary"
                      style={{ transition: 'color var(--duration-fast) var(--easing-default)' }}
                      aria-label={`${t('tokenManager.editKey')} ${tk.key}`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {tk.type}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={tk.value}
                      onChange={(e) => onEdit(tk.id, 'value', e.target.value)}
                      className="bg-transparent outline-none font-mono w-full focus:text-primary"
                      aria-label={`${t('tokenManager.editValue')} ${tk.key}`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      {tk.fallbackHex && (
                        <div
                          className="size-3.5 rounded border border-border shrink-0"
                          style={{ background: tk.fallbackHex }}
                        />
                      )}
                      <input
                        value={tk.fallbackHex || ''}
                        onChange={(e) => onEdit(tk.id, 'fallbackHex', e.target.value)}
                        className="bg-transparent outline-none font-mono w-full focus:text-primary"
                        placeholder="-"
                        aria-label={`${t('tokenManager.editHex')} ${tk.key}`}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => copyRow(tk)}
                        className="p-1 rounded hover:bg-muted transition-colors"
                        aria-label={t('common.copy')}
                      >
                        {copiedId === tk.id ? (
                          <Check className="size-3.5 text-success" />
                        ) : (
                          <Copy className="size-3.5 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={() => onDelete(tk.id)}
                        className="p-1 rounded hover:bg-destructive/10 transition-colors"
                        aria-label={t('common.delete')}
                      >
                        <Trash2 className="size-3.5 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── HistoryList ───
function HistoryList({
  entries,
  onRollback,
}: {
  entries: HistoryEntry[];
  onRollback: (id: string) => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="rounded-xl border border-border p-4 hover:border-primary/30 transition-all"
          style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground font-mono">{entry.timestamp}</span>
                <Badge variant="outline" className="text-[10px]">
                  {entry.author}
                </Badge>
              </div>
              <p className="text-sm">{entry.summary}</p>
              <div className="flex gap-3 mt-2 text-[10px]">
                {entry.added > 0 && (
                  <span className="text-success">
                    +{entry.added} {t('tokenManager.added')}
                  </span>
                )}
                {entry.modified > 0 && (
                  <span className="text-warning">
                    ~{entry.modified} {t('tokenManager.modified')}
                  </span>
                )}
                {entry.deleted > 0 && (
                  <span className="text-destructive">
                    -{entry.deleted} {t('tokenManager.deleted')}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRollback(entry.id)}
              className="shrink-0"
            >
              <RotateCcw className="size-3.5" />
              {t('tokenManager.rollback')}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ───
export function TokenManagerPage() {
  const { t } = useLanguage();
  const { style } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>('import');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tokens, setTokens] = useState<TokenEntry[]>(MOCK_TOKENS);
  const [jsonContent, setJsonContent] = useState(MOCK_JSON);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Keyboard shortcut: Ctrl+Alt+I → Import tab
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setActiveTab('import');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const showToast = (type: 'success' | 'error', text: string) => setToastMsg({ type, text });

  const handleImport = useCallback(
    (content: string, filename: string) => {
      try {
        const parsed = JSON.parse(content);
        showToast(
          'success',
          `${t('tokenManager.imported')}: ${filename} (${Object.keys(parsed).length} keys)`
        );
        setJsonContent(content);
        setActiveTab('edit');
      } catch {
        showToast('error', t('tokenManager.importFailed'));
      }
    },
    [t]
  );

  const handleEditToken = useCallback(
    (id: string, field: 'key' | 'value' | 'fallbackHex', val: string) => {
      setTokens((prev) => prev.map((tk) => (tk.id === id ? { ...tk, [field]: val } : tk)));
    },
    []
  );

  const handleDeleteToken = useCallback((id: string) => {
    setTokens((prev) => prev.filter((tk) => tk.id !== id));
  }, []);

  const handleAddToken = useCallback(() => {
    setTokens((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, key: 'new-token', type: 'other', value: '', fallbackHex: '' },
    ]);
  }, []);

  const handleCopyAll = useCallback(() => {
    const data = tokens.map(({ key, type, value, fallbackHex }) => ({
      key,
      type,
      value,
      fallbackHex,
    }));
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    showToast('success', t('tokenManager.allTokensCopied'));
  }, [tokens, t]);

  const handleExport = useCallback(
    (format: string) => {
      let content = '';
      let filename = '';
      if (format === 'json') {
        content = JSON.stringify(
          {
            tokens: tokens.map(({ key, type, value, fallbackHex }) => ({
              key,
              type,
              value,
              fallbackHex,
            })),
          },
          null,
          2
        );
        filename = 'tokens.json';
      } else if (format === 'css') {
        content = `:root {\n${tokens.map((tk) => `  --${tk.key}: ${tk.fallbackHex || tk.value};`).join('\n')}\n}`;
        filename = 'variables.css';
      } else if (format === 'ts') {
        content = `export const tokens = {\n${tokens.map((tk) => `  "${tk.key}": { value: "${tk.value}", fallbackHex: "${tk.fallbackHex || ''}" }`).join(',\n')}\n} as const;`;
        filename = 'tokens.ts';
      }
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      showToast('success', `${t('tokenManager.exported').replace('{filename}', filename)}`);
    },
    [tokens, t]
  );

  const tabs: { id: TabId; icon: typeof Upload; label: string }[] = [
    { id: 'import', icon: Upload, label: t('tokenManager.importTab') },
    { id: 'edit', icon: Edit3, label: t('tokenManager.editTab') },
    { id: 'export', icon: Download, label: t('tokenManager.exportTab') },
    { id: 'history', icon: History, label: t('tokenManager.historyTab') },
  ];

  const changesSummary = { added: 2, modified: 5, deleted: 1 };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Toast — Token: success/destructive bg + foreground */}
      {toastMsg && (
        <div
          className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm shadow-lg animate-in slide-in-from-right"
          style={{
            background: toastMsg.type === 'success' ? 'var(--success)' : 'var(--destructive)',
            color:
              toastMsg.type === 'success'
                ? 'var(--success-foreground)'
                : 'var(--destructive-foreground)',
            transition: `all var(--duration-fast) var(--easing-out)`,
          }}
          role="alert"
        >
          {toastMsg.type === 'success' ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <AlertCircle className="size-4" />
          )}
          {toastMsg.text}
          <button
            onClick={() => setToastMsg(null)}
            className="ml-2 p-0.5 rounded hover:opacity-80"
            aria-label={t('common.close')}
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Breadcrumb */}
      <nav aria-label={t('components.breadcrumb')}>
        <ol className="flex items-center gap-1.5 text-sm">
          <li>
            <Link
              to="/"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="size-3.5" />
              {t('nav.home')}
            </Link>
          </li>
          <li>
            <ChevronRight className="size-3.5 text-muted-foreground" />
          </li>
          <li className="text-foreground" aria-current="page">
            {t('nav.tokenManager')}
          </li>
        </ol>
      </nav>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">{t('tokenManager.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('tokenManager.subtitle')}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono">
            Ctrl+Alt+I
          </kbd>
          <span>{t('tokenManager.quickImport')}</span>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Sidebar */}
        <aside
          className={`shrink-0 transition-all ${sidebarOpen ? 'w-44' : 'w-10'}`}
          style={{ transition: `width var(--duration-normal) var(--easing-default)` }}
        >
          <div className="sticky top-20">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mb-2 p-1.5 rounded-md border border-border hover:bg-muted transition-colors w-full flex items-center justify-center"
              aria-label={t('tokenManager.toggleSidebar')}
            >
              {sidebarOpen ? (
                <ChevronLeft className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
            <nav className="space-y-1" aria-label={t('tokenManager.sidebarNav')}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  style={{ transition: `all var(--duration-fast) var(--easing-default)` }}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <tab.icon className="size-4 shrink-0" />
                  {sidebarOpen && <span>{tab.label}</span>}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-4 p-1 rounded-lg border border-border bg-muted/30">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${
                  activeTab === tab.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                style={{ transition: `all var(--duration-fast) var(--easing-default)` }}
              >
                <tab.icon className="size-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Import Tab */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              <div
                className="rounded-xl border border-border p-6"
                style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
              >
                <h3 className="text-sm mb-4">{t('tokenManager.importTokenFile')}</h3>
                <FileImportBox onImport={handleImport} />
              </div>
              <div
                className="rounded-xl border border-border p-6"
                style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
              >
                <h3 className="text-sm mb-3">{t('tokenManager.importInstructions')}</h3>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>{t('tokenManager.importInstructionsContent')}</p>
                  <p>{t('tokenManager.importAfterDesc')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Edit Tab */}
          {activeTab === 'edit' && (
            <div className="space-y-4">
              <div
                className="rounded-xl border border-border p-4"
                style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm">{t('tokenManager.jsonEditor')}</h3>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    tokens.json
                  </Badge>
                </div>
                <JSONEditor value={jsonContent} onChange={setJsonContent} />
              </div>
              <Separator />
              <div
                className="rounded-xl border border-border p-4"
                style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm">{t('tokenManager.tokenTable')}</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleAddToken}>
                      <Plus className="size-3.5" />
                      {t('common.add')}
                    </Button>
                    <Button size="sm" onClick={() => setShowApplyModal(true)}>
                      <CheckCircle2 className="size-3.5" />
                      {t('tokenManager.applyChanges')}
                    </Button>
                  </div>
                </div>
                <TokenTable
                  tokens={tokens}
                  onEdit={handleEditToken}
                  onDelete={handleDeleteToken}
                  onCopyAll={handleCopyAll}
                />
              </div>
            </div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  format: 'json',
                  icon: FileJson,
                  title: 'tokens.json',
                  desc: t('tokenManager.exportJson'),
                },
                {
                  format: 'css',
                  icon: FileJson,
                  title: 'variables.css',
                  desc: t('tokenManager.exportCss'),
                },
                {
                  format: 'ts',
                  icon: FileJson,
                  title: 'tokens.ts',
                  desc: t('tokenManager.exportTs'),
                },
              ].map((item) => (
                <div
                  key={item.format}
                  className="rounded-xl border border-border p-5 space-y-3 hover:border-primary/30 transition-all"
                  style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
                >
                  <item.icon className="size-8 text-primary" />
                  <h3 className="text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport(item.format)}
                    className="w-full"
                  >
                    <Download className="size-3.5" />
                    {t('common.export')}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm">{t('tokenManager.versionHistory')}</h3>
                <Badge variant="secondary" className="text-xs">
                  {MOCK_HISTORY.length} {t('tokenManager.entries')}
                </Badge>
              </div>
              <HistoryList
                entries={MOCK_HISTORY}
                onRollback={(id) => {
                  showToast('success', `${t('tokenManager.rolledBack')} ${id}`);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Apply Changes Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('tokenManager.applyChanges')}</DialogTitle>
            <DialogDescription>{t('tokenManager.applyChangesDesc')}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-success/30 bg-success/5 p-3 text-center">
                <p className="text-xl text-success">{changesSummary.added}</p>
                <p className="text-xs text-muted-foreground">{t('tokenManager.added')}</p>
              </div>
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-center">
                <p className="text-xl text-warning">{changesSummary.modified}</p>
                <p className="text-xs text-muted-foreground">{t('tokenManager.modified')}</p>
              </div>
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-center">
                <p className="text-xl text-destructive">{changesSummary.deleted}</p>
                <p className="text-xs text-muted-foreground">{t('tokenManager.deleted')}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={() => {
                setShowApplyModal(false);
                showToast('success', t('tokenManager.changesApplied'));
              }}
            >
              <CheckCircle2 className="size-4" />
              {t('tokenManager.confirmApply')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
