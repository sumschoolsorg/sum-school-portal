import fs from 'fs';

const report = JSON.parse(fs.readFileSync('eslint-report.json', 'utf8'));

report.forEach(file => {
  const errors = file.messages.filter(m => m.severity === 2);
  if (errors.length > 0) {
    const rel = file.filePath.split(/[\/\\]src[\/\\]/)[1] || file.filePath;
    console.log(`\n=== src/${rel} (${errors.length} errors) ===`);
    errors.forEach(e => {
      console.log(`  Line ${e.line}:${e.column} [${e.ruleId}] ${e.message.split('\n')[0]}`);
    });
  }
});
