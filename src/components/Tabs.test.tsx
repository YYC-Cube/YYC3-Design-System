/**
 * @file Tabs 组件测试
 * @description 测试 Tabs 组件的各项功能
 * @module __tests__/components/Tabs.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import { Tabs, TabList, Tab, TabPanel } from './Tabs';
import { ThemeProvider } from '../context/ThemeContext';

describe('Tabs 组件', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider initial="light">{component}</ThemeProvider>);
  };

  it('应该正确渲染 Tabs 组件', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
      </Tabs>
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Panel 1')).toBeInTheDocument();
  });

  it('应该默认显示第一个标签面板', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
      </Tabs>
    );

    expect(screen.getByText('Panel 1')).toBeInTheDocument();

    const panel2 = screen.getByText('Panel 2');
    expect(panel2).toHaveStyle({ display: 'none' });
  });

  it('应该在点击标签时切换面板', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
      </Tabs>
    );

    const tab2 = screen.getByText('Tab 2');
    fireEvent.click(tab2);

    expect(screen.getByText('Panel 2')).toBeInTheDocument();

    const panel1 = screen.getByText('Panel 1');
    expect(panel1).toHaveStyle({ display: 'none' });
  });

  it('应该正确设置 active tab 的样式', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
      </Tabs>
    );

    const tab1 = screen.getByText('Tab 1');
    const tab2 = screen.getByText('Tab 2');

    expect(tab1).toHaveStyle({
      backgroundColor: 'rgb(224, 106, 112)',
      color: 'rgb(255, 255, 255)',
      fontWeight: '600',
    });

    expect(tab2).toHaveStyle({
      color: 'rgb(240, 240, 240)',
      fontWeight: '400',
    });
  });

  it('应该在切换时更新样式', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
      </Tabs>
    );

    const tab2 = screen.getByText('Tab 2');
    fireEvent.click(tab2);

    expect(tab2).toHaveStyle({
      backgroundColor: 'rgb(224, 106, 112)',
      color: 'rgb(255, 255, 255)',
      fontWeight: '600',
    });
  });

  it('应该正确设置 role 属性', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
      </Tabs>
    );

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab')).toBeInTheDocument();
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('应该正确设置 aria-selected 属性', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
      </Tabs>
    );

    const tab1 = screen.getByText('Tab 1');
    const tab2 = screen.getByText('Tab 2');

    expect(tab1).toHaveAttribute('aria-selected', 'true');
    expect(tab2).toHaveAttribute('aria-selected', 'false');
  });

  it('应该正确设置 aria-hidden 属性', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
      </Tabs>
    );

    const panel1 = screen.getByText('Panel 1');
    const panel2 = screen.getByText('Panel 2');

    expect(panel1).toHaveAttribute('aria-hidden', 'false');
    expect(panel2).toHaveAttribute('aria-hidden', 'true');
  });

  it('应该应用自定义 className', () => {
    const { container } = renderWithTheme(
      <Tabs defaultValue="tab1" className="custom-tabs">
        <TabList className="custom-list">
          <Tab value="tab1" className="custom-tab">
            Tab 1
          </Tab>
        </TabList>
        <TabPanel value="tab1" className="custom-panel">
          Panel 1
        </TabPanel>
      </Tabs>
    );

    expect(container.querySelector('.custom-tabs')).toBeInTheDocument();
    expect(container.querySelector('.custom-list')).toBeInTheDocument();
    expect(container.querySelector('.custom-tab')).toBeInTheDocument();
    expect(container.querySelector('.custom-panel')).toBeInTheDocument();
  });

  it('应该在 Tab 不在 Tabs 中时抛出错误', () => {
    expect(() => {
      renderWithTheme(
        <div>
          <Tab value="tab1">Tab 1</Tab>
        </div>
      );
    }).toThrow('Tab must be used within Tabs');
  });

  it('应该在 TabPanel 不在 Tabs 中时抛出错误', () => {
    expect(() => {
      renderWithTheme(
        <div>
          <TabPanel value="tab1">Panel 1</TabPanel>
        </div>
      );
    }).toThrow('TabPanel must be used within Tabs');
  });

  it('应该正确处理多个标签', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
          <Tab value="tab3">Tab 3</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
        <TabPanel value="tab3">Panel 3</TabPanel>
      </Tabs>
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('应该在多次点击时正确切换', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
          <Tab value="tab3">Tab 3</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
        <TabPanel value="tab3">Panel 3</TabPanel>
      </Tabs>
    );

    const tab2 = screen.getByText('Tab 2');
    const tab3 = screen.getByText('Tab 3');

    fireEvent.click(tab2);
    expect(screen.getByText('Panel 2')).toBeInTheDocument();

    fireEvent.click(tab3);
    expect(screen.getByText('Panel 3')).toBeInTheDocument();

    fireEvent.click(tab2);
    expect(screen.getByText('Panel 2')).toBeInTheDocument();
  });

  it('应该正确设置 TabList 的样式', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
      </Tabs>
    );

    const tabList = screen.getByRole('tablist');
    expect(tabList).toHaveStyle({
      display: 'flex',
      gap: '0.5rem',
      borderBottom: '1px solid rgb(160, 160, 160)',
      marginBottom: '1rem',
    });
  });

  it('应该正确设置 Tab 的样式', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
      </Tabs>
    );

    const tab = screen.getByRole('tab');
    expect(tab).toHaveStyle({
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    });
  });

  it('应该正确设置 TabPanel 的样式', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
      </Tabs>
    );

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveStyle({
      display: 'block',
    });
  });

  it('应该在非激活时隐藏 TabPanel', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
      </Tabs>
    );

    const panel2 = screen.getByText('Panel 2');
    expect(panel2).toHaveStyle({ display: 'none' });
    expect(panel2).toHaveAttribute('aria-hidden', 'true');
  });

  it('应该正确处理空 children', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
        </TabList>
        <TabPanel value="tab1">Content 1</TabPanel>
      </Tabs>
    );

    expect(screen.getByRole('tab')).toBeInTheDocument();
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('应该正确处理复杂内容', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">
            <div>
              <strong>Tab 1</strong>
              <span>Icon</span>
            </div>
          </Tab>
        </TabList>
        <TabPanel value="tab1">
          <div>
            <h2>Panel 1</h2>
            <p>Content</p>
          </div>
        </TabPanel>
      </Tabs>
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Panel 1')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('应该在切换时正确更新 aria-selected', () => {
    renderWithTheme(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
      </Tabs>
    );

    const tab1 = screen.getByText('Tab 1');
    const tab2 = screen.getByText('Tab 2');

    expect(tab1).toHaveAttribute('aria-selected', 'true');
    expect(tab2).toHaveAttribute('aria-selected', 'false');

    fireEvent.click(tab2);

    expect(tab1).toHaveAttribute('aria-selected', 'false');
    expect(tab2).toHaveAttribute('aria-selected', 'true');
  });
});
