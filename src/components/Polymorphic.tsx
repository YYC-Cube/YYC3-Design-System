/**
 * @file 多态组件基础设施
 * @description 提供多态组件支持，允许组件使用 asChild 模式和动态元素类型
 * @module components/Polymorphic
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import React, { ElementType, forwardRef } from 'react';
import type { ComponentWithRef, MergeProps, OverrideProps } from '../types/advanced-types';

export type AsChildProps<T extends ElementType> = {
  asChild?: boolean;
  as?: T;
};

export type SlotProps<T extends ElementType = 'div'> = {
  children?: React.ReactNode;
} & AsChildProps<T>;

export type PolymorphicComponent<
  T extends ElementType = 'div',
  P extends object = object,
> = ComponentWithRef<T, P>;

export const createPolymorphicComponent = (displayName: string) => {
  const Component = forwardRef<ElementType, SlotProps<ElementType> & Record<string, unknown>>(
    (props, ref) => {
      const { as, children, ...rest } = props;
      const ElementType = (as || 'div') as ElementType;

      return React.createElement(ElementType, { ...rest, ref }, children as React.ReactNode);
    }
  );

  Component.displayName = displayName;

  return Component as PolymorphicComponent<
    ElementType,
    SlotProps<ElementType> & Record<string, unknown>
  >;
};

export const Slot = <T extends ElementType = 'div'>({
  asChild = false,
  as,
  children,
  ...rest
}: SlotProps<T> & Record<string, unknown>) => {
  const ElementType = asChild ? (children as React.ReactElement)?.type : as || 'div';
  const Child = asChild
    ? children
    : React.createElement(ElementType, rest, children as React.ReactNode);

  if (!React.isValidElement(Child)) {
    return Child as React.ReactElement;
  }

  const childRef = (Child as React.ReactElement & { ref?: React.Ref<unknown> }).ref;

  return React.cloneElement(Child as React.ReactElement<Record<string, unknown>>, {
    ...rest,
    ref: (refValue: React.Ref<unknown>) => {
      if (childRef) {
        if (typeof childRef === 'function') {
          childRef(refValue);
        } else {
          (childRef as React.MutableRefObject<unknown>).current = refValue;
        }
      }
    },
  });
};

Slot.displayName = 'Slot';

export const createSlot = <T extends ElementType = 'div'>(displayName: string) => {
  const SlotComponent = Slot as React.ComponentType<SlotProps<T> & Record<string, unknown>>;
  (SlotComponent as React.ComponentType<SlotProps<T> & Record<string, unknown>>).displayName =
    displayName;
  return SlotComponent;
};

export const mergeProps = <T, U>(source: T, target: U): MergeProps<T, U> => {
  return { ...source, ...target } as MergeProps<T, U>;
};

export const overrideProps = <T, O>(base: T, overrides: Partial<O>): OverrideProps<T, O> => {
  return { ...base, ...overrides } as OverrideProps<T, O>;
};

export const createAsChildComponent = <P extends object = object>(
  displayName: string,
  render: (props: P) => React.ReactElement
) => {
  const Component = forwardRef<ElementType, P>((props, ref) => {
    return render({ ...props, ref } as P);
  });

  Component.displayName = displayName;

  return Component as PolymorphicComponent<ElementType, P>;
};

export const polymorphic = <T extends ElementType = 'div', P extends object = object>(
  displayName: string
): PolymorphicComponent<T, P> => {
  return createPolymorphicComponent(displayName) as PolymorphicComponent<T, P>;
};

export const withAsChild = <T extends ElementType = 'div', P extends object = object>(
  _WrappedComponent: React.ComponentType<P>,
  displayName: string
) => {
  const Wrapped = React.forwardRef<ElementType, P>((props, ref) => {
    const propsRecord = props as Record<string, unknown>;
    const { asChild, as, ...rest } = propsRecord;
    const restProps = rest as Omit<P, 'asChild' | 'as'>;

    if (asChild && React.isValidElement(propsRecord.children)) {
      const child = propsRecord.children as React.ReactElement;
      const childRef = (child as React.ReactElement & { ref?: React.Ref<unknown> }).ref;

      return React.cloneElement(child, {
        ...restProps,
        ref: (childRefValue: React.Ref<unknown>) => {
          if (childRefValue) {
            if (typeof childRef === 'function') {
              childRef(childRefValue);
            } else if (childRef) {
              (childRef as React.MutableRefObject<unknown>).current = childRefValue;
            }
          }
        },
      });
    }

    const ElementType = (as || 'div') as ElementType;
    return React.createElement(
      ElementType,
      { ...restProps, ref },
      propsRecord.children as React.ReactNode
    );
  });

  Wrapped.displayName = displayName;

  return Wrapped as PolymorphicComponent<T, P>;
};

export default {
  createPolymorphicComponent,
  Slot,
  createSlot,
  mergeProps,
  overrideProps,
  createAsChildComponent,
  polymorphic,
  withAsChild,
};
