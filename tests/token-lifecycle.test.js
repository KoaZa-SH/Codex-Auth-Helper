import test from "node:test";
import assert from "node:assert/strict";
import {
  canAttemptRefresh,
  decideTokenAction,
  TokenAction,
} from "../src/auth/token-lifecycle.js";

const now = 1_800_000_000_000;

test("uses an unexpired access token without refreshing", () => {
  assert.deepEqual(
    decideTokenAction({
      accessToken: "access",
      refreshToken: "",
      accessTokenExpiresAtMs: now + 300_000,
      nowMs: now,
    }),
    {
      action: TokenAction.USE_ACCESS_TOKEN,
      reason: "access_token_not_near_expiry",
    },
  );
});

test("does not attempt refresh when refresh token is empty", () => {
  assert.equal(canAttemptRefresh(""), false);
  assert.equal(canAttemptRefresh("   "), false);
});

test("requires reauthentication after access-token expiry when refresh is absent", () => {
  assert.deepEqual(
    decideTokenAction({
      accessToken: "access",
      refreshToken: "",
      accessTokenExpiresAtMs: now - 1,
      nowMs: now,
      clockSkewMs: 0,
    }),
    {
      action: TokenAction.REAUTHENTICATE,
      reason: "refresh_token_unavailable_and_access_token_expired",
    },
  );
});

test("allows refresh only when a non-empty refresh token exists", () => {
  assert.equal(canAttemptRefresh("refresh"), true);
  assert.equal(
    decideTokenAction({
      accessToken: "access",
      refreshToken: "refresh",
      accessTokenExpiresAtMs: now - 1,
      nowMs: now,
      clockSkewMs: 0,
    }).action,
    TokenAction.REFRESH,
  );
});

test("does not guess expiry from an access token", () => {
  assert.equal(
    decideTokenAction({
      accessToken: "access",
      refreshToken: "",
      nowMs: now,
    }).action,
    TokenAction.EXPIRY_UNKNOWN,
  );
});

test("requests authentication when no credentials exist", () => {
  assert.equal(
    decideTokenAction({ accessToken: "", refreshToken: "" }).action,
    TokenAction.AUTHENTICATE,
  );
});
