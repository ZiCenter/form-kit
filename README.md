# @zicenter/form-kit

Headless, `FieldDef`-driven form primitives for React. Declare your fields once — `form-kit` auto-builds a Zod schema, wires it to `react-hook-form`, and renders through slots you provide.

Designed to be fully visual-free: it ships **zero** styles, layout, or components with opinions about how inputs look. You supply the field renderers; `form-kit` handles schema generation, validation, defaults, coercion, and step orchestration.

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

## Quick start

```tsx
import { FormEngine, defineFields, type FieldDef } from '@zicenter/form-kit';

const fields: FieldDef[] = defineFields([
  { name: 'email',    label: 'Email',    type: 'text',   required: true, validators: ['email'] },
  { name: 'password', label: 'Password', type: 'password', required: true, min: 8 },
  { name: 'role',     label: 'Role',     type: 'select', options: [
    { value: 'admin', label: 'Admin' },
    { value: 'user',  label: 'User'  },
  ]},
]);

export function SignupForm() {
  return (
    <FormEngine
      fields={fields}
      defaultValues={{ role: 'user' }}
      onSubmit={async (values) => {
        await api.createUser(values);
      }}
    />
  );
}
```

`FormEngine` reads `fields`, builds a Zod schema under the hood, instantiates `react-hook-form` with the resolver, and renders each field through the `FormFieldProvider` slot you've configured (or the default `FieldRenderer`).

## Multi-step forms

```tsx
import { defineSteps, type FormStep } from '@zicenter/form-kit';

const steps: FormStep[] = defineSteps([
  { id: 'profile', title: 'Profile',  fields: profileFields },
  { id: 'billing', title: 'Billing',  fields: billingFields },
  { id: 'review',  title: 'Review',   component: ReviewStep },
]);
```

Pass to a stepper that implements the `StepperProps`.

## Public API

### Components
- `FormEngine` — top-level form renderer
- `FieldRenderer` — single-field renderer (used inside `FormEngine`, exported so you can reuse it)

### Providers
- `FormFieldProvider` — slot container for injecting your own field renderers

### Hooks
- `useFormEngine` — low-level hook if you want to drive your own layout

### Types
- `FieldDef`, `FieldGroupDef`, `DetailFieldDef`, `FormDef`
- `FormStep`, `StepComponentProps`, `StepperProps`, `StepperStep`
- `FormFieldRenderProps`, `FormFieldSlots`
- `InferFormValues<T>` — derives the value type from a `FieldDef[]`

### Utilities
- `defineFields`, `defineSteps` — identity helpers for inference
- `mapRawOptions` — normalize raw API options into `{ value, label }` pairs
- `coerceQueryParams` — coerce query-string params to their declared field types

## Design principles

- **Headless.** No Tailwind, no CSS, no layout opinions. You own the visuals.
- **Schema from data.** `FieldDef[]` is the single source of truth — schema, defaults, and coercion all derive from it.
- **Slots for rendering.** `FormFieldProvider` lets you inject your own inputs without touching form-kit internals.
- **Typed end-to-end.** `InferFormValues` gives you exact value types from your field definitions.

## Development

```sh
pnpm install
pnpm build       # tsup → dist/
pnpm typecheck
```

## License

UNLICENSED — internal ZiCenter package.
