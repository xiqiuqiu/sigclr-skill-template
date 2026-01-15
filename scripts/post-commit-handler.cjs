const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Path to log-work script
const logScript = path.join(__dirname, 'log-work.cjs');

// Check for skip flag
if (process.env.AGENT_SKIP_WORK_LOG) {
    process.exit(0);
}

console.log('\n=============================================');
console.log('       Daily Work Tracker Reminder');
console.log('=============================================');

// 1. Get the last commit message
let commitMsg = '';
try {
    // Get the raw subject lines
    commitMsg = execSync('git log -1 --pretty=%B').toString().trim();
} catch (e) {
    // If we can't git log, likely not a repo or something else.
    process.exit(0);
}

console.log(`Commit: "${commitMsg}"`);

// 2. Setup Interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 3. Inference
let type = 'FEATURE';
const lowerMsg = commitMsg.toLowerCase();
if (lowerMsg.startsWith('fix') || lowerMsg.includes('bug')) {
    type = 'BUG';
} else if (lowerMsg.startsWith('chore') || lowerMsg.startsWith('refactor')) {
    type = 'OTHER';
} else if (lowerMsg.startsWith('doc')) {
    type = 'OTHER';
}

// 4. Prompt
rl.question(`\nHow much time did you spend on this? (e.g., 30m, 1h) [Enter to skip]: `, (duration) => {
    const cleanDuration = duration.trim();
    if (!cleanDuration) {
        console.log('Skipping log entry.');
        rl.close();
        process.exit(0);
    }

    try {
        console.log(`logging as ${type}...`);
        // We use child_process to call the sibling script just to keep things decoupled,
        // though requiring it would be faster. Child process ensures env isolation.
        // We need to escape quotes in the description for the command line.
        const safeDesc = commitMsg.replace(/"/g, '\\"');

        execSync(`node "${logScript}" --type "${type}" --duration "${cleanDuration}" --description "${safeDesc}"`, { stdio: 'inherit' });

    } catch (e) {
        console.error("Failed to log work:", e.message);
    }

    console.log('\n');
    rl.close();
});
