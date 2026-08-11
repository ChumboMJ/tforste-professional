const fs = require('fs');
const path = require('path');

function findLatestXml(dir) {
  if (!fs.existsSync(dir)) return null;
  let latestFile = null;
  let latestMtime = 0;

  function walk(currentDir) {
    for (const f of fs.readdirSync(currentDir)) {
      const full = path.join(currentDir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (f === 'coverage.cobertura.xml') {
        if (stat.mtimeMs > latestMtime) {
          latestMtime = stat.mtimeMs;
          latestFile = full;
        }
      }
    }
  }

  walk(dir);
  return latestFile;
}

const file = findLatestXml('PortfolioApi.Tests/TestResults');
if (!file) {
  console.error('❌ Error: Coverage XML report file not found in PortfolioApi.Tests/TestResults');
  process.exit(1);
}

console.log(`🔍 Inspecting coverage report: ${file}`);
const content = fs.readFileSync(file, 'utf8');

// Match line-rate attribute for package name="PortfolioApi"
const match = content.match(/<package name="PortfolioApi" line-rate="([^"]+)"/);
if (!match) {
  console.error('❌ Error: Could not parse PortfolioApi package line-rate in Cobertura XML report');
  process.exit(1);
}

const lineRate = parseFloat(match[1]) * 100;
const formattedRate = lineRate.toFixed(2);
const threshold = 70.0;

console.log(`--------------------------------------------------`);
console.log(`📊 Current Backend Line Coverage: ${formattedRate}%`);
console.log(`🎯 Required Minimum Threshold:     ${threshold.toFixed(2)}%`);
console.log(`--------------------------------------------------`);

if (lineRate < threshold) {
  console.error(`❌ POLICY FAILURE: Backend line coverage (${formattedRate}%) is below the required ${threshold}% threshold to merge into main!`);
  process.exit(1);
} else {
  console.log(`✅ POLICY SUCCESS: Backend line coverage requirement met (${formattedRate}% >= ${threshold}%)!`);
}
