/**
 * @file 文档同步器
 * @description YYC³ Design System文档同步器
 * @module core/DocumentSyncer
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { DocumentMapper, DocumentMap, documentMapper } from './DocumentMapper';

export interface SyncConfig {
  source: string;
  destination: string;
  includePatterns: string[];
  excludePatterns: string[];
  dryRun: boolean;
  verbose: boolean;
}

export interface SyncResult {
  success: boolean;
  startTime: number;
  endTime: number;
  duration: number;
  filesProcessed: number;
  filesCreated: number;
  filesUpdated: number;
  filesDeleted: number;
  filesSkipped: number;
  errors: string[];
}

export interface SyncEvent {
  type: 'sync.started' | 'sync.completed' | 'sync.failed' | 'file.created' | 'file.updated' | 'file.deleted' | 'file.skipped';
  timestamp: number;
  data: any;
}

export class DocumentSyncer {
  private documentMapper: DocumentMapper;
  private syncTimer: ReturnType<typeof setInterval> | null = null;
  private eventListeners: Map<string, Set<(event: SyncEvent) => void>> = new Map();

  constructor(documentMapper: DocumentMapper) {
    this.documentMapper = documentMapper;
  }

  on(event: string, callback: (event: SyncEvent) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: (event: SyncEvent) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: SyncEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => callback(event));
    }
  }

  async sync(config: SyncConfig): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      startTime: Date.now(),
      endTime: 0,
      duration: 0,
      filesProcessed: 0,
      filesCreated: 0,
      filesUpdated: 0,
      filesDeleted: 0,
      filesSkipped: 0,
      errors: [],
    };

    try {
      this.emit({
        type: 'sync.started',
        timestamp: Date.now(),
        data: { config },
      });

      const sourceFiles = this.getFiles(config.source, config.includePatterns, config.excludePatterns);

      for (const file of sourceFiles) {
        result.filesProcessed++;

        const sourcePath = path.join(config.source, file);
        const destPath = path.join(config.destination, file);

        try {
          if (!fs.existsSync(destPath)) {
            if (!config.dryRun) {
              this.ensureDirectoryExists(destPath);
              fs.copyFileSync(sourcePath, destPath);
            }

            result.filesCreated++;
            this.emit({
              type: 'file.created',
              timestamp: Date.now(),
              data: { file, sourcePath, destPath },
            });
          } else if (this.isNewer(sourcePath, destPath)) {
            if (!config.dryRun) {
              fs.copyFileSync(sourcePath, destPath);
            }

            result.filesUpdated++;
            this.emit({
              type: 'file.updated',
              timestamp: Date.now(),
              data: { file, sourcePath, destPath },
            });
          } else {
            result.filesSkipped++;
            this.emit({
              type: 'file.skipped',
              timestamp: Date.now(),
              data: { file, reason: 'up-to-date' },
            });
          }
        } catch (error) {
          const errorMessage = `Error processing ${file}: ${error}`;
          result.errors.push(errorMessage);

          if (config.verbose) {
            console.error(errorMessage);
          }
        }
      }

      result.success = result.errors.length === 0;
    } catch (error) {
      const errorMessage = `Sync failed: ${error}`;
      result.errors.push(errorMessage);
      result.success = false;

      this.emit({
        type: 'sync.failed',
        timestamp: Date.now(),
        data: { error: errorMessage },
      });
    } finally {
      result.endTime = Date.now();
      result.duration = result.endTime - result.startTime;

      if (result.success) {
        this.emit({
          type: 'sync.completed',
          timestamp: Date.now(),
          data: { result },
        });
      }
    }

    return result;
  }

  private getFiles(directory: string, includePatterns: string[], excludePatterns: string[]): string[] {
    const files: string[] = [];

    const scanDir = (dir: string, baseDir: string = dir): void => {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.relative(baseDir, fullPath);
        const stat = fs.statSync(fullPath);

        if (this.shouldExclude(relativePath, excludePatterns)) {
          continue;
        }

        if (stat.isDirectory()) {
          scanDir(fullPath, baseDir);
        } else if (this.shouldInclude(relativePath, includePatterns)) {
          files.push(relativePath);
        }
      }
    };

    scanDir(directory);
    return files;
  }

  private shouldInclude(filePath: string, patterns: string[]): boolean {
    if (patterns.length === 0) {
      return true;
    }

    return patterns.some(pattern => this.matchPattern(filePath, pattern));
  }

  private shouldExclude(filePath: string, patterns: string[]): boolean {
    return patterns.some(pattern => this.matchPattern(filePath, pattern));
  }

  private matchPattern(filePath: string, pattern: string): boolean {
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
    );
    return regex.test(filePath);
  }

  private isNewer(sourcePath: string, destPath: string): boolean {
    const sourceStat = fs.statSync(sourcePath);
    const destStat = fs.statSync(destPath);

    return sourceStat.mtime > destStat.mtime;
  }

  private ensureDirectoryExists(filePath: string): void {
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  startAutoSync(config: SyncConfig): void {
    if (this.syncTimer) {
      this.stopAutoSync();
    }

    const docMap = this.documentMapper['docMap'] as DocumentMap;
    const interval = docMap.syncRules.syncInterval;

    this.syncTimer = setInterval(async () => {
      await this.sync(config);
    }, interval);
  }

  stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  async syncToGit(config: SyncConfig): Promise<SyncResult> {
    const result = await this.sync(config);

    if (!result.success || config.dryRun) {
      return result;
    }

    try {
      execSync('git add .', { cwd: config.destination });
      execSync('git commit -m "docs: sync documents"', { cwd: config.destination });
      execSync('git push', { cwd: config.destination });
    } catch (error) {
      result.errors.push(`Git sync failed: ${error}`);
      result.success = false;
    }

    return result;
  }

  async syncFromGit(config: SyncConfig): Promise<SyncResult> {
    try {
      execSync('git pull', { cwd: config.destination });
      return await this.sync(config);
    } catch (error) {
      return {
        success: false,
        startTime: Date.now(),
        endTime: Date.now(),
        duration: 0,
        filesProcessed: 0,
        filesCreated: 0,
        filesUpdated: 0,
        filesDeleted: 0,
        filesSkipped: 0,
        errors: [`Git pull failed: ${error}`],
      };
    }
  }

  generateReport(result: SyncResult): string {
    const lines = [
      '=== Document Sync Report ===',
      '',
      `Status: ${result.success ? '✓ Success' : '✗ Failed'}`,
      `Duration: ${result.duration}ms`,
      `Files Processed: ${result.filesProcessed}`,
      `Files Created: ${result.filesCreated}`,
      `Files Updated: ${result.filesUpdated}`,
      `Files Deleted: ${result.filesDeleted}`,
      `Files Skipped: ${result.filesSkipped}`,
      '',
    ];

    if (result.errors.length > 0) {
      lines.push('Errors:');
      result.errors.forEach(error => {
        lines.push(`  - ${error}`);
      });
      lines.push('');
    }

    return lines.join('\n');
  }
}

export const documentSyncer = new DocumentSyncer(documentMapper);
