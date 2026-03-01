/**
 * @file 高级类型定义
 * @description 提供严格的类型约束和高级类型工具
 * @module types/advanced-types
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import type { ElementType } from 'react';
import * as React from 'react';

export type DesignTokens = {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, unknown>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
  animations: Record<string, string>;
  breakpoints: Record<string, string>;
};

export type OmitNever<T> = Omit<T, never>;

export type StrictOmit<T, K extends keyof T> = T & OmitNever<Pick<T, K>>;

export type StrictPick<T, K extends keyof T> = Pick<T, K>;

export type Merge<T, U> = Omit<T, keyof U> & U;

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

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type MaybePromise<T> = T | Promise<T>;

export type AsyncReturnType<T extends (...args: unknown[]) => unknown> = T extends (
  ...args: unknown[]
) => Promise<infer U>
  ? U
  : T extends (...args: unknown[]) => infer U
    ? U
    : unknown;

export type NonEmptyArray<T> = [T, ...T[]];

export type ValueOf<T> = T[keyof T];

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I & { [K in keyof I]: I[K] }
  : never;

export type LastOf<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;

export type FirstOf<T extends unknown[]> = T extends [infer F, ...unknown[]] ? F : never;

export type TupleToUnion<T extends unknown[]> = T[number];

export type IsAny<T> = unknown extends T ? ([T] extends [never] ? false : true) : false;

export type IsNever<T> = [T] extends [never] ? true : false;

export type IsUnknown<T> = unknown extends T ? ([T] extends [never] ? false : true) : false;

export type IsUnion<T, U extends T = T> = (T extends U ? false : true) extends false ? false : true;

export type Equals<X, Y> =
  (<T>() => T extends X ? (Y extends X ? true : false) : false) extends <T>() => T extends Y
    ? Y extends X
      ? true
      : false
    : false
    ? true
    : false;

export type Brand<K, T> = T & { readonly __brand: K };

export type Unbrand<T> = T extends { readonly __brand: unknown } ? T : never;

export type BrandedColor = Brand<'Color', string>;

export type BrandedSpacing = Brand<'Spacing', string>;

export type ColorValue = string | BrandedColor;

export type CSSValue = string | number;

export type ResponsiveValue<T> = T | (T | Responsive<T>)[];

export type Responsive<T> = {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
};

export type SpacingValue = string | number;

export type ThemeValue<T> = T | ((theme: DesignTokens) => T);

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

export type WithAsProp<T extends ElementType> = {
  as?: T;
};

export type WithoutRef<T> = Omit<T, 'ref'>;

export type WithRef<T> = T & { ref?: React.Ref<unknown> };

export type ForwardRefComponent<T, P> = React.ForwardRefExoticComponent<P & React.RefAttributes<T>>;

export type HTMLAttributes<T extends ElementType> = React.ComponentPropsWithoutRef<T>;

export type EventHandler<E extends React.SyntheticEvent<unknown, unknown>> = (event: E) => void;

export type ChangeHandler = EventHandler<React.ChangeEvent<Element>>;

export type FocusHandler = EventHandler<React.FocusEvent<Element>>;

export type KeyboardHandler = EventHandler<React.KeyboardEvent<Element>>;

export type MouseHandler = EventHandler<React.MouseEvent<Element>>;

export type TouchHandler = EventHandler<React.TouchEvent<Element>>;

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
  onClick?: MouseHandler;
  onDoubleClick?: MouseHandler;
  onMouseDown?: MouseHandler;
  onMouseUp?: MouseHandler;
  onMouseEnter?: MouseHandler;
  onMouseLeave?: MouseHandler;
  onMouseMove?: MouseHandler;
  onFocus?: FocusHandler;
  onBlur?: FocusHandler;
  onKeyDown?: KeyboardHandler;
  onKeyUp?: KeyboardHandler;
  onChange?: ChangeHandler;
  onSubmit?: EventHandler<React.FormEvent<HTMLFormElement>>;
  onReset?: EventHandler<React.FormEvent<HTMLFormElement>>;
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

export type ElementTypeType = React.ElementType;

export type ComponentType<P = unknown> = React.ComponentType<P>;

export type ReactElement = React.ReactElement;

export type ReactNode = React.ReactNode;

export type Ref<T> = React.Ref<T>;

export type RefCallback<T> = (instance: T | null) => void;

export type MutableRefObject<T> = React.MutableRefObject<T>;

export type ComponentPropsType<T extends ElementType> = React.ComponentPropsWithoutRef<T>;

export type PolymorphicRef<T extends ElementType> = React.ComponentPropsWithRef<T>['ref'];

export type ExtractProps<T> = T extends React.ComponentType<infer P> ? P : never;

export type MergeProps<T, U> = Omit<T, keyof U> & U;

export type OverrideProps<T, O> = Omit<T, keyof O> & Partial<O>;

export type OverrideComponentProps<T, O> = T & O;

export type DefaultProps<T, P extends keyof T> = Omit<T, P> & { [K in P]?: T[K] };

export type ExtractComponentType<T> = T extends React.ComponentType<infer P> ? P : never;

export type Prettify<T> = {
  [K in keyof T]: T[K];
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : Required<T[P]>;
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : T[P];
};

export type Exact<T, Shape> = [Shape] extends [T] ? [T] : never;

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

export type Tail<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;

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

export type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type NonPrimitive = object;

export type Builtin = Primitive | ((...args: unknown[]) => unknown) | Date | Error | RegExp;

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

export type IsUnionLiteral<T, U> = [T] extends [U] ? false : [U] extends [T] ? false : true;

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

export type ExtractNonPrimitive<T> = T extends NonPrimitive ? T : never;

export type ExtractBuiltin<T> = T extends Builtin ? T : never;

export type ExtractNonBuiltin<T> = Builtin extends T ? never : T;

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

export type ExtractObjectNonArray<T> = T extends object
  ? T extends (...args: unknown[]) => unknown
    ? never
    : T extends unknown[]
      ? never
      : T
  : never;

export type ExtractFunctionNonObject<T> = T extends (...args: unknown[]) => unknown ? T : never;

export type ExtractPrimitiveNonObject<T> = T extends Primitive ? T : never;

export type ExtractNonPrimitiveNonObjectNonFunction<T> = T extends NonPrimitive
  ? T extends (...args: unknown[]) => unknown
    ? never
    : T
  : never;

export type ExtractBuiltinNonPrimitiveNonObjectNonFunction<T> = T extends Builtin
  ? T extends Primitive
    ? T
    : never
  : never;

export type ExtractNonBuiltinNonPrimitiveNonObjectNonFunction<T> = NonPrimitive extends T
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

export type ExtractNonPrimitiveNonObjectNonArrayNonTupleNonFunction<T> = T extends NonPrimitive
  ? T extends (...args: unknown[]) => unknown
    ? never
    : T
  : never;

export type ExtractBuiltinNonPrimitiveNonObjectNonArrayNonTupleNonFunction<T> = T extends Builtin
  ? T extends Primitive
    ? T
    : never
  : never;

export type ExtractNonBuiltinNonPrimitiveNonObjectNonArrayNonTupleNonFunction<T> =
  NonPrimitive extends T ? (T extends (...args: unknown[]) => unknown ? never : T) : never;
