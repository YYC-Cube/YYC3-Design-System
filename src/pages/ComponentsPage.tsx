/**
 * YYC³ Design System — Components Page
 *
 * Token Reference:
 *   background:   var(--background), var(--card), var(--muted)
 *   foreground:   var(--foreground), var(--muted-foreground), var(--primary)
 *   border:       var(--border)
 *   states:       hover:bg-muted, focus:border-primary, active:bg-primary/10
 *   shadow:       var(--shadow-glow) [cyber theme hover]
 *   animation:    var(--duration-fast) var(--easing-default)
 *   a11y:         outline: 2px solid var(--ring) on focus
 */
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Switch } from '../components/ui/switch';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { Slider } from '../components/ui/slider';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Skeleton } from '../components/ui/skeleton';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Search,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Heart,
  Star,
  User,
  Mail,
  Lock,
  Loader2,
  Bell,
  Download,
  Send,
  ChevronRight,
  Plus,
  Settings,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  X as XIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { StorybookSettingsPanel } from '../components/StorybookSettingsPanel';

/* ─── Component Category & A11y Metadata ─── */
type Category = 'all' | 'form' | 'data' | 'feedback' | 'navigation' | 'display';

const COMPONENT_META: Record<
  string,
  {
    category: Category;
    jsxCode: string;
    a11yRole: string;
    a11yKeys: string;
    a11yAttrs: string;
    tokens: string;
  }
> = {
  button: {
    category: 'form',
    jsxCode: `import { Button } from "@/components/ui/button";\n<Button variant="default">Click me</Button>`,
    a11yRole: 'button',
    a11yKeys: 'Enter / Space',
    a11yAttrs: 'aria-label, aria-disabled',
    tokens: '--primary, --radius-md, --shadow-sm',
  },
  input: {
    category: 'form',
    jsxCode: `import { Input } from "@/components/ui/input";\n<Input type="text" placeholder="Enter value" />`,
    a11yRole: 'textbox',
    a11yKeys: 'Tab',
    a11yAttrs: 'aria-label, aria-required, aria-invalid',
    tokens: '--input-background, --border, --ring',
  },
  textarea: {
    category: 'form',
    jsxCode: `import { Textarea } from "@/components/ui/textarea";\n<Textarea placeholder="Enter message" />`,
    a11yRole: 'textbox',
    a11yKeys: 'Tab',
    a11yAttrs: 'aria-label, aria-multiline',
    tokens: '--input-background, --border, --ring',
  },
  select: {
    category: 'form',
    jsxCode: `import { Select } from "@/components/ui/select";\n<Select><SelectTrigger /><SelectContent /></Select>`,
    a11yRole: 'combobox',
    a11yKeys: 'Enter, Arrow keys',
    a11yAttrs: 'aria-expanded, aria-haspopup',
    tokens: '--input-background, --border, --primary',
  },
  checkbox: {
    category: 'form',
    jsxCode: `import { Checkbox } from "@/components/ui/checkbox";\n<Checkbox id="cb" /><label htmlFor="cb">Label</label>`,
    a11yRole: 'checkbox',
    a11yKeys: 'Space',
    a11yAttrs: 'aria-checked, aria-label',
    tokens: '--primary, --border, --ring',
  },
  radio: {
    category: 'form',
    jsxCode: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";\n<RadioGroup><RadioGroupItem value="a" /></RadioGroup>`,
    a11yRole: 'radio',
    a11yKeys: 'Arrow keys',
    a11yAttrs: "aria-checked, role='radiogroup'",
    tokens: '--primary, --border, --ring',
  },
  switch: {
    category: 'form',
    jsxCode: `import { Switch } from "@/components/ui/switch";\n<Switch checked={true} onCheckedChange={() => {}} />`,
    a11yRole: 'switch',
    a11yKeys: 'Space',
    a11yAttrs: 'aria-checked, aria-label',
    tokens: '--primary, --switch-background, --ring',
  },
  slider: {
    category: 'form',
    jsxCode: `import { Slider } from "@/components/ui/slider";\n<Slider defaultValue={[50]} max={100} step={1} />`,
    a11yRole: 'slider',
    a11yKeys: 'Arrow keys, Home, End',
    a11yAttrs: 'aria-valuemin/max/now',
    tokens: '--primary, --border, --ring',
  },
  badge: {
    category: 'data',
    jsxCode: `import { Badge } from "@/components/ui/badge";\n<Badge variant="default">New</Badge>`,
    a11yRole: 'status',
    a11yKeys: '—',
    a11yAttrs: 'aria-label (if standalone)',
    tokens: '--primary, --secondary, --radius-xl',
  },
  avatar: {
    category: 'data',
    jsxCode: `import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";\n<Avatar><AvatarFallback>YY</AvatarFallback></Avatar>`,
    a11yRole: 'img',
    a11yKeys: '—',
    a11yAttrs: 'alt on <img>',
    tokens: '--muted, --border, --radius-xl',
  },
  card: {
    category: 'data',
    jsxCode: `import { Card, CardContent } from "@/components/ui/card";\n<Card><CardContent>Content</CardContent></Card>`,
    a11yRole: 'article',
    a11yKeys: 'Tab (if interactive)',
    a11yAttrs: 'aria-label for cards',
    tokens: '--card, --border, --shadow-md, --radius-lg',
  },
  table: {
    category: 'data',
    jsxCode: `import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";\n<Table><TableBody><TableRow><TableCell>Data</TableCell></TableRow></TableBody></Table>`,
    a11yRole: 'table',
    a11yKeys: 'Tab',
    a11yAttrs: 'scope on <th>, aria-sort',
    tokens: '--card, --border, --muted',
  },
  skeleton: {
    category: 'data',
    jsxCode: `import { Skeleton } from "@/components/ui/skeleton";\n<Skeleton className="h-4 w-32" />`,
    a11yRole: 'none',
    a11yKeys: '—',
    a11yAttrs: "aria-hidden='true'",
    tokens: '--muted, --radius-md',
  },
  scrollArea: {
    category: 'data',
    jsxCode: `import { ScrollArea } from "@/components/ui/scroll-area";\n<ScrollArea className="h-32"><div /></ScrollArea>`,
    a11yRole: 'region',
    a11yKeys: 'Arrow keys, Page Up/Down',
    a11yAttrs: 'aria-label',
    tokens: '--muted, --border, --radius-md',
  },
  alert: {
    category: 'feedback',
    jsxCode: `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";\n<Alert><AlertTitle>Title</AlertTitle><AlertDescription>Desc</AlertDescription></Alert>`,
    a11yRole: 'alert',
    a11yKeys: '—',
    a11yAttrs: "role='alert', aria-live='polite'",
    tokens: '--destructive, --success, --warning, --border',
  },
  progress: {
    category: 'feedback',
    jsxCode: `import { Progress } from "@/components/ui/progress";\n<Progress value={60} />`,
    a11yRole: 'progressbar',
    a11yKeys: '—',
    a11yAttrs: 'aria-valuenow/min/max',
    tokens: '--primary, --muted, --radius-xl',
  },
  spinner: {
    category: 'feedback',
    jsxCode: `import { Loader2 } from "lucide-react";\n<Loader2 className="animate-spin" aria-label="Loading" />`,
    a11yRole: 'status',
    a11yKeys: '—',
    a11yAttrs: "aria-label, aria-live='polite'",
    tokens: '--primary, --muted-foreground',
  },
  modal: {
    category: 'feedback',
    jsxCode: `import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";\n<Dialog><DialogTrigger>Open</DialogTrigger><DialogContent>Content</DialogContent></Dialog>`,
    a11yRole: 'dialog',
    a11yKeys: 'Tab, Escape',
    a11yAttrs: 'aria-labelledby, aria-describedby',
    tokens: '--card, --border, --shadow-lg, --radius-lg',
  },
  toast: {
    category: 'feedback',
    jsxCode: `import { toast } from "sonner";\ntoast.success("Operation successful!");`,
    a11yRole: 'status',
    a11yKeys: '—',
    a11yAttrs: "aria-live='polite'",
    tokens: '--card, --success, --destructive, --shadow-lg',
  },
  tabs: {
    category: 'navigation',
    jsxCode: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";\n<Tabs defaultValue="tab1"><TabsList><TabsTrigger value="tab1">Tab 1</TabsTrigger></TabsList><TabsContent value="tab1">Content</TabsContent></Tabs>`,
    a11yRole: 'tablist/tab/tabpanel',
    a11yKeys: 'Arrow keys, Tab',
    a11yAttrs: 'aria-selected, aria-controls',
    tokens: '--primary, --muted, --border, --radius-md',
  },
  breadcrumb: {
    category: 'navigation',
    jsxCode: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";\n<Breadcrumb><BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem></Breadcrumb>`,
    a11yRole: 'navigation',
    a11yKeys: 'Tab',
    a11yAttrs: "aria-label='breadcrumb', aria-current",
    tokens: '--muted-foreground, --primary, --foreground',
  },
  pagination: {
    category: 'navigation',
    jsxCode: `import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";\n<Pagination><PaginationContent><PaginationPrevious /><PaginationItem>1</PaginationItem><PaginationNext /></PaginationContent></Pagination>`,
    a11yRole: 'navigation',
    a11yKeys: 'Tab, Enter',
    a11yAttrs: "aria-label='pagination', aria-current",
    tokens: '--primary, --border, --muted, --radius-md',
  },
  separator: {
    category: 'navigation',
    jsxCode: `import { Separator } from "@/components/ui/separator";\n<Separator orientation="horizontal" />`,
    a11yRole: 'separator',
    a11yKeys: '—',
    a11yAttrs: 'aria-orientation',
    tokens: '--border',
  },
  animated: {
    category: 'display',
    jsxCode: `import { motion } from "motion/react";\n<motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>Content</motion.div>`,
    a11yRole: 'region',
    a11yKeys: '—',
    a11yAttrs: 'aria-label, prefers-reduced-motion',
    tokens: '--duration-fast, --easing-out',
  },
  themeToggle: {
    category: 'display',
    jsxCode: `import { ThemeToggle } from "@/components/ThemeToggle";\n<ThemeToggle />`,
    a11yRole: 'button',
    a11yKeys: 'Enter / Space',
    a11yAttrs: 'aria-label, aria-pressed',
    tokens: '--primary, --muted, --ring',
  },
  tooltip: {
    category: 'display',
    jsxCode: `import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";\n<Tooltip><TooltipTrigger>Hover</TooltipTrigger><TooltipContent>Tip</TooltipContent></Tooltip>`,
    a11yRole: 'tooltip',
    a11yKeys: 'Tab (trigger)',
    a11yAttrs: "role='tooltip', aria-describedby",
    tokens: '--card, --border, --shadow-md, --radius-md',
  },
};

/* ─── Section Component ─── */
function Section({
  title,
  id,
  children,
  jsxCode,
  a11yRole,
  a11yKeys,
  a11yAttrs,
  tokens,
  onSelectA11y,
}: {
  title: string;
  id: string;
  children: React.ReactNode;
  jsxCode?: string;
  a11yRole?: string;
  a11yKeys?: string;
  a11yAttrs?: string;
  tokens?: string;
  onSelectA11y?: (info: {
    title: string;
    role: string;
    keys: string;
    attrs: string;
    tokens: string;
  }) => void;
}) {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopyJsx = useCallback(async () => {
    if (!jsxCode) return;
    try {
      await navigator.clipboard.writeText(jsxCode);
      setCopied(true);
      toast.success(`${title} JSX ${t('components.copiedJsx')}`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('common.error'));
    }
  }, [jsxCode, title, t]);

  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2" style={{ fontSize: '1.125rem' }}>
          <span
            className="size-6 rounded flex items-center justify-center text-xs"
            style={{
              background: 'color-mix(in oklch, var(--primary) 12%, var(--card))',
              color: 'var(--primary)',
              fontWeight: 700,
            }}
            aria-hidden="true"
          >
            #
          </span>
          {title}
        </h3>
        <div className="flex items-center gap-1.5">
          {a11yRole && onSelectA11y && (
            <button
              onClick={() =>
                onSelectA11y({
                  title,
                  role: a11yRole,
                  keys: a11yKeys ?? '—',
                  attrs: a11yAttrs ?? '—',
                  tokens: tokens ?? '—',
                })
              }
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all focus-visible:outline-none"
              style={{
                border: '1px solid var(--border)',
                background: 'var(--card)',
                color: 'var(--muted-foreground)',
                cursor: 'pointer',
                outline: '2px solid transparent',
                transition: `all var(--duration-fast) var(--easing-out)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--card)';
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = `2px solid var(--ring)`;
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = '2px solid transparent';
              }}
              aria-label={`${t('components.a11yInfo')} — ${title}`}
            >
              <Eye className="size-3" aria-hidden="true" />
              <span className="hidden sm:inline">{t('components.a11yInfo')}</span>
            </button>
          )}
          {jsxCode && (
            <button
              onClick={handleCopyJsx}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all focus-visible:outline-none"
              style={{
                border: `1px solid ${copied ? 'var(--success)' : 'var(--border)'}`,
                background: copied
                  ? 'color-mix(in oklch, var(--success) 10%, var(--card))'
                  : 'var(--card)',
                color: copied ? 'var(--success)' : 'var(--muted-foreground)',
                cursor: 'pointer',
                outline: '2px solid transparent',
                transition: `all var(--duration-fast) var(--easing-out)`,
              }}
              onMouseEnter={(e) => {
                if (!copied)
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--muted)';
              }}
              onMouseLeave={(e) => {
                if (!copied)
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--card)';
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = `2px solid var(--ring)`;
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = '2px solid transparent';
              }}
              aria-label={`${t('components.copyJsx')} — ${title}`}
            >
              {copied ? (
                <CheckCircle2 className="size-3" aria-hidden="true" />
              ) : (
                <Copy className="size-3" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {copied ? t('components.copiedJsx') : t('components.copyJsx')}
              </span>
            </button>
          )}
        </div>
      </div>
      <div
        className="rounded-xl p-4 sm:p-6"
        style={{ border: '1px solid var(--border)', background: 'var(--card)' }}
      >
        {children}
      </div>
    </section>
  );
}

/* ─── A11y Info Panel ─── */
function A11yPanel({
  info,
  onClose,
}: {
  info: { title: string; role: string; keys: string; attrs: string; tokens: string } | null;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  if (!info) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 rounded-2xl p-5 max-w-xs w-full shadow-2xl"
      style={{
        background: 'var(--card)',
        border: '2px solid var(--primary)',
        boxShadow: 'var(--shadow-lg), 0 0 0 1px var(--primary)',
      }}
      role="complementary"
      aria-label={t('components.a11yInfo')}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Eye className="size-4" style={{ color: 'var(--primary)' }} aria-hidden="true" />
          <span className="text-sm" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
            {t('components.a11yInfo')}:{' '}
            <code style={{ color: 'var(--primary)', fontFamily: 'var(--font-family-mono)' }}>
              &lt;{info.title}/&gt;
            </code>
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-0.5 transition-all focus-visible:outline-none"
          style={{
            color: 'var(--muted-foreground)',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            outline: '2px solid transparent',
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLButtonElement).style.outline = `2px solid var(--ring)`;
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLButtonElement).style.outline = '2px solid transparent';
          }}
          aria-label={t('common.close')}
        >
          <XIcon className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-2.5">
        {[
          { label: t('components.a11yRole'), value: info.role },
          { label: t('components.a11yKeys'), value: info.keys },
          { label: t('components.a11yAttrs'), value: info.attrs },
          { label: t('components.tokenRef'), value: info.tokens },
        ].map(({ label, value }) => (
          <div key={label}>
            <p
              className="text-[10px] mb-0.5"
              style={{
                color: 'var(--muted-foreground)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {label}
            </p>
            <p
              className="text-xs break-all"
              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-family-mono)' }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const componentList = [
  'Button',
  'Input',
  'Textarea',
  'Select',
  'Checkbox',
  'Radio',
  'Switch',
  'Slider',
  'Badge',
  'Avatar',
  'Card',
  'Alert',
  'Progress',
  'Spinner',
  'Tabs',
  'Modal',
  'Tooltip',
  'Separator',
  'Table',
  'Skeleton',
  'ScrollArea',
  'Animated',
  'ThemeToggle',
  'Toast',
  'Breadcrumb',
  'Pagination',
];

export function ComponentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);
  const [progress, setProgress] = useState(65);
  const [sliderVal, setSliderVal] = useState([50]);
  const [checkVal, setCheckVal] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [storybookSettingsOpen, setStorybookSettingsOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<Category>('all');
  const [a11yInfo, setA11yInfo] = useState<{
    title: string;
    role: string;
    keys: string;
    attrs: string;
    tokens: string;
  } | null>(null);
  const { style } = useTheme();
  const { t } = useLanguage();

  const categories: { key: Category; label: string }[] = [
    { key: 'all', label: t('components.filterAll') },
    { key: 'form', label: t('components.filterForm') },
    { key: 'data', label: t('components.filterData') },
    { key: 'feedback', label: t('components.filterFeedback') },
    { key: 'navigation', label: t('components.filterNavigation') },
    { key: 'display', label: t('components.filterDisplay') },
  ];

  // Category → first section ID to scroll to
  const CATEGORY_ANCHORS: Record<Category, string> = {
    all: 'button',
    form: 'button',
    data: 'badge',
    feedback: 'alert',
    navigation: 'tabs',
    display: 'animated',
  };

  const handleCategoryClick = (key: Category) => {
    setCategoryFilter(key);
    const anchor = CATEGORY_ANCHORS[key];
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <TooltipProvider>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar nav */}
          <aside className="lg:w-48 shrink-0">
            <div className="sticky top-20 space-y-1">
              <h2 className="text-sm text-muted-foreground mb-2">
                {componentList.length} {t('components.count')}
              </h2>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={t('components.filterPlaceholder')}
                  className="w-full h-7 pl-7 pr-2 rounded-md text-xs bg-muted border border-border focus:border-primary outline-none"
                  aria-label={t('components.filterComponents')}
                />
              </div>
              <nav
                className="space-y-0.5 max-h-[60vh] overflow-y-auto"
                aria-label={t('components.componentList')}
              >
                {componentList
                  .filter((c) => c.toLowerCase().includes(searchFilter.toLowerCase()))
                  .map((c) => (
                    <a
                      key={c}
                      href={`#${c.toLowerCase()}`}
                      className="block px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    >
                      {c}
                    </a>
                  ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 space-y-8 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl mb-1">{t('components.title')}</h2>
                <p className="text-sm text-muted-foreground">{t('components.subtitle')}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStorybookSettingsOpen(true)}
                className="shrink-0"
                aria-label={t('storybook.title')}
              >
                <Settings className="size-4" />
                <span className="hidden sm:inline">{t('common.settings')}</span>
              </Button>
            </div>

            <StorybookSettingsPanel
              open={storybookSettingsOpen}
              onOpenChange={setStorybookSettingsOpen}
            />

            {/* Filter Chips */}
            <div
              className="sticky top-16 z-10 -mx-1 px-1 py-2 rounded-xl"
              style={{
                background: 'color-mix(in oklch, var(--background) 85%, transparent)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                className="flex flex-wrap items-center gap-1.5"
                role="group"
                aria-label={t('components.filterCategory')}
              >
                <span className="text-xs mr-1" style={{ color: 'var(--muted-foreground)' }}>
                  {t('components.filterCategory')}:
                </span>
                {categories.map(({ key, label }) => (
                  <button
                    key={key}
                    role="checkbox"
                    aria-checked={categoryFilter === key}
                    onClick={() => handleCategoryClick(key)}
                    className="px-3 py-1 rounded-full text-xs transition-all focus-visible:outline-none"
                    style={{
                      background: categoryFilter === key ? 'var(--primary)' : 'var(--muted)',
                      color:
                        categoryFilter === key
                          ? 'var(--primary-foreground)'
                          : 'var(--muted-foreground)',
                      border: '1px solid transparent',
                      cursor: 'pointer',
                      fontWeight: categoryFilter === key ? 600 : 400,
                      outline: '2px solid transparent',
                      transition: `all var(--duration-fast) var(--easing-out)`,
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline =
                        `2px solid var(--ring)`;
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline =
                        '2px solid transparent';
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* A11y Panel */}
            <A11yPanel info={a11yInfo} onClose={() => setA11yInfo(null)} />

            {/* 1. Button */}
            <Section
              title={t('components.button')}
              id="button"
              jsxCode={COMPONENT_META.button.jsxCode}
              a11yRole={COMPONENT_META.button.a11yRole}
              a11yKeys={COMPONENT_META.button.a11yKeys}
              a11yAttrs={COMPONENT_META.button.a11yAttrs}
              tokens={COMPONENT_META.button.tokens}
              onSelectA11y={setA11yInfo}
            >
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="default">{t('components.primary')}</Button>
                  <Button variant="secondary">{t('components.secondary')}</Button>
                  <Button variant="outline">{t('components.outline')}</Button>
                  <Button variant="ghost">{t('components.ghost')}</Button>
                  <Button variant="destructive">{t('components.destructive')}</Button>
                  <Button variant="link">{t('components.link')}</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">{t('components.small')}</Button>
                  <Button size="default">{t('components.default')}</Button>
                  <Button size="lg">{t('components.large')}</Button>
                  <Button size="icon" aria-label={t('common.settings')}>
                    <Settings className="size-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button disabled>{t('components.disabled')}</Button>
                  <Button>
                    <Loader2 className="size-4 animate-spin" />
                    {t('common.loading')}
                  </Button>
                  <Button>
                    <Download className="size-4" />
                    {t('components.download')}
                  </Button>
                  <Button>
                    {t('components.send')} <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </Section>

            {/* 2. Input */}
            <Section
              title={t('components.input')}
              id="input"
              jsxCode={COMPONENT_META.input.jsxCode}
              a11yRole={COMPONENT_META.input.a11yRole}
              a11yKeys={COMPONENT_META.input.a11yKeys}
              a11yAttrs={COMPONENT_META.input.a11yAttrs}
              tokens={COMPONENT_META.input.tokens}
              onSelectA11y={setA11yInfo}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                <div className="space-y-1.5">
                  <Label htmlFor="email-input">{t('components.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="email-input"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password-input">{t('components.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="password-input"
                      type="password"
                      placeholder={t('components.enterPassword')}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="disabled-input">{t('components.disabled')}</Label>
                  <Input id="disabled-input" disabled placeholder={t('components.disabledInput')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="search-input">{t('common.search')}</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="search-input"
                      placeholder={`${t('common.search')}...`}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </Section>

            {/* 3. Textarea */}
            <Section
              title={t('components.textarea')}
              id="textarea"
              jsxCode={COMPONENT_META.textarea.jsxCode}
              a11yRole={COMPONENT_META.textarea.a11yRole}
              a11yKeys={COMPONENT_META.textarea.a11yKeys}
              a11yAttrs={COMPONENT_META.textarea.a11yAttrs}
              tokens={COMPONENT_META.textarea.tokens}
              onSelectA11y={setA11yInfo}
            >
              <div className="max-w-md space-y-1.5">
                <Label htmlFor="textarea-demo">{t('components.message')}</Label>
                <Textarea
                  id="textarea-demo"
                  placeholder={t('components.messagePlaceholder')}
                  rows={3}
                />
              </div>
            </Section>

            {/* 4. Select */}
            <Section
              title={t('components.select')}
              id="select"
              jsxCode={COMPONENT_META.select.jsxCode}
              a11yRole={COMPONENT_META.select.a11yRole}
              a11yKeys={COMPONENT_META.select.a11yKeys}
              a11yAttrs={COMPONENT_META.select.a11yAttrs}
              tokens={COMPONENT_META.select.tokens}
              onSelectA11y={setA11yInfo}
            >
              <div className="max-w-xs space-y-1.5">
                <Label>{t('components.chooseFramework')}</Label>
                <Select>
                  <SelectTrigger aria-label={t('components.chooseFramework')}>
                    <SelectValue placeholder={t('components.selectPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="vue">Vue 3</SelectItem>
                    <SelectItem value="svelte">Svelte</SelectItem>
                    <SelectItem value="angular">Angular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Section>

            {/* 5. Checkbox */}
            <Section
              title={t('components.checkbox')}
              id="checkbox"
              jsxCode={COMPONENT_META.checkbox.jsxCode}
              a11yRole={COMPONENT_META.checkbox.a11yRole}
              a11yKeys={COMPONENT_META.checkbox.a11yKeys}
              a11yAttrs={COMPONENT_META.checkbox.a11yAttrs}
              tokens={COMPONENT_META.checkbox.tokens}
              onSelectA11y={setA11yInfo}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="check-1"
                    checked={checkVal}
                    onCheckedChange={(v) => setCheckVal(!!v)}
                  />
                  <Label htmlFor="check-1">{t('components.acceptTerms')}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="check-2" defaultChecked />
                  <Label htmlFor="check-2">{t('components.enableNotifications')}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="check-3" disabled />
                  <Label htmlFor="check-3" className="text-muted-foreground">
                    {t('components.disabledOption')}
                  </Label>
                </div>
              </div>
            </Section>

            {/* 6. Radio */}
            <Section title={t('components.radio')} id="radio">
              <fieldset className="space-y-2">
                <legend className="text-sm mb-2">{t('components.preferredContact')}</legend>
                {[
                  { value: 'email', label: t('components.emailOption') },
                  { value: 'phone', label: t('components.phoneOption') },
                  { value: 'sms', label: t('components.smsOption') },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="contact"
                      value={opt.value}
                      defaultChecked={opt.value === 'email'}
                      className="accent-[var(--primary)] size-4"
                      aria-label={opt.label}
                    />
                    {opt.label}
                  </label>
                ))}
              </fieldset>
            </Section>

            {/* 7. Switch */}
            <Section
              title={t('components.switch')}
              id="switch"
              jsxCode={COMPONENT_META.switch.jsxCode}
              a11yRole={COMPONENT_META.switch.a11yRole}
              a11yKeys={COMPONENT_META.switch.a11yKeys}
              a11yAttrs={COMPONENT_META.switch.a11yAttrs}
              tokens={COMPONENT_META.switch.tokens}
              onSelectA11y={setA11yInfo}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Switch id="switch-1" checked={switchOn} onCheckedChange={setSwitchOn} />
                  <Label htmlFor="switch-1">
                    {t('components.darkMode')}: {switchOn ? t('common.on') : t('common.off')}
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="switch-2" disabled />
                  <Label htmlFor="switch-2" className="text-muted-foreground">
                    {t('common.disabled')}
                  </Label>
                </div>
              </div>
            </Section>

            {/* 8. Slider */}
            <Section
              title={t('components.slider')}
              id="slider"
              jsxCode={COMPONENT_META.slider.jsxCode}
              a11yRole={COMPONENT_META.slider.a11yRole}
              a11yKeys={COMPONENT_META.slider.a11yKeys}
              a11yAttrs={COMPONENT_META.slider.a11yAttrs}
              tokens={COMPONENT_META.slider.tokens}
              onSelectA11y={setA11yInfo}
            >
              <div className="max-w-sm space-y-3">
                <Label>
                  {t('components.volume')}: {sliderVal[0]}%
                </Label>
                <Slider
                  value={sliderVal}
                  onValueChange={setSliderVal}
                  max={100}
                  step={1}
                  aria-label={t('components.volume')}
                />
              </div>
            </Section>

            {/* 9. Badge */}
            <Section title={t('components.badge')} id="badge">
              <div className="flex flex-wrap gap-2">
                <Badge>{t('components.default')}</Badge>
                <Badge variant="secondary">{t('components.secondary')}</Badge>
                <Badge variant="outline">{t('components.outline')}</Badge>
                <Badge variant="destructive">{t('components.destructive')}</Badge>
                <Badge className="bg-success text-success-foreground">{t('common.success')}</Badge>
                <Badge className="bg-warning text-warning-foreground">{t('common.warning')}</Badge>
              </div>
            </Section>

            {/* 10. Avatar */}
            <Section title={t('components.avatar')} id="avatar">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=YC" alt="YC" />
                  <AvatarFallback>YC</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">AB</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-destructive text-destructive-foreground">
                    <User className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <Avatar className="size-12">
                  <AvatarFallback className="bg-success text-success-foreground text-lg">
                    DS
                  </AvatarFallback>
                </Avatar>
              </div>
            </Section>

            {/* 11. Card */}
            <Section title={t('components.card')} id="card">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('components.designTokens')}</CardTitle>
                    <CardDescription>{t('components.designTokensDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t('components.designTokensContent')}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline">
                      {t('components.learnMore')}
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="border-primary/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{t('components.statistics')}</CardTitle>
                      <Badge>{t('common.live')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-2xl text-primary">26+</p>
                        <p className="text-xs text-muted-foreground">{t('components.count')}</p>
                      </div>
                      <div>
                        <p className="text-2xl text-primary">3</p>
                        <p className="text-xs text-muted-foreground">{t('components.themes')}</p>
                      </div>
                      <div>
                        <p className="text-2xl text-success">AA</p>
                        <p className="text-xs text-muted-foreground">{t('components.wcagLevel')}</p>
                      </div>
                      <div>
                        <p className="text-2xl text-warning">8px</p>
                        <p className="text-xs text-muted-foreground">{t('components.baseGrid')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Section>

            {/* 12. Alert */}
            <Section title={t('components.alert')} id="alert">
              <div className="space-y-3">
                <Alert>
                  <Info className="size-4" />
                  <AlertTitle>{t('common.info')}</AlertTitle>
                  <AlertDescription>{t('components.infoAlertDesc')}</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>{t('common.error')}</AlertTitle>
                  <AlertDescription>{t('components.errorAlertDesc')}</AlertDescription>
                </Alert>
                <Alert className="border-success/30 bg-success/5 text-success [&>svg]:text-success">
                  <CheckCircle2 className="size-4" />
                  <AlertTitle>{t('common.success')}</AlertTitle>
                  <AlertDescription>{t('components.successAlert')}</AlertDescription>
                </Alert>
                <Alert className="border-warning/30 bg-warning/5 text-warning [&>svg]:text-warning">
                  <AlertTriangle className="size-4" />
                  <AlertTitle>{t('common.warning')}</AlertTitle>
                  <AlertDescription>{t('components.warningAlert')}</AlertDescription>
                </Alert>
              </div>
            </Section>

            {/* 13. Progress */}
            <Section title={t('components.progress')} id="progress">
              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t('components.uploadProgress')}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} aria-label={t('components.uploadProgress')} />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setProgress(Math.max(0, progress - 10))}
                  >
                    -10
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setProgress(Math.min(100, progress + 10))}
                  >
                    +10
                  </Button>
                </div>
              </div>
            </Section>

            {/* 14. Spinner */}
            <Section title={t('components.spinner')} id="spinner">
              <div className="flex items-center gap-6">
                <Loader2
                  className="size-5 animate-spin text-primary"
                  aria-label={t('common.loading')}
                />
                <Loader2
                  className="size-8 animate-spin text-primary"
                  aria-label={t('common.loading')}
                />
                <div
                  className="size-8 rounded-full border-2 border-muted border-t-primary animate-spin"
                  role="status"
                  aria-label={t('common.loading')}
                />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  {t('components.loadingData')}
                </div>
              </div>
            </Section>

            {/* 15. Tabs */}
            <Section title={t('components.tabs')} id="tabs">
              <Tabs defaultValue="react" className="max-w-md">
                <TabsList>
                  <TabsTrigger value="react">React</TabsTrigger>
                  <TabsTrigger value="vue">Vue 3</TabsTrigger>
                  <TabsTrigger value="svelte">Svelte</TabsTrigger>
                </TabsList>
                <TabsContent value="react" className="mt-3">
                  <pre className="text-xs p-3 rounded-lg bg-muted font-mono overflow-x-auto">
                    {`import { Button } from '@yyc3/ui-react';

export function App() {
  return <Button variant="primary">Click me</Button>;
}`}
                  </pre>
                </TabsContent>
                <TabsContent value="vue" className="mt-3">
                  <pre className="text-xs p-3 rounded-lg bg-muted font-mono overflow-x-auto">
                    {`<template>
  <YButton variant="primary">Click me</YButton>
</template>
<script setup>
import { YButton } from '@yyc3/ui-vue';
</script>`}
                  </pre>
                </TabsContent>
                <TabsContent value="svelte" className="mt-3">
                  <pre className="text-xs p-3 rounded-lg bg-muted font-mono overflow-x-auto">
                    {`<script>
  import { Button } from '@yyc3/ui-svelte';
</script>
<Button variant="primary">Click me</Button>`}
                  </pre>
                </TabsContent>
              </Tabs>
            </Section>

            {/* 16. Modal/Dialog */}
            <Section title={t('components.modal')} id="modal">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>{t('components.openModal')}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('components.exportDesignToken')}</DialogTitle>
                    <DialogDescription>{t('components.exportDesc')}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 py-2">
                    {['tokens.json', 'variables.css', 'tokens.js', 'tokens.d.ts'].map((f) => (
                      <label
                        key={f}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer text-sm"
                      >
                        <Checkbox defaultChecked />
                        <code className="font-mono text-xs">{f}</code>
                      </label>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button onClick={() => setDialogOpen(false)}>
                      <Download className="size-4" /> {t('common.export')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Section>

            {/* 17. Tooltip */}
            <Section title={t('components.tooltip')} id="tooltip">
              <div className="flex gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" aria-label={t('common.edit')}>
                      <Edit className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('components.editItem')}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" aria-label={t('common.copy')}>
                      <Copy className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('components.copyToClipboard')}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" aria-label={t('common.delete')}>
                      <Trash2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('components.deleteItem')}</TooltipContent>
                </Tooltip>
              </div>
            </Section>

            {/* 18. Separator */}
            <Section title={t('components.separator')} id="separator">
              <div className="space-y-4 max-w-md">
                <div>
                  <p className="text-sm">{t('components.sectionA')}</p>
                  <Separator className="my-2" />
                  <p className="text-sm">{t('components.sectionB')}</p>
                </div>
                <div className="flex items-center gap-3 h-6">
                  <span className="text-sm">{t('components.item1')}</span>
                  <Separator orientation="vertical" />
                  <span className="text-sm">{t('components.item2')}</span>
                  <Separator orientation="vertical" />
                  <span className="text-sm">{t('components.item3')}</span>
                </div>
              </div>
            </Section>

            {/* 19. Table */}
            <Section title={t('components.table')} id="table">
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('components.token')}</TableHead>
                      <TableHead>{t('components.valueLight')}</TableHead>
                      <TableHead>{t('components.valueDark')}</TableHead>
                      <TableHead className="text-right">{t('components.contrast')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { token: '--primary', light: '#2563eb', dark: '#3b82f6', contrast: '7.2:1' },
                      {
                        token: '--destructive',
                        light: '#dc2626',
                        dark: '#ef4444',
                        contrast: '5.8:1',
                      },
                      { token: '--success', light: '#16a34a', dark: '#22c55e', contrast: '4.7:1' },
                      { token: '--warning', light: '#d97706', dark: '#f59e0b', contrast: '4.5:1' },
                    ].map((row) => (
                      <TableRow key={row.token}>
                        <TableCell className="font-mono text-xs">{row.token}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="size-4 rounded border border-border"
                              style={{ background: row.light }}
                            />
                            <span className="text-xs font-mono">{row.light}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="size-4 rounded border border-border"
                              style={{ background: row.dark }}
                            />
                            <span className="text-xs font-mono">{row.dark}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="font-mono text-xs">
                            {row.contrast}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Section>

            {/* 20. Skeleton */}
            <Section title={t('components.skeleton')} id="skeleton">
              <div className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </Section>

            {/* 21. ScrollArea */}
            <Section title={t('components.scrollArea')} id="scrollarea">
              <ScrollArea className="h-40 rounded-lg border border-border p-4">
                <div className="space-y-2">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm py-1">
                      <span className="text-muted-foreground font-mono text-xs w-6">{i + 1}</span>
                      <span>
                        {t('components.tokenEntry')} #{i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Section>

            {/* 22. Animated */}
            <Section title={t('components.animated')} id="animated">
              <div className="flex flex-wrap gap-4 items-end">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }}
                  className="p-4 rounded-xl border border-border bg-primary/5"
                >
                  <p className="text-sm">{t('components.fadeInUp')}</p>
                  <p className="text-xs text-muted-foreground">{t('components.duration350')}</p>
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="p-4 rounded-xl border border-primary/30 bg-primary/5"
                >
                  <p className="text-sm">{t('components.pulseScale')}</p>
                  <p className="text-xs text-muted-foreground">{t('components.infiniteLoop')}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: 'var(--shadow-glow)' }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 rounded-xl border border-border cursor-pointer select-none"
                >
                  <p className="text-sm">{t('components.hoverTap')}</p>
                  <p className="text-xs text-muted-foreground">{t('components.interactive')}</p>
                </motion.div>
                {style === 'cyber' && (
                  <div className="p-4 rounded-xl border border-primary/50 animate-neon-pulse">
                    <p className="text-sm">{t('components.neonPulse')}</p>
                    <p className="text-xs text-muted-foreground">{t('components.cyberOnly')}</p>
                  </div>
                )}
              </div>
            </Section>

            {/* 23. ThemeToggle */}
            <Section title={t('components.themeToggle')} id="themetoggle">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t('components.themeToggleDesc')}{' '}
                  <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded">
                    Ctrl+Alt+T
                  </kbd>{' '}
                  {t('components.cycleThemes')}
                </p>
                <div className="inline-block">
                  <div className="p-3 rounded-lg border border-border bg-muted/30">
                    <ThemeToggleInline />
                  </div>
                </div>
              </div>
            </Section>

            {/* 24. Toast */}
            <Section title={t('components.toast')} id="toast">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    import('sonner').then(({ toast }) =>
                      toast(t('components.defaultNotification'))
                    );
                  }}
                >
                  {t('components.defaultToast')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    import('sonner').then(({ toast }) =>
                      toast.success(t('components.operationSuccessful'))
                    );
                  }}
                >
                  {t('components.successToast')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    import('sonner').then(({ toast }) =>
                      toast.error(t('components.somethingWentWrong'))
                    );
                  }}
                >
                  {t('components.errorToast')}
                </Button>
              </div>
            </Section>

            {/* 25. Breadcrumb */}
            <Section title={t('components.breadcrumb')} id="breadcrumb">
              <nav aria-label={t('components.breadcrumb')}>
                <ol className="flex items-center gap-1.5 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t('nav.home')}
                    </a>
                  </li>
                  <li>
                    <ChevronRight className="size-3.5 text-muted-foreground" />
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t('nav.components')}
                    </a>
                  </li>
                  <li>
                    <ChevronRight className="size-3.5 text-muted-foreground" />
                  </li>
                  <li className="text-foreground" aria-current="page">
                    {t('components.breadcrumb')}
                  </li>
                </ol>
              </nav>
            </Section>

            {/* 26. Pagination */}
            <Section title={t('components.pagination')} id="pagination">
              <PaginationDemo />
            </Section>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function ThemeToggleInline() {
  const { style, mode, resolvedMode } = useTheme();
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-3 text-xs">
      <span>
        {t('theme.style')}: <strong className="text-primary capitalize">{style}</strong>
      </span>
      <Separator orientation="vertical" className="h-4" />
      <span>
        {t('theme.mode')}:{' '}
        <strong className="capitalize">
          {resolvedMode === 'dark' ? t('theme.dark') : t('theme.light')}
        </strong>
      </span>
    </div>
  );
}

function PaginationDemo() {
  const [page, setPage] = useState(1);
  const total = 10;
  const { t } = useLanguage();
  return (
    <nav aria-label={t('components.pagination')} className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        aria-label={t('components.prevPage')}
      >
        {t('components.prevPage')}
      </Button>
      {Array.from({ length: Math.min(5, total) }, (_, i) => {
        const p = page <= 3 ? i + 1 : page >= total - 2 ? total - 4 + i : page - 2 + i;
        return (
          <Button
            key={p}
            variant={p === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPage(p)}
            aria-label={`${t('components.pagePrefix')}${p}${t('components.pageSuffix')}`}
            aria-current={p === page ? 'page' : undefined}
            className="w-9"
          >
            {p}
          </Button>
        );
      })}
      <Button
        variant="outline"
        size="sm"
        disabled={page === total}
        onClick={() => setPage(page + 1)}
        aria-label={t('components.nextPage')}
      >
        {t('components.nextPage')}
      </Button>
    </nav>
  );
}
