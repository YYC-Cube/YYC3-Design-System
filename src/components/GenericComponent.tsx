/**
 * @file 通用泛型组件
 * @description 提供泛型组件基础，支持多态组件和类型安全
 * @module components/GenericComponent
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import React, { ElementType, forwardRef } from 'react';
import type {
  MergeProps,
  ColorProps,
  SpacingProps,
  LayoutProps,
  TypographyProps,
  ARIAAttributes,
  DataAttributes,
  EventHandlers,
} from '../types/advanced-types';

export interface GenericComponentProps<E extends ElementType = 'div'> {
  as?: E;
  children?: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  role?: string;
  tabIndex?: number;
  disabled?: boolean;
  hidden?: boolean;
  defaultValue?: string;
  color?: ColorProps['color'];
  backgroundColor?: ColorProps['backgroundColor'];
  borderColor?: ColorProps['borderColor'];
  margin?: SpacingProps['margin'];
  padding?: SpacingProps['padding'];
  gap?: SpacingProps['gap'];
  width?: LayoutProps['width'];
  height?: LayoutProps['height'];
  display?: LayoutProps['display'];
  flex?: LayoutProps['flex'];
  flexDirection?: LayoutProps['flexDirection'];
  justifyContent?: LayoutProps['justifyContent'];
  alignItems?: LayoutProps['alignItems'];
  fontSize?: TypographyProps['fontSize'];
  fontWeight?: TypographyProps['fontWeight'];
  lineHeight?: TypographyProps['lineHeight'];
  letterSpacing?: TypographyProps['letterSpacing'];
  textAlign?: TypographyProps['textAlign'];
  onClick?: EventHandlers['onClick'];
  onMouseDown?: EventHandlers['onMouseDown'];
  onMouseUp?: EventHandlers['onMouseUp'];
  onFocus?: EventHandlers['onFocus'];
  onBlur?: EventHandlers['onBlur'];
  onKeyDown?: EventHandlers['onKeyDown'];
  onKeyUp?: EventHandlers['onKeyUp'];
  onChange?: EventHandlers['onChange'];
  'aria-label'?: ARIAAttributes['aria-label'];
  'aria-labelledby'?: ARIAAttributes['aria-labelledby'];
  'aria-describedby'?: ARIAAttributes['aria-describedby'];
  'aria-hidden'?: ARIAAttributes['aria-hidden'];
  'aria-disabled'?: ARIAAttributes['aria-disabled'];
  'aria-invalid'?: ARIAAttributes['aria-invalid'];
  'aria-required'?: ARIAAttributes['aria-required'];
  'data-testid'?: DataAttributes['data-testid'];
}

export type GenericComponentPropsWithExtra<
  E extends ElementType = 'div',
  P extends object = object,
> = GenericComponentProps<E> & P;

export const GenericComponent = forwardRef<ElementType, GenericComponentProps<ElementType>>(
  (props, ref) => {
    const {
      as,
      children,
      className,
      style,
      role,
      tabIndex,
      disabled,
      hidden,
      defaultValue,
      color,
      backgroundColor,
      borderColor,
      margin,
      padding,
      gap,
      width,
      height,
      display,
      flex,
      flexDirection,
      justifyContent,
      alignItems,
      fontSize,
      fontWeight,
      lineHeight,
      letterSpacing,
      textAlign,
      onClick,
      onMouseDown,
      onMouseUp,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      onChange,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      'aria-hidden': ariaHidden,
      'aria-disabled': ariaDisabled,
      'aria-invalid': ariaInvalid,
      'aria-required': ariaRequired,
      'data-testid': dataTestId,
      ...rest
    } = props as GenericComponentProps<ElementType>;

    const Component = (as || 'div') as ElementType;

    const mergedStyle: React.CSSProperties = {
      ...style,
      ...(color !== undefined && { color }),
      ...(backgroundColor !== undefined && { backgroundColor }),
      ...(borderColor !== undefined && { borderColor }),
      ...(margin !== undefined && { margin }),
      ...(padding !== undefined && { padding }),
      ...(gap !== undefined && { gap }),
      ...(width !== undefined && { width }),
      ...(height !== undefined && { height }),
      ...(display !== undefined && { display }),
      ...(flex !== undefined && { flex }),
      ...(flexDirection !== undefined && { flexDirection }),
      ...(justifyContent !== undefined && { justifyContent }),
      ...(alignItems !== undefined && { alignItems }),
      ...(fontSize !== undefined && { fontSize }),
      ...(fontWeight !== undefined && { fontWeight }),
      ...(lineHeight !== undefined && { lineHeight }),
      ...(letterSpacing !== undefined && { letterSpacing }),
      ...(textAlign !== undefined && { textAlign }),
    } as React.CSSProperties;

    return React.createElement(
      Component,
      {
        className,
        style: mergedStyle,
        role,
        tabIndex,
        disabled,
        hidden,
        defaultValue,
        ref,
        onClick,
        onMouseDown,
        onMouseUp,
        onFocus,
        onBlur,
        onKeyDown,
        onKeyUp,
        onChange,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        'aria-describedby': ariaDescribedby,
        'aria-hidden': ariaHidden,
        'aria-disabled': ariaDisabled,
        'aria-invalid': ariaInvalid,
        'aria-required': ariaRequired,
        'data-testid': dataTestId,
        ...rest,
      },
      children
    );
  }
);

GenericComponent.displayName = 'GenericComponent';

export const genericComponentFactory = {
  create: function <E extends ElementType = 'div', P extends object = object>(
    displayName: string,
    defaultProps?: Partial<GenericComponentPropsWithExtra<E, P>>
  ) {
    return createGenericComponent<E, P>(displayName, defaultProps);
  },

  withEffect: function <P extends object = object>(
    component: React.ComponentType<P>,
    displayName: string
  ) {
    return withGenericComponentEffect<P>(component, displayName);
  },

  withMemo: function <P extends object = object>(
    component: React.ComponentType<P>,
    displayName: string
  ) {
    return withGenericComponentMemo<P>(component, displayName);
  },
};

export const createGenericComponent = function <
  E extends ElementType = 'div',
  P extends object = object,
>(displayName: string, defaultProps?: Partial<GenericComponentPropsWithExtra<E, P>>) {
  const Component = forwardRef<E, GenericComponentPropsWithExtra<E, P>>((props, ref) => {
    const mergedProps = { ...defaultProps, ...props } as GenericComponentPropsWithExtra<E, P>;
    return React.createElement(GenericComponent, { ...mergedProps, ref } as React.ComponentProps<
      typeof GenericComponent
    >);
  });

  Component.displayName = displayName;
  return Component as React.ForwardRefExoticComponent<
    GenericComponentPropsWithExtra<E, P> & React.RefAttributes<E>
  >;
};

export const withGenericComponentEffect = function <P extends React.HTMLAttributes<HTMLElement>>(
  WrappedComponent: React.ComponentType<P>,
  displayName: string
) {
  const EnhancedComponent = forwardRef<HTMLElement, P>((props, ref) => {
    React.useEffect(() => {
      console.warn(`${displayName} mounted with props:`, props);
      return () => {
        console.warn(`${displayName} unmounted`);
      };
    }, [props]);

    return React.createElement(WrappedComponent, { ...props, ref } as any);
  });

  EnhancedComponent.displayName = `withEffect(${displayName})`;
  return EnhancedComponent;
};

export const withGenericComponentMemo = function <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  displayName: string
) {
  const MemoizedComponent = React.memo(WrappedComponent);
  MemoizedComponent.displayName = `memo(${displayName})`;
  return MemoizedComponent;
};

export const mergeGenericComponentProps = function <P1 extends object, P2 extends object>(
  props1: P1,
  props2: P2
): MergeProps<P1, P2> {
  return { ...props1, ...props2 } as MergeProps<P1, P2>;
};

export const overrideGenericComponentProps = function <P extends object, O extends Partial<P>>(
  base: P,
  overrides: O
): MergeProps<P, O> {
  return { ...base, ...overrides } as MergeProps<P, O>;
};

export default {
  GenericComponent,
  genericComponentFactory,
  createGenericComponent,
  withGenericComponentEffect,
  withGenericComponentMemo,
  mergeGenericComponentProps,
  overrideGenericComponentProps,
};
