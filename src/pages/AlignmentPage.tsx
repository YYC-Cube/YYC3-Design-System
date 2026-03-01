/**
 * YYC³ Design System — Alignment Summary Page
 *
 * Token Reference:
 *   background:   var(--background), var(--card), var(--muted)
 *   foreground:   var(--foreground), var(--muted-foreground)
 *   primary:      var(--primary), var(--primary-foreground)
 *   success:      var(--success)
 *   warning:      var(--warning)
 *   border:       var(--border)
 *   shadow:       var(--shadow-sm)
 *   animation:    var(--duration-normal) var(--easing-default)
 */
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  Layers,
  Palette,
  Languages,
  Component,
  FileJson,
  Accessibility,
  Ruler,
  FileText,
  Upload,
  Settings,
  Hammer,
  Shield,
  TestTube2,
  Globe,
  Workflow,
  FileCode2,
  Cpu,
  Eye,
  GitBranch,
  BookOpen,
  Wrench,
  Clock,
  type LucideIcon,
} from 'lucide-react';

type Status = 'done' | 'partial' | 'pending';

interface AlignmentItem {
  label: string;
  status: Status;
  detail: string;
  token?: string;
}
interface AlignmentSection {
  title: string;
  icon: LucideIcon;
  items: AlignmentItem[];
}

function StatusIcon({ status }: { status: Status }) {
  if (status === 'done') return <CheckCircle2 className="size-4 text-success shrink-0" />;
  if (status === 'partial') return <AlertTriangle className="size-4 text-warning shrink-0" />;
  return <Circle className="size-4 text-muted-foreground shrink-0" />;
}

function ProgressBar({ done, partial, total }: { done: number; partial: number; total: number }) {
  const doneP = (done / total) * 100;
  const partialP = (partial / total) * 100;
  return (
    <div className="w-full h-2 rounded-full bg-muted overflow-hidden flex">
      <div
        className="h-full rounded-l-full"
        style={{
          width: `${doneP}%`,
          background: 'var(--success)',
          transition: 'width var(--duration-normal) var(--easing-default)',
        }}
      />
      <div
        className="h-full"
        style={{
          width: `${partialP}%`,
          background: 'var(--warning)',
          transition: 'width var(--duration-normal) var(--easing-default)',
        }}
      />
    </div>
  );
}

function countStats(sections: AlignmentSection[]) {
  let done = 0,
    partial = 0,
    pending = 0;
  for (const s of sections)
    for (const i of s.items) {
      if (i.status === 'done') done++;
      else if (i.status === 'partial') partial++;
      else pending++;
    }
  return { done, partial, pending, total: done + partial + pending };
}

export function AlignmentPage() {
  const { t } = useLanguage();
  const { style, resolvedMode } = useTheme();

  const statusLabel = (s: Status) =>
    s === 'done'
      ? t('alignment.statusDone')
      : s === 'partial'
        ? t('alignment.statusPartial')
        : t('alignment.statusPending');

  // ─── Phase 1 ───
  const phase1Sections: AlignmentSection[] = [
    {
      title: t('alignment.themeSystem'),
      icon: Palette,
      items: [
        {
          label: t('alignment.threeThemes'),
          status: 'done',
          detail: t('alignment.threeThemesDetail'),
          token: 'data-theme',
        },
        {
          label: t('alignment.lightDark'),
          status: 'done',
          detail: t('alignment.lightDarkDetail'),
          token: '.dark selector',
        },
        {
          label: t('alignment.oklchFallback'),
          status: 'done',
          detail: t('alignment.oklchFallbackDetail'),
          token: '--primary, --background, ...',
        },
        {
          label: t('alignment.cssDriven'),
          status: 'done',
          detail: t('alignment.cssDrivenDetail'),
          token: '@theme inline',
        },
        {
          label: t('alignment.themeShortcut'),
          status: 'done',
          detail: t('alignment.themeShortcutDetail'),
          token: 'Ctrl+Alt+T',
        },
      ],
    },
    {
      title: t('alignment.bilingualSystem'),
      icon: Languages,
      items: [
        {
          label: t('alignment.langContext'),
          status: 'done',
          detail: t('alignment.langContextDetail'),
        },
        {
          label: t('alignment.defaultChinese'),
          status: 'done',
          detail: t('alignment.defaultChineseDetail'),
        },
        {
          label: t('alignment.langShortcut'),
          status: 'done',
          detail: t('alignment.langShortcutDetail'),
          token: 'Ctrl+Alt+L',
        },
        {
          label: t('alignment.allBilingual'),
          status: 'done',
          detail: t('alignment.allBilingualDetail'),
        },
      ],
    },
    {
      title: t('alignment.componentLibrary'),
      icon: Component,
      items: [
        {
          label: t('alignment.shadcnComponents'),
          status: 'done',
          detail: t('alignment.shadcnDetail'),
        },
        {
          label: t('alignment.themeToggleComp'),
          status: 'done',
          detail: t('alignment.themeToggleDetail'),
        },
        {
          label: t('alignment.langToggleComp'),
          status: 'done',
          detail: t('alignment.langToggleDetail'),
        },
        { label: t('alignment.layoutComp'), status: 'done', detail: t('alignment.layoutDetail') },
        {
          label: t('alignment.motionIntegration'),
          status: 'done',
          detail: t('alignment.motionDetail'),
        },
      ],
    },
    {
      title: t('alignment.pageArchitecture'),
      icon: Layers,
      items: [
        {
          label: t('alignment.overviewPage'),
          status: 'done',
          detail: t('alignment.overviewPageDetail'),
        },
        {
          label: t('alignment.componentsPage'),
          status: 'done',
          detail: t('alignment.componentsPageDetail'),
        },
        {
          label: t('alignment.playgroundPageLabel'),
          status: 'done',
          detail: t('alignment.playgroundPageDetail'),
        },
        {
          label: t('alignment.tokensPageLabel'),
          status: 'done',
          detail: t('alignment.tokensPageDetail'),
        },
        {
          label: t('alignment.routerArch'),
          status: 'done',
          detail: t('alignment.routerArchDetail'),
        },
      ],
    },
    {
      title: t('alignment.tokenSystem'),
      icon: FileJson,
      items: [
        {
          label: t('alignment.colorTokens'),
          status: 'done',
          detail: t('alignment.colorTokensDetail'),
          token: '--color-primary, --color-background, ...',
        },
        {
          label: t('alignment.spacingTokens'),
          status: 'done',
          detail: t('alignment.spacingTokensDetail'),
          token: '--spacing-1 ~ --spacing-8',
        },
        {
          label: t('alignment.radiusTokens'),
          status: 'done',
          detail: t('alignment.radiusTokensDetail'),
          token: '--radius-sm ~ --radius-xl',
        },
        {
          label: t('alignment.shadowTokens'),
          status: 'done',
          detail: t('alignment.shadowTokensDetail'),
          token: '--shadow-sm, --shadow-glow',
        },
        {
          label: t('alignment.animationTokens'),
          status: 'done',
          detail: t('alignment.animationTokensDetail'),
          token: '--duration-fast, --easing-default',
        },
        {
          label: t('alignment.iconTokens'),
          status: 'done',
          detail: t('alignment.iconTokensDetail'),
          token: '--icon-xs ~ --icon-xl',
        },
      ],
    },
    {
      title: t('alignment.fiveHighAlignment'),
      icon: Accessibility,
      items: [
        {
          label: t('alignment.highA11y'),
          status: 'done',
          detail: t('alignment.highA11yDetail'),
          token: '--ring, aria-label',
        },
        {
          label: t('alignment.highCustom'),
          status: 'done',
          detail: t('alignment.highCustomDetail'),
        },
        { label: t('alignment.highPerf'), status: 'done', detail: t('alignment.highPerfDetail') },
        {
          label: t('alignment.highConsist'),
          status: 'done',
          detail: t('alignment.highConsistDetail'),
        },
        {
          label: t('alignment.highExtend'),
          status: 'done',
          detail: t('alignment.highExtendDetail'),
        },
      ],
    },
  ];

  // ─── Phase 2 ───
  const phase2Sections: AlignmentSection[] = [
    {
      title: t('alignment.tokenManagerTitle'),
      icon: Upload,
      items: [
        {
          label: t('alignment.breadcrumbNav'),
          status: 'done',
          detail: t('alignment.breadcrumbNavDetail'),
        },
        {
          label: t('alignment.collapsibleSidebar'),
          status: 'done',
          detail: t('alignment.collapsibleSidebarDetail'),
        },
        {
          label: t('alignment.fileImportBox'),
          status: 'done',
          detail: t('alignment.fileImportBoxDetail'),
        },
        {
          label: t('alignment.jsonEditorLabel'),
          status: 'done',
          detail: t('alignment.jsonEditorDetail'),
        },
        {
          label: t('alignment.tokenTableLabel'),
          status: 'done',
          detail: t('alignment.tokenTableDetail'),
        },
        {
          label: t('alignment.applyModal'),
          status: 'done',
          detail: t('alignment.applyModalDetail'),
        },
        {
          label: t('alignment.historyList'),
          status: 'done',
          detail: t('alignment.historyListDetail'),
        },
        {
          label: t('alignment.importShortcut'),
          status: 'done',
          detail: t('alignment.importShortcutDetail'),
        },
      ],
    },
    {
      title: t('alignment.storybookTitle'),
      icon: Settings,
      items: [
        {
          label: t('alignment.settingsButton'),
          status: 'done',
          detail: t('alignment.settingsButtonDetail'),
        },
        {
          label: t('alignment.isolationSwitch'),
          status: 'done',
          detail: t('alignment.isolationSwitchDetail'),
        },
        {
          label: t('alignment.snapshotDropdown'),
          status: 'done',
          detail: t('alignment.snapshotDropdownDetail'),
        },
        {
          label: t('alignment.qualitySlider'),
          status: 'done',
          detail: t('alignment.qualitySliderDetail'),
        },
        {
          label: t('alignment.runTestsButton'),
          status: 'done',
          detail: t('alignment.runTestsButtonDetail'),
        },
        {
          label: t('alignment.statusBadge'),
          status: 'done',
          detail: t('alignment.statusBadgeDetail'),
        },
      ],
    },
    {
      title: t('alignment.buildTitle'),
      icon: Hammer,
      items: [
        { label: t('alignment.buildPage'), status: 'done', detail: t('alignment.buildPageDetail') },
        {
          label: t('alignment.platformIcon'),
          status: 'done',
          detail: t('alignment.platformIconDetail'),
        },
        {
          label: t('alignment.enableToggle'),
          status: 'done',
          detail: t('alignment.enableToggleDetail'),
        },
        {
          label: t('alignment.outputDropdown'),
          status: 'done',
          detail: t('alignment.outputDropdownDetail'),
        },
        {
          label: t('alignment.checkboxGroup'),
          status: 'done',
          detail: t('alignment.checkboxGroupDetail'),
        },
        {
          label: t('alignment.generateProgress'),
          status: 'done',
          detail: t('alignment.generateProgressDetail'),
        },
        {
          label: t('alignment.buildShortcut'),
          status: 'done',
          detail: t('alignment.buildShortcutDetail'),
        },
        {
          label: t('alignment.feedbackToast'),
          status: 'done',
          detail: t('alignment.feedbackToastDetail'),
        },
      ],
    },
    {
      title: t('alignment.globalStandards'),
      icon: Ruler,
      items: [
        {
          label: t('alignment.localeKeyMigration'),
          status: 'done',
          detail: t('alignment.localeKeyMigrationDetail'),
        },
        {
          label: t('alignment.tokenReference'),
          status: 'done',
          detail: t('alignment.tokenReferenceDetail'),
        },
        {
          label: t('alignment.threeThemeVariant'),
          status: 'done',
          detail: t('alignment.threeThemeVariantDetail'),
        },
        {
          label: t('alignment.interactionStates'),
          status: 'done',
          detail: t('alignment.interactionStatesDetail'),
        },
      ],
    },
  ];

  // ─── Phase 3 ───
  const phase3Sections: AlignmentSection[] = [
    {
      title: '3.1 i18n + Types',
      icon: Globe,
      items: [
        {
          label: t('alignment.localeIndexTs'),
          status: 'done',
          detail: t('alignment.localeIndexTsDetail'),
        },
        {
          label: t('alignment.typeDefinitions'),
          status: 'done',
          detail: t('alignment.typeDefinitionsDetail'),
        },
        {
          label: t('alignment.localeValidation'),
          status: 'done',
          detail: t('alignment.localeValidationDetail'),
        },
      ],
    },
    {
      title: '3.2 Testing',
      icon: TestTube2,
      items: [
        { label: t('alignment.unitTests'), status: 'done', detail: t('alignment.unitTestsDetail') },
        {
          label: t('alignment.integrationTests'),
          status: 'done',
          detail: t('alignment.integrationTestsDetail'),
        },
        { label: t('alignment.e2eTests'), status: 'done', detail: t('alignment.e2eTestsDetail') },
        { label: t('alignment.a11yTests'), status: 'done', detail: t('alignment.a11yTestsDetail') },
      ],
    },
    {
      title: '3.3 CI/CD + Quality',
      icon: Workflow,
      items: [
        {
          label: t('alignment.perfBenchmark'),
          status: 'done',
          detail: t('alignment.perfBenchmarkDetail'),
        },
        {
          label: t('alignment.visualRegression'),
          status: 'done',
          detail: t('alignment.visualRegressionDetail'),
        },
        {
          label: t('alignment.cicdPipeline'),
          status: 'done',
          detail: t('alignment.cicdPipelineDetail'),
        },
        {
          label: t('alignment.codeQuality'),
          status: 'done',
          detail: t('alignment.codeQualityDetail'),
        },
        { label: t('alignment.qaDoc'), status: 'done', detail: t('alignment.qaDocDetail') },
        {
          label: t('alignment.qaDashboard'),
          status: 'done',
          detail: t('alignment.qaDashboardDetail'),
          token: '/qa',
        },
        {
          label: t('alignment.rootConfigs'),
          status: 'done',
          detail: t('alignment.rootConfigsDetail'),
        },
        {
          label: t('alignment.ciWorkflows'),
          status: 'done',
          detail: t('alignment.ciWorkflowsDetail'),
          token: '.github/workflows/',
        },
        {
          label: t('alignment.qaShortcut'),
          status: 'done',
          detail: t('alignment.qaShortcutDetail'),
          token: 'Ctrl+Alt+Q',
        },
      ],
    },
  ];

  // ─── Phase 4: Prompt.md Execution Alignment ───
  const phase4Sections: AlignmentSection[] = [
    {
      title: t('alignment.promptSection1'),
      icon: FileCode2,
      items: [
        {
          label: t('alignment.promptSection1Item1'),
          status: 'done',
          detail: t('alignment.promptSection1Item1Detail'),
          token: 'src/types/tokens.d.ts',
        },
        {
          label: t('alignment.promptSection1Item2'),
          status: 'done',
          detail: t('alignment.promptSection1Item2Detail'),
          token: 'src/types/theme.d.ts',
        },
        {
          label: t('alignment.promptSection1Item3'),
          status: 'done',
          detail: t('alignment.promptSection1Item3Detail'),
          token: 'src/types/language.d.ts',
        },
        {
          label: t('alignment.promptSection1Item4'),
          status: 'done',
          detail: t('alignment.promptSection1Item4Detail'),
          token: 'src/types/components.d.ts',
        },
        {
          label: t('alignment.promptSection1Item5'),
          status: 'done',
          detail: t('alignment.promptSection1Item5Detail'),
          token: 'src/types/animation.d.ts',
        },
        {
          label: t('alignment.promptSection1Item6'),
          status: 'done',
          detail: t('alignment.promptSection1Item6Detail'),
          token: 'src/types/index.d.ts',
        },
      ],
    },
    {
      title: t('alignment.promptSection2'),
      icon: Shield,
      items: [
        {
          label: t('alignment.promptSection2Item1'),
          status: 'done',
          detail: t('alignment.promptSection2Item1Detail'),
          token: 'src/qa/configs/eslintrc.js',
        },
        {
          label: t('alignment.promptSection2Item2'),
          status: 'done',
          detail: t('alignment.promptSection2Item2Detail'),
          token: 'src/qa/configs/prettierrc.json',
        },
        {
          label: t('alignment.promptSection2Item3'),
          status: 'done',
          detail: t('alignment.promptSection2Item3Detail'),
          token: 'src/qa/configs/lintstagedrc.json',
        },
        {
          label: t('alignment.promptSection2Item4'),
          status: 'partial',
          detail: t('alignment.promptSection2Item4Detail'),
          token: 'src/qa/ci-workflow.ts',
        },
      ],
    },
    {
      title: t('alignment.promptSection3'),
      icon: TestTube2,
      items: [
        {
          label: t('alignment.promptSection3Item1'),
          status: 'done',
          detail: t('alignment.promptSection3Item1Detail'),
          token: 'src/qa/jest.config.ts',
        },
        {
          label: t('alignment.promptSection3Item2'),
          status: 'done',
          detail: t('alignment.promptSection3Item2Detail'),
          token: 'src/qa/tests/unit/',
        },
        {
          label: t('alignment.promptSection3Item3'),
          status: 'done',
          detail: t('alignment.promptSection3Item3Detail'),
          token: 'src/qa/tests/integration/',
        },
        {
          label: t('alignment.promptSection3Item4'),
          status: 'done',
          detail: t('alignment.promptSection3Item4Detail'),
          token: 'src/qa/tests/a11y/',
        },
        {
          label: t('alignment.promptSection3Item5'),
          status: 'done',
          detail: t('alignment.promptSection3Item5Detail'),
          token: 'src/qa/scripts/',
        },
      ],
    },
    {
      title: t('alignment.promptSection4'),
      icon: Globe,
      items: [
        {
          label: t('alignment.promptSection4Item1'),
          status: 'done',
          detail: t('alignment.promptSection4Item1Detail'),
          token: 'src/qa/configs/playwright.config.ts',
        },
        {
          label: t('alignment.promptSection4Item2'),
          status: 'done',
          detail: t('alignment.promptSection4Item2Detail'),
          token: 'src/qa/tests/e2e/',
        },
      ],
    },
    {
      title: t('alignment.promptSection5'),
      icon: Cpu,
      items: [
        {
          label: t('alignment.promptSection5Item1'),
          status: 'done',
          detail: t('alignment.promptSection5Item1Detail'),
          token: 'src/qa/configs/lighthouserc.json',
        },
        {
          label: t('alignment.promptSection5Item2'),
          status: 'done',
          detail: t('alignment.promptSection5Item2Detail'),
          token: 'src/qa/scripts/perf-test.ts',
        },
      ],
    },
    {
      title: t('alignment.promptSection6'),
      icon: Eye,
      items: [
        {
          label: t('alignment.promptSection6Item1'),
          status: 'done',
          detail: t('alignment.promptSection6Item1Detail'),
          token: 'src/qa/tests/visual/',
        },
      ],
    },
    {
      title: t('alignment.promptSection7'),
      icon: GitBranch,
      items: [
        {
          label: t('alignment.promptSection7Item1'),
          status: 'done',
          detail: t('alignment.promptSection7Item1Detail'),
          token: 'src/qa/workflows/ci.yml.ts',
        },
      ],
    },
    {
      title: t('alignment.promptSection8'),
      icon: BookOpen,
      items: [
        {
          label: t('alignment.promptSection8Item1'),
          status: 'done',
          detail: t('alignment.promptSection8Item1Detail'),
          token: 'docs/quality/README.md',
        },
      ],
    },
    {
      title: t('alignment.promptSection9'),
      icon: Wrench,
      items: [
        {
          label: t('alignment.promptSection9Item1'),
          status: 'done',
          detail: t('alignment.promptSection9Item1Detail'),
        },
        {
          label: t('alignment.promptSection9Item2'),
          status: 'done',
          detail: t('alignment.promptSection9Item2Detail'),
          token: 'design/tokens.json',
        },
      ],
    },
    {
      title: t('alignment.promptPendingTitle'),
      icon: Clock,
      items: [
        {
          label: t('alignment.promptPending1'),
          status: 'pending',
          detail: t('alignment.promptPending1Detail'),
        },
        {
          label: t('alignment.promptPending2'),
          status: 'done',
          detail: t('alignment.promptPending2Detail'),
        },
        {
          label: t('alignment.promptPending3'),
          status: 'done',
          detail: t('alignment.promptPending3Detail'),
        },
        {
          label: t('alignment.promptPending4'),
          status: 'done',
          detail: t('alignment.promptPending4Detail'),
        },
      ],
    },
  ];

  const p1Stats = countStats(phase1Sections);
  const p2Stats = countStats(phase2Sections);
  const p3Stats = countStats(phase3Sections);
  const p4Stats = countStats(phase4Sections);
  const allStats = {
    done: p1Stats.done + p2Stats.done + p3Stats.done + p4Stats.done,
    partial: p1Stats.partial + p2Stats.partial + p3Stats.partial + p4Stats.partial,
    pending: p1Stats.pending + p2Stats.pending + p3Stats.pending + p4Stats.pending,
    total: p1Stats.total + p2Stats.total + p3Stats.total + p4Stats.total,
  };

  const renderSections = (sections: AlignmentSection[], color: string) =>
    sections.map((section) => (
      <div
        key={section.title}
        className="rounded-xl border border-border bg-card overflow-hidden"
        style={{ boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="flex items-center gap-2 px-5 py-3 bg-muted/50 border-b border-border">
          <section.icon className={`size-4 text-${color}`} />
          <h3 className="text-sm">{section.title}</h3>
          <span className="ml-auto text-xs text-muted-foreground">
            {section.items.filter((i) => i.status === 'done').length}/{section.items.length}
          </span>
        </div>
        <div className="divide-y divide-border">
          {section.items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 px-5 py-3">
              <div className="pt-0.5">
                <StatusIcon status={item.status} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm">{item.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {statusLabel(item.status)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                {item.token && (
                  <code className="text-[10px] text-primary/70 mt-1 inline-block font-mono bg-primary/5 px-1.5 py-0.5 rounded">
                    {item.token}
                  </code>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ));

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <section className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-xs text-muted-foreground">
          <FileText className="size-3" />
          {t('alignment.phase4Completed')}
        </div>
        <h1 className="text-3xl tracking-tight">{t('alignment.title')}</h1>
        <p className="text-muted-foreground max-w-3xl">{t('alignment.subtitle')}</p>
      </section>

      {/* Overall Progress */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: t('alignment.overallProgress'), stats: allStats, color: 'primary' },
          { title: t('alignment.phase1Title'), stats: p1Stats, color: 'success' },
          { title: t('alignment.phase2Title'), stats: p2Stats, color: 'success' },
          { title: t('alignment.phase3Title'), stats: p3Stats, color: 'success' },
          { title: t('alignment.phase4Title'), stats: p4Stats, color: 'warning' },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-border bg-card p-5 space-y-3"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <h3 className="text-sm text-muted-foreground">{card.title}</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl tabular-nums" style={{ color: `var(--${card.color})` }}>
                {Math.round(
                  ((card.stats.done + card.stats.partial * 0.5) / card.stats.total) * 100
                )}
                %
              </span>
              <span className="text-xs text-muted-foreground mb-1">
                {card.stats.done}/{card.stats.total} {t('alignment.done')}
              </span>
            </div>
            <ProgressBar
              done={card.stats.done}
              partial={card.stats.partial}
              total={card.stats.total}
            />
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3 text-success" /> {card.stats.done}
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="size-3 text-warning" /> {card.stats.partial}
              </span>
              <span className="flex items-center gap-1">
                <Circle className="size-3" /> {card.stats.pending}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Current Runtime */}
      <section
        className="rounded-xl border border-border bg-card p-5"
        style={{ boxShadow: 'var(--shadow-sm)' }}
      >
        <h3 className="text-sm text-muted-foreground mb-3">{t('alignment.currentRuntime')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-xs text-muted-foreground">{t('alignment.visualTheme')}</span>
            <p className="capitalize">{style}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">{t('alignment.colorMode')}</span>
            <p className="capitalize">{resolvedMode}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">{t('alignment.language')}</span>
            <p>{t('alignment.chinese')}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">{t('alignment.routerPackage')}</span>
            <p className="font-mono text-xs">react-router v7</p>
          </div>
        </div>
      </section>

      {/* Phase 1 */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="size-4 text-success" />
          </div>
          <div>
            <h2 className="text-xl">{t('alignment.phase1Heading')}</h2>
            <p className="text-xs text-muted-foreground">{t('alignment.phase1Desc')}</p>
          </div>
        </div>
        <div className="space-y-6">{renderSections(phase1Sections, 'primary')}</div>
      </section>

      {/* Phase 2 */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="size-4 text-success" />
          </div>
          <div>
            <h2 className="text-xl">{t('alignment.phase2Heading')}</h2>
            <p className="text-xs text-muted-foreground">{t('alignment.phase2Desc')}</p>
          </div>
        </div>
        <div className="space-y-6">{renderSections(phase2Sections, 'warning')}</div>
      </section>

      {/* Phase 3 */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="size-4 text-success" />
          </div>
          <div>
            <h2 className="text-xl">{t('alignment.phase3Heading')}</h2>
            <p className="text-xs text-muted-foreground">{t('alignment.phase3Desc')}</p>
          </div>
        </div>
        <div className="space-y-6">{renderSections(phase3Sections, 'primary')}</div>
      </section>

      {/* Phase 4 */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-warning/10 flex items-center justify-center">
            <AlertTriangle className="size-4 text-warning" />
          </div>
          <div>
            <h2 className="text-xl">{t('alignment.phase4Heading')}</h2>
            <p className="text-xs text-muted-foreground">{t('alignment.phase4Desc')}</p>
          </div>
        </div>
        <div className="space-y-6">{renderSections(phase4Sections, 'warning')}</div>
      </section>

      {/* Keyboard Shortcuts */}
      <section
        className="rounded-xl border border-border bg-card p-5"
        style={{ boxShadow: 'var(--shadow-sm)' }}
      >
        <h2 className="text-lg mb-3">{t('alignment.keyboardShortcuts')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { keys: 'Ctrl+Alt+T', desc: t('alignment.themeShortcut') },
            { keys: 'Ctrl+Alt+L', desc: t('alignment.langShortcut') },
            { keys: 'Ctrl+Alt+I', desc: t('alignment.importShortcut') },
            { keys: 'Ctrl+Alt+B', desc: t('alignment.buildShortcut') },
            { keys: 'Ctrl+Alt+Q', desc: t('alignment.qaShortcut') },
          ].map((s) => (
            <div
              key={s.keys}
              className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/5 p-3"
            >
              <kbd className="text-xs font-mono bg-card border border-border rounded px-2 py-1 shadow-sm whitespace-nowrap">
                {s.keys}
              </kbd>
              <p className="text-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <section className="text-center py-4 text-xs text-muted-foreground space-y-1">
        <p>{t('alignment.footerThanks')}</p>
        <p>{t('alignment.footerComplete')}</p>
      </section>
    </div>
  );
}
