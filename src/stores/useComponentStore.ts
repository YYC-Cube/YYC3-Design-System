/**
 * @file 组件配置Store
 * @description 组件配置状态管理，包括组件默认配置等
 * @module stores/useComponentStore
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ComponentConfig {
  size?: 'small' | 'middle' | 'large';
  bordered?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export interface ComponentState {
  globalConfig: ComponentConfig;
  componentConfigs: Record<string, ComponentConfig>;

  setGlobalConfig: (config: ComponentConfig) => void;
  updateGlobalConfig: (config: Partial<ComponentConfig>) => void;
  setComponentConfig: (componentId: string, config: ComponentConfig) => void;
  updateComponentConfig: (componentId: string, config: Partial<ComponentConfig>) => void;
  removeComponentConfig: (componentId: string) => void;
  resetConfigs: () => void;
}

const defaultGlobalConfig: ComponentConfig = {
  size: 'middle',
  bordered: false,
  disabled: false,
  loading: false,
};

export const useComponentStore = create<ComponentState>()(
  devtools((set) => ({
    globalConfig: defaultGlobalConfig,
    componentConfigs: {},

    setGlobalConfig: (config) => set({ globalConfig: config }),
    updateGlobalConfig: (config) =>
      set((state) => ({
        globalConfig: { ...state.globalConfig, ...config },
      })),
    setComponentConfig: (componentId, config) =>
      set((state) => ({
        componentConfigs: { ...state.componentConfigs, [componentId]: config },
      })),
    updateComponentConfig: (componentId, config) =>
      set((state) => ({
        componentConfigs: {
          ...state.componentConfigs,
          [componentId]: {
            ...(state.componentConfigs[componentId] || {}),
            ...config,
          },
        },
      })),
    removeComponentConfig: (componentId) =>
      set((state) => {
        const newConfigs = { ...state.componentConfigs };
        delete newConfigs[componentId];
        return { componentConfigs: newConfigs };
      }),
    resetConfigs: () => set({ globalConfig: defaultGlobalConfig, componentConfigs: {} }),
  }))
);
