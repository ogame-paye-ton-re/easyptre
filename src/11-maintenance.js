// ****************************************
// MAINTENANCE
// ****************************************

// Temp function to clean old version data
function migrateDataAndCleanStorage() {
    console.log("[EasyPTRE] Migrate Data and clean storage");
    const currentTime = Math.floor(serverTime.getTime() / 1000);

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

    // Clean Sharable Data
    var dataJSON = '';
    var dataJSONNew = '';
    dataJSON = GM_getValue(ptreDataToSync, '');
    var dataList = [];
    var dataListNew = [];
    if (dataJSON != '') {
        // Get current planet list
        const planetListFromDOM = document.querySelectorAll('.planet-koords');
        var planetList = [];
        planetListFromDOM.forEach(function(planet) {
            planetList.push(planet.textContent.replace(/[\[\]]/g, ""));
        });
        dataList = JSON.parse(dataJSON);
        // Go throught every element
        $.each(dataList, function(i, elem) {
            var keep_elem = 1;
            if (elem.type == "phalanx") {
                // Clean relocated planets
                if (!planetList.includes(elem.coords)) {
                    consoleDebug("Deleting phalanx (no more planet): " + elem.coords);
                    keep_elem = 0;
                }
                // Clean Old phalanx ID format
                const regex = /\:/;
                if (regex.test(elem.id)) {
                    consoleDebug("Need to remove old ID format: " + elem.id);
                    keep_elem = 0;
                }
            } else {
                // Wrong / deprecated type
                consoleDebug("Need to remove wrong / deprecated type: " + elem.type);
                keep_elem = 0;
            }
            // Keep element
            if (keep_elem == 1) {
                //console.log("Need to KEEP " + elem.type + ": " + elem.id + " (" + elem.val + ")");
                dataListNew.push(elem);
            }
        });
        dataJSONNew = JSON.stringify(dataListNew);
        GM_setValue(ptreDataToSync, dataJSONNew);
    }
    //debugSharableData();
    // End: Clean Sharable Data with wrong format

    // Clean LastAvailableVersion Keys from each universe
    const pattern = /LastAvailableVersion/i;
    var count = 0;
    GM_listValues().forEach(key => {
        if (pattern.test(key)) {
            if (key != ptreLastAvailableVersion && key != ptreLastAvailableVersionRefresh) {
                GM_deleteValue(key);
                count++;
            }
        }
    });
    if (count > 0) {
        addToLogs("Deleted " + count + " deprecated Keys (LastAvailableVersion)");
    }
    // End: Clean LastAvailableVersion Keys

    // Check TS
    if (GM_getValue(ptreLastGlobalSync, 0) > currentTime) {
        GM_setValue(ptreLastGlobalSync, currentTime);
        addToLogs("Fixed bad TS ptreLastGlobalSync");
    }
}

/*
    Drop old storage
    Wont loose real data
    It will only make more requests to PTRE, at start
*/
function dropGalaxyCacheStorageV1() {
    //TODO: remove in few days
    // Migrate cooldown check to "per universe"
    if (GM_getValue(ptreCheckForUpdateCooldown, -1) == -1) { // if we dont have the new "per uni" parameter (exclude 0 as means disabled)
        const oldUpdateCooldown = GM_getValue("ptre-CheckForUpdateCooldown", 0);
        if (oldUpdateCooldown > 0) {
            GM_setValue(ptreCheckForUpdateCooldown, oldUpdateCooldown);
            addToLogs("Migrate cooldown " + oldUpdateCooldown + " to: " + ptreCheckForUpdateCooldown);
        }
    }
    // Clean old storage ONCE
    if (GM_getValue(ptreGalaxyStorageVersion, 1) != 2) {
        GM_listValues().filter(key => key.includes(ptreGalaxyData)).sort().forEach(key => {
            GM_deleteValue(key);
            console.log("Deleting Galaxy Key: " + key);
        });
        addToLogs("Cleaned Galaxy Storage V1");
        GM_setValue(ptreGalaxyStorageVersion, 2);
    }
}

function addToLogs(message) {
    var currentTime = Math.floor(serverTime.getTime() / 1000);
    console.log(message);
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
    if (GM_getValue(ptreGalaxyStorageVersion, 1) == 2) {
        const currentTime = Math.floor(serverTime.getTime() / 1000);
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
            }
        }
    }
    if (removedCount > 0) {
        addToLogs("[GC] Cleaned " + removedCount + " old positions");
    }
}

