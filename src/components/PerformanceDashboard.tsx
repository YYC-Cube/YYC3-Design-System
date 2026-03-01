import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { cn } from '@/utils/cn';
import { PerformanceMetrics } from '../performance/types';

interface PerformanceWindow extends Window {
  performanceMonitor?: {
    getMetrics: () => PerformanceMetrics;
  };
}

interface Score {
  score: number;
  label: string;
  color: string;
}

export const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMetrics = () => {
      if (typeof window !== 'undefined' && (window as PerformanceWindow).performanceMonitor) {
        const currentMetrics = (window as PerformanceWindow).performanceMonitor!.getMetrics();
        setMetrics(currentMetrics);
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  const getScore = (
    value: number | undefined,
    thresholds: { good: number; needsImprovement: number }
  ): Score => {
    if (value === undefined) {
      return { score: 0, label: '等待中', color: 'gray' };
    }
    if (value <= thresholds.good) {
      return { score: 100, label: '优秀', color: 'green' };
    }
    if (value <= thresholds.needsImprovement) {
      return { score: 75, label: '良好', color: 'yellow' };
    }
    return { score: 50, label: '需改进', color: 'red' };
  };

  const fcpScore = getScore(metrics.FCP, { good: 1.8, needsImprovement: 3 });
  const lcpScore = getScore(metrics.LCP, { good: 2.5, needsImprovement: 4 });
  const fidScore = getScore(metrics.FID, { good: 100, needsImprovement: 300 });
  const clsScore = getScore(metrics.CLS, { good: 0.1, needsImprovement: 0.25 });
  const ttfbScore = getScore(metrics.TTFB, { good: 800, needsImprovement: 1800 });

  const MetricCard = ({
    title,
    value,
    unit,
    score,
  }: {
    title: string;
    value?: number;
    unit: string;
    score: Score;
  }) => (
    <div className="metric-card">
      <div className="metric-title">{title}</div>
      <div className="metric-value">{value !== undefined ? `${value.toFixed(2)}${unit}` : '-'}</div>
      <div className={cn('metric-score', score.color)}>{score.label}</div>
    </div>
  );

  return (
    <>
      <style>{`
        .performance-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #d45a5f;
          color: white;
          border: none;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 9999;
          transition: all 0.3s ease;
        }

        .performance-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .performance-dashboard-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }

        .performance-dashboard {
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow: auto;
          position: relative;
        }

        .performance-dashboard .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #1a1a1a;
          padding: 0;
          line-height: 1;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .metric-card {
          background: #fbfbfc;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          padding: 1rem;
          text-align: center;
        }

        .metric-title {
          font-size: 0.875rem;
          color: #777777;
          margin-bottom: 0.5rem;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .metric-score {
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          display: inline-block;
        }

        .metric-score.green {
          background: #d1fae5;
          color: #065f46;
        }

        .metric-score.yellow {
          background: #fef3c7;
          color: #92400e;
        }

        .metric-score.red {
          background: #fee2e2;
          color: #991b1b;
        }

        .metric-score.gray {
          background: #f3f4f6;
          color: #374151;
        }

        .performance-tips {
          background: #f8f9ef;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          padding: 1rem;
        }

        .performance-tips h4 {
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .performance-tips ul {
          margin: 0;
          padding-left: 1.5rem;
          color: #777777;
          line-height: 1.6;
        }
      `}</style>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="performance-toggle"
        aria-label="Toggle Performance Dashboard"
      >
        📊
      </button>

      {isVisible && (
        <div className="performance-dashboard-overlay">
          <Card className="performance-dashboard">
            <CardHeader>
              <CardTitle>性能监控仪表板</CardTitle>
              <button
                onClick={() => setIsVisible(false)}
                className="close-button"
                aria-label="Close"
              >
                ×
              </button>
            </CardHeader>
            <CardContent>
              <div className="metrics-grid">
                <MetricCard
                  title="首次内容绘制 (FCP)"
                  value={metrics.FCP}
                  unit="s"
                  score={fcpScore}
                />
                <MetricCard
                  title="最大内容绘制 (LCP)"
                  value={metrics.LCP}
                  unit="s"
                  score={lcpScore}
                />
                <MetricCard
                  title="首次输入延迟 (FID)"
                  value={metrics.FID}
                  unit="ms"
                  score={fidScore}
                />
                <MetricCard
                  title="累积布局偏移 (CLS)"
                  value={metrics.CLS}
                  unit=""
                  score={clsScore}
                />
                <MetricCard
                  title="首字节时间 (TTFB)"
                  value={metrics.TTFB}
                  unit="ms"
                  score={ttfbScore}
                />
              </div>

              <div className="performance-tips">
                <h4>性能优化建议</h4>
                <ul>
                  {lcpScore.score < 100 && <li>优化图片加载，使用懒加载</li>}
                  {fidScore.score < 100 && <li>减少JavaScript执行时间</li>}
                  {clsScore.score < 100 && <li>为图片和视频设置尺寸属性</li>}
                  {fcpScore.score < 100 && <li>减少关键CSS大小</li>}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
