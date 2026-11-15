# Token Lifecycle and Missing Refresh Token

**Status: Implemented as a local decision guard; provider OAuth integration remains unimplemented.**

## Required behavior

A refresh request must never be sent unless the refresh token is a non-empty string after trimming whitespace. In particular, an empty string must not be serialized as `"refresh_token": ""`.

The lifecycle decision is implemented in `src/auth/token-lifecycle.js`:

| Condition | Decision |
|---|---|
| No access token and no refresh token | Start authentication |
| Access token has a provider-validated expiry safely in the future | Use the existing access token; do not refresh |
| Access token expiry is unknown | Do not guess expiry or decode an unverified JWT; require the caller to resolve validity through a supported mechanism |
| Access token is expired/near expiry and refresh token is non-empty | Refresh may be attempted |
| Access token is expired/near expiry and refresh token is missing/empty | Require authentication again; do not call the token endpoint |

The default clock-skew safety window is 60 seconds. The caller may override it for a verified provider-specific policy.

## Important limitations

- This guard does not create, recover, or rotate refresh tokens.
- It does not make a session token interchangeable with an OAuth refresh token.
- It does not establish that a browser session or access token is accepted by Codex Work.
- The caller must supply `accessTokenExpiresAtMs` from a trusted, provider-validated source. Do not infer expiry from an unverified JWT payload.
- If a provider returns a replacement refresh token, the integration must persist it securely and atomically. That provider-specific persistence is not implemented here.

## User-facing states

Use localized messages to distinguish:
- Access token still usable; refresh is not needed.
- Refresh unavailable; the current access token may work only until its expiry.
- Access token expired and reauthentication is required.

Never label the session as "refreshed" when no refresh request succeeded.
Never silently retry with an empty token.
Never log token values or include them in diagnostic output.

## Tests

Run `npm test` with Node.js 20 or later. Tests cover empty and whitespace-only refresh tokens, valid refresh availability, access-token expiry, unknown expiry, and missing credentials.
