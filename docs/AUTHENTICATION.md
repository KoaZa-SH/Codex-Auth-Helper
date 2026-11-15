# Authentication Research

**Status: Not implemented — protocol verification required.**

## Known facts from the public Codex source

The OpenAI Codex repository contains OAuth authorization-code and PKCE code, token exchange and refresh handling, credential persistence, and an `auth.json` storage model. Its internal implementation demonstrates that refresh is a lifecycle involving a real provider-issued refresh token, expiry handling, token-response validation, and persistence of rotated credentials.

Relevant upstream source (for research; not copied into this project):

- [OAuth authorization request](https://github.com/openai/codex/blob/main/codex-rs/login/src/oauth/authorization.rs)
- [OAuth token client](https://github.com/openai/codex/blob/main/codex-rs/login/src/oauth/client.rs)
- [OAuth session manager](https://github.com/openai/codex/blob/main/codex-rs/login/src/oauth_session.rs)
- [Token response validation](https://github.com/openai/codex/blob/main/codex-rs/login/src/oauth_session_token.rs)
- [Codex auth storage model](https://github.com/openai/codex/blob/main/codex-rs/login/src/auth/storage.rs)

These source files are evidence of Codex's own implementation, **not proof that third-party extensions are authorized to reuse its OAuth client registration, endpoints, or private integration details**.

## Required verification before implementation

1. Identify a documented, supported OAuth flow available to this independent client.
2. Verify the permitted client type, redirect URI rules, scopes, PKCE requirements, token endpoint, and applicable terms.
3. Verify whether the resulting credentials may be exported to or consumed through Codex's `auth.json` format.
4. Verify token refresh semantics, including whether refresh tokens rotate and how omitted replacement tokens are handled.
5. Confirm supported logout/revocation behavior and credential storage requirements.

## Explicitly prohibited shortcuts

- Treating `sessionToken` from `chatgpt.com/api/auth/session` as an OAuth refresh token.
- Creating synthetic JWTs or unsigned ID tokens.
- Scraping private browser state as a substitute for an authorized OAuth grant.
- Guessing undocumented endpoints, client IDs, scopes, or redirect URIs.
- Claiming that a generated `auth.json` is valid without testing it against a supported Codex version.

## Implementation gate

The authentication module remains a non-functional interface until the requirements above are verified. If no supported third-party OAuth flow exists, the project must clearly state that limitation and consider a supported alternative rather than bypassing it.
