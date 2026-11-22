// ****************************************
// UI HELPERS
// Small HTML builders for EasyPTRE views (styles in 02-styles.js)
// Every content given to these helpers is HTML: escape untrusted text before
// ****************************************

// Cell: HTML string or {html, align: 'left'|'center'|'right', colspan, id, className}
function ptreCell(cell, tag = 'td') {
    if (cell === null || typeof cell !== 'object') {
        cell = {html: cell};
    }
    const classes = [];
    if (cell.align) {
        classes.push('ptreAlign-' + cell.align);
    }
    if (cell.className) {
        classes.push(cell.className);
    }
    let attrs = '';
    if (classes.length > 0) {
        attrs += ' class="' + classes.join(' ') + '"';
    }
    if (cell.colspan) {
        attrs += ' colspan="' + cell.colspan + '"';
    }
    if (cell.id) {
        attrs += ' id="' + cell.id + '"';
    }
    return '<' + tag + attrs + '>' + (cell.html === undefined || cell.html === null ? '' : cell.html) + '</' + tag + '>';
}

/*
    Data table with zebra rows
    rows: array of rows, a row is an array of cells or {cells: [...], id, className}
    options: {header: [cells], id, className, empty: HTML displayed when there is no row}
*/
function ptreTable(rows, options = {}) {
    let html = '<table' + (options.id ? ' id="' + options.id + '"' : '') + ' class="ptreTable' + (options.className ? ' ' + options.className : '') + '">';
    if (options.header) {
        html += '<thead><tr>' + options.header.map(c => ptreCell(c, 'th')).join('') + '</tr></thead>';
    }
    html += '<tbody>';
    if (rows.length === 0 && options.empty) {
        const colspan = options.header ? options.header.length : 1;
        html += '<tr>' + ptreCell({html: options.empty, colspan: colspan, align: 'center'}) + '</tr>';
    }
    rows.forEach(function(row) {
        const cells = Array.isArray(row) ? row : row.cells;
        let attrs = '';
        if (!Array.isArray(row) && row.id) {
            attrs += ' id="' + row.id + '"';
        }
        if (!Array.isArray(row) && row.className) {
            attrs += ' class="' + row.className + '"';
        }
        html += '<tr' + attrs + '>' + cells.map(c => ptreCell(c)).join('') + '</tr>';
    });
    return html + '</tbody></table>';
}

/*
    Label / value table (overview, settings...)
    rows: array of {label, description, value, id} (id is set on the value cell)
*/
function ptreInfoTable(rows) {
    return ptreTable(rows.map(function(row) {
        const label = row.label + (row.description ? '<div class="ptreSmall">' + row.description + '</div>' : '');
        return [label, {html: row.value, align: 'center', id: row.id}];
    }), {className: 'ptreInfoTable'});
}

// Titled block, with optional actions (buttons) on the right of the title
function ptreSection(title, contentHtml, actionsHtml = '') {
    return '<div class="ptreSection"><div class="ptreSectionHeader"><span class="ptreCategoryTitle">' + title + '</span>'
        + (actionsHtml ? '<span class="ptreSectionActions">' + actionsHtml + '</span>' : '') + '</div>'
        + contentHtml + '</div>';
}

// OGame style button (click handler has to be added after rendering)
function ptreButton(id, label, className = '') {
    return '<div id="' + id + '" class="button btn_blue ptreButton' + (className ? ' ' + className : '') + '">' + label + '</div>';
}

function ptreLoading(text = 'Loading...') {
    return '<div class="ptreLoading"><span class="ptreSpinner"></span>' + text + '</div>';
}

// Message block: type is 'success' | 'error' | 'warning' | 'info'
function ptreMessageBlock(type, html) {
    return '<div class="ptreMessageBlock ptreMessageBlock-' + type + '">' + html + '</div>';
}
