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
    // data-ogi-callback-event-token is set on <html> as soon as OGI starts (.ogl-harvestOptions comes much later)
    if (document.documentElement.dataset.ogiCallbackEventToken || document.getElementsByClassName('ogl-harvestOptions').length != 0) {
        return true;
    }
    return false;
}

function getDetectedTools() {
    const detectedTools = [];
    if (isAGREnabled()) {
        detectedTools.push("AGR");
    }
    if (isOGLEnabled()) {
        detectedTools.push("OGL");
    }
    if (isOGIEnabled()) {
        detectedTools.push("OGI");
    }
    return detectedTools;
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
        return '<span class="ptreError">never updated</span>';
    } else if (currentTime >= ts) {
        var nb_min = (currentTime - ts) / 60;
        if (nb_min <= 1) {
            temp = '<span class="ptreSuccess">updated now</span>';
        } else if (nb_min < 60) {
            temp = '<span class="ptreSuccess">updated ' + round(nb_min, 0) + ' mins ago</span>';
        } else if (nb_min < 24*60) {
            var nb_h = (currentTime - ts) / 3600;
            temp = '<span class="ptreWarning">updated ' + round(nb_h, 0) + ' hours ago</span>';
        } else {
            temp = '<span class="ptreError">updated ' + round(nb_min/(24*60), 1) + ' days ago</span>';
        }
        return temp;
    } else {
        let inSec = ts - currentTime;
        return "In " + inSec + " secs";
    }
    return temp;
}

function getUnixTSLabel(ts) {
    var temp = "";
    const currentUnixTS = getCurrentUnixTS();

    if (ts == 0) {
        return '<span class="ptreError">???</span>';
    } else if (currentUnixTS >= ts) {
        var nb_min = (currentUnixTS - ts) / 60;
        if (nb_min <= 1) {
            temp = '<span class="ptreSuccess">now</span>';
        } else if (nb_min < 60) {
            temp = '<span class="ptreSuccess">' + round(nb_min, 0) + ' mins ago</span>';
        } else if (nb_min < 24*60) {
            var nb_h = (currentUnixTS - ts) / 3600;
            temp = '<span class="ptreWarning">' + round(nb_h, 0) + ' hours ago</span>';
        } else {
            temp = '<span class="ptreError">' + round(nb_min/(24*60), 1) + ' days ago</span>';
        }
        return temp;
    } else {
        let inSec = ts - currentUnixTS;
        return "In " + inSec + " secs";
    }
    return temp;
}

// Decode a base64 string containing UTF-8 bytes (atob alone breaks non-ASCII chars)
function decodeBase64UTF8(base64) {
    return new TextDecoder().decode(Uint8Array.from(atob(base64), c => c.charCodeAt(0)));
}

// Returns true if version "candidate" is strictly newer than "current" (format: X.Y.Z)
function isNewerVersion(candidate, current) {
    const a = String(candidate).split('.').map(n => parseInt(n, 10) || 0);
    const b = String(current).split('.').map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const diff = (a[i] || 0) - (b[i] || 0);
        if (diff !== 0) {
            return diff > 0;
        }
    }
    return false;
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

function convertUnixTSToIGTS(unixTS) {
    return unixTS - ptreTimezoneDiffSec;
}

function convertIGTSToUnixTS(igTS) {
    return igTS + ptreTimezoneDiffSec;
}

