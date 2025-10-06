#!/usr/bin/env node

/**
 * Safe script to fix unused variables ONLY in catch blocks
 * This is the safest approach - only replaces unused error variables in catch blocks
 */

const fs = require('fs');
const path = require('path');

// Find all TypeScript files
function findTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findTsFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Fix unused variables ONLY in catch blocks
function fixCatchBlocks(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Find all catch blocks and check if the variable is used
  const catchBlockRegex = /catch\s*\(\s*(\w+)\s*\)\s*\{([^}]*)\}/g;
  let match;
  
  while ((match = catchBlockRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const varName = match[1];
    const catchBody = match[2];
    
    // Skip if variable is used in the catch body
    if (catchBody.includes(varName)) {
      continue;
    }
    
    // Only replace common unused variable names in catch blocks
    if (varName === 'error' || varName === 'e' || varName === 'err') {
      const replacement = fullMatch.replace(varName, '_');
      content = content.replace(fullMatch, replacement);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed catch blocks in: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
console.log('🔧 Fixing unused variables in catch blocks only (safe approach)...\n');

const srcDir = path.join(__dirname, '..', 'src');
const files = findTsFiles(srcDir);

let fixedCount = 0;
for (const file of files) {
  if (fixCatchBlocks(file)) {
    fixedCount++;
  }
}

console.log(`\n✅ Fixed catch blocks in ${fixedCount} files`);
console.log('🎯 Run "npm run lint" to see the improvement!');
