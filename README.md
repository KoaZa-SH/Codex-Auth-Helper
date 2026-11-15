# Codex Auth Helper

A security-first, multilingual helper for managing Codex authentication configuration.

**Status: Research and architecture phase; token-lifecycle guard implemented.** This repository is not yet a usable extension build. The token-lifecycle module returns a reauthentication decision instead of a refresh decision when the refresh token is empty. It is not yet wired to a running OAuth client; OAuth login, provider integration, secure credential storage, and Codex compatibility are not implemented.

## Goals

- Persian (فارسی), English, and Simplified Chinese (简体中文) interface.
- Explicit language selection, with browser-language detection as the initial default.
- Authentication logic isolated from UI and localization.
- Least-privilege browser permissions and no third-party credential relay.
- Safe handling of access-token expiry, refresh-token rotation, logout, and interrupted writes.
- Automated tests for authentication lifecycle and localization.

## Implemented in this revision

- A pure token-lifecycle decision module at `src/auth/token-lifecycle.js`.
- A reusable guard and decision function that identify empty or whitespace-only refresh-token values before a future caller sends a refresh request.
- Explicit states for usable access token, unknown expiry, refresh eligibility, and reauthentication.
- Node.js tests for the empty-refresh-token failure mode.

See [Token lifecycle](docs/TOKEN-LIFECYCLE.md) for the exact behavior.

## Security principles

- Never treat a ChatGPT browser session token as an OAuth refresh token.
- Never generate unsigned or synthetic JWTs as authentication credentials.
- Never log, export to analytics, or transmit credentials to project-owned servers.
- Do not ship an OAuth client secret in a browser extension.
- Do not implement an undocumented or unsupported authentication endpoint.

## Current limitations

The project does not yet implement OAuth login, token exchange, refresh network calls, credential persistence, a browser-extension UI, or a verified integration with Codex Desktop/Work. The module provides the decision logic for preventing a malformed refresh request when integrated by a caller; this repository does not yet contain a running refresh client. It does not manufacture a valid refresh token or guarantee that Work can refresh the session.

## Tests

Requires Node.js 20 or later:

```sh
npm test
```

## Research

See [Authentication research](docs/AUTHENTICATION.md), [Security policy](docs/SECURITY.md), and [Architecture](docs/ARCHITECTURE.md).

A working login flow depends on confirming an officially supported OAuth client and the exact Codex credential contract.
