const fs = require('fs');
const { execSync } = require('child_process');

// Read the current package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Store the original package.json
const originalPackageJson = JSON.stringify(packageJson, null, 2);

try {
  // Set homepage for GitHub Pages
  packageJson.homepage = "https://abdul-mangrio.github.io/mhi-ai-tool";
  
  // Write the modified package.json
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  
  console.log('✅ Homepage set for GitHub Pages deployment');
  
  // Build the project
  console.log('🔨 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Deploy to GitHub Pages
  console.log('🚀 Deploying to GitHub Pages...');
  execSync('gh-pages -d build', { stdio: 'inherit' });
  
  console.log('✅ Deployment completed successfully!');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
} finally {
  // Restore the original package.json
  fs.writeFileSync('package.json', originalPackageJson);
  console.log('✅ Package.json restored for development');
}
