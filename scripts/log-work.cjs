const fs = require('fs');
const path = require('path');

// Simple arg parser
const args = process.argv.slice(2);
const getArg = (name) => {
    const index = args.indexOf(`--${name}`);
    if (index !== -1 && args[index + 1]) {
        return args[index + 1];
    }
    return null;
};

const type = (getArg('type') || 'OTHER').toUpperCase();
const duration = getArg('duration') || '0h';
const description = getArg('description') || 'No description';

const dataDir = path.join(__dirname, '../data');
const dataFile = path.join(dataDir, 'work-log.json');

// Ensure data dir exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load existing data
let logs = [];
if (fs.existsSync(dataFile)) {
    logs = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

const now = new Date();
const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

const entry = {
    id: Date.now().toString(),
    timestamp: now.toISOString(),
    date: dateStr,
    type,
    duration, // store as string '2h', agent can parse if needed or script can normalize later
    description
};

logs.push(entry);

fs.writeFileSync(dataFile, JSON.stringify(logs, null, 2));

console.log(`Successfully logged work:
Type: ${type}
Duration: ${duration}
Description: ${description}
Date: ${dateStr}`);
