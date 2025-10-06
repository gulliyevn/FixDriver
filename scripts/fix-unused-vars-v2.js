#!/usr/bin/env node

/**
 * Script to fix unused variables in catch blocks
 * Replaces unused 'error', 'e', 'err' with '_' when they're truly unused
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

// Fix unused variables in a file
function fixUnusedVars(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Split into lines for easier processing
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for catch blocks with unused variables
    const catchMatch = line.match(/catch\s*\(\s*(\w+)\s*\)\s*\{/);
    if (catchMatch) {
      const varName = catchMatch[1];
      
      // Check if this variable is used in the next few lines
      let isUsed = false;
      let braceCount = 0;
      let foundOpeningBrace = false;
      
      for (let j = i; j < lines.length && j < i + 10; j++) {
        const currentLine = lines[j];
        
        // Count braces to find the end of catch block
        for (const char of currentLine) {
          if (char === '{') {
            braceCount++;
            foundOpeningBrace = true;
          } else if (char === '}') {
            braceCount--;
            if (foundOpeningBrace && braceCount === 0) {
              // End of catch block found
              break;
            }
          }
        }
        
        // Check if variable is used in this line (but not in the catch declaration)
        if (j !== i && currentLine.includes(varName)) {
          isUsed = true;
          break;
        }
        
        // If we found the end of the catch block, stop looking
        if (foundOpeningBrace && braceCount === 0) {
          break;
        }
      }
      
      // If variable is not used, replace it with _
      if (!isUsed && (varName === 'error' || varName === 'e' || varName === 'err')) {
        lines[i] = line.replace(varName, '_');
        modified = true;
      }
    }
  }
  
  if (modified) {
    const newContent = lines.join('\n');
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✓ Fixed unused variables in: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
console.log('🔧 Fixing unused variables in catch blocks...\n');

const srcDir = path.join(__dirname, '..', 'src');
const files = findTsFiles(srcDir);

let fixedCount = 0;
for (const file of files) {
  if (fixUnusedVars(file)) {
    fixedCount++;
  }
}

console.log(`\n✅ Fixed unused variables in ${fixedCount} files`);
console.log('🎯 Run "npm run lint" to see the improvement!');
