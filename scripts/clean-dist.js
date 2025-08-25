const fs = require('fs');
const path = require('path');

const distPath = path.resolve('dist');

fs.readdirSync(distPath).forEach((file) => {
  if (file !== 'logs') {
    const fullPath = path.join(distPath, file);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
});

console.info('Cleaned dist folder (except logs)');
