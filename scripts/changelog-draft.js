#!/usr/bin/env node
/*
    Prints a draft of the "Unreleased" section of CHANGELOG.md from conventional commits.
    Commits are taken since the last commit changing "@version" in src/00-headers.js (last release),
    or since the given git reference.
    Usage: node scripts/changelog-draft.js [git-ref]

    The draft has to be reviewed and rewritten for players before being copied into CHANGELOG.md.
*/
const {execSync} = require('child_process');

const git = cmd => execSync('git ' + cmd, {encoding: 'utf8'}).trim();

const since = process.argv[2] || git("log -1 --format=%H -G'^// @version' -- src/00-headers.js");
if (!since) {
    console.error('ERROR: cannot find last release commit, give a git reference as argument');
    process.exit(1);
}

// Conventional commit type => Keep a Changelog section
const sections = {
    feat: 'Added',
    fix: 'Fixed',
    perf: 'Changed',
    refactor: 'Changed',
    revert: 'Changed',
};
const draft = {Added: [], Changed: [], Fixed: [], 'Not in changelog (chore, docs, build...)': [], 'Not conventional': []};

git('log --no-merges --reverse --format=%s ' + since + '..HEAD').split('\n').filter(Boolean).forEach(function(subject) {
    const match = subject.match(/^(\w+)(?:\(([^)]+)\))?!?:\s*(.+)$/);
    if (!match) {
        draft['Not conventional'].push(subject);
        return;
    }
    const [, type, scope, description] = match;
    const line = (scope ? scope + ': ' : '') + description;
    draft[sections[type] || 'Not in changelog (chore, docs, build...)'].push(line);
});

console.log('Commits since ' + git('log -1 --format="%h %s" ' + since) + '\n');
console.log('## [Unreleased]');
Object.entries(draft).filter(([, lines]) => lines.length > 0).forEach(function([section, lines]) {
    console.log('\n### ' + section);
    lines.forEach(line => console.log('- ' + line));
});
