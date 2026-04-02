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

    logsJSON = JSON.stringify(logsList);
    GM_setValue(ptreLogsList, logsJSON);
}

// Garbage collection function
// Cleans logs
// Check migrated timers
// Delete old positions
// In order to avoid storage being too large for nothing
// Will make more requests to PTRE when going to newly empty systems, but it's fine
function runGarbageCollection() {
    console.log("[EasyPTRE] [GC] Running Garbage Collector...");
    const currentTime = getIGCurrentTS();
    const currentUnixTS = getCurrentUnixTS();
    const days = ptreGalaxyStorageRetention;

    // Clean logs
    var logsJSON = GM_getValue(ptreLogsList, '');
    if (logsJSON != '') {
        var minTs = currentUnixTS - ptreLogsRetentionDuration;
        var logsList = [];
        logsList = JSON.parse(logsJSON);
        logsList.splice(0, logsList.length, ...logsList.filter(item => item.ts >= minTs));
        logsJSON = JSON.stringify(logsList);
        GM_setValue(ptreLogsList, logsJSON);
    }
    // End: Clean logs

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

    // Clean old positions in galaxy storage
    if (GM_getValue(ptreGalaxyStorageVersion, 2) == 2) {
        const limitTS = currentTime - days*24*60*60;
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
    GM_setValue(ptreLastGarbageCollection, currentUnixTS);
}

function validatePurgeTamperMonkeyKeys(targetCountry, targetUniverse, keys) {
    setupMainBox('Delete keys for ' + targetCountry + '-' + targetUniverse + '?', 'TMKeys');
    const tkKey = 'ptre-' + targetCountry + '-' + targetUniverse + '-TK';
    const keysToDelete = keys.filter(function(k) { return k !== tkKey; });

    var content = '<span class="ptreError">This will delete ' + keysToDelete.length + ' key(s) for universe ' + targetCountry + '-' + targetUniverse + '.</span><br><br>';
    content += 'The Team Key (TK) will be preserved.<br><br>';
    content += '<div id="confirmPurgeUniKeys" class="button btn_blue">PURGE, REALLY?</div>';
    content += ' <div id="cancelPurgeUniKeys" class="button btn_blue">CANCEL</div>';
    content += '<br><br>Keys to delete:<br><ul>';
    keysToDelete.forEach(function(k) {
        content += '<li>' + k + '</li>';
    });
    content += '</ul>';

    document.getElementById('ptreMainContent').innerHTML = content;

    document.getElementById('confirmPurgeUniKeys').addEventListener('click', function() {
        keysToDelete.forEach(function(k) {
            GM_deleteValue(k);
        });
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

