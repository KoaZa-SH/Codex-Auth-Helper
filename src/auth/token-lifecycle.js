/**
 * Decide whether an OAuth refresh request is allowed.
 *
 * This module does not perform network requests, infer token expiry from an
 * unverified JWT, or manufacture credentials. Callers must provide the
 * provider-validated access-token expiry as a Unix timestamp in milliseconds.
 */

export const TokenAction = Object.freeze({
  AUTHENTICATE: "authenticate",
  USE_ACCESS_TOKEN: "use_access_token",
  REFRESH: "refresh",
  REAUTHENTICATE: "reauthenticate",
  EXPIRY_UNKNOWN: "expiry_unknown",
});

/**
 * @param {object} input
 * @param {string|null|undefined} input.accessToken
 * @param {string|null|undefined} input.refreshToken
 * @param {number|null|undefined} input.accessTokenExpiresAtMs
 * @param {number} [input.nowMs]
 * @param {number} [input.clockSkewMs]
 * @returns {{ action: string, reason: string }}
 */
export function decideTokenAction({
  accessToken,
  refreshToken,
  accessTokenExpiresAtMs,
  nowMs = Date.now(),
  clockSkewMs = 60_000,
} = {}) {
  const hasAccessToken =
    typeof accessToken === "string" && accessToken.trim().length > 0;
  const hasRefreshToken =
    typeof refreshToken === "string" && refreshToken.trim().length > 0;

  if (!hasAccessToken && !hasRefreshToken) {
    return {
      action: TokenAction.AUTHENTICATE,
      reason: "no_access_or_refresh_token",
    };
  }

  const hasKnownExpiry =
    typeof accessTokenExpiresAtMs === "number" &&
    Number.isFinite(accessTokenExpiresAtMs);

  if (hasAccessToken && !hasKnownExpiry) {
    return {
      action: TokenAction.EXPIRY_UNKNOWN,
      reason: "access_token_expiry_not_verified",
    };
  }

  if (
    hasAccessToken &&
    accessTokenExpiresAtMs > nowMs + Math.max(0, clockSkewMs)
  ) {
    return {
      action: TokenAction.USE_ACCESS_TOKEN,
      reason: "access_token_not_near_expiry",
    };
  }

  if (hasRefreshToken) {
    return {
      action: TokenAction.REFRESH,
      reason: "access_token_expired_or_near_expiry",
    };
  }

  if (hasAccessToken) {
    return {
      action: TokenAction.REAUTHENTICATE,
      reason: "refresh_token_unavailable_and_access_token_expired",
    };
  }

  return {
    action: TokenAction.AUTHENTICATE,
    reason: "no_usable_credentials",
  };
}

/**
 * A refresh request must never be sent with an empty or whitespace-only token.
 * The returned object deliberately excludes the token value.
 */
export function canAttemptRefresh(refreshToken) {
  return typeof refreshToken === "string" && refreshToken.trim().length > 0;
}
