import PerformanceMonitor from './monitor';

interface PerformanceWindow extends Window {
  performanceMonitor?: PerformanceMonitor;
}

let monitor: PerformanceMonitor | null = null;

export const initPerformanceMonitoring = (reportUrl?: string) => {
  if (typeof window !== 'undefined' && !monitor) {
    monitor = new PerformanceMonitor(reportUrl);
    monitor.init();
    (window as PerformanceWindow).performanceMonitor = monitor;
  }
};

export const getPerformanceMetrics = () => {
  return monitor ? monitor.getMetrics() : {};
};

export const destroyPerformanceMonitoring = () => {
  if (monitor) {
    monitor.destroy();
    monitor = null;
    delete (window as PerformanceWindow).performanceMonitor;
  }
};
