// ****************************************
// MINI FUNCTIONS
// ****************************************

// Check TeamKey format
function isValidTeamKey(tk) {
    return tk.replace(/-/g, "").length == 18 && tk.substr(0, 2) == "TM";
}

// Detects if AGR is enabled
function isAGREnabled() {
    if (document.getElementById('ago_panel_Player')) {
        return true;
    }
    return false;
}

function isOGLEnabled() {
    if (document.querySelector('body.oglight')) {
        return true;
    }
    return false;
}

function isOGIEnabled() {
    if (document.getElementsByClassName('ogl-harvestOptions').length != 0) {
        return true;
    }
    return false;
}

// Detects if OGL is enabled
function isOGLorOGIEnabled() {
    if (isOGLEnabled() || isOGIEnabled()) {
        return true;
    }
    return false;
}

// Convert planets activities to OGL - PTRE format
function convertActivityToOGLFormat(showActivity, idleTime) {
    if (showActivity == '15') {
        return '*';
    } else if (showActivity == '60') {
        return idleTime;
    } else if (!showActivity) {
        return '60';
    }
    return '60';
}

function buildPTRELinkToPlayer(playerID) {
    return 'https://ptre.chez.gg/?country=' + country + '&univers=' + universe + '&player_id=' + playerID;
}

function buildPTRELinkToAdvancedActivityTable(playerID) {
    return 'https://ptre.chez.gg/advanced_activity_table.php?country=' + country + '&univers=' + universe + '&player_id=' + playerID;
}

function buildLinkToGalaxy(galaxy, system, position) {
    return '<a href="https://s'+universe+'-'+country+'.ogame.gameforge.com/game/index.php?page=ingame&component=galaxy&galaxy='+galaxy+'&system='+system+'&position='+position+'">['+galaxy+':'+system+':'+position+']</a>';
}

function buildLinkToMoonBuilding(moonID) {
    return '<a href="https://s'+universe+'-'+country+'.ogame.gameforge.com/game/index.php?page=ingame&component=facilities&cp='+moonID+'">Visit another Moon buildings</a>';
}

function consoleDebug(message) {
    if (ptreEnableConsoleDebugValue === true) {
        console.log('[EasyPTRE] ' + message);
    }
}

function round(x, y) {
    return Number.parseFloat(x).toFixed(y);
}

function setNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function getLastUpdateLabel(ts) {
    var temp = "";
    const currentTime = getIGCurrentTS();

    if (ts == 0) {
        return '<span class="ptreError ptreSmall">never updated</span>';
    } else if (currentTime >= ts) {
        var nb_min = (currentTime - ts) / 60;
        if (nb_min <= 1) {
            temp = '<span class="ptreSuccess ptreSmall">updated now</span>';
        } else if (nb_min < 60) {
            temp = '<span class="ptreSuccess ptreSmall">updated ' + round(nb_min, 0) + ' mins ago</span>';
        } else if (nb_min < 24*60) {
            var nb_h = (currentTime - ts) / 3600;
            temp = '<span class="ptreWarning ptreSmall">updated ' + round(nb_h, 0) + ' hours ago</span>';
        } else {
            temp = '<span class="ptreError ptreSmall">updated ' + round(nb_min/(24*60), 1) + ' days ago</span>';
        }
        return temp;
    } else {
        let inSec = ts - currentTime;
        return "In " + inSec + " secs";
    }
    return temp;
}

function getLogTSLabel(ts) {
    var temp = "";
    const currentTime = getCurrentUnixTS();

    if (ts == 0) {
        return '<span class="ptreError ptreSmall">???</span>';
    } else if (currentTime >= ts) {
        var nb_min = (currentTime - ts) / 60;
        if (nb_min <= 1) {
            temp = '<span class="ptreSuccess ptreSmall">now</span>';
        } else if (nb_min < 60) {
            temp = '<span class="ptreSuccess ptreSmall">' + round(nb_min, 0) + ' mins ago</span>';
        } else if (nb_min < 24*60) {
            var nb_h = (currentTime - ts) / 3600;
            temp = '<span class="ptreWarning ptreSmall">' + round(nb_h, 0) + ' hours ago</span>';
        } else {
            temp = '<span class="ptreError ptreSmall">' + round(nb_min/(24*60), 1) + ' days ago</span>';
        }
        return temp;
    } else {
        let inSec = ts - currentTime;
        return "In " + inSec + " secs";
    }
    return temp;
}

function updateHtmlById(id, html) {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = html;
    }
}

// Calling serverTime.getTime() multtiple times is buggy.
// We call it one time at script start
// Then we manage current time via client time increase
function getIGCurrentTS() {
    const elapsed = Date.now() - ptrePageLoadClientMiliTS;
    return Math.floor((ptrePageLoadServerMiliTS + elapsed) / 1000);
}

function getIGCurrentMiliTS() {
    const elapsed = Date.now() - ptrePageLoadClientMiliTS;
    return ptrePageLoadServerMiliTS + elapsed;
}

function getCurrentUnixTS() {
    const elapsed = Date.now() - ptrePageLoadClientMiliTS;
    return Math.floor(ptrePageLoadUnixTS + elapsed / 1000);
}

