import fs from 'fs';

const report = JSON.parse(fs.readFileSync('eslint-report.json', 'utf8'));

let totalErrors = 0;
let totalWarnings = 0;
const ruleCounts = {};
const fileProblems = [];

report.forEach(file => {
  if (file.errorCount > 0 || file.warningCount > 0) {
    totalErrors += file.errorCount;
    totalWarnings += file.warningCount;
    fileProblems.push({
      filePath: file.filePath.split(/[\/\\]/).slice(-2).join('/'),
      errors: file.errorCount,
      warnings: file.warningCount,
    });
    file.messages.forEach(m => {
      const rule = m.ruleId || 'unknown';
      if (!ruleCounts[rule]) ruleCounts[rule] = { errors: 0, warnings: 0 };
      if (m.severity === 2) ruleCounts[rule].errors++;
      else ruleCounts[rule].warnings++;
    });
  }
});

console.log('Total Errors:', totalErrors);
console.log('Total Warnings:', totalWarnings);
console.log('\n--- Rule Breakdown ---');
Object.entries(ruleCounts)
  .sort((a, b) => (b[1].errors + b[1].warnings) - (a[1].errors + a[1].warnings))
  .forEach(([r, c]) => {
    console.log(`  ${r}: ${c.errors} errors, ${c.warnings} warnings`);
  });

console.log('\n--- Top 15 Files with Violations ---');
fileProblems
  .sort((a, b) => (b.errors + b.warnings) - (a.errors + a.warnings))
  .slice(0, 15)
  .forEach(f => {
    console.log(`  ${f.filePath}: ${f.errors} errors, ${f.warnings} warnings`);
  });
