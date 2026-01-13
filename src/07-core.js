// ****************************************
// CORE FUNCTIONS
// ****************************************

/*
    Watches the loading element on the galaxy page
    Once gone, we can start improving galaxy table
*/
function waitForGalaxyToBeLoaded() {
    consoleDebug("[GALAXY] Waiting for Galaxy content");
    galaxyInitMiliTS = serverTime.getTime();
    const galaxyLoading = document.getElementById('galaxyLoading');
    if (window.getComputedStyle(galaxyLoading).display === 'none') {
        consoleDebug("[GALAXY] Galaxy is already ready!");
        improveGalaxyTable();
    } else {
        const observer = new MutationObserver((mutations, obs) => {
            if (window.getComputedStyle(galaxyLoading).display === 'none') {
                let tempDuration = serverTime.getTime() - galaxyInitMiliTS;
                consoleDebug("[GALAXY] Galaxy is ready after " + tempDuration + " miliseconds");
                obs.disconnect();
                improveGalaxyTable();
            } else {
                consoleDebug("[GALAXY] Galaxy is still NOT ready. Waiting...");
            }
        });
        observer.observe(galaxyLoading, {
            childList: true,
            attributes: true
        });
    }
}

// Check if EasyPTRE needs to be updated
function updateLastAvailableVersion(force = false) {
    // Only check once a while

    var lastCheckTime = GM_getValue(ptreLastAvailableVersionRefresh, 0);
    var currentTime = Math.floor(serverTime.getTime() / 1000);

    if (force === true || currentTime > lastCheckTime + versionCheckTimeout) {
        consoleDebug("Checking last version available");
        GM_xmlhttpRequest({
            method:'GET',
            url:urlToScriptMetaInfos,
            nocache:true,
            onload:result => {
                //consoleDebug(result.responseText);
                if (result.status == 200) {
                    var tab = result.responseText.split('//');
                    var availableVersion = tab[2].match(/\d+\.\d+.\d+/);
                    availableVersion = availableVersion[0];
                    consoleDebug("Current version: " + GM_info.script.version);
                    consoleDebug("Last version: " + availableVersion);
                    GM_setValue(ptreLastAvailableVersion, availableVersion);
                    GM_setValue(ptreLastAvailableVersionRefresh, currentTime);
                    if (availableVersion !== GM_info.script.version) {
                        if (document.getElementById('ptreUpdateVersionMessage')) {
                            document.getElementById('ptreUpdateVersionMessage').innerHTML = '<span class="ptreError">New version '+ availableVersion + ' is available. You need to update <a href="https://openuserjs.org/scripts/GeGe_GM/EasyPTRE" target="_blank">EasyPTRE</a> version.</span>';
                        }
                        if (document.getElementById('ptreMenuName')) {
                            document.getElementById('ptreMenuName').innerHTML = 'CLICK ME';
                            document.getElementById('ptreMenuName').classList.add('ptreError');
                        }
                        displayPTREPopUpMessage("New EasyPTRE version available. Please update it.");
                        consoleDebug('Version ' + availableVersion + ' is available');
                    } else {
                        if (document.getElementById('ptreUpdateVersionMessage')) {
                            document.getElementById('ptreUpdateVersionMessage').innerHTML = '<span class="ptreSuccess">EasyPTRE is up to date</span>';
                        }
                    }
                } else {
                    document.getElementById('ptreUpdateVersionMessage').innerHTML = '<span class="ptreError">Error ' + result.status + ' (' + result.statusText + ')</span>';
                }
            }
        });
    } else {
        var temp = lastCheckTime + versionCheckTimeout - currentTime;
        //consoleDebug("Skipping automatic EasyPTRE version check. Next check in " + round(temp, 0) + " seconds (at least)");
    }
}

// Get the content of a system
function fetchSystemV2(galaxy, system) {
    const galaxyData = GM_getValue(ptreGalaxyData+galaxy, {});
    const systemData = galaxyData[String(system)] || null;
    return systemData;
}

// Update the content of an entire system
function updateSystemV2(galaxy, system, newSystemData) {
    const galaxyData = GM_getValue(ptreGalaxyData+galaxy, {});
    galaxyData[String(system)] = newSystemData;
    GM_setValue(ptreGalaxyData+galaxy, galaxyData);
    consoleDebug(`[GALAXY] Updated Storage for ${galaxy}:${system}`);
}

/*
Cooldown:
    - 0 => DISABLE
    - >= 60 => ENABLE
Last Update:
    - -1 to not update value (and keep the current one)
    - >=0 to update
*/
function updateLiveCheckConfig(coolddown, last_update = -1) {
    // 0 to disable
    if (Number(coolddown) == 0 || Number(coolddown) >= 60) {
        GM_setValue(ptreCheckForUpdateCooldown, Number(coolddown));
        consoleDebug('[LIVE] Updated Check Cooldown to ' + coolddown);
    }
    if (Number(last_update) >= 0) {
        GM_setValue(ptreCurrentBackendUpdateTS, Number(last_update));
        consoleDebug('[LIVE] Updated Backend TS to ' + last_update);
    }
}

// Ask PTRE if new data are available
function checkForPTREUpdate() {
    const TKey = GM_getValue(ptreTeamKey, '');
    if (TKey != '') {
        const currentTime = Math.floor(serverTime.getTime() / 1000);
        if (currentTime > GM_getValue(ptreLastUpdateCheck, 0) + 60) {// Safety to avoid spamming
            consoleDebug("Checking for Updates...");
            $.ajax({
                url : urlcheckForPTREUpdate + '&team_key=' + TKey + '&current_ts=' + GM_getValue(ptreCurrentBackendUpdateTS, 0) + '&cooldown=' + GM_getValue(ptreCheckForUpdateCooldown, 0),
                type : 'POST',
                cache: false,
                success : function(reponse){
                    var reponseDecode = jQuery.parseJSON(reponse);
                    if (reponseDecode.code == 1) {
                        // Update config (we dont change our current TS)
                        updateLiveCheckConfig(reponseDecode.check_for_update_cooldown, -1);
                        // Is update needed?
                        if (reponseDecode.update == 1) {
                            consoleDebug("Update needed!");
                            displayPTREPopUpMessage("New update available");
                            addToLogs("New update available");
                            setTimeout(syncDataWithPTRE, 100);
                        } else {
                            consoleDebug("NO Update needed");
                        }
                    }
                }
            });
            GM_setValue(ptreLastUpdateCheck, currentTime);
        }
    }
}

// Enable auto-check to PTRE
// This is disabled by default cooldown <= 0
function runAutoCheckForPTREUpdate() {
    const currentTime = Math.floor(serverTime.getTime() / 1000);
    const cooldown = Number(GM_getValue(ptreCheckForUpdateCooldown, 0));
    // If Auto-Check is enabled
    if (cooldown > 0) {
        // Should we check?
        if (currentTime > (Math.floor(Number(GM_getValue(ptreLastUpdateCheck, 0)) + cooldown))) {
            consoleDebug("Need to Check For Updates");
            checkForPTREUpdate();
        }
        setTimeout(runAutoCheckForPTREUpdate, 10*1000);
    } else {
        consoleDebug("Auto-Check For Updates is DISABLED: nothing to do.");
    }
}

// Sync all data once a day
function globalPTRESync() {
    addToLogs("Global Clean & Sync");
    const currentTime = Math.floor(serverTime.getTime() / 1000);
    migrateDataAndCleanStorage();
    garbageCollectGalaxyDataV2(ptreGalaxyStorageRetention);
    syncTargets();
    syncDataWithPTRE();
    GM_setValue(ptreLastGlobalSync, currentTime);
}

