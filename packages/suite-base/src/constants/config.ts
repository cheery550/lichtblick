// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

/**
 * Application configuration constants.
 * Centralizes all environment variables and build-time constants.
 *
 * For deployment: API base URL can be set at runtime (e.g. via Docker env API_URL)
 * so the same image works across environments. Runtime value is read from
 * globalThis.LICHTBLICK_SUITE_DEFAULT_API_URL when present.
 */

// Global variables defined by webpack DefinePlugin
declare const API_URL: string | undefined;
declare const LICHTBLICK_SUITE_VERSION: string | undefined;
declare const DEV_WORKSPACE: string | undefined;

// Prefer runtime config (e.g. Docker env) over build-time so one image works in all environments
const g = globalThis as typeof globalThis & { LICHTBLICK_SUITE_DEFAULT_API_URL?: string };
const apiUrl =
  typeof globalThis !== "undefined" && g.LICHTBLICK_SUITE_DEFAULT_API_URL !== undefined
    ? g.LICHTBLICK_SUITE_DEFAULT_API_URL
    : API_URL;

export const APP_CONFIG = {
  /**
   * API base URL for HTTP requests (build-time or runtime when injected, e.g. by entrypoint).
   */
  apiUrl,

  /**
   * Application version
   */
  version: LICHTBLICK_SUITE_VERSION ?? "unknown",

  /**
   * Development workspace prefix (for local storage keys)
   */
  devWorkspace: DEV_WORKSPACE ?? "",
} as const;
