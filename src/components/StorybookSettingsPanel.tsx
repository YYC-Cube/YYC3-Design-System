/**
 * YYC³ Design System — Storybook Settings Panel
 *
 * Token Reference:
 *   primary:       var(--primary)           — Switch active color
 *   success:       var(--success)           — Passed badge background
 *   destructive:   var(--destructive)       — Failed badge background
 *   muted:         var(--muted)             — Help block background
 *   card:          var(--card)              — Dialog background
 *   shadow:        var(--shadow-card)       — Switch selected shadow
 *   animation:     var(--duration-fast) var(--easing-default)
 *   a11y:          outline: 2px solid var(--ring) on focus
 */
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Separator } from './ui/separator';
import { Play, X, Loader2, CheckCircle2, XCircle, Info, Settings } from 'lucide-react';

interface StorybookSettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StorybookSettingsPanel({ open, onOpenChange }: StorybookSettingsPanelProps) {
  const { t } = useLanguage();
  const [isolationMode, setIsolationMode] = useState(false);
  const [snapshotLayout, setSnapshotLayout] = useState('grid');
  const [renderQuality, setRenderQuality] = useState([75]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunStatus, setLastRunStatus] = useState<'passed' | 'failed' | null>(null);

  const handleRunTests = () => {
    setIsRunning(true);
    setLastRunStatus(null);
    setTimeout(() => {
      setIsRunning(false);
      setLastRunStatus(Math.random() > 0.3 ? 'passed' : 'failed');
    }, 2500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Settings className="size-5 text-primary" />
            <DialogTitle>{t('storybook.title')}</DialogTitle>
          </div>
          <DialogDescription>{t('storybook.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Isolation Mode Switch — Token: color-primary (active) */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isolation-mode" className="text-sm">
                {t('storybook.isolationMode')}
              </Label>
              <p className="text-xs text-muted-foreground">{t('storybook.isolationModeDesc')}</p>
            </div>
            <Switch
              id="isolation-mode"
              checked={isolationMode}
              onCheckedChange={setIsolationMode}
              aria-label={t('storybook.toggleIsolation')}
            />
          </div>

          <Separator />

          {/* Snapshot Layout Dropdown */}
          <div className="space-y-2">
            <Label>{t('storybook.snapshotLayout')}</Label>
            <Select value={snapshotLayout} onValueChange={setSnapshotLayout}>
              <SelectTrigger aria-label={t('storybook.selectLayout')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">{t('storybook.grid')}</SelectItem>
                <SelectItem value="list">{t('storybook.list')}</SelectItem>
                <SelectItem value="carousel">{t('storybook.carousel')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Render Quality Slider — Token: color-primary (track) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t('storybook.renderQuality')}</Label>
              <span className="text-xs text-muted-foreground font-mono">{renderQuality[0]}%</span>
            </div>
            <Slider
              value={renderQuality}
              onValueChange={setRenderQuality}
              min={0}
              max={100}
              step={5}
              aria-label={t('storybook.renderQuality')}
            />
            <p className="text-[10px] text-muted-foreground">{t('storybook.renderQualityDesc')}</p>
          </div>

          <Separator />

          {/* Run Tests Button */}
          <div className="space-y-3">
            <Button onClick={handleRunTests} disabled={isRunning} className="w-full">
              {isRunning ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t('storybook.running')}
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  {t('storybook.runIsolatedTests')}
                </>
              )}
            </Button>

            {/* Status Badge — Token: color-success / color-destructive */}
            {lastRunStatus && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-muted-foreground">{t('storybook.lastRun')}:</span>
                {lastRunStatus === 'passed' ? (
                  <Badge
                    className="gap-1"
                    style={{ background: 'var(--success)', color: 'var(--success-foreground)' }}
                  >
                    <CheckCircle2 className="size-3" />
                    {t('storybook.passed')}
                  </Badge>
                ) : (
                  <Badge
                    className="gap-1"
                    style={{
                      background: 'var(--destructive)',
                      color: 'var(--destructive-foreground)',
                    }}
                  >
                    <XCircle className="size-3" />
                    {t('storybook.failed')}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Help text — Token: bg = var(--muted) */}
          <div
            className="rounded-lg p-3 flex items-start gap-2"
            style={{ background: 'var(--muted)' }}
          >
            <Info className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground" style={{ lineHeight: 1.5 }}>
              {t('storybook.isolationDescription')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
