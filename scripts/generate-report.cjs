const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const getArg = (name) => {
    const index = args.indexOf(`--${name}`);
    if (index !== -1 && args[index + 1]) {
        return args[index + 1];
    }
    return null;
};

let targetDate = getArg('date') || 'today';

const today = new Date();
let filterDate = '';

if (targetDate === 'today') {
    filterDate = today.toISOString().split('T')[0];
} else if (targetDate === 'yesterday') {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    filterDate = yesterday.toISOString().split('T')[0];
} else {
    filterDate = targetDate;
}

const dataFile = path.join(__dirname, '../data/work-log.json');

if (!fs.existsSync(dataFile)) {
    console.log('No work logs found.');
    process.exit(0);
}

const logs = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const dailyLogs = logs.filter(log => log.date === filterDate);

if (dailyLogs.length === 0) {
    console.log(`No logs found for date: ${filterDate}`);
    process.exit(0);
}

// Helper to parse duration (very basic)
const parseDuration = (dur) => {
    const match = dur.match(/(\d+(\.\d+)?)([h|m])/);
    if (!match) return 0;
    const val = parseFloat(match[1]);
    const unit = match[3];
    if (unit === 'm') return val / 60;
    return val;
};

let totalHours = 0;
const byType = {};

console.log(`# Work Report for ${filterDate}\n`);
console.log(`| Type | Duration | Description |`);
console.log(`|---|---|---|`);

dailyLogs.forEach(log => {
    const hours = parseDuration(log.duration);
    totalHours += hours;

    if (!byType[log.type]) byType[log.type] = 0;
    byType[log.type] += hours;

    console.log(`| ${log.type} | ${log.duration} | ${log.description} |`);
});

console.log(`\n**Total Time:** ${totalHours.toFixed(2)} hours`);
console.log(`\n**Summary:**`);
for (const [t, h] of Object.entries(byType)) {
    console.log(`- ${t}: ${h.toFixed(2)}h`);
}
