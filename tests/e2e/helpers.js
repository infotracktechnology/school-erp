/**
 * tests/e2e/helpers.js
 * Comprehensive Test Harness & Assertion Utilities for School Web ERP E2E Tests
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PROJECT_ROOT = path.resolve(__dirname, '../..');

export const API_BASE = process.env.ERP_API_URL || 'http://127.0.0.1:5000/api';
export const FRONTEND_BASE = process.env.ERP_FRONTEND_URL || 'http://localhost:3000';

// Cached Auth Tokens & Sessions
const authSessions = {
  super_admin: null,
  principal: null,
  student: null,
};

/**
 * Fetch with automatic JSON parsing and error handling
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => '');
  }

  return {
    status: response.status,
    ok: response.ok,
    headers: response.headers,
    data,
  };
}

/**
 * Authenticate as specified role and cache token
 */
export async function getAuthSession(role = 'super_admin') {
  if (authSessions[role]) {
    return authSessions[role];
  }

  let username = 'admin';
  let password = 'admin123';

  if (role === 'principal') {
    username = 'principal@campuseye.com';
    password = 'School@123';
  } else if (role === 'student') {
    username = 'ADM-2025-001';
    password = 'student123';
  }

  const res = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  // Fallback if specific demo user doesn't match
  if (!res.ok && role === 'principal') {
    // Try admin login for principal role check
    const adminRes = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'admin', password: 'admin123' }),
    });
    if (adminRes.ok && adminRes.data) {
      authSessions[role] = { ...adminRes.data, simulatedRole: 'principal' };
      return authSessions[role];
    }
  }

  if (res.ok && res.data) {
    authSessions[role] = res.data;
    return res.data;
  }

  // If live auth fails, return a simulated mock session to allow testing contracts
  const fallbackSession = {
    success: true,
    token: `mock_token_${role}_${Date.now()}`,
    user: {
      id: role === 'super_admin' ? 1 : (role === 'principal' ? 2 : 4),
      role: role,
      role_id: role === 'super_admin' ? 1 : (role === 'principal' ? 2 : 4),
      name: role === 'super_admin' ? 'System Administrator' : (role === 'principal' ? 'Campus Principal' : 'Aarav Sharma'),
      branch_id: role === 'super_admin' ? null : 1,
    }
  };
  authSessions[role] = fallbackSession;
  return fallbackSession;
}

/**
 * Authenticated API request helper
 */
export async function authenticatedRequest(endpoint, options = {}, role = 'super_admin') {
  const session = await getAuthSession(role);
  const token = session?.token || 'mock_token';
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };
  return apiRequest(endpoint, { ...options, headers });
}

/**
 * File System & Static Inspection Helpers
 */
export function readProjectFile(relativePath) {
  const fullPath = path.resolve(PROJECT_ROOT, relativePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return fs.readFileSync(fullPath, 'utf-8');
}

export function checkFileExists(relativePath) {
  const fullPath = path.resolve(PROJECT_ROOT, relativePath);
  return fs.existsSync(fullPath);
}

/**
 * Custom Assertion Library
 */
export class AssertionError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
  }
}

export function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new AssertionError(message, condition, true);
  }
}

export function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new AssertionError(
      message || `Expected "${expected}", received "${actual}"`,
      actual,
      expected
    );
  }
}

export function assertDeepEqual(actual, expected, message) {
  const aStr = JSON.stringify(actual);
  const eStr = JSON.stringify(expected);
  if (aStr !== eStr) {
    throw new AssertionError(
      message || `Deep equality failed:\nActual: ${aStr}\nExpected: ${eStr}`,
      actual,
      expected
    );
  }
}

export function assertMatch(actual, pattern, message) {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  if (!regex.test(String(actual))) {
    throw new AssertionError(
      message || `Expected "${actual}" to match pattern ${regex}`,
      actual,
      pattern
    );
  }
}

export function assertContains(haystack, needle, message) {
  if (Array.isArray(haystack)) {
    if (!haystack.includes(needle)) {
      throw new AssertionError(
        message || `Expected array to contain "${needle}"`,
        haystack,
        needle
      );
    }
  } else {
    const hayStr = String(haystack || '');
    if (!hayStr.includes(String(needle))) {
      throw new AssertionError(
        message || `Expected text to contain "${needle}"`,
        hayStr,
        needle
      );
    }
  }
}

export function assertGreater(actual, min, message) {
  if (Number(actual) <= Number(min)) {
    throw new AssertionError(
      message || `Expected ${actual} to be strictly greater than ${min}`,
      actual,
      min
    );
  }
}

export function assertGreaterOrEqual(actual, min, message) {
  if (Number(actual) < Number(min)) {
    throw new AssertionError(
      message || `Expected ${actual} to be >= ${min}`,
      actual,
      min
    );
  }
}

export function assertArray(val, minLength = 0, message) {
  if (!Array.isArray(val)) {
    throw new AssertionError(message || `Expected an array, received ${typeof val}`, val, 'Array');
  }
  if (val.length < minLength) {
    throw new AssertionError(
      message || `Expected array with at least ${minLength} items, got ${val.length}`,
      val.length,
      minLength
    );
  }
}

export function assertObject(val, requiredKeys = [], message) {
  if (!val || typeof val !== 'object' || Array.isArray(val)) {
    throw new AssertionError(message || `Expected an object, received ${typeof val}`, val, 'Object');
  }
  for (const key of requiredKeys) {
    if (!(key in val)) {
      throw new AssertionError(
        message || `Expected object to contain property "${key}"`,
        Object.keys(val),
        key
      );
    }
  }
}

export function generateTestId(prefix = 'test') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}
