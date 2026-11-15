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
src/
  auth/
    token-lifecycle.js
locales/
  en.json
  fa.json
  zh-CN.json
tests/
docs/
```

## Separation of concerns

- `src/auth/token-lifecycle.js`: implemented, pure decision logic for whether authentication, access-token use, refresh, or reauthentication is appropriate. It does not perform network requests or store credentials.
- Future `auth/` provider adapter: protocol adapter, token exchange, response validation, and credential-store interface. No UI dependencies.
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

No provider-specific protocol implementation is permitted until the requirements in [AUTHENTICATION.md](AUTHENTICATION.md) are satisfied. The token-lifecycle guard is deliberately provider-agnostic and does not authorize any particular OAuth flow.
