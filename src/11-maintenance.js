// ****************************************
// MAINTENANCE
// ****************************************

function addToLogs(message) {
    const currentUnixTS = getCurrentUnixTS();
    console.log('[EasyPTRE] ' + message);
    var logsJSON = GM_getValue(ptreLogsList, '');
    var logsList = [];
    if (logsJSON != '') {
        logsList = JSON.parse(logsJSON);
    }
    var newLog = {ts: currentUnixTS, uni: country + "-" + universe, log: message};
    logsList.push(newLog);
    // Keep only the most recent logs
    if (logsList.length > ptreLogsMaxEntries) {
        logsList.splice(0, logsList.length - ptreLogsMaxEntries);
    }

    logsJSON = JSON.stringify(logsList);
    GM_setValue(ptreLogsList, logsJSON);
}

// Clean universe logs
function cleanCurrentUniverseLogs() {
    var logsJSON = GM_getValue(ptreLogsList, '');
    if (logsJSON != '') {
        var logsList = JSON.parse(logsJSON);
        logsList = logsList.filter(function(item) { return item.uni !== country + "-" + universe; });
        logsJSON = JSON.stringify(logsList);
        GM_setValue(ptreLogsList, logsJSON);
        addToLogs('[PURGE] Cleaned logs for ' + country + '-' + universe);
    }
}

// Garbage collection function
// Runs at most once a day per played universe (see ptreGarbageCollectionTimeout)
// In order to avoid storage being too large for nothing
function runGarbageCollection() {
    console.log("[EasyPTRE] [GC] Running Garbage Collector...");
    // GC reads galaxy storage: write pending changes first
    flushGalaxyStorage();
    const currentTime = getIGCurrentTS();
    const currentUnixTS = getCurrentUnixTS();

    // ----------------------------------------
    // Logs (all universes): remove logs older than retention
    // ----------------------------------------
    var logsJSON = GM_getValue(ptreLogsList, '');
    if (logsJSON != '') {
        var minTs = currentUnixTS - ptreLogsRetentionDuration;
        var logsList = [];
        logsList = JSON.parse(logsJSON);
        logsList.splice(0, logsList.length, ...logsList.filter(item => item.ts >= minTs));
        logsJSON = JSON.stringify(logsList);
        GM_setValue(ptreLogsList, logsJSON);
    }

    // ----------------------------------------
    // Timestamps (current universe): fix values set in the future
    // ----------------------------------------
    // Check ptreLastGlobalSync IG TS
    const lastGlobalSyncTemp = GM_getValue(ptreLastGlobalSync, 0);
    if (lastGlobalSyncTemp != 0) {
        if (lastGlobalSyncTemp > currentTime) {
            GM_setValue(ptreLastGlobalSync, currentTime);
            addToLogs("[GC] Fixed bad IG TS ptreLastGlobalSync (L:" + lastGlobalSyncTemp + ' / C:' + currentTime + ')');
        }
    }
    // Check ptreLastAvailableVersionRefresh (after migrating to UNIX TS)
    const lastAvailableVersionRefreshTemp = GM_getValue(ptreLastAvailableVersionRefresh, 0);
    if (lastAvailableVersionRefreshTemp != 0) {
        if (lastAvailableVersionRefreshTemp > currentUnixTS) {
            GM_setValue(ptreLastAvailableVersionRefresh, currentUnixTS);
            addToLogs("[GC] Fixed bad Unix TS ptreLastAvailableVersionRefresh (L:" + lastAvailableVersionRefreshTemp + ' / C:' + currentUnixTS + ')');
        }
    }

    // ----------------------------------------
    // Galaxy storage (current universe): delete positions older than retention
    // Will make more requests to PTRE when going to newly empty systems, but it's fine
    // ----------------------------------------
    if (GM_getValue(ptreGalaxyStorageVersion, 2) == 2) {
        const limitTS = currentTime - ptreGalaxyStorageRetention*24*60*60;
        var removedCount = 0;
        for(var gala = 1; gala <= 15 ; gala++) {
            const galaxyData = GM_getValue(ptreGalaxyData+gala, '');
            if (galaxyData != '') {
                for (const systemKey of Object.keys(galaxyData)) {
                    const system = galaxyData[systemKey];
                    for (const posKey of Object.keys(system)) {
                        const pos = system[posKey];
                        if (pos.ts < limitTS) {
                            delete system[posKey];
                            removedCount++;
                        }
                    }
                    if (Object.keys(system).length === 0) {
                        delete galaxyData[systemKey];
                    }
                }
                GM_setValue(ptreGalaxyData+gala, galaxyData);
                ptreGalaxyCache[gala] = galaxyData; // Keep in-memory cache in sync after GC
            }
        }
        if (removedCount > 0) {
            addToLogs("[GC] Cleaned " + removedCount + " old positions");
        }
    }

    // ----------------------------------------
    // Other universes: EasyPTRE never runs on a universe that is not played anymore, so it is cleaned from here
    // Reference date = its LastGarbageCollection (real activity), or else its InactivitySince (activity unknown)
    // - no reference date: InactivitySince is created now, nothing is deleted
    // - inactive >= ptreGalaxyStorageRetention days: galaxy data is deleted (all positions are expired anyway)
    // - inactive >= ptreInactiveUniverseFullPurgeDays days: every key is deleted, except TK and both dates
    // Only Unix TS are compared here (IG TS of another universe are not usable)
    // ----------------------------------------
    const universes = {};
    GM_listValues().forEach(function(key) {
        const match = key.match(/^ptre-([a-z]+)-(\d+)-(.+)$/);
        if (!match || (match[1] === country && match[2] === String(universe))) {
            return;
        }
        const uniKey = match[1] + '-' + match[2];
        if (!universes[uniKey]) {
            universes[uniKey] = {prefix: 'ptre-' + uniKey + '-', keys: []};
        }
        universes[uniKey].keys.push(key);
    });
    Object.keys(universes).forEach(function(uniKey) {
        const uni = universes[uniKey];
        const lastGCKey = uni.prefix + ptreLastGarbageCollectionKeySuffix;
        const inactivitySinceKey = uni.prefix + ptreInactivitySinceKeySuffix;
        const referenceTS = Number(GM_getValue(lastGCKey, 0)) || Number(GM_getValue(inactivitySinceKey, 0));
        if (referenceTS <= 0) {
            GM_setValue(inactivitySinceKey, currentUnixTS);
            consoleDebug('[GC] ' + uniKey + ': activity unknown, tracked from now');
            return;
        }
        const inactiveDays = Math.floor((currentUnixTS - referenceTS) / (24*60*60));
        let keysToDelete = [];
        let label = '';
        if (inactiveDays >= ptreInactiveUniverseFullPurgeDays) {
            keysToDelete = uni.keys.filter(k => k !== uni.prefix + 'TK' && k !== lastGCKey && k !== inactivitySinceKey);
            label = 'keys (all except TK)';
        } else if (inactiveDays >= ptreGalaxyStorageRetention) {
            keysToDelete = uni.keys.filter(k => k.startsWith(uni.prefix + 'GalaxyDataG'));
            label = 'galaxy keys';
        }
        if (keysToDelete.length > 0) {
            keysToDelete.forEach(k => GM_deleteValue(k));
            addToLogs('[GC] ' + uniKey + ' inactive for ' + inactiveDays + ' days: removed ' + keysToDelete.length + ' ' + label);
        }
    });

    // ----------------------------------------
    // Current universe activity: real activity date is now known
    // ----------------------------------------
    GM_deleteValue(ptreInactivitySince);
    GM_setValue(ptreLastGarbageCollection, currentUnixTS);
}

function validatePurgeTamperMonkeyKeys(targetCountry, targetUniverse, keys) {
    setupMainBox('Delete keys for ' + targetCountry + '-' + targetUniverse + '?', 'TMKeys');
    const tkKey = 'ptre-' + targetCountry + '-' + targetUniverse + '-TK';
    // By default the Team Key is preserved, the checkbox allows to delete everything
    const getKeysToDelete = function() {
        if (document.getElementById('purgeUniKeysWithTK').checked) {
            return keys.slice();
        }
        return keys.filter(function(k) { return k !== tkKey; });
    };

    var content = ptreMessageBlock('error', '<span id="purgeUniKeysSummary"></span>');
    content += '<label><input type="checkbox" id="purgeUniKeysWithTK"> Also delete the Team Key (TK): every key of this universe will be deleted</label><br><br>';
    content += '<div class="ptreSectionActions">' + ptreButton('confirmPurgeUniKeys', 'PURGE, REALLY?') + ptreButton('cancelPurgeUniKeys', 'CANCEL') + '</div>';
    content += ptreSection('Keys to delete', '<ul id="purgeUniKeysList" class="ptreList"></ul>');

    document.getElementById('ptreMainContent').innerHTML = content;

    const refreshPurgeDetails = function() {
        const keysToDelete = getKeysToDelete();
        var summary = 'This will delete ' + keysToDelete.length + ' key(s) for universe ' + targetCountry + '-' + targetUniverse + '. ';
        summary += keysToDelete.includes(tkKey) ? 'The Team Key (TK) will be DELETED.' : 'The Team Key (TK) will be preserved.';
        document.getElementById('purgeUniKeysSummary').textContent = summary;
        document.getElementById('purgeUniKeysList').innerHTML = keysToDelete.map(k => '<li>' + k + '</li>').join('');
    };
    refreshPurgeDetails();
    document.getElementById('purgeUniKeysWithTK').addEventListener('change', refreshPurgeDetails);

    document.getElementById('confirmPurgeUniKeys').addEventListener('click', function() {
        const keysToDelete = getKeysToDelete();
        const isCurrentUniverse = (targetCountry === country && targetUniverse === universe);
        if (isCurrentUniverse) {
            // Write pending changes first, so nothing is written after the purge
            flushGalaxyStorage();
        }
        keysToDelete.forEach(function(k) {
            GM_deleteValue(k);
        });
        if (isCurrentUniverse) {
            ptreGalaxyCache = {}; // Clear in-memory cache after purge
        }
        // Purge logs for this universe
        var logsJSON = GM_getValue(ptreLogsList, '');
        if (logsJSON != '') {
            var logsList = JSON.parse(logsJSON);
            var targetUni = targetCountry + '-' + targetUniverse;
            logsList = logsList.filter(function(item) { return item.uni !== targetUni; });
            GM_setValue(ptreLogsList, JSON.stringify(logsList));
        }
        addToLogs('[PURGE] Purged ' + keysToDelete.length + ' keys for ' + targetCountry + '-' + targetUniverse);
        displayTamperMonkeyKeys();
    });

    document.getElementById('cancelPurgeUniKeys').addEventListener('click', function() {
        displayTamperMonkeyKeys();
    });
}

