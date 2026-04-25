import type { z } from 'zod/v4';

export type SelectSchema = z.ZodUnion<[z.ZodString, z.ZodNumber]>;
export type AutocompleteSchema = z.ZodUnion<[z.ZodString, z.ZodNumber]>;
export type MultiselectSchema = z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
export type MultiAutocompleteSchema = z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
export type ArraySchema = z.ZodArray<z.ZodObject<any>>;
