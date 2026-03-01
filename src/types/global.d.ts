/**
 * @file 全局统一类型定义
 * @description YYC³ Design System 统一类型定义，提供严格的类型约束和类型工具
 * @module types/global
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import type { ElementType } from 'react';
import * as React from 'react';
import type { z } from 'zod';
import type {
  UseFormReturn,
  FieldValues,
  Control,
  FieldPath,
  FieldPathValue,
  RegisterOptions,
} from 'react-hook-form';

export type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type MaybePromise<T> = T | Promise<T>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : Required<T[P]>;
};

export type Brand<K, T> = T & { readonly __brand: K };

export type BrandedColor = Brand<'Color', string>;

export type ColorValue = string | BrandedColor;

export type CSSValue = string | number;

export type SpacingValue = string | number;

export type ResponsiveValue<T> =
  | T
  | {
      xs?: T;
      sm?: T;
      md?: T;
      lg?: T;
      xl?: T;
    };

export type ThemeValue<T> = T | ((theme: Record<string, unknown>) => T);

export type CSSProperties = React.CSSProperties & {
  [key: string]: unknown;
};

export type VariantProps<V extends string> = {
  variant?: V;
};

export type ColorProps = {
  color?: ColorValue;
  backgroundColor?: ColorValue;
  borderColor?: ColorValue;
};

export type SpacingProps = {
  margin?: SpacingValue | ResponsiveValue<SpacingValue>;
  padding?: SpacingValue | ResponsiveValue<SpacingValue>;
  gap?: SpacingValue | ResponsiveValue<SpacingValue>;
};

export type LayoutProps = {
  width?: CSSValue | ResponsiveValue<CSSValue>;
  height?: CSSValue | ResponsiveValue<CSSValue>;
  display?: CSSValue;
  flex?: CSSValue;
  flexDirection?: CSSValue;
  justifyContent?: CSSValue;
  alignItems?: CSSValue;
};

export type TypographyProps = {
  fontSize?: CSSValue | ResponsiveValue<CSSValue>;
  fontWeight?: CSSValue;
  lineHeight?: CSSValue;
  letterSpacing?: CSSValue;
  textAlign?: CSSValue;
};

export type ARIAAttributes = {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean;
  'aria-disabled'?: boolean;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  'aria-busy'?: boolean;
  'aria-controls'?: string;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-haspopup'?: boolean | 'listbox' | 'menu' | 'tree' | 'grid' | 'dialog';
};

export type DataAttributes = {
  'data-testid'?: string;
  'data-cy'?: string;
  'data-qa'?: string;
  [key: `data-${string}`]: unknown;
};

export type EventHandlers = {
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onMouseUp?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onMouseMove?: (event: React.MouseEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onKeyUp?: (event: React.KeyboardEvent) => void;
  onChange?: (event: React.ChangeEvent) => void;
  onSubmit?: (event: React.FormEvent) => void;
  onReset?: (event: React.FormEvent) => void;
};

export type CommonProps = ColorProps &
  SpacingProps &
  LayoutProps &
  TypographyProps &
  ARIAAttributes &
  DataAttributes &
  EventHandlers & {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    role?: string;
    tabIndex?: number;
    disabled?: boolean;
    hidden?: boolean;
  };

export type PolymorphicComponentProps<E extends ElementType, P extends object = object> = P & {
  as?: E;
  children?: React.ReactNode;
};

export type ComponentWithRef<
  T extends ElementType,
  P extends object = object,
> = React.ForwardRefExoticComponent<PolymorphicComponentProps<T, P>>;

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type WithOptional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] };

export type Merge<T, U> = Omit<T, keyof U> & U;

export type OverrideProps<T, O> = Omit<T, keyof O> & Partial<O>;

export type ExtractProps<T> = T extends React.ComponentType<infer P> ? P : never;

export type Prettify<T> = {
  [K in keyof T]: T[K];
};

export type OmitNever<T> = Omit<T, never>;

export type StrictOmit<T, K extends keyof T> = T & OmitNever<Pick<T, K>>;

export type StrictPick<T, K extends keyof T> = Pick<T, K>;

export type ElementTypeType = React.ElementType;

export type ComponentType<P> = React.ComponentType<P>;

export type ReactElement = React.ReactElement;

export type ReactNode = React.ReactNode;

export type Ref<T> = React.Ref<T>;

export type RefCallback<T> = (instance: T | null) => void;

export type MutableRefObject<T> = React.MutableRefObject<T>;

export type ComponentPropsType<T extends ElementType> = React.ComponentPropsWithoutRef<T>;

export type PolymorphicRef<T extends ElementType> = React.ComponentPropsWithRef<T>['ref'];

export type NonNullable<T> = T extends null | undefined ? never : T;

export type NonUndefined<T> = T extends undefined ? never : T;

export type NonNull<T> = T extends null ? never : T;

export type DeepNonNullable<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type DeepNonUndefined<T> = {
  [P in keyof T]: NonUndefined<T[P]>;
};

export type DeepNonNull<T> = {
  [P in keyof T]: NonNull<T[P]>;
};

export type PickRequired<T, K extends keyof T> = Required<Pick<T, K>>;

export type PickOptional<T, K extends keyof T> = Partial<Pick<T, K>>;

export type OmitUndefined<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

export type OmitNull<T> = {
  [K in keyof T as null extends T[K] ? never : K]: T[K];
};

export type KeysOfType<T, U> = {
  [K in keyof T]-?: T[K] extends U ? K : never;
}[keyof T];

export type ValuesOfType<T, U> = Pick<T, KeysOfType<T, U>>[keyof Pick<T, KeysOfType<T, U>>];

export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

export type TupleElement<T extends readonly unknown[]> = T[number];

export type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never;

export type Tail<T extends unknown[]> = T extends [...infer R, infer L] ? L : never;

export type Length<T extends unknown[]> = T extends { length: infer L } ? L : never;

export type Append<T extends unknown[], U> = [...T, U];

export type Prepend<T extends unknown[], U> = [U, ...T];

export type Shift<T extends unknown[]> = T extends [unknown, ...infer R] ? R : never;

export type Unshift<T extends unknown[], U> = T extends [...infer R, unknown] ? [U, ...R] : never;

export type Pop<T extends unknown[]> = T extends [...infer R, unknown] ? R : never;

export type Push<T extends unknown[], U> = [...T, U];

export type Flatten<T extends unknown[]> = T extends [infer F, ...infer R] ? F | Flatten<R> : never;

export type Reverse<T extends unknown[]> = T extends [...infer R, infer L]
  ? [L, ...Reverse<R>]
  : [];

export type Unique<T extends unknown[]> = T extends [infer F, ...infer R]
  ? F extends R[number]
    ? never
    : [F, ...Unique<R>]
  : T;

export type Includes<T extends unknown[], U> = U extends T[number] ? true : false;

export type IncludesAll<T extends unknown[], U extends unknown[]> = U extends [infer F, ...infer R]
  ? F extends T[number]
    ? IncludesAll<T, R>
    : false
  : true;

export type IncludesAny<T extends unknown[], U extends unknown[]> = U extends [infer F, ...infer R]
  ? F extends T[number]
    ? true
    : IncludesAny<T, R>
  : false;

export type UnionIncludes<T, U> = [T] extends [never]
  ? false
  : T extends U
    ? true
    : U extends T
      ? true
      : false;

export type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;

export type First<T extends unknown[]> = T extends [infer F, ...unknown[]] ? F : never;

export type Rest<T extends unknown[]> = T extends [unknown, ...infer R] ? R : never;

export type Init<T extends unknown[]> = T extends [unknown, ...infer R] ? R : T extends [] ? [] : T;

export type At<T extends unknown[], I extends number> = T extends [...Array<unknown>, infer E]
  ? I extends keyof Init<T>
    ? E
    : never
  : never;

export type AtLeastOne<T, U = { [K in keyof T]-?: T[K] }> = Partial<T> & U & Record<string, never>;

export type AllOrNone<T> = Partial<T> | { [K in keyof T]-?: T[K] };

export type OneOrMore<T> = T | T[];

export type ExactlyOne<T, K extends keyof T = keyof T> = {
  [P in K]-?: T[P];
} & {
  [P in Exclude<keyof T, K>]?: never;
} & {
  [P in K]?: T[P];
} & Record<string, never>;

export type XOR<T, U> = T | U extends object
  ? (undefined extends T ? Record<string, never> : { [K in Exclude<keyof T, keyof U>]?: T[K] }) &
      (undefined extends U ? Record<string, never> : { [K in Exclude<keyof U, keyof T>]?: U[K] })
  : T | U;

export type NOR<T, U> = Exclude<Exclude<T, U>, U>;

export type NAND<T, U> = T extends U ? never : U extends T ? never : T | U;

export type OR<T, U> = T | U;

export type AND<T, U> = T & U;

export type NOT<T> = never extends T ? never : Exclude<T, never>;

export type XOR3<T, U, V> = XOR<T, XOR<U, V>>;

export type Tuple<T extends unknown[]> = {
  [K in keyof T]: T[K];
};

export type RecordKey<T> = T extends Record<infer K, unknown> ? K : never;

export type RecordValue<T> = T extends Record<string | number | symbol, infer V> ? V : never;

export type MapKey<T> = T extends Map<infer K, unknown> ? K : never;

export type MapValue<T> = T extends Map<unknown, infer V> ? V : never;

export type SetKey<T> = T extends Set<infer K> ? K : never;

export type PromiseKey<T> = T extends Promise<infer K> ? K : never;

export type ArrayKey<T> = T extends Array<infer K> ? K : never;

export type FunctionKey<T> = T extends (...args: unknown[]) => unknown ? T : never;

export type ObjectKey<T> = T extends object ? keyof T : never;

export type StringKey<T> = T extends string ? T : never;

export type NumberKey<T> = T extends number ? T : never;

export type BooleanKey<T> = T extends boolean ? T : never;

export type NullKey<T> = T extends null ? T : never;

export type UndefinedKey<T> = T extends undefined ? T : never;

export type VoidKey<T> = T extends void ? T : never;

export type AnyKey<T> = T extends unknown ? T : never;

export type UnknownKey<T> = T extends unknown ? T : never;

export type NeverKey<T> = T extends never ? T : never;

export type IsTuple<T> = T extends readonly unknown[]
  ? number extends T['length']
    ? false
    : true
  : false;

export type IsArray<T> = T extends unknown[] ? true : false;

export type IsObject<T> = T extends object
  ? T extends (...args: unknown[]) => unknown
    ? false
    : T extends unknown[]
      ? false
      : true
  : false;

export type IsFunction<T> = T extends (...args: unknown[]) => unknown ? true : false;

export type IsString<T> = T extends string ? true : false;

export type IsNumber<T> = T extends number ? true : false;

export type IsBoolean<T> = T extends boolean ? true : false;

export type IsNull<T> = T extends null ? true : false;

export type IsUndefined<T> = T extends undefined ? true : false;

export type IsNullable<T> = IsNull<T> extends true ? true : IsUndefined<T>;

export type IsOptional<T> = undefined extends T ? true : false;

export type IsRequired<T> = undefined extends T ? false : true;

export type IsReadonly<T> = T extends readonly unknown[] ? true : false;

export type IsMutable<T> = IsReadonly<T> extends true ? false : IsObject<T>;

export type IsDeepReadonly<T> = T extends DeepReadonly<unknown> ? true : false;

export type IsDeepMutable<T> = [T] extends [DeepMutable<unknown>] ? true : false;

export type IsExact<T, U> = Equals<T, U>;

export type IsSupertype<T, U> = T extends U ? true : false;

export type IsSubtype<T, U> = U extends T ? true : false;

export type IsAssignable<T, U> = [U] extends [T] ? true : false;

export type IsSame<T, U> = Equals<T, U>;

export type IsDifferent<T, U> = Equals<T, U> extends true ? false : true;

export type IsLiteral<T> = T extends Primitive
  ? [T] extends [never]
    ? false
    : [T] extends [string | number | boolean | bigint | symbol | null | undefined]
      ? T extends string | number | boolean | bigint | symbol | null | undefined
        ? [string | number | boolean | bigint | symbol | null | undefined] extends [T]
          ? false
          : true
        : false
      : false
  : false;

export type Equals<X, Y> =
  (<T>() => T extends X ? (Y extends X ? true : false) : false) extends <T>() => T extends Y
    ? Y extends X
      ? true
      : false
    : false
    ? true
    : false;

export type IsUnion<T, U extends T = T> = (T extends U ? false : true) extends false ? false : true;

export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I & { [K in keyof I]: I[K] }
  : never;

export type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends null
        ? null
        : T extends undefined
          ? undefined
          : T;

export type Narrow<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends null
        ? null
        : T extends undefined
          ? undefined
          : T;

export type ExtractLiteral<T> = T extends Primitive
  ? [T] extends [string | number | boolean | bigint | symbol | null | undefined]
    ? [string | number | boolean | bigint | symbol | null | undefined] extends [T]
      ? never
      : T
    : never
  : never;

export type ExtractUnion<T> = T extends Primitive
  ? [T] extends [string | number | boolean | bigint | symbol | null | undefined]
    ? [string | number | boolean | bigint | symbol | null | undefined] extends [T]
      ? T
      : never
    : never
  : never;

export type ExtractObject<T> = T extends object
  ? T extends (...args: unknown[]) => unknown
    ? never
    : T extends unknown[]
      ? never
      : T
  : never;

export type ExtractArray<T> = T extends unknown[] ? T : never;

export type ExtractFunction<T> = T extends (...args: unknown[]) => unknown ? T : never;

export type ExtractPrimitive<T> = T extends Primitive ? T : never;

export type ExtractNonPrimitive<T> = T extends object
  ? T extends (...args: unknown[]) => unknown
    ? never
    : T extends unknown[]
      ? never
      : T
  : never;

export type ExtractBuiltin<T> = T extends
  | Primitive
  | ((...args: unknown[]) => unknown)
  | Date
  | Error
  | RegExp
  ? T
  : never;

export type ExtractNonBuiltin<T> =
  | Primitive
  | ((...args: unknown[]) => unknown)
  | Date
  | Error
  | RegExp extends T
  ? never
  : T;

export type ExtractTuple<T> = T extends readonly unknown[]
  ? number extends T['length']
    ? never
    : T
  : never;

export type ExtractNonTuple<T> = T extends readonly unknown[]
  ? number extends T['length']
    ? T
    : never
  : never;

export type ExtractArrayNonTuple<T> = T extends unknown[]
  ? number extends T['length']
    ? T
    : never
  : never;

export type ExtractObjectNonArrayNonTuple<T> = T extends object
  ? T extends (...args: unknown[]) => unknown
    ? never
    : T extends unknown[]
      ? never
      : T
  : never;

export type ExtractFunctionNonObject<T> = T extends (...args: unknown[]) => unknown ? T : never;

export type ExtractPrimitiveNonObject<T> = T extends Primitive ? T : never;

export type ExtractNonPrimitiveNonObjectNonFunction<T> = T extends object
  ? T extends (...args: unknown[]) => unknown
    ? never
    : T
  : never;

export type ExtractBuiltinNonPrimitiveNonObjectNonFunction<T> = T extends
  | Primitive
  | ((...args: unknown[]) => unknown)
  | Date
  | Error
  | RegExp
  ? T extends Primitive
    ? T
    : never
  : never;

export type ExtractNonBuiltinNonPrimitiveNonObjectNonFunction<T> =
  | Primitive
  | ((...args: unknown[]) => unknown)
  | Date
  | Error
  | RegExp extends T
  ? never
  : T extends object
    ? T extends (...args: unknown[]) => unknown
      ? never
      : T
    : never;

export type ExtractTupleNonArrayNonObjectNonFunction<T> = T extends readonly unknown[]
  ? number extends T['length']
    ? T
    : never
  : never;

export type ExtractNonTupleNonArrayNonObjectNonFunction<T> = T extends readonly unknown[]
  ? number extends T['length']
    ? T
    : never
  : never;

export type ExtractArrayNonTupleNonObjectNonFunction<T> = T extends unknown[]
  ? number extends T['length']
    ? T
    : never
  : never;

export type ExtractObjectNonArrayNonTupleNonFunction<T> = T extends object
  ? T extends (...args: unknown[]) => unknown
    ? never
    : T extends unknown[]
      ? never
      : T
  : never;

export type ExtractFunctionNonObjectNonArrayNonTuple<T> = T extends (...args: unknown[]) => unknown
  ? T
  : never;

export type ExtractPrimitiveNonObjectNonArrayNonTupleNonFunction<T> = T extends Primitive
  ? T
  : never;

export type ExtractNonPrimitiveNonObjectNonArrayNonTupleNonFunction<T> = T extends object
  ? T extends (...args: unknown[]) => unknown
    ? never
    : T
  : never;

export type ExtractBuiltinNonPrimitiveNonObjectNonArrayNonTupleNonFunction<T> =
  | Primitive
  | ((...args: unknown[]) => unknown)
  | Date
  | Error
  | RegExp extends T
  ? T extends Primitive
    ? T
    : never
  : never;

export type ExtractNonBuiltinNonPrimitiveNonObjectNonArrayNonTupleNonFunction<T> =
  | Primitive
  | ((...args: unknown[]) => unknown)
  | Date
  | Error
  | RegExp extends T
  ? never
  : T extends object
    ? T extends (...args: unknown[]) => unknown
      ? never
      : T
    : never;

export type IsUnionLiteral<T, U> = [T] extends [U] ? false : [U] extends [T] ? false : true;

export type NonEmptyArray<T> = [T, ...T[]];

export type ValueOf<T> = T[keyof T];

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type AsyncReturnType<T extends (...args: unknown[]) => unknown> = T extends (
  ...args: unknown[]
) => Promise<infer U>
  ? U
  : T extends (...args: unknown[]) => infer U
    ? U
    : unknown;

export type TupleToUnion<T extends unknown[]> = T[number];

export type FirstOf<T extends unknown[]> = T extends [infer F, ...unknown[]] ? F : never;

export type LastOf<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;

export type IsAny<T> = unknown extends T ? ([T] extends [never] ? false : true) : false;

export type IsNever<T> = [T] extends [never] ? true : false;

export type IsUnknown<T> = unknown extends T ? ([T] extends [never] ? false : true) : false;

export type NonPrimitive = object;

export type Builtin = Primitive | ((...args: unknown[]) => unknown) | Date | Error | RegExp;

export type EventHandler<E extends React.SyntheticEvent<unknown, unknown>> = (event: E) => void;

export type ChangeHandler = EventHandler<React.ChangeEvent<Element>>;

export type FocusHandler = EventHandler<React.FocusEvent<Element>>;

export type KeyboardHandler = EventHandler<React.KeyboardEvent<Element>>;

export type MouseHandler = EventHandler<React.MouseEvent<Element>>;

export type TouchHandler = EventHandler<React.TouchEvent<Element>>;

export type WithoutRef<T> = Omit<T, 'ref'>;

export type WithRef<T> = T & { ref?: React.Ref<unknown> };

export type ForwardRefComponent<T, P> = React.ForwardRefExoticComponent<P & React.RefAttributes<T>>;

export type HTMLAttributes<T extends ElementType> = React.ComponentPropsWithoutRef<T>;

export type DefaultProps<T, P extends keyof T> = Omit<T, P> & { [K in P]?: T[K] };

export type OverrideComponentProps<T, O> = T & O;

export type Exact<T, Shape> = [Shape] extends [T] ? [T] : never;

export type DesignTokens = {
  [key: string]: string | number | Record<string, string | number>;
};

export type Theme = {
  tokens: DesignTokens;
  mode: 'light' | 'dark';
};

export type ThemeContextValue = {
  tokens: DesignTokens;
  setTokens: (patch: Partial<DesignTokens>) => void;
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
};

export type ColorToken = {
  oklch: string;
  hex: string;
  foreground?: string;
};

export type ShadowToken = {
  x: string;
  y: string;
  blur: string;
  spread: string;
  color_hex: string;
};

export type TypographyTokens = {
  'font-sans': string;
  'font-serif': string;
  'font-mono': string;
};

export type GeneratedColorToken = {
  value: {
    hex: string;
    oklch: string;
    foreground?: string;
  };
  name: string;
};

export type GeneratedTokens = {
  colors: Record<string, GeneratedColorToken>;
  spacing?: Record<string, string | number>;
  typography?: Record<string, string | number>;
  [key: string]: unknown;
};

export type AnimationDefinition = {
  name: string;
  duration?: string;
  timing?: string;
  delay?: string;
  iteration?: string;
  direction?: string;
  fill?: string;
  playState?: string;
};

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export type ButtonProps = CommonProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
};

export type InputProps = CommonProps & {
  defaultValue?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'color';
  label?: string;
  placeholder?: string;
  autoFocus?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export type CardProps = CommonProps & {};

export type BadgeProps = CommonProps & {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
};

export type AvatarProps = CommonProps & {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
};

export type CheckboxProps = CommonProps & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

export type RadioProps = CommonProps & {
  name?: string;
  value?: string;
  checked?: boolean;
  onChange?: (value: string) => void;
};

export type SwitchProps = CommonProps & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

export type ProgressProps = CommonProps & {
  value?: number;
  max?: number;
};

export type SpinnerProps = CommonProps & {
  size?: 'sm' | 'md' | 'lg';
};

export type AlertProps = CommonProps & {
  variant?: 'default' | 'destructive' | 'warning' | 'success';
};

export type TabsProps = CommonProps & {
  defaultValue?: string;
};

export type TabListProps = CommonProps & {};

export type TabProps = CommonProps & {
  value: string;
};

export type TabPanelProps = CommonProps & {
  value: string;
};

export type ModalProps = CommonProps & {
  isOpen?: boolean;
  onClose?: () => void;
};

export type TooltipProps = CommonProps & {
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
};

export type DividerProps = CommonProps & {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed';
};

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = CommonProps & {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export type Notification = {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
};

export type AppState = {
  isSidebarOpen: boolean;
  currentLanguage: string;
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLanguage: (lang: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export type ThemeState = {
  mode: 'light' | 'dark';
  tokens: DesignTokens;
  setMode: (mode: 'light' | 'dark') => void;
  setTokens: (tokens: Partial<DesignTokens>) => void;
};

export type ComponentState = {
  components: Record<string, unknown>;
  themes: Record<string, unknown>;
  tokens: Record<string, unknown>;
  registerComponent: (id: string, component: unknown) => void;
  unregisterComponent: (id: string) => void;
  registerTheme: (id: string, theme: unknown) => void;
  unregisterTheme: (id: string) => void;
  registerToken: (id: string, token: unknown) => void;
  unregisterToken: (id: string) => void;
  setMode: (mode: 'light' | 'dark') => void;
  setTokens: (tokens: Partial<DesignTokens>) => void;
};

export type LanguageState = {
  currentLanguage: string;
  supportedLanguages: string[];
  setLanguage: (language: string) => void;
  addLanguage: (language: string) => void;
  removeLanguage: (language: string) => void;
  getTranslation: (key: string) => string;
};

export type ErrorLog = {
  id: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  message: string;
  timestamp: number;
  source?: string;
  context?: Record<string, unknown>;
  stack?: string;
  userId?: string;
  sessionId?: string;
};

export type ErrorReportingConfig = {
  enabled: boolean;
  endpoint?: string;
  apiKey?: string;
  batchSize?: number;
  flushInterval?: number;
  maxRetries?: number;
  retryDelay?: number;
  includeContext?: boolean;
  includeStack?: boolean;
  includeUserInfo?: boolean;
  sanitizeData?: boolean;
  customFields?: Record<string, unknown>;
};

export type ErrorLoggerState = {
  logs: ErrorLog[];
  config: ErrorReportingConfig;
  isReporting: boolean;
  lastFlushTime: number;
  retryCount: number;
  addLog: (log: Omit<ErrorLog, 'id'>) => void;
  clearLogs: () => void;
  flushLogs: () => Promise<void>;
  updateConfig: (config: Partial<ErrorReportingConfig>) => void;
  enableReporting: () => void;
  disableReporting: () => void;
};

export type DocumentMapping = {
  sourcePath: string;
  targetPath: string;
  type:
    | 'component'
    | 'theme'
    | 'token'
    | 'store'
    | 'hook'
    | 'utility'
    | 'type'
    | 'config'
    | 'documentation';
  priority: 'high' | 'medium' | 'low';
  autoSync?: boolean;
  lastSynced?: number;
  dependencies?: string[];
};

export type DocumentSyncConfig = {
  enabled: boolean;
  interval?: number;
  batchSize?: number;
  maxRetries?: number;
  conflictResolution?: 'overwrite' | 'merge' | 'skip' | 'prompt';
  excludePatterns?: string[];
  includePatterns?: string[];
  dryRun?: boolean;
  validateBeforeSync?: boolean;
  backupEnabled?: boolean;
  backupPath?: string;
  syncOnStart?: boolean;
  syncOnSave?: boolean;
  syncOnBuild?: boolean;
  syncHooks?: {
    beforeSync?: (mappings: DocumentMapping[]) => void | Promise<void>;
    afterSync?: (mappings: DocumentMapping[]) => void | Promise<void>;
    onConflict?: (conflict: DocumentMapping[]) => DocumentMapping | Promise<DocumentMapping>;
    onError?: (error: Error) => void | Promise<void>;
  };
};

export type DocumentSyncerState = {
  mappings: DocumentMapping[];
  config: DocumentSyncConfig;
  isSyncing: boolean;
  lastSyncTime: number;
  syncStats: {
    total: number;
    successful: number;
    failed: number;
    skipped: number;
  };
  addMapping: (mapping: Omit<DocumentMapping, 'id'>) => void;
  removeMapping: (id: string) => void;
  updateMapping: (id: string, updates: Partial<DocumentMapping>) => void;
  sync: () => Promise<void>;
  updateConfig: (config: Partial<DocumentSyncConfig>) => void;
  enableSync: () => void;
  disableSync: () => void;
  getSyncStatus: () => DocumentSyncerState['syncStats'];
};

export type PluginManifest = {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  homepage?: string;
  repository?: string;
  keywords?: string[];
  icon?: string;
  screenshots?: string[];
  main?: string;
  types?: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  engines?: {
    node?: string;
    yyc3?: string;
  };
  yyc3?: {
    minVersion?: string;
    maxVersion?: string;
    apiVersion?: string;
    hooks?: PluginHooks;
  };
};

export type PluginConfig = {
  enabled: boolean;
  settings: Record<string, unknown>;
  permissions: string[];
};

export type PluginLogger = {
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
};

export type PluginHooks = {
  onInstall: (context: PluginContext) => void | Promise<void>;
  onActivate: (context: PluginContext) => void | Promise<void>;
  onDeactivate: (context: PluginContext) => void | Promise<void>;
  onUninstall: (context: PluginContext) => void | Promise<void>;
  onConfigChange: (config: PluginConfig) => void | Promise<void>;
  onThemeChange: (theme: string) => void | Promise<void>;
  onLanguageChange: (language: string) => void | Promise<void>;
};

export type PluginAPI = {
  registerComponent: (component: ComponentRegistration) => void;
  unregisterComponent: (componentId: string) => void;
  registerTheme: (theme: ThemeRegistration) => void;
  unregisterTheme: (themeId: string) => void;
  registerToken: (token: TokenRegistration) => void;
  unregisterToken: (tokenId: string) => void;
  getComponents: () => ComponentRegistration[];
  getThemes: () => ThemeRegistration[];
  getTokens: () => TokenRegistration[];
};

export type PluginContext = {
  pluginId: string;
  pluginVersion: string;
  appVersion: string;
  config: PluginConfig;
  api: PluginAPI;
  logger: PluginLogger;
  hooks: PluginHooks;
};

export type ComponentRegistration = {
  id: string;
  name: string;
  component: ElementType;
  props?: Record<string, unknown>;
  category?: string;
  tags?: string[];
  icon?: string;
  description?: string;
  pluginId?: string;
};

export type ThemeRegistration = {
  id: string;
  name: string;
  tokens: Partial<DesignTokens>;
  mode?: 'light' | 'dark';
  pluginId?: string;
};

export type TokenRegistration = {
  id: string;
  name: string;
  tokens: Partial<DesignTokens>;
  pluginId?: string;
};

export type PluginState = {
  installed: boolean;
  activated: boolean;
  version: string;
  lastUpdated: number;
};

export type PluginEvent = {
  type: string;
  source: string;
  timestamp: number;
  data?: unknown;
};

export type PluginManagerState = {
  plugins: Map<string, PluginManifest>;
  pluginStates: Map<string, PluginState>;
  componentRegistry: Map<string, ComponentRegistration>;
  themeRegistry: Map<string, ThemeRegistration>;
  tokenRegistry: Map<string, TokenRegistration>;
  eventListeners: Map<string, Set<(event: PluginEvent) => void>>;
  install: (manifest: PluginManifest) => Promise<void>;
  uninstall: (pluginId: string) => Promise<void>;
  activate: (pluginId: string) => Promise<void>;
  deactivate: (pluginId: string) => Promise<void>;
  registerComponent: (component: ComponentRegistration) => void;
  unregisterComponent: (componentId: string) => void;
  registerTheme: (theme: ThemeRegistration) => void;
  unregisterTheme: (themeId: string) => void;
  registerToken: (token: TokenRegistration) => void;
  unregisterToken: (tokenId: string) => void;
  getComponents: () => ComponentRegistration[];
  getThemes: () => ThemeRegistration[];
  getTokens: () => TokenRegistration[];
  on: (eventType: string, listener: (event: PluginEvent) => void) => void;
  off: (eventType: string, listener: (event: PluginEvent) => void) => void;
  emit: (event: PluginEvent) => void;
  getPlugin: (pluginId: string) => PluginManifest | undefined;
  getAllPlugins: () => PluginManifest[];
  getActivatedPlugins: () => PluginManifest[];
  getComponent: (componentId: string) => ComponentRegistration | undefined;
  getTheme: (themeId: string) => ThemeRegistration | undefined;
  getToken: (tokenId: string) => TokenRegistration | undefined;
};

export type FormProps<T extends z.ZodType> = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> & {
  schema: T;
  defaultValues?: z.infer<T>;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  children: ReactNode | ((methods: UseFormReturn<z.infer<T>>) => ReactNode);
  className?: string;
  'data-testid'?: string;
};

export type FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  name: TName;
  label?: string;
  error?: string;
  required?: boolean;
  description?: string;
  className?: string;
  'data-testid'?: string;
  children: (field: {
    name: TName;
    value: FieldPathValue<TFieldValues, TName>;
    onChange: (value: FieldPathValue<TFieldValues, TName>) => void;
    onBlur: () => void;
    ref: React.Ref<unknown>;
    disabled?: boolean;
    [key: string]: unknown;
  }) => ReactNode;
};

export type FormErrorProps = CommonProps & {
  error?: string;
};

export type TableProps<T extends Record<string, unknown>> = CommonProps & {
  columns: TableColumn<T>[];
  dataSource: T[];
  rowKey?: string | ((record: T) => string);
  loading?: boolean;
  bordered?: boolean;
  size?: 'small' | 'middle' | 'large';
  showHeader?: boolean;
  pagination?: PaginationProps;
  rowSelection?: RowSelectionProps<T>;
  onRow?: (record: T, index: number) => RowEventHandlers;
  className?: string;
};

export type TableColumn<T extends Record<string, unknown>> = {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: unknown, record: T, index: number) => ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
};

export type PaginationProps = {
  current?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  pageSizeOptions?: number[];
};

export type RowSelectionProps<T> = {
  selectedRowKeys?: (string | number)[];
  onChange?: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void;
  type?: 'checkbox' | 'radio';
};

export type RowEventHandlers = {
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
};

export type BreadcrumbProps = CommonProps & {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  maxItems?: number;
  showIcons?: boolean;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export type DropdownProps<T = string> = CommonProps & {
  options: DropdownOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  loading?: boolean;
  trigger?: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
};

export type DropdownOption<T = string> = {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
  description?: string;
};

export type MenuProps = CommonProps & {
  items: MenuItem[];
  mode?: 'vertical' | 'horizontal';
  theme?: 'light' | 'dark';
  selectable?: boolean;
  defaultSelectedKeys?: string[];
  onSelectedKeysChange?: (selectedKeys: string[]) => void;
};

export type MenuItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  children?: MenuItem[];
  danger?: boolean;
  divider?: boolean;
};

export type LanguageSwitcherProps = CommonProps & {
  currentLanguage: string;
  supportedLanguages: { code: string; name: string; flag?: string }[];
  onLanguageChange: (language: string) => void;
  showFlag?: boolean;
  showName?: boolean;
};

export type ErrorBoundaryProps = CommonProps & {
  fallback?: ReactNode | ((error: Error, errorInfo: React.ErrorInfo) => ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: string[];
};

export type ErrorNotificationProps = CommonProps & {
  error: Error | null;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  showDetails?: boolean;
};

export type ColorTokenStyle = {
  color: ColorValue;
  backgroundColor?: ColorValue;
  borderColor?: ColorValue;
  foreground?: ColorValue;
};

export type DynamicStyleValue<
  T extends Record<string, unknown>,
  K extends keyof T,
> = K extends keyof T
  ? T[K] extends string
    ? string
    : T[K] extends number
      ? number
      : T[K] extends boolean
        ? boolean
        : unknown
  : never;

export type SafeStyleAssignment<T extends Record<string, unknown>, K extends keyof T> = {
  [P in K]: T[P] extends string
    ? string
    : T[P] extends number
      ? number
      : T[P] extends boolean
        ? boolean
        : never;
};

export type StrictRecord<K extends PropertyKey, T> = Record<K, T> & {
  [P in K]: T;
};

export type ExactRecord<K extends PropertyKey, T> = {
  [P in K]: T;
} & {
  [P in Exclude<PropertyKey, K>]: never;
};

export type RequiredKeys<T, K extends keyof T> = {
  [P in K]-?: T[P];
} & {
  [P in Exclude<keyof T, K>]?: T[P];
};

export type OptionalKeys<T, K extends keyof T> = {
  [P in K]?: T[P];
} & {
  [P in Exclude<keyof T, K>]-?: T[P];
};

export type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

export type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

export type OmitByValue<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
};

export type UnionToTuple<T, L extends number> = [T, ...Array<T, L>];

export type LengthOf<T extends readonly unknown[]> = T['length'];

export type IsEmpty<T extends readonly unknown[]> = T['length'] extends 0 ? true : false;

export type NonEmpty<T extends readonly unknown[]> = T['length'] extends 0 ? false : true;

export type ArrayToReadonly<T> = Readonly<T>;

export type ReadonlyToArray<T> = T extends readonly unknown[] ? [...T] : never;

export type Join<T extends readonly string[], D extends string = ''> = T extends readonly [
  infer F,
  ...infer R,
]
  ? `${F}${D}${Join<R, D>}`
  : '';

export type Split<S extends string, D extends string> = S extends `${infer T}${D}${infer R}`
  ? [T, ...Split<R, D>]
  : [S];

export type CamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<CamelCase<U>>}`
  : S;

export type KebabCase<S extends string> = S extends `${infer T}${infer U}`
  ? U extends Uppercase<U>
    ? `${T}-${Lowercase<U>}`
    : `${T}-${KebabCase<U>}`
  : S;

export type PascalCase<S extends string> = Capitalize<CamelCase<S>>;

export type SnakeCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}_${SnakeCase<U>}`
  : S;

export type Lowercase<S extends string> = S extends `${infer T}${infer U}`
  ? `${Lowercase<T>}${Lowercase<U>}`
  : S;

export type Uppercase<S extends string> = S extends `${infer T}${infer U}`
  ? `${Uppercase<T>}${Uppercase<U>}`
  : S;

export type Capitalize<S extends string> = S extends `${infer T}${infer U}`
  ? `${Uppercase<T>}${Lowercase<U>}`
  : S;

export type Uncapitalize<S extends string> = S extends `${infer T}${infer U}`
  ? `${Lowercase<T>}${U}`
  : S;

export type Trim<S extends string> = S extends `${' '}${infer T}${' '}`
  ? Trim<T>
  : S extends `${'\t'}${infer T}${'\t'}`
    ? Trim<T>
    : S extends `${'\n'}${infer T}${'\n'}`
      ? Trim<T>
      : S extends `${'\r'}${infer T}${'\r'}`
        ? Trim<T>
        : S;

export type Replace<S extends string, From extends string, To extends string> = From extends ''
  ? S
  : S extends `${infer Before}${From}${infer After}`
    ? `${Before}${To}${Replace<After, From, To>}`
    : S;

export type ReplaceAll<S extends string, From extends string, To extends string> = From extends ''
  ? S
  : S extends `${infer Before}${From}${infer After}`
    ? `${Before}${To}${ReplaceAll<After, From, To>}`
    : S;

export type Includes<S extends string, Sub extends string> = S extends `${string}${Sub}${string}`
  ? true
  : false;

export type StartsWith<S extends string, Prefix extends string> = S extends `${Prefix}${string}`
  ? true
  : false;

export type EndsWith<S extends string, Suffix extends string> = S extends `${string}${Suffix}`
  ? true
  : false;

export type StringLength<S extends string, L extends number = S['length']> = S['length'] extends L
  ? true
  : false;

export type StringAt<S extends string, I extends number> = string;

export type StringSlice<S extends string, Start extends number, End extends number> = string;

export type StringSubstring<S extends string, Start extends number, End extends number> = string;

export type StringConcat<A extends string, B extends string> = `${A}${B}`;

export type StringPadStart<S extends string, N extends number, Pad extends string = ''> = string;

export type StringPadEnd<S extends string, N extends number, Pad extends string = ''> = string;

export type StringRepeat<S extends string, N extends number, Acc extends string = ''> = string;

export type StringTrim<S extends string> = Trim<S>;

export type StringTrimLeft<S extends string> = S;

export type StringTrimRight<S extends string> = S;

export type StringTrimStart<S extends string> = S;

export type StringTrimEnd<S extends string> = S;

export type NumberToString<N extends number> = string;

export type StringToNumber<S extends string> = number;

export type StringToBoolean<S extends string> = S extends 'true'
  ? true
  : S extends 'false'
    ? false
    : never;

export type BooleanToString<B extends boolean> = B extends true ? 'true' : 'false';

export type NumberToBoolean<N extends number> = N extends 0 ? false : N extends 1 ? true : never;

export type BooleanToNumber<B extends boolean> = B extends true ? 1 : 0;

export type IsPositive<N extends number> = N extends 0 ? false : N extends number ? true : false;

export type IsNegative<N extends number> = N extends 0 ? false : N extends number ? true : false;

export type IsZero<N extends number> = N extends 0 ? true : false;

export type IsNonZero<N extends number> = N extends 0 ? false : true;

export type IsEven<N extends number> = N extends number ? true : false;

export type IsOdd<N extends number> = N extends number ? true : false;

export type Add<A extends number, B extends number> = number;

export type Subtract<A extends number, B extends number> = number;

export type Multiply<A extends number, B extends number> = number;

export type Divide<A extends number, B extends number> = number;

export type Mod<A extends number, B extends number> = number;

export type Power<A extends number, B extends number> = number;

export type Max<A extends number, B extends number> = A extends B ? A : B;

export type Min<A extends number, B extends number> = A extends B ? B : A;

export type Clamp<N extends number, Min extends number, Max extends number> = N extends Min
  ? N extends Max
    ? N
    : Max
  : Min;

export type Abs<N extends number> = number;

export type Sign<N extends number> = '+' | '-' | '0';

export type Round<N extends number> = number;

export type Floor<N extends number> = number;

export type Ceil<N extends number> = number;

export type Trunc<N extends number> = number;

export type ArrayPush<T extends unknown[], U> = [...T, U];

export type ArrayPop<T extends unknown[]> = T extends [...infer R, infer _] ? R : never;

export type ArrayShift<T extends unknown[]> = T extends [infer _, ...infer R] ? R : never;

export type ArrayUnshift<T extends unknown[], U> = [U, ...T];

export type ArraySplice<
  T extends unknown[],
  Start extends number,
  DeleteCount extends number,
  Insert extends unknown[],
> = T extends [...infer Before, ...infer After]
  ? DeleteCount extends 0
    ? [...Before, ...Insert, ...After]
    : DeleteCount extends 1
      ? Before extends [infer _, ...infer Rest]
        ? [...Rest, ...Insert, ...After]
        : never
      : never
  : never;

export type ArraySort<T> = T extends number[] ? number[] : T extends string[] ? string[] : T[];

export type ArrayReverse<T> = T extends [...infer R, infer L] ? [L, ...Reverse<R>] : [];

export type ArrayFlat<T extends unknown[]> = T extends [infer F, ...infer R] ? F | ArrayFlat<R> : F;

export type ArrayFlatMap<T extends unknown[]> = T extends [infer F, ...infer R]
  ? [F, ...ArrayFlatMap<R>]
  : [F];

export type ArrayJoin<T extends string[], D extends string = ','> = string;

export type ArrayIncludes<T extends unknown[], U> = U extends T[number] ? true : false;

export type ArrayIndexOf<T extends unknown[], U> = number;

export type ArrayFind<T extends unknown[], U> = T extends U ? T : never;

export type ArrayFilter<T extends unknown[], U> = T[];

export type ArrayMap<T extends unknown[], U> = U[];

export type ArrayReduce<T extends unknown[], U, Acc = unknown> = Acc;

export type ArraySome<T extends unknown[]> = boolean;

export type ArrayEvery<T extends unknown[]> = boolean;

export type ArrayForEach<T extends unknown[]> = void;

export type ArrayLength<T extends unknown[]> = T['length'];

export type ArrayAt<T extends unknown[], I extends number> = T[number];

export type ArraySlice<T extends unknown[], Start extends number, End extends number> = T[];

export type ArrayConcat<T extends unknown[], U extends unknown[]> = [...T, ...U];

export type ArrayFill<T, N extends number> = T[];

export type ArrayFrom<T, N extends number> = T[];

export type ArrayOf<T, N extends number> = ArrayFrom<T, N>;

export type ArrayCopyWithin<T, Target extends number, Start extends number, End extends number> = T;

export type ArrayEntries<T extends unknown[]> = T extends readonly unknown[]
  ? { [K in keyof T]: [K, T[K]] }
  : never;

export type ArrayKeys<T extends unknown[]> = T extends readonly unknown[] ? keyof T : never;

export type ArrayValues<T extends unknown[]> = T[number];

export type ObjectKeys<T extends object> = keyof T;

export type ObjectValues<T extends object> = T[keyof T];

export type ObjectEntries<T extends object> = T extends object
  ? { [K in keyof T]: [K, T[K]] }
  : never;

export type ObjectFromEntries<T extends readonly [PropertyKey, unknown][]> = {
  [K in T[number] as K extends PropertyKey ? K : never]: T extends [K, infer V] ? V : never;
};

export type ObjectAssign<T, U> = T & U;

export type ObjectMerge<T, U> = Omit<T, keyof U> & U;

export type ObjectOmit<T, K extends keyof T> = Omit<T, K>;

export type ObjectPick<T, K extends keyof T> = Pick<T, K>;

export type ObjectKeys<T extends object> = keyof T;

export type ObjectValues<T extends object> = T[keyof T];

export type ObjectEntries<T extends object> = T extends object
  ? { [K in keyof T]: [K, T[K]] }
  : never;

export type PromiseAll<T extends readonly unknown[]> = {
  [K in keyof T]: T[K] extends Promise<infer U> ? U : never;
}[keyof T];

export type PromiseRace<T extends readonly unknown[]> =
  T[number] extends Promise<infer U> ? U : never;

export type PromiseAny<T extends readonly unknown[]> =
  T[number] extends Promise<infer U> ? U : never;

export type PromiseAllSettled<T extends readonly unknown[]> = {
  [K in keyof T]: T[K] extends Promise<infer U> ? PromiseSettledResult<U> : never;
}[keyof T];

export type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

export type PromiseFulfilledResult<T> = {
  status: 'fulfilled';
  value: T;
};

export type PromiseRejectedResult = {
  status: 'rejected';
  reason: unknown;
};

export type FunctionParameters<T extends (...args: unknown[]) => unknown> = T extends (
  ...args: infer P
) => unknown
  ? P
  : never;

export type FunctionReturnType<T extends (...args: unknown[]) => unknown> = T extends (
  ...args: unknown[]
) => infer R
  ? R
  : never;

export type FunctionThisParameter<T> = T extends (this: infer U, ...args: unknown[]) => unknown
  ? U
  : unknown;

export type InstanceType<T extends new (...args: unknown[]) => unknown> = T extends new (
  ...args: infer P
) => infer R
  ? R
  : never;

export type ConstructorParameters<T extends new (...args: unknown[]) => unknown> = T extends new (
  ...args: infer P
) => unknown
  ? P
  : never;

export type ThisParameterType<T> = T extends (this: infer U, ...args: unknown[]) => unknown
  ? U
  : unknown;

export type OmitThisParameter<T> = T extends (this: unknown, ...args: infer P) => unknown
  ? (...args: P) => unknown
  : never;

export type ExtractThisParameter<T> = T extends (this: infer U, ...args: unknown[]) => unknown
  ? U
  : unknown;

export type NoInfer<T> = [T] extends [never] ? T : T;

export type IsLiteralType<T> = T extends string
  ? string extends T
    ? false
    : true
  : T extends number
    ? number extends T
      ? false
      : true
    : T extends boolean
      ? boolean extends T
        ? false
        : true
      : T extends bigint
        ? bigint extends T
          ? false
          : true
        : T extends symbol
          ? symbol extends T
            ? false
            : true
          : false;

export type IsUnionType<T> = [T] extends [never] ? false : true;

export type IsIntersectionType<T> = [T] extends [never]
  ? false
  : T extends object
    ? T extends (...args: unknown[]) => unknown
      ? false
      : T extends unknown[]
        ? false
        : true
    : false;

export type IsArrayType<T> = T extends readonly unknown[] ? true : false;

export type IsTupleType<T> = T extends readonly unknown[]
  ? number extends T['length']
    ? false
    : true
  : false;

export type IsObjectType<T> = T extends object
  ? T extends (...args: unknown[]) => unknown
    ? false
    : T extends unknown[]
      ? false
      : true
  : false;

export type IsFunctionType<T> = T extends (...args: unknown[]) => unknown ? true : false;

export type IsPromiseType<T> = T extends Promise<unknown> ? true : false;

export type IsAsyncFunction<T> = T extends (...args: unknown[]) => Promise<unknown> ? true : false;

export type IsSyncFunction<T> = T extends (...args: unknown[]) => unknown
  ? T extends (...args: unknown[]) => Promise<unknown>
    ? false
    : true
  : false;

export type ExtractReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never;

export type ExtractParameters<T> = T extends (...args: unknown[]) => infer P ? P : never;

export type ExtractAwaited<T> = T extends Promise<infer U> ? U : T;

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type UnwrapArray<T> = T extends (infer U)[] ? U : T;

export type UnwrapReadonlyArray<T> = T extends readonly (infer U)[] ? U : T;

export type FlattenObjectKeys<T> = T extends object
  ? { [K in keyof T]: T[K] extends object ? FlattenObjectKeys<T[K]> : T[K] }
  : never;

export type FlattenObjectValues<T> = T extends object
  ? { [K in keyof T]: T[K] extends object ? FlattenObjectValues<T[K]> : T[K] }
  : never;

export type FlattenObject<T> = FlattenObjectKeys<T> | FlattenObjectValues<T>;

export type DeepOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P] extends object
    ? DeepOmit<T[P], K extends keyof T[P] ? K : never>
    : T[P];
};

export type DeepPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type DeepMerge<T, U> = Omit<T, keyof U> & U;

export type Path<T> = keyof T | string;

export type PathValue<T, P extends string> = unknown;

export type DeepReadonlyKeys<T> = {
  [P in keyof T]: T[P] extends object ? DeepReadonlyKeys<T[P]> : T[P];
};

export type DeepMutableKeys<T> = {
  [P in keyof T]: T[P] extends object ? DeepMutableKeys<T[P]> : T[P];
};

export type DeepRequiredKeys<T> = {
  [P in keyof T]: T[P] extends object ? DeepRequiredKeys<T[P]> : T[P];
};

export type DeepOptionalKeys<T> = {
  [P in keyof T]: T[P] extends object ? DeepOptionalKeys<T[P]> : T[P];
};

export type PartialKeys<T> = {
  [P in keyof T]-?: T[P];
};

export type RequiredKeys<T> = {
  [P in keyof T]-?: T[P];
};

export type ReadonlyKeys<T> = {
  [P in keyof T]: T[P] extends Readonly<T[P]> ? P : never;
};

export type MutableKeys<T> = {
  [P in keyof T]: T[P] extends Readonly<T[P]> ? never : P;
};

export type GetRequired<T> = {
  [P in RequiredKeys<T>]-?: T[P];
};

export type GetOptional<T> = {
  [P in OptionalKeys<T>]: T[P];
};

export type GetReadonly<T> = Readonly<Pick<T, ReadonlyKeys<T>>>;

export type GetMutable<T> = Omit<T, ReadonlyKeys<T>>;

export type MakeRequired<T> = {
  [P in keyof T]-?: T[P];
};

export type MakeOptional<T> = {
  [P in keyof T]?: T[P];
};

export type MakeReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

export type MakeMutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type MakePartial<T> = {
  [P in keyof T]?: T[P];
};

export type MakeDeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : Required<T[P]>;
};

export type MakeDeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type MakeDeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : Readonly<T[P]>;
};

export type MakeDeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : Mutable<T[P]>;
};

export type AssertEqual<T, U> = T extends U ? (U extends T ? true : false) : false;

export type AssertExtends<T, U> = T extends U ? true : false;

export type AssertAssignable<T, U> = [U] extends [T] ? true : false;

export type AssertNotAny<T> = [T] extends [never] ? false : true;

export type AssertNotNever<T> = [T] extends [never] ? true : false;

export type AssertNotUndefined<T> = undefined extends T ? false : true;

export type AssertNotNull<T> = null extends T ? false : true;

export type AssertNullable<T> = null extends T ? true : undefined extends T ? true : false;

export type AssertOptional<T> = undefined extends T ? true : false;

export type AssertRequired<T> = undefined extends T ? false : true;

export type AssertReadonly<T> = T extends Readonly<T> ? true : false;

export type AssertMutable<T> = T extends Readonly<T> ? false : true;

export type AssertArray<T> = T extends unknown[] ? true : false;

export type AssertObject<T> = T extends object
  ? T extends (...args: unknown[]) => unknown
    ? false
    : true
  : false;
