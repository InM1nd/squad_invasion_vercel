const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read translation files
const ruPath = path.join(__dirname, '../src/locales/ru.json');
const enPath = path.join(__dirname, '../src/locales/en.json');

const ru = JSON.parse(fs.readFileSync(ruPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Find all t() calls in source files - not needed for this check

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Check known namespaces and their keys
const checks = [
  {
    namespace: 'dashboard.nav',
    keys: ['dashboard', 'profile', 'settings', 'events', 'squad', 'notes', 'signOut', 'squadLeader', 'admin', 'users', 'adminEvents', 'system']
  },
  {
    namespace: 'dashboard.squad',
    keys: ['title', 'description', 'comingSoon', 'comingSoonDescription', 'content']
  },
  {
    namespace: 'dashboard.squad.notes',
    keys: ['title', 'description', 'comingSoon', 'comingSoonDescription', 'content']
  },
  {
    namespace: 'dashboard.events',
    keys: ['title', 'description', 'empty', 'registrationOpen', 'maxParticipants', 'status.upcoming', 'status.ongoing', 'status.completed', 'status.cancelled', 'type.clan_war', 'type.scrim', 'type.tournament', 'type.training', 'gameMode.invasion', 'gameMode.territory_control', 'gameMode.raas', 'gameMode.aas']
  },
  {
    namespace: 'dashboard.admin.events',
    keys: ['title', 'description', 'list.title', 'list.description', 'list.createButton', 'list.empty', 'list.createFirst', 'list.noDescription', 'list.public', 'list.private', 'list.maxParticipants', 'list.view', 'calendar.view', 'calendar.today', 'calendar.more', 'calendar.january', 'calendar.february', 'calendar.march', 'calendar.april', 'calendar.may', 'calendar.june', 'calendar.july', 'calendar.august', 'calendar.september', 'calendar.october', 'calendar.november', 'calendar.december', 'calendar.sunday', 'calendar.monday', 'calendar.tuesday', 'calendar.wednesday', 'calendar.thursday', 'calendar.friday', 'calendar.saturday', 'calendar.legend.upcoming', 'calendar.legend.ongoing', 'calendar.legend.completed', 'create.title', 'create.description', 'create.titleLabel', 'create.titlePlaceholder', 'create.descriptionLabel', 'create.descriptionPlaceholder', 'create.typeLabel', 'create.typeClanWar', 'create.typeScrim', 'create.typeTournament', 'create.typeTraining', 'create.gameModeLabel', 'create.gameModeInvasion', 'create.gameModeTC', 'create.gameModeRAAS', 'create.gameModeAAS', 'create.startDateLabel', 'create.endDateLabel', 'create.serverLabel', 'create.serverPlaceholder', 'create.mapLabel', 'create.mapPlaceholder', 'create.maxParticipantsLabel', 'create.isPublicLabel', 'create.registrationOpenLabel', 'create.cancel', 'create.submit', 'create.creating', 'deleteConfirm', 'deleteError', 'status.upcoming', 'status.ongoing', 'status.completed', 'status.cancelled', 'type.clan_war', 'type.scrim', 'type.tournament', 'type.training', 'gameMode.invasion', 'gameMode.territory_control', 'gameMode.raas', 'gameMode.aas']
  },
  {
    namespace: 'dashboard.admin.users',
    keys: ['title', 'description', 'search', 'searchDescription', 'searchPlaceholder', 'usersList', 'view', 'editButton', 'edit.title', 'edit.description', 'edit.usernameLabel', 'edit.usernamePlaceholder', 'edit.displayNameLabel', 'edit.displayNamePlaceholder', 'edit.bioLabel', 'edit.bioPlaceholder', 'edit.roleLabel', 'edit.roleUser', 'edit.roleSquadLeader', 'edit.roleEventAdmin', 'edit.roleAdmin', 'edit.roleSuperAdmin', 'edit.roleChangeRestricted', 'edit.ratingLabel', 'edit.banSection', 'edit.banDescription', 'edit.isBannedLabel', 'edit.bannedUntilLabel', 'edit.bannedUntilHint', 'edit.banReasonLabel', 'edit.banReasonPlaceholder', 'edit.cancel', 'edit.save', 'edit.saving']
  }
];

console.log('=== Comprehensive Translation Check ===\n');

let totalErrors = 0;

checks.forEach(({ namespace, keys }) => {
  const ruObj = getNestedValue(ru, namespace);
  const enObj = getNestedValue(en, namespace);
  
  if (!ruObj) {
    console.log(`❌ Missing namespace in RU: ${namespace}`);
    totalErrors++;
    return;
  }
  
  if (!enObj) {
    console.log(`❌ Missing namespace in EN: ${namespace}`);
    totalErrors++;
    return;
  }
  
  keys.forEach(key => {
    const ruValue = getNestedValue(ruObj, key);
    const enValue = getNestedValue(enObj, key);
    
    if (!ruValue) {
      console.log(`❌ Missing in RU: ${namespace}.${key}`);
      totalErrors++;
    }
    if (!enValue) {
      console.log(`❌ Missing in EN: ${namespace}.${key}`);
      totalErrors++;
    }
  });
});

if (totalErrors === 0) {
  console.log('✅ All translations are present and correct!');
} else {
  console.log(`\n❌ Found ${totalErrors} missing translation(s)`);
  process.exit(1);
}

