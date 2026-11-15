# Codex Auth Helper

A security-first, multilingual helper for managing Codex authentication configuration.

**Status: Research and architecture phase.** Authentication is not implemented yet. The project will not fabricate OAuth tokens, reinterpret browser session cookies as refresh tokens, or claim compatibility until the supported authentication flow and credential format have been verified.

## Goals

- Persian (فارسی), English, and Simplified Chinese (简体中文) interface.
- Explicit language selection, with browser-language detection as the initial default.
- Authentication logic isolated from UI and localization.
- Least-privilege browser permissions and no third-party credential relay.
- Safe handling of access-token expiry, refresh-token rotation, logout, and interrupted writes.
- Automated tests for authentication lifecycle and localization.

## Security principles

- Never treat a ChatGPT browser session token as an OAuth refresh token.
- Never generate unsigned or synthetic JWTs as authentication credentials.
- Never log, export to analytics, or transmit credentials to project-owned servers.
- Do not ship an OAuth client secret in a browser extension.
- Do not implement an undocumented or unsupported authentication endpoint.

## Current status

See [Authentication research](docs/AUTHENTICATION.md), [Security policy](docs/SECURITY.md), and [Architecture](docs/ARCHITECTURE.md).

No usable extension build is published yet. A working login flow depends on confirming an officially supported OAuth client and the exact Codex credential contract.
