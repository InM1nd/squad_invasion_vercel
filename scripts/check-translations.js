const fs = require('fs');
const path = require('path');

const ruPath = path.join(__dirname, '../src/locales/ru.json');
const enPath = path.join(__dirname, '../src/locales/en.json');

const ru = JSON.parse(fs.readFileSync(ruPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    keys.push(fullKey);
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    }
  }
  return keys;
}

function findMissingKeys(source, target, prefix = '') {
  const missing = [];
  for (const key in source) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (!(key in target)) {
      missing.push(fullKey);
    } else if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      if (typeof target[key] === 'object' && target[key] !== null && !Array.isArray(target[key])) {
        missing.push(...findMissingKeys(source[key], target[key], fullKey));
      } else {
        missing.push(fullKey);
      }
    }
  }
  return missing;
}

const ruKeys = getAllKeys(ru);
const enKeys = getAllKeys(en);

const missingInEn = findMissingKeys(ru, en);
const missingInRu = findMissingKeys(en, ru);

console.log('=== Translation Check ===\n');
console.log(`Total keys in RU: ${ruKeys.length}`);
console.log(`Total keys in EN: ${enKeys.length}\n`);

if (missingInEn.length > 0) {
  console.log('❌ Missing in EN:');
  missingInEn.forEach(key => console.log(`  - ${key}`));
} else {
  console.log('✅ All RU keys present in EN');
}

console.log('');

if (missingInRu.length > 0) {
  console.log('❌ Missing in RU:');
  missingInRu.forEach(key => console.log(`  - ${key}`));
} else {
  console.log('✅ All EN keys present in RU');
}

