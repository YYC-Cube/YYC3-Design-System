/**
 * @file YYC³ 文档布局组件
 * @description 文档页面的布局结构，包含侧边栏导航
 * @module components
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-27
 */

import React from 'react';

interface DocsLayoutProps {
  children: React.ReactNode;
}

interface DocSection {
  title: string;
  items: Array<{
    title: string;
    path: string;
  }>;
}

const docSections: DocSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', path: '/docs/introduction' },
      { title: 'Installation', path: '/docs/installation' },
      { title: 'Quick Start', path: '/docs/quick-start' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'Theming System', path: '/docs/theming' },
      { title: 'Design Tokens', path: '/docs/tokens' },
      { title: 'Accessibility', path: '/docs/accessibility' },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Button', path: '/docs/components/button' },
      { title: 'Card', path: '/docs/components/card' },
      { title: 'Input', path: '/docs/components/input' },
      { title: 'Progress', path: '/docs/components/progress' },
    ],
  },
  {
    title: 'Quality Assurance',
    items: [
      { title: 'Testing', path: '/docs/testing' },
      { title: 'CI/CD Pipeline', path: '/docs/cicd' },
      { title: 'Performance', path: '/docs/performance' },
    ],
  },
];

export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 border-r border-border bg-card p-6 h-screen sticky top-0 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-foreground">YYC³ Docs</h1>
            <p className="text-sm text-muted-foreground mt-1">Design System Documentation</p>
          </div>
          <nav className="space-y-6">
            {docSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-sm font-semibold text-foreground mb-2">{section.title}</h2>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.path}>
                      <a
                        href={item.path}
                        className="block text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded px-2 py-1.5 transition-colors"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8 max-w-4xl">{children}</main>
      </div>
    </div>
  );
}
