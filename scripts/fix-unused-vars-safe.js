#!/usr/bin/env node

/**
 * Safe script to fix unused variables in catch blocks
 * Only replaces variables that are truly unused (empty catch blocks)
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

// Fix unused variables in a file - only for truly empty catch blocks
function fixUnusedVars(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Pattern 1: catch (error) { } -> catch (_) { }
  const emptyCatchError = /catch\s*\(\s*error\s*\)\s*\{\s*\}/g;
  if (emptyCatchError.test(content)) {
    content = content.replace(emptyCatchError, 'catch (_) { }');
    modified = true;
  }
  
  // Pattern 2: catch (e) { } -> catch (_) { }
  const emptyCatchE = /catch\s*\(\s*e\s*\)\s*\{\s*\}/g;
  if (emptyCatchE.test(content)) {
    content = content.replace(emptyCatchE, 'catch (_) { }');
    modified = true;
  }
  
  // Pattern 3: catch (err) { } -> catch (_) { }
  const emptyCatchErr = /catch\s*\(\s*err\s*\)\s*\{\s*\}/g;
  if (emptyCatchErr.test(content)) {
    content = content.replace(emptyCatchErr, 'catch (_) { }');
    modified = true;
  }
  
  // Pattern 4: catch (error) { /* comment */ } -> catch (_) { /* comment */ }
  const emptyCatchErrorComment = /catch\s*\(\s*error\s*\)\s*\{\s*\/\*[^*]*\*\/\s*\}/g;
  if (emptyCatchErrorComment.test(content)) {
    content = content.replace(emptyCatchErrorComment, (match) => {
      return match.replace(/catch\s*\(\s*error\s*\)/, 'catch (_)');
    });
    modified = true;
  }
  
  // Pattern 5: catch (e) { /* comment */ } -> catch (_) { /* comment */ }
  const emptyCatchEComment = /catch\s*\(\s*e\s*\)\s*\{\s*\/\*[^*]*\*\/\s*\}/g;
  if (emptyCatchEComment.test(content)) {
    content = content.replace(emptyCatchEComment, (match) => {
      return match.replace(/catch\s*\(\s*e\s*\)/, 'catch (_)');
    });
    modified = true;
  }
  
  // Pattern 6: catch (err) { /* comment */ } -> catch (_) { /* comment */ }
  const emptyCatchErrComment = /catch\s*\(\s*err\s*\)\s*\{\s*\/\*[^*]*\*\/\s*\}/g;
  if (emptyCatchErrComment.test(content)) {
    content = content.replace(emptyCatchErrComment, (match) => {
      return match.replace(/catch\s*\(\s*err\s*\)/, 'catch (_)');
    });
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed empty catch blocks in: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
console.log('🔧 Fixing empty catch blocks (safe approach)...\n');

const srcDir = path.join(__dirname, '..', 'src');
const files = findTsFiles(srcDir);

let fixedCount = 0;
for (const file of files) {
  if (fixUnusedVars(file)) {
    fixedCount++;
  }
}

console.log(`\n✅ Fixed empty catch blocks in ${fixedCount} files`);
console.log('🎯 Run "npm run lint" to see the improvement!');
