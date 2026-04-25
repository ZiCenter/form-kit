import type { Field } from '../contracts/field.contract';
import type { FormStep } from '../contracts/form.contract';
import type { BaseField } from '../models/Field/Field';

export type Simplify<T> = { [K in keyof T]: T[K] } & {};

export type OutputOf<F> = F extends BaseField<infer O, any, any> ? O : never;

export type FieldOutput<F extends readonly Field[], K extends string> =
  Extract<F[number], { key: K }> extends BaseField<infer O, any, any> ? O : never;

export type AlwaysOptionalKeys<F extends readonly Field[]> = Extract<
  F[number],
  { alwaysOptional: true }
>['key'];

export type RequiredKeys<F extends readonly Field[]> = Exclude<
  Extract<F[number], { required: true }>['key'],
  AlwaysOptionalKeys<F>
>;

export type AllKeys<F extends readonly Field[]> = F[number]['key'];

export type StepFields<S extends readonly FormStep[]> = S[number] extends infer Step
  ? Step extends { fields: infer F extends readonly Field[] }
    ? F[number]
    : never
  : never;
