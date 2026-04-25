# @zicenter/form-kit

Headless, class-driven form primitives for React. Instantiate field classes, hand them to `FormEngine`, and the kit auto-builds a Zod schema, wires it to `react-hook-form`, and renders each field through slot components you provide.

Designed to be fully visual-free: it ships **zero** styles, layout, or components with opinions about how inputs look. You supply the field renderers and the stepper shell; `form-kit` handles schema generation, validation, defaults, coercion, visibility, disabled state, and step orchestration.

Used as the form engine behind [`@zicenter/resource-kit`](https://github.com/ZiCenter/resource-kit).

## Install

Consumed as a git-based npm dependency:

```json
{
  "dependencies": {
    "@zicenter/form-kit": "github:ZiCenter/form-kit#main"
  }
}
```

On `pnpm install`, pnpm clones the repo and runs the `prepare` hook (`tsup`), so consumers always resolve against built output in `dist/`.

To enable the `prepare` hook under pnpm, add to your workspace or root `package.json`:

```yaml
# pnpm-workspace.yaml
onlyBuiltDependencies:
  - '@zicenter/form-kit'
```

### Pinning

Use a commit SHA for reproducible installs once stable:

```json
"@zicenter/form-kit": "github:ZiCenter/form-kit#<commit-sha>"
```

`pnpm-lock.yaml` pins the resolved commit even with `#main`, so re-running `pnpm install` bumps it.

## Peer dependencies

| Package | Version |
|---|---|
| `react` | `^19` |
| `react-dom` | `^19` |
| `react-hook-form` | `^7` |
| `@hookform/resolvers` | `^5` |
| `zod` | `^4` |

## Mental model

1. **Fields are class instances.** `new TextField({...})`, `new SelectField({...})`, etc. Each class knows its base Zod schema, its renderer dispatch, and its config shape.
2. **Forms are stepped.** `FormEngine` always takes `steps: FormStep[]`. A single-step form is just one step.
3. **Rendering is slot-driven.** `FormFieldProvider` injects two things into context: a `slots` map (one component per field type) and a `StepperWrapper` (the form shell). `FormEngine` reads both — there are no defaults.

## Quick start

```tsx
import {
  FormEngine,
  FormFieldProvider,
  defineFields,
  defineSteps,
  TextField,
  SelectField,
  type FormFieldSlots,
  type StepperWrapper,
} from '@zicenter/form-kit';

// 1. Slot components — one per field type. Every slot in FormFieldSlots is required.
const slots: FormFieldSlots = {
  text: ({ field, value, onChange, error, disabled }) => (
    <label>
      <span>{field.label}</span>
      <input
        value={(value as string) ?? ''}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <em>{error}</em>}
    </label>
  ),
  select: ({ field, value, onChange, disabled }) => {
    // field.options is the loader from SelectFieldConfig
    // ... render your own <select> using field.options() / field.optionLabel / field.optionValue
    return null;
  },
  // textarea, number, currency, date, checkbox, multiselect,
  // autocomplete, 'multi-autocomplete', file, array — all required
} as FormFieldSlots;

// 2. Stepper shell — receives the children (the rendered fields or step component).
const StepperShell: StepperWrapper = ({
  children,
  onSubmit,
  onCancel,
  isSubmitting,
}) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
    {children}
    <button type="submit" disabled={isSubmitting}>Submit</button>
    {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
  </form>
);

// 3. Declare fields. `defineFields` is an identity helper that preserves the const tuple type.
const fields = defineFields([
  new TextField({
    key: 'email',
    label: 'Email',
    required: true,
    validation: (s) => s.email(),
  }),
  new TextField({
    key: 'password',
    label: 'Password',
    required: true,
    validation: (s) => s.min(8),
  }),
  new SelectField({
    key: 'role',
    label: 'Role',
    required: true,
    options: async () => [
      { id: 'admin', name: 'Admin' },
      { id: 'user',  name: 'User'  },
    ],
  }),
]);

const steps = defineSteps([{ id: 'main', label: 'Account', fields }]);

// 4. Mount.
export function SignupForm() {
  return (
    <FormFieldProvider slots={slots} StepperWrapper={StepperShell}>
      <FormEngine
        steps={steps}
        defaultValues={{ role: 'user' }}
        onSubmit={async (values) => {
          await api.createUser(values);
        }}
      />
    </FormFieldProvider>
  );
}
```

## Validation

Each field config takes a `validation: (schema) => schema` callback. The callback receives the field's narrow base Zod schema (e.g. `z.ZodString` for `TextField`, `z.ZodNumber` for `NumberField`) and returns a refined schema:

```ts
new TextField({ key: 'email', label: 'Email', required: true,
  validation: (s) => s.email() });

new NumberField({ key: 'age', label: 'Age', required: true,
  validation: (s) => s.min(18).max(120) });
```

For cross-field rules, use `refine`:

```ts
new TextField({
  key: 'confirmPassword',
  label: 'Confirm password',
  required: true,
  refine: (value, formValues) =>
    value !== formValues.password ? 'Passwords must match' : undefined,
});
```

Optional fields are produced by leaving `required` falsy — schemas are wrapped in `.optional()` automatically.

## Visibility & disabled state

Both accept either a static value or a `(formValues) => boolean` predicate:

```ts
new TextField({
  key: 'companyName',
  label: 'Company',
  visibleWhen: (v) => v.accountType === 'business',
  disabled: (v) => v.locked === true,
});
```

`FieldRenderer` short-circuits to `null` when `isVisible` is false; otherwise it forwards `disabled` down to the slot component.

## Multi-step forms

```tsx
const steps = defineSteps([
  { id: 'profile', label: 'Profile', fields: profileFields },
  { id: 'billing', label: 'Billing', fields: billingFields, icon: 'card' },
  { id: 'review',  label: 'Review',  component: ReviewStep },
]);
```

Each step is either field-based (`fields`) or component-based (`component`). The `StepperWrapper` you pass to `FormFieldProvider` is the stepper UI — `FormEngine` feeds it `currentStep`, `steps` (with computed `description` + completion percentages), `onStepChange`, `onSubmit`, etc. (see `StepperProps`).

A component step receives `{ form, getData? }` so it can read/write `react-hook-form` state directly.

## Field classes

| Class | Base schema | Output type |
|---|---|---|
| `TextField` | `z.ZodString` | `string` |
| `TextareaField` | `z.ZodString` | `string` |
| `NumberField` | `z.ZodNumber` | `number` |
| `CurrencyField` | `z.ZodNumber` | `number` |
| `DateField` | `z.ZodString` | `string` (ISO) |
| `CheckboxField` | `z.ZodBoolean` | `boolean` |
| `SelectField<TOption>` | enum-like | `string \| number` |
| `MultiselectField<TOption>` | array | `(string \| number)[]` |
| `AutocompleteField<TOption>` | enum-like | `string \| number` |
| `MultiAutocompleteField<TOption>` | array | `(string \| number)[]` |
| `FileField` | `z.ZodType<File>` | `File` |
| `ArrayField` | object array | `Record<string, any>[]` |

Each class accepts a config matching the corresponding `*FieldConfig` interface. Option-based fields take an async `options: () => Promise<TOption[]>` loader plus optional `optionLabel` / `optionValue` keys (defaults `'name'` / `'id'`). `ArrayField` takes `itemFields: Field[]` to render per-row.

## Public API

### Components
- `FormEngine` — top-level form renderer (steps + stepper)
- `FieldRenderer` — single-field dispatcher (handles visibility + disabled, then delegates to the field's `Renderer`)

### Providers
- `FormFieldProvider` — supplies `slots` and `StepperWrapper` to `FormEngine` via context

### Hooks
- `useFormEngine` — headless alternative if you want to drive layout yourself (returns `{ form, handleSubmit, fields, getFieldState, reset }`)

### Field classes
`BaseField`, `TextField`, `TextareaField`, `NumberField`, `CurrencyField`, `DateField`, `CheckboxField`, `SelectField`, `MultiselectField`, `AutocompleteField`, `MultiAutocompleteField`, `FileField`, `ArrayField`.

### Types
- `Field` — alias for any field instance (`BaseField<any, any, any>`)
- `FieldBaseConfig`, `OptionConfig`, `RefineFn`, `BuildFieldSchemaOptions`
- `TextFieldConfig`, `TextareaFieldConfig`, `NumberFieldConfig`, `CurrencyFieldConfig`, `DateFieldConfig`, `CheckboxFieldConfig`, `SelectFieldConfig`, `MultiselectFieldConfig`, `AutocompleteFieldConfig`, `MultiAutocompleteFieldConfig`, `FileFieldConfig`, `ArrayFieldConfig`
- `FormFieldRenderProps<F>` — props passed to slot components
- `FormFieldSlots` — slot map type
- `FormStep`, `StepComponentProps`
- `StepperProps`, `StepperStep`, `StepperWrapper`

### Utilities
- `defineFields`, `defineSteps` — identity helpers that preserve const tuple inference
- `mapRawOptions(raw, config)` — normalize a raw option array into `{ label, value }` pairs using `optionLabel` / `optionValue`
- `coerceQueryParams(params, fields)` — coerce a `URLSearchParams` into a typed values object using each field's schema (skips `FileField` / `ArrayField`)

## Design principles

- **Headless.** No CSS, no layout opinions. You own every visual.
- **Classes as the source of truth.** A field instance carries its key, label, schema builder, coercion rule, and renderer — schema, defaults, query coercion, and rendering all derive from it.
- **Slots for rendering.** `FormFieldProvider` is the only seam between the engine and your inputs.
- **Typed end-to-end.** `OutputOf<F>` flows the field's output type into `value`/`onChange` on each slot.

## Development

```sh
pnpm install
pnpm build       # tsup → dist/
pnpm typecheck
```

## License

UNLICENSED — internal ZiCenter package.
