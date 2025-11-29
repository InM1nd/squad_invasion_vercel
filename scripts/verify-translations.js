const fs = require('fs');
const path = require('path');

const ruPath = path.join(__dirname, '../src/locales/ru.json');
const enPath = path.join(__dirname, '../src/locales/en.json');

const ru = JSON.parse(fs.readFileSync(ruPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Check specific namespaces used in code
const namespaces = [
  'dashboard.squad',
  'dashboard.squad.notes',
  'dashboard.events',
  'dashboard.admin.events',
  'dashboard.admin.users',
  'dashboard.admin.users.edit',
];

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

console.log('=== Translation Verification ===\n');

let hasErrors = false;

namespaces.forEach(ns => {
  const ruValue = getNestedValue(ru, ns);
  const enValue = getNestedValue(en, ns);
  
  if (!ruValue) {
    console.log(`❌ Missing in RU: ${ns}`);
    hasErrors = true;
  }
  if (!enValue) {
    console.log(`❌ Missing in EN: ${ns}`);
    hasErrors = true;
  }
  if (ruValue && enValue) {
    console.log(`✅ ${ns} - OK`);
  }
});

// Check specific keys
const keyChecks = [
  { ns: 'dashboard.squad', keys: ['title', 'description', 'comingSoon', 'comingSoonDescription', 'content'] },
  { ns: 'dashboard.squad.notes', keys: ['title', 'description', 'comingSoon', 'comingSoonDescription', 'content'] },
  { ns: 'dashboard.events', keys: ['title', 'description', 'empty', 'registrationOpen', 'maxParticipants'] },
  { ns: 'dashboard.admin.events', keys: ['title', 'description', 'list.view', 'calendar.view'] },
  { ns: 'dashboard.admin.users', keys: ['title', 'description', 'editButton'] },
];

console.log('\n=== Key Verification ===\n');

keyChecks.forEach(({ ns, keys }) => {
  const ruObj = getNestedValue(ru, ns);
  const enObj = getNestedValue(en, ns);
  
  if (!ruObj || !enObj) {
    console.log(`⚠️  ${ns} - namespace not found`);
    return;
  }
  
  keys.forEach(key => {
    const ruKey = getNestedValue(ruObj, key);
    const enKey = getNestedValue(enObj, key);
    
    if (!ruKey) {
      console.log(`❌ Missing in RU: ${ns}.${key}`);
      hasErrors = true;
    }
    if (!enKey) {
      console.log(`❌ Missing in EN: ${ns}.${key}`);
      hasErrors = true;
    }
  });
});

if (!hasErrors) {
  console.log('\n✅ All translations verified!');
} else {
  console.log('\n❌ Some translations are missing!');
  process.exit(1);
}

