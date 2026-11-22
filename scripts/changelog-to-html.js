#!/usr/bin/env node
/*
    Converts CHANGELOG.md (Keep a Changelog format) to HTML for the ingame changelog.
    Usage: node scripts/changelog-to-html.js CHANGELOG.md
    Prints a JS declaration: const ptreChangelogHTML = "...";

    Supported Markdown (keep CHANGELOG.md simple):
    - "## [x.y.z] - YYYY-MM-DD" or "## [Unreleased]"
    - "### Added" / "### Changed" / "### Fixed" / ... (rendered as "[Added]" before each item)
    - "- item" and nested "  - item"
    - **bold**, `code`, [text](url)
    Everything before the first "## " (title, intro) and link references "[x]: url" are ignored.
    Empty versions (e.g. empty Unreleased) are not displayed.
*/
const fs = require('fs');

const file = process.argv[2];
if (!file) {
    console.error('Usage: node scripts/changelog-to-html.js CHANGELOG.md');
    process.exit(1);
}

const escapeHTML = s => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const inline = s => escapeHTML(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank">$1</a>');

// Parse
const versions = [];
let version = null;
let section = '';
fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach(function(line) {
    const versionMatch = line.match(/^## \[([^\]]+)\](?:\s*-\s*(\S+))?/);
    if (versionMatch) {
        version = {name: versionMatch[1], date: versionMatch[2] || '', lines: []};
        versions.push(version);
        section = '';
        return;
    }
    if (!version || line.trim() === '' || /^\[[^\]]+\]:\s/.test(line)) {
        return;
    }
    const sectionMatch = line.match(/^### (.+)/);
    if (sectionMatch) {
        section = sectionMatch[1].trim();
        return;
    }
    const itemMatch = line.match(/^(\s*)[-*] (.+)/);
    if (itemMatch) {
        const level = Math.floor(itemMatch[1].length / 2);
        const tag = (level === 0 && section) ? '[' + escapeHTML(section) + '] ' : '';
        version.lines.push('&nbsp;&nbsp;&nbsp;&nbsp;'.repeat(level) + '- ' + tag + inline(itemMatch[2]));
    } else {
        version.lines.push(inline(line.trim()));
    }
});

if (versions.length === 0) {
    console.error('ERROR: no version found in ' + file);
    process.exit(1);
}

// Render (a separator is added when the minor version changes)
let html = '';
let previousMinor = null;
versions.filter(v => v.lines.length > 0).forEach(function(v) {
    const isUnreleased = v.name.toLowerCase() === 'unreleased';
    const minor = isUnreleased ? 'unreleased' : v.name.split('.').slice(0, 2).join('.');
    if (previousMinor !== null && minor !== previousMinor) {
        html += '<div><hr></div>';
    }
    previousMinor = minor;
    const title = isUnreleased ? 'Unreleased (next version)' : escapeHTML(v.name) + (v.date ? ' (' + escapeHTML(v.date) + ')' : '');
    html += '<div class="ptreSubTitle">' + title + '</div>' + v.lines.join('<br>');
});

process.stdout.write('// Generated from CHANGELOG.md by scripts/changelog-to-html.js\n');
process.stdout.write('const ptreChangelogHTML = ' + JSON.stringify(html) + ';\n\n');
