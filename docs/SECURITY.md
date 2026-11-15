# Security Policy

## Credential handling

- Credentials must remain local to the user's device.
- No telemetry, analytics, crash reports, or logs may contain access tokens, refresh tokens, authorization codes, cookies, or full credential payloads.
- Do not use `localStorage` for long-lived credentials.
- Prefer the operating system's secure credential store where the platform supports it. If browser-extension storage is unavoidable, document its threat model and limitations.
- Never send credentials to a project-operated backend.
- Never include secrets in screenshots, test fixtures, issue reports, or commits.

## Browser extension permissions

Request only permissions required by the verified authentication flow. Host permissions must be narrowly scoped and justified. Do not request broad access to all websites.

## Token lifecycle

- Validate token responses before persistence.
- Account for expiry and clock skew.
- Handle refresh-token rotation atomically.
- Preserve a newly rotated token even if a later UI operation is cancelled.
- Do not retry indefinitely after invalid_grant or other terminal authorization failures.
- Redact credentials from all diagnostics.

## Reporting vulnerabilities

Do not publish live credentials or exploit details in public issues. Until a private security contact is configured, report only non-sensitive reproduction details to the repository owner.
