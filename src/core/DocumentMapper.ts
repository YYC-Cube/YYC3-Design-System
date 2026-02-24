/**
 * @file 文档映射管理器
 * @description YYC³ Design System文档映射管理器
 * @module core/DocumentMapper
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

export interface DocumentMetadata {
  id: string;
  path: string;
  type: string;
  status: 'draft' | 'published' | 'archived';
  version: string;
  lastModified: string;
  dependencies: string[];
  tags: string[];
  category: string;
}

export interface DocumentMap {
  version: string;
  lastUpdated: string;
  documents: DocumentMetadata[];
  syncRules: SyncRules;
  notificationRules: NotificationRules;
  versionControl: VersionControl;
}

export interface SyncRules {
  autoSync: boolean;
  syncInterval: number;
  syncOnCommit: boolean;
  syncOnPush: boolean;
  syncOnPull: boolean;
  excludePatterns: string[];
}

export interface NotificationRules {
  enabled: boolean;
  channels: string[];
  events: string[];
}

export interface VersionControl {
  enabled: boolean;
  strategy: 'semantic' | 'date' | 'hash';
  autoIncrement: boolean;
  preRelease: boolean;
}

export class DocumentMapper {
  private docMapPath: string;
  private docMap: DocumentMap;

  constructor(docMapPath: string = path.join(process.cwd(), 'docs/.docmap.json')) {
    this.docMapPath = docMapPath;
    this.docMap = this.loadDocMap();
  }

  private loadDocMap(): DocumentMap {
    try {
      const data = fs.readFileSync(this.docMapPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.warn('Document map not found, creating new one');
      return this.createDefaultDocMap();
    }
  }

  private createDefaultDocMap(): DocumentMap {
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      documents: [],
      syncRules: {
        autoSync: true,
        syncInterval: 3600000,
        syncOnCommit: true,
        syncOnPush: true,
        syncOnPull: true,
        excludePatterns: [
          'node_modules/**',
          'dist/**',
          'build/**',
          '.git/**',
          '*.log',
        ],
      },
      notificationRules: {
        enabled: true,
        channels: ['email', 'slack'],
        events: [
          'document.created',
          'document.updated',
          'document.deleted',
          'sync.started',
          'sync.completed',
          'sync.failed',
        ],
      },
      versionControl: {
        enabled: true,
        strategy: 'semantic',
        autoIncrement: true,
        preRelease: false,
      },
    };
  }

  private saveDocMap(): void {
    this.docMap.lastUpdated = new Date().toISOString();
    fs.writeFileSync(this.docMapPath, JSON.stringify(this.docMap, null, 2), 'utf-8');
  }

  addDocument(metadata: DocumentMetadata): void {
    const existingIndex = this.docMap.documents.findIndex(doc => doc.id === metadata.id);

    if (existingIndex >= 0) {
      this.docMap.documents[existingIndex] = metadata;
    } else {
      this.docMap.documents.push(metadata);
    }

    this.saveDocMap();
  }

  removeDocument(documentId: string): void {
    this.docMap.documents = this.docMap.documents.filter(doc => doc.id !== documentId);
    this.saveDocMap();
  }

  getDocument(documentId: string): DocumentMetadata | undefined {
    return this.docMap.documents.find(doc => doc.id === documentId);
  }

  getDocuments(filter?: Partial<DocumentMetadata>): DocumentMetadata[] {
    let documents = [...this.docMap.documents];

    if (filter) {
      if (filter.type) {
        documents = documents.filter(doc => doc.type === filter.type);
      }
      if (filter.status) {
        documents = documents.filter(doc => doc.status === filter.status);
      }
      if (filter.category) {
        documents = documents.filter(doc => doc.category === filter.category);
      }
      if (filter.tags && filter.tags.length > 0) {
        documents = documents.filter(doc =>
          filter.tags!.some(tag => doc.tags.includes(tag))
        );
      }
    }

    return documents;
  }

  updateDocument(documentId: string, updates: Partial<DocumentMetadata>): void {
    const index = this.docMap.documents.findIndex(doc => doc.id === documentId);

    if (index >= 0) {
      this.docMap.documents[index] = {
        ...this.docMap.documents[index],
        ...updates,
        lastModified: new Date().toISOString(),
      };
      this.saveDocMap();
    }
  }

  getDependencies(documentId: string): DocumentMetadata[] {
    const document = this.getDocument(documentId);

    if (!document || !document.dependencies) {
      return [];
    }

    return document.dependencies
      .map(depId => this.getDocument(depId))
      .filter((doc): doc is DocumentMetadata => doc !== undefined);
  }

  getDependents(documentId: string): DocumentMetadata[] {
    return this.docMap.documents.filter(doc =>
      doc.dependencies.includes(documentId)
    );
  }

  validateDependencies(documentId: string): { valid: boolean; missing: string[] } {
    const document = this.getDocument(documentId);

    if (!document) {
      return { valid: false, missing: [documentId] };
    }

    const missing: string[] = [];

    for (const depId of document.dependencies) {
      if (!this.getDocument(depId)) {
        missing.push(depId);
      }
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  scanDocuments(directory: string = path.join(process.cwd(), 'docs')): void {
    const scanDir = (dir: string, baseDir: string = dir): string[] => {
      const files: string[] = [];

      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          files.push(...scanDir(fullPath, baseDir));
        } else if (item.endsWith('.md')) {
          const relativePath = path.relative(baseDir, fullPath);
          files.push(relativePath);
        }
      }

      return files;
    };

    const markdownFiles = scanDir(directory);

    for (const file of markdownFiles) {
      const fullPath = path.join(directory, file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const metadata = this.extractMetadata(content, file);

      if (metadata) {
        this.addDocument(metadata);
      }
    }
  }

  private extractMetadata(content: string, filePath: string): DocumentMetadata | null {
    const lines = content.split('\n');
    let metadata: any = {};
    let inMetadata = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('---')) {
        if (inMetadata) {
          break;
        }
        inMetadata = true;
        continue;
      }

      if (inMetadata) {
        const match = line.match(/^(\w+):\s*(.*)$/);
        if (match) {
          const [, key, value] = match;
          metadata[key] = value;
        }
      }
    }

    if (!metadata.id) {
      return null;
    }

    return {
      id: metadata.id,
      path: filePath,
      type: metadata.type || 'general',
      status: (metadata.status as any) || 'published',
      version: metadata.version || '1.0.0',
      lastModified: metadata.lastModified || new Date().toISOString(),
      dependencies: metadata.dependencies ? JSON.parse(metadata.dependencies) : [],
      tags: metadata.tags ? JSON.parse(metadata.tags) : [],
      category: metadata.category || 'general',
    };
  }

  getVersion(): string {
    return this.docMap.version;
  }

  incrementVersion(type: 'major' | 'minor' | 'patch' = 'patch'): void {
    const parts = this.docMap.version.split('.').map(Number);

    switch (type) {
      case 'major':
        parts[0]++;
        parts[1] = 0;
        parts[2] = 0;
        break;
      case 'minor':
        parts[1]++;
        parts[2] = 0;
        break;
      case 'patch':
        parts[2]++;
        break;
    }

    this.docMap.version = parts.join('.');
    this.saveDocMap();
  }

  exportMap(): string {
    return JSON.stringify(this.docMap, null, 2);
  }

  importMap(data: string): void {
    this.docMap = JSON.parse(data);
    this.saveDocMap();
  }

  getStatistics(): {
    totalDocuments: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
  } {
    const stats = {
      totalDocuments: this.docMap.documents.length,
      byStatus: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
    };

    for (const doc of this.docMap.documents) {
      stats.byStatus[doc.status] = (stats.byStatus[doc.status] || 0) + 1;
      stats.byType[doc.type] = (stats.byType[doc.type] || 0) + 1;
      stats.byCategory[doc.category] = (stats.byCategory[doc.category] || 0) + 1;
    }

    return stats;
  }
}

export const documentMapper = new DocumentMapper();
