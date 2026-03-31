// ****************************************
// MAINTENANCE
// ****************************************

// Temp function to clean old version data
function migrateDataAndCleanStorage() {
    console.log("[EasyPTRE] Migrate Data and clean storage");
    const currentTime = getIGCurrentTS();

    // Clean logs
    var logsJSON = GM_getValue(ptreLogsList, '');
    if (logsJSON != '') {
        var minTs = currentTime - logsRetentionDuration;
        var logsList = [];
        logsList = JSON.parse(logsJSON);
        logsList.splice(0, logsList.length, ...logsList.filter(item => item.ts >= minTs));
        logsJSON = JSON.stringify(logsList);
        GM_setValue(ptreLogsList, logsJSON);
    }
    // End: Clean logs

    // Check TS
    const lastGlobalSyncTemp = GM_getValue(ptreLastGlobalSync, 0);
    if (lastGlobalSyncTemp != 0) {
        if (lastGlobalSyncTemp > currentTime) {
            GM_setValue(ptreLastGlobalSync, currentTime);
            addToLogs("Fixed bad TS ptreLastGlobalSync (L:" + lastGlobalSyncTemp + ' / C:' + currentTime + ')');
        }
    }
}

function addToLogs(message) {
    const currentTime = getCurrentUnixTS();
    console.log('[EasyPTRE] ' + message);
    var logsJSON = GM_getValue(ptreLogsList, '');
    var logsList = [];
    if (logsJSON != '') {
        logsList = JSON.parse(logsJSON);
    }
    var newLog = {ts: currentTime, uni: country + "-" + universe, log: message};
    logsList.push(newLog);

    logsJSON = JSON.stringify(logsList);
    GM_setValue(ptreLogsList, logsJSON);
}

// Delete old positions
// In order to avoid storage behind too fat for nothing
// Will make more request to PTRE when goind to newly empty system, but its fine
function garbageCollectGalaxyDataV2(days) {
    var removedCount = 0;
    if (GM_getValue(ptreGalaxyStorageVersion, 2) == 2) {
        const currentTime = getIGCurrentTS();
        const limitTS = currentTime - days*24*60*60;
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
    }
    if (removedCount > 0) {
        addToLogs("[GC] Cleaned " + removedCount + " old positions");
    }
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
        addToLogs('Purged ' + keysToDelete.length + ' keys for ' + targetCountry + '-' + targetUniverse);
        displayTamperMonkeyKeys();
    });

    document.getElementById('cancelPurgeUniKeys').addEventListener('click', function() {
        displayTamperMonkeyKeys();
    });
}

