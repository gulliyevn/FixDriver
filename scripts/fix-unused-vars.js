#!/usr/bin/env node

/**
 * Script to fix unused variables in catch blocks
 * Replaces unused 'error', 'e', 'err' with '_' or adds console.warn
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
  
  // Pattern 1: catch (error) { } -> catch (_) { }
  const catchErrorPattern = /catch\s*\(\s*error\s*\)\s*\{\s*\}/g;
  if (catchErrorPattern.test(content)) {
    content = content.replace(catchErrorPattern, 'catch (_) { }');
    modified = true;
  }
  
  // Pattern 2: catch (e) { } -> catch (_) { }
  const catchEPattern = /catch\s*\(\s*e\s*\)\s*\{\s*\}/g;
  if (catchEPattern.test(content)) {
    content = content.replace(catchEPattern, 'catch (_) { }');
    modified = true;
  }
  
  // Pattern 3: catch (err) { } -> catch (_) { }
  const catchErrPattern = /catch\s*\(\s*err\s*\)\s*\{\s*\}/g;
  if (catchErrPattern.test(content)) {
    content = content.replace(catchErrPattern, 'catch (_) { }');
    modified = true;
  }
  
  // Pattern 4: catch (error) { /* some comment */ } -> catch (_) { /* some comment */ }
  const catchErrorCommentPattern = /catch\s*\(\s*error\s*\)\s*\{\s*\/\*[^*]*\*\/\s*\}/g;
  if (catchErrorCommentPattern.test(content)) {
    content = content.replace(catchErrorCommentPattern, (match) => {
      return match.replace(/catch\s*\(\s*error\s*\)/, 'catch (_)');
    });
    modified = true;
  }
  
  // Pattern 5: catch (e) { /* some comment */ } -> catch (_) { /* some comment */ }
  const catchECommentPattern = /catch\s*\(\s*e\s*\)\s*\{\s*\/\*[^*]*\*\/\s*\}/g;
  if (catchECommentPattern.test(content)) {
    content = content.replace(catchECommentPattern, (match) => {
      return match.replace(/catch\s*\(\s*e\s*\)/, 'catch (_)');
    });
    modified = true;
  }
  
  // Pattern 6: catch (err) { /* some comment */ } -> catch (_) { /* some comment */ }
  const catchErrCommentPattern = /catch\s*\(\s*err\s*\)\s*\{\s*\/\*[^*]*\*\/\s*\}/g;
  if (catchErrCommentPattern.test(content)) {
    content = content.replace(catchErrCommentPattern, (match) => {
      return match.replace(/catch\s*\(\s*err\s*\)/, 'catch (_)');
    });
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
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