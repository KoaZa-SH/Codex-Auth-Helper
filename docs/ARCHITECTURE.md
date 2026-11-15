# Architecture

## Planned modules

```text
extension/
  manifest.json
  background/
  auth/
  popup/
  settings/
  services/
locales/
  en.json
  fa.json
  zh-CN.json
tests/
docs/
```

## Separation of concerns

- `auth/`: protocol adapter, token lifecycle, validation, and credential-store interface. No UI dependencies.
- `background/`: extension lifecycle and message routing. No token values in logs or messages unless strictly required by an internal typed operation.
- `popup/` and `settings/`: presentation only; all user-visible strings come from locale resources.
- `locales/`: translation dictionaries with matching keys.
- `tests/`: unit tests for state transitions, storage, localization, and protocol behavior.

## Localization

Supported locales:

| Locale | Language | Direction |
|---|---|---|
| `en` | English | LTR |
| `fa` | فارسی | RTL |
| `zh-CN` | 简体中文 | LTR |

The user can select a language explicitly. On first launch, the extension may detect the browser locale and fall back to English. The selected language must persist independently of authentication state.

## Authentication boundary

No protocol implementation is permitted until the requirements in [AUTHENTICATION.md](AUTHENTICATION.md) are satisfied.
