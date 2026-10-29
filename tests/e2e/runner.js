#!/usr/bin/env node
/**
 * tests/e2e/runner.js
 * Standalone Node.js E2E Test Runner for School Web ERP
 * Executes Tiers 1-4 Test Suites, prints clear pass/fail status, and exits with code 0 on success.
 */

import { performance } from 'perf_hooks';

// Color codes for beautiful terminal reporting
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

// Parse command line arguments
const args = process.argv.slice(2);
const tierArg = args.find((a) => a.startsWith('--tier='));
const filterArg = args.find((a) => a.startsWith('--filter='));
const bailArg = args.includes('--bail');
const quietArg = args.includes('--quiet');

const targetTier = tierArg ? tierArg.split('=')[1] : null;
const filterQuery = filterArg ? filterArg.split('=')[1].toLowerCase() : null;

// Test Suite Definitions
const tiers = [
  {
    tierNumber: 1,
    tierName: 'Tier 1: Feature Coverage (PROJECT.md Features 1-45)',
    files: [
      { name: 'M1 Primitives (F01-F19)', path: './tier1-feature-coverage/m1-primitives.test.js' },
      { name: 'M2 Shell & Nav (F20-F27)', path: './tier1-feature-coverage/m2-shell-nav.test.js' },
      { name: 'M3 SIS & Attendance (F28-F35)', path: './tier1-feature-coverage/m3-sis-attendance.test.js' },
      { name: 'M4 Operations & Academic (F36-F45)', path: './tier1-feature-coverage/m4-ops-academic.test.js' },
    ],
  },
  {
    tierNumber: 2,
    tierName: 'Tier 2: Boundary & Corner Cases (Limits, Edge Cases, Invalid Inputs)',
    files: [
      { name: 'M1 Primitives Boundary (F01-F19)', path: './tier2-boundary-corners/m1-primitives-boundary.test.js' },
      { name: 'M2 Shell & Nav Boundary (F20-F27)', path: './tier2-boundary-corners/m2-shell-nav-boundary.test.js' },
      { name: 'M3 SIS & Attendance Boundary (F28-F35)', path: './tier2-boundary-corners/m3-sis-attendance-boundary.test.js' },
      { name: 'M4 Operations & Academic Boundary (F36-F45)', path: './tier2-boundary-corners/m4-ops-academic-boundary.test.js' },
    ],
  },
  {
    tierNumber: 3,
    tierName: 'Tier 3: Cross-Feature Combinations (Pairwise Domain Interactions)',
    files: [
      { name: 'Pairwise Cross-Feature Suites', path: './tier3-cross-feature/cross-feature.test.js' },
    ],
  },
  {
    tierNumber: 4,
    tierName: 'Tier 4: Real-World Application Scenarios (Multi-Step Operational Workflows)',
    files: [
      { name: 'Real-World Operations Scenarios', path: './tier4-application-scenarios/real-world-scenarios.test.js' },
    ],
  },
];

async function runTest(testCase) {
  const start = performance.now();
  try {
    await testCase.run();
    const duration = (performance.now() - start).toFixed(1);
    return {
      passed: true,
      name: testCase.name,
      feature: testCase.feature || '',
      featureName: testCase.featureName || '',
      duration,
      error: null,
    };
  } catch (err) {
    const duration = (performance.now() - start).toFixed(1);
    return {
      passed: false,
      name: testCase.name,
      feature: testCase.feature || '',
      featureName: testCase.featureName || '',
      duration,
      error: err,
    };
  }
}

async function main() {
  console.log(`\n${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}   School Web ERP - Requirement-Driven E2E Test Suite  ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.dim}Date: ${new Date().toISOString()}${colors.reset}`);
  if (targetTier) console.log(`${colors.yellow}Filter: Target Tier = ${targetTier}${colors.reset}`);
  if (filterQuery) console.log(`${colors.yellow}Filter: Query = "${filterQuery}"${colors.reset}`);
  console.log();

  const totalStart = performance.now();
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  const failureList = [];

  for (const tier of tiers) {
    if (targetTier && String(tier.tierNumber) !== String(targetTier)) {
      continue;
    }

    console.log(`${colors.bold}${colors.magenta}▶ [TIER ${tier.tierNumber}] ${tier.tierName}${colors.reset}`);
    let tierTests = 0;
    let tierPassed = 0;
    let tierFailed = 0;

    for (const fileConfig of tier.files) {
      let suiteModule;
      try {
        suiteModule = await import(fileConfig.path);
      } catch (importErr) {
        console.error(`${colors.red}  ✖ Failed to load suite ${fileConfig.name}: ${importErr.message}${colors.reset}`);
        totalFailed++;
        failureList.push({ name: `Load ${fileConfig.name}`, error: importErr });
        continue;
      }

      const allSuiteTests = suiteModule.tests || [];
      const filteredTests = filterQuery
        ? allSuiteTests.filter(
            (t) =>
              t.name.toLowerCase().includes(filterQuery) ||
              (t.feature && t.feature.toLowerCase().includes(filterQuery)) ||
              (t.featureName && t.featureName.toLowerCase().includes(filterQuery))
          )
        : allSuiteTests;

      if (filteredTests.length === 0) continue;

      if (!quietArg) {
        console.log(`  ${colors.bold}${colors.white}${fileConfig.name}${colors.reset} (${filteredTests.length} tests)`);
      }

      for (const testCase of filteredTests) {
        tierTests++;
        totalTests++;

        const result = await runTest(testCase);

        if (result.passed) {
          tierPassed++;
          totalPassed++;
          if (!quietArg) {
            console.log(`    ${colors.green}✔ PASS${colors.reset} ${colors.dim}[${result.duration}ms]${colors.reset} ${result.name}`);
          }
        } else {
          tierFailed++;
          totalFailed++;
          console.log(`    ${colors.red}✖ FAIL${colors.reset} ${colors.dim}[${result.duration}ms]${colors.reset} ${result.name}`);
          console.log(`      ${colors.red}${result.error.message || result.error}${colors.reset}`);
          failureList.push(result);

          if (bailArg) {
            console.log(`\n${colors.red}${colors.bold}Bail requested on first failure. Stopping execution.${colors.reset}\n`);
            printSummary(totalTests, totalPassed, totalFailed, totalStart, failureList);
            process.exit(1);
          }
        }
      }
    }

    const tierRate = tierTests > 0 ? ((tierPassed / tierTests) * 100).toFixed(1) : 0;
    const tierStatusColor = tierFailed === 0 ? colors.green : colors.red;
    console.log(
      `  ${colors.dim}└─ Tier ${tier.tierNumber} Result:${colors.reset} ${tierStatusColor}${tierPassed}/${tierTests} Passed (${tierRate}%)${colors.reset}\n`
    );
  }

  printSummary(totalTests, totalPassed, totalFailed, totalStart, failureList);

  if (totalFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

function printSummary(total, passed, failed, startTime, failures) {
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.bold}                   TEST SUMMARY REPORT                ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`Total Test Cases Executed: ${colors.bold}${total}${colors.reset}`);
  console.log(`Tests Passed:              ${colors.green}${colors.bold}${passed}${colors.reset}`);
  console.log(`Tests Failed:              ${failed > 0 ? colors.red : colors.green}${colors.bold}${failed}${colors.reset}`);
  console.log(`Pass Rate:                 ${failed === 0 ? colors.green : colors.yellow}${colors.bold}${passRate}%${colors.reset}`);
  console.log(`Total Duration:            ${colors.dim}${elapsed}s${colors.reset}`);

  if (failures.length > 0) {
    console.log(`\n${colors.red}${colors.bold}Failed Test Cases (${failures.length}):${colors.reset}`);
    failures.forEach((f, idx) => {
      console.log(`  ${idx + 1}. ${f.name}`);
      console.log(`     ${colors.dim}${f.error?.message || f.error}${colors.reset}`);
    });
  }

  console.log();
  if (failed === 0 && total > 0) {
    console.log(`${colors.bgGreen}${colors.white}${colors.bold}  SUCCESS: ALL TEST TIERS PASSED (100%)  ${colors.reset}\n`);
  } else if (total === 0) {
    console.log(`${colors.yellow}No test cases matched the specified criteria.${colors.reset}\n`);
  } else {
    console.log(`${colors.bgRed}${colors.white}${colors.bold}  FAILURE: ${failed} TEST CASE(S) FAILED  ${colors.reset}\n`);
  }
}

main().catch((fatalErr) => {
  console.error(`\n${colors.red}Fatal Runner Error: ${fatalErr.stack || fatalErr}${colors.reset}\n`);
  process.exit(1);
});
