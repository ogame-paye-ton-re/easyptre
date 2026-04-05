// ****************************************
// CORE FUNCTIONS
// ****************************************

/*
    Watches the loading element on the galaxy page
    Once gone, we can start improving galaxy table

    Ordre :
    1. Galaxy page détectée => run de improvePageGalaxy() qui ajoute les éléments comme le footer de galaxie
    2. improvePageGalaxy() lance waitForGalaxyToBeLoaded()
    3. waitForGalaxyToBeLoaded() attend qu'il n'y ait plus le chargement et lance improveGalaxyTable()
    4. improveGalaxyTable() parse la galaxie et ajoute les éléments + push les actis et gala events
       + attend le prochain changement de galaxie via waitForNextGalaxyChangeTrigger()
    5. waitForNextGalaxyChangeTrigger() attend le prochain changement et appel waitForGalaxyToBeLoaded()
    Et la boucle est bouclée ! :)
*/
// TODO: check galaxyLoading?
function waitForGalaxyToBeLoaded() {
    consoleDebug("[GALAXY] Waiting for Galaxy content");
    ptreGalaxyInitMiliTS = Date.now();
    const galaxyLoading = document.getElementById('galaxyLoading');
    if (window.getComputedStyle(galaxyLoading).display === 'none') {
        consoleDebug("[GALAXY] Galaxy is already ready!");
        improveGalaxyTable();
    } else {
        const observer = new MutationObserver((mutations, obs) => {
            if (window.getComputedStyle(galaxyLoading).display === 'none') {
                let tempDuration = Date.now() - ptreGalaxyInitMiliTS;
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

// Wait for loading image
function waitForNextGalaxyChangeTrigger() {
    const galaxyLoading = document.getElementById('galaxyLoading');
    const observer = new MutationObserver((mutations, obs) => {
        if (window.getComputedStyle(galaxyLoading).display !== 'none') {
            consoleDebug("[GALAXY] Galaxy change triggered");
            obs.disconnect();
            waitForGalaxyToBeLoaded();
        }
    });
    observer.observe(galaxyLoading, {
        childList: true,
        attributes: true
    });
}

/*
    Function called on each new system displayed in order to:
    - parse galaxy table
    - add PTRE elements to galaxy table
    - prepare galaxy data (and call send function)
    - prepare activities data (and call send function)

    (This function is NOT called when the galaxy page is displayed, only when the galaxy TABLE is)
*/
function improveGalaxyTable() {
    var systemElem = $("input#system_input")[0];
    var galaxyElem = $("input#galaxy_input")[0];
    var galaxy = galaxyElem.value;
    var system = systemElem.value;
    var newSystemToStore = {};
    var additionnalSSInfos = {};
    var activitiesInfos = {};
    var activitiesToSend = 0;
    const imgSize = 16;

    const start = performance.now();
    const currentMiliTime = getIGCurrentMiliTS();
    const currentTime = getIGCurrentTS();

    consoleDebug("[GALAXY] Improving Galaxy Table " + galaxy + ":" + system);
    cleanGalaxyMiniMessage();

    var ptreStoredTK = GM_getValue(ptreTeamKey, '');
    // Get players to highlight
    var highlightedPlayersList = GM_getValue(ptreHighlightedPlayers, {});
    // Get positions to highlight
    var galaEventsList = GM_getValue(ptreGalaxyEventsPos, []);
    // Get merged Targets
    var mergedTargetsList = getMergedTargetsList();
    const ptreTrackedPlayerCount = document.getElementById("ptreTrackedPlayerCount");
    if (ptreTrackedPlayerCount) {
        ptreTrackedPlayerCount.innerHTML = mergedTargetsList.length + Object.keys(highlightedPlayersList).length;
    }

    // Go throught galaxy tab
    for(let pos = 1; pos <= 15 ; pos++) {
        // Init structures
        newSystemToStore[pos] = {playerId: -1, planetId: -1, moonId: -1, ts: currentTime};
        additionnalSSInfos[pos] = {playerName: '', playerStatus: '', playerRank: -1, moonSize: -1, timestamp_ig: currentMiliTime};
        //activitiesInfos[pos] = {planetActi: '60', moonActi: '60', debris: 0};

        // Browse every rows
        const row = document.getElementById('galaxyRow' + pos);
        if (row) {
            // Planet ID
            const planetDiv = row.querySelector('.cellPlanet .microplanet');
            if (planetDiv) {
                newSystemToStore[pos].planetId = Number(planetDiv.dataset.planetId);
            }
            // Moon ID
            const moonDiv = row.querySelector('.cellMoon .micromoon');
            if (moonDiv) {
                newSystemToStore[pos].moonId = Number(moonDiv.dataset.moonId);
            }
            const cellPlayerName = row.querySelector('.cellPlayerName');
            if (cellPlayerName && cellPlayerName.children.length > 0) {
                // Get Player
                const playerSpan = cellPlayerName.querySelector('span[rel^="player"]');
                if (playerSpan) {
                    // Player status
                    const preElem = cellPlayerName.querySelector('pre');
                    if (preElem) {
                        var statusTemp = '';
                        preElem.querySelectorAll('span').forEach(function(span) {
                            const statusMatch = span.className.match(/status_abbr_(\w+)/);
                            if (statusMatch) {
                                const status = statusMatch[1];
                                //console.log('[EasyPTRE] [GALAXY] [' + galaxy + ':' + system + ':' + pos + '] status: "' + status + '"');
                                if (status === 'inactive') {
                                    statusTemp += 'i';
                                }
                                if (status === 'longinactive') {
                                    statusTemp += 'I';
                                }
                                if (status === 'vacation') {
                                    statusTemp += 'v';
                                }
                                if (status === 'admin') {
                                    statusTemp += 'a';
                                }
                            }
                        });
                        if (statusTemp !== '') {
                            //console.log('[EasyPTRE] [GALAXY] [' + galaxy + ':' + system + ':' + pos + '] Status: ' + statusTemp);
                            additionnalSSInfos[pos].playerStatus = statusTemp;
                        }
                    }
                    // Player ID
                    const rel = playerSpan.getAttribute('rel');
                    newSystemToStore[pos].playerId = Number(rel.replace(/\D/g, ''));
                    // Player rank
                    additionnalSSInfos[pos].playerRank = Number(document.getElementById(playerSpan.getAttribute('rel'))?.querySelector('li.rank a')?.textContent);
                    // Player name
                    const playerSpanName = row.querySelector('.galaxyCell .playerName.tooltipRel');
                    if (playerSpanName) {
                        additionnalSSInfos[pos].playerName = playerSpanName.childNodes[0].textContent.trim();
                    }
                } else if (cellPlayerName.querySelector('.ownPlayerRow')) {
                    // This is OUR row. No playerID is provided, we replace it.
                    newSystemToStore[pos].playerId = Number(currentPlayerID);
                    additionnalSSInfos[pos].playerName = currentPlayerName;
                    // TODO: add own rank
                }
            }

            // Check if an event already exists for this position
            // We are comparing to already saved events from PTRE DB (saved in local)
            const galaEventDetected = galaEventsList.includes(galaxy+":"+system+":"+pos);

            // Display button only if settings allow it
            if (ptreDisplayGalaPopup === true) {
                // We add the button for every player OR for empty position with an event
                if (newSystemToStore[pos].playerId > -1 || galaEventDetected === true) {
                    var btn = document.createElement("span");
                    btn.dataset.galaxy = galaxy;
                    btn.dataset.system = system;
                    btn.dataset.pos = pos;
                    btn.dataset.playerId = newSystemToStore[pos].playerId;
                    btn.dataset.playerName = additionnalSSInfos[pos].playerName;
                    // We sort status by most important first
                    if (highlightedPlayersList[newSystemToStore[pos].playerId] && highlightedPlayersList[newSystemToStore[pos].playerId]["status"] == "dnp" && highlightedPlayersList[newSystemToStore[pos].playerId]["ts"] >= currentTime) {
                        btn.style.border = ptreBorderStyleDnpList;
                        //consoleDebug("===> "+playerName+" is part of DNP list");
                    } else if (galaEventDetected === true) {
                        btn.style.border = ptreBorderStyleGalaxyEvent;
                        //consoleDebug("===> "+galaxy+":"+system+":"+pos+" is a Galaxy Event");
                    } else if (highlightedPlayersList[newSystemToStore[pos].playerId] && highlightedPlayersList[newSystemToStore[pos].playerId]["status"] == "hot") {
                        btn.style.border = ptreBorderStyleHotList;
                        //consoleDebug("===> "+playerName+" is part of HOT list");
                    }
                    // Display button
                    btn.innerHTML = '<a class="tooltip" title="PTRE actions"><img id="ptreActionPos-' + galaxy + ":" + system + ":" + pos + '" style="cursor:pointer;" class="mouseSwitch" src="' + imgPTREOK + '" height="' + imgSize + 'px" width="' + imgSize + 'px"></a>';
                    cellPlayerName.appendChild(btn);
                    // Add action
                    btn.addEventListener('click', function (event) {
                        event.stopPropagation();
                        openPTREGalaxyActions(this.dataset.galaxy, this.dataset.system, this.dataset.pos, this.dataset.playerId, this.dataset.playerName);
                    });
                }
            }

            // Get activities infos
            if (ptrePushActivities === true && ptreStoredTK != '') {
                if (newSystemToStore[pos].playerId > 0) {
                    if ( (highlightedPlayersList[newSystemToStore[pos].playerId] && highlightedPlayersList[newSystemToStore[pos].playerId]["status"] == "hot") || mergedTargetsList.includes(newSystemToStore[pos].playerId) ) {
                        activitiesToSend++;
                        // Init structure
                        const coord = galaxy+":"+system+":"+pos;
                        activitiesInfos[coord] = {teamkey : ptreStoredTK,
                                                galaxy: Number(galaxy),
                                                system: Number(system),
                                                position: pos,
                                                player_id: newSystemToStore[pos].playerId,
                                                activity: '60',
                                                cdr_total_size: -1,
                                                main: false,//TODO: useless
                                                moon: {activity: "60"}};
                        // Get planet activity
                        const actiElemPlanet = row.querySelector('[data-planet-id] .activity');
                        if (actiElemPlanet) {
                            if (actiElemPlanet.classList.contains('minute15')) {
                                activitiesInfos[coord].activity = '*';
                            } else if (actiElemPlanet.classList.contains('showMinutes')) {
                                const actiTimerPlanet = actiElemPlanet.textContent.trim();
                                activitiesInfos[coord].activity = actiTimerPlanet;
                            }
                        }
                        // Get moon activity
                        const actiElemMoon = row.querySelector('[data-moon-id] .activity');
                        if (actiElemMoon) {
                            if (actiElemMoon.classList.contains('minute15')) {
                                activitiesInfos[coord].moon.activity = '*';
                            } else if (actiElemMoon.classList.contains('showMinutes')) {
                                const actiTimerMoon = actiElemMoon.textContent.trim();
                                activitiesInfos[coord].moon.activity = actiTimerMoon;
                            }
                        }
                        // Get debris
                        let debris = 0;
                        const debrisElements = row.querySelectorAll('#debris' + pos + ' .ListLinks .debris-content');
                        debrisElements.forEach((element, index) => {
                            let splitted = element.textContent.split(':');
                            let cdr = splitted[1].trim();
                            cdr = Number(cdr.replace(/[.,]/g, ''));
                            debris = debris + cdr;
                            //consoleDebug("Elem "+ index + ": " + cdr + " => " + debris);
                        });
                        activitiesInfos[coord].cdr_total_size = debris;
                        //console.log(activitiesInfos[pos]);
                    }
                }
            }
        } else {
            consoleDebug("[GALAXY] No galaxy row " + pos);
        }
    }

    // Wait for new SS change
    waitForNextGalaxyChangeTrigger();

    // Manage activities only if configured
    if (ptrePushActivities === true && activitiesToSend > 0) {
        processPlayerActivities(galaxy, system, activitiesInfos);
    }

    // Manage Galaxy updates only if configured
    if (ptreSendGalaEvents === true) {
        processGalaxyUpdates(galaxy, system, newSystemToStore, additionnalSSInfos);
    }

    const end = performance.now();
    const duration = end - start;
    consoleDebug("[GALAXY] Galaxy improvement duration: " + duration.toFixed(1) + " ms");
}

// Check if EasyPTRE needs to be updated
function updateLastAvailableVersion(force = false) {
    // Only check once a while

    var lastCheckTime = GM_getValue(ptreLastAvailableVersionRefresh, 0);
    const currentUnixTS = getCurrentUnixTS();

    if (force === true || currentUnixTS > lastCheckTime + ptreVersionCheckTimeout) {
        consoleDebug("[OPENJS] Checking last version available");
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
                    consoleDebug("[OPENJS] Current version: " + GM_info.script.version);
                    consoleDebug("[OPENJS] Last version: " + availableVersion);
                    GM_setValue(ptreLastAvailableVersion, availableVersion);
                    GM_setValue(ptreLastAvailableVersionRefresh, currentUnixTS);
                    if (availableVersion !== GM_info.script.version) {
                        displayUpdateVersionMessage('<span class="ptreError">New version '+ availableVersion + ' is available. You need to update <a href="https://openuserjs.org/scripts/GeGe_GM/EasyPTRE" target="_blank">EasyPTRE</a> version.</span>');
                        if (document.getElementById('ptreMenuName')) {
                            document.getElementById('ptreMenuName').innerHTML = 'CLICK ME';
                            document.getElementById('ptreMenuName').classList.add('ptreError');
                        }
                        displayPTREPopUpMessage("New EasyPTRE version available. Please update it.");
                        consoleDebug('[OPENJS] Version ' + availableVersion + ' is available');
                    } else {
                        displayUpdateVersionMessage('<span class="ptreSuccess">EasyPTRE is up to date</span>');
                    }
                } else {
                    displayUpdateVersionMessage('<span class="ptreError">Error ' + result.status + ' (' + result.statusText + ')</span>');
                    consoleDebug('[OPENJS] Error while checking script version: ' + result.status + ' (' + result.statusText + ')');
                }
            }
        });
    } else {
        var temp = lastCheckTime + ptreVersionCheckTimeout - currentUnixTS;
        //consoleDebug("[OPENJS] Skipping automatic EasyPTRE version check. Next check in " + round(temp, 0) + " seconds (at least)");
    }
}

// Get the content of a system
function fetchSystemV2(galaxy, system) {
    if (!ptreGalaxyCache[galaxy]) {
        ptreGalaxyCache[galaxy] = GM_getValue(ptreGalaxyData+galaxy, {});
    }
    return ptreGalaxyCache[galaxy][String(system)] || null;
}

// Update the content of an entire system
function updateSystemV2(galaxy, system, newSystemData) {
    if (!ptreGalaxyCache[galaxy]) {
        ptreGalaxyCache[galaxy] = GM_getValue(ptreGalaxyData+galaxy, {});
    }
    ptreGalaxyCache[galaxy][String(system)] = newSystemData;
    GM_setValue(ptreGalaxyData+galaxy, ptreGalaxyCache[galaxy]);
    consoleDebug(`[GALAXY] Updated Storage for ${galaxy}:${system}`);
}

// Generate an empty system structure (all 15 positions with no player)
function generateEmptySystem() {
    const system = {};
    for (let pos = 1; pos <= 15; pos++) {
        system[pos] = { playerId: -1, planetId: -1, moonId: -1, ts: -1 };
    }
    return system;
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
        const currentTime = getIGCurrentTS();
        if (currentTime > GM_getValue(ptreLastUpdateCheck, 0) + 60) {// Safety to avoid spamming
            consoleDebug("[LIVE] Checking for Updates...");
            $.ajax({
                url : urlcheckForPTREUpdate + '&team_key=' + TKey +
                '&current_ts=' + GM_getValue(ptreCurrentBackendUpdateTS, 0) +
                '&cooldown=' + GM_getValue(ptreCheckForUpdateCooldown, 0) +
                '&galaxy_api_update_timestamp=' + GM_getValue(ptreGalaxyAPIUpdateIGTS, 0),
                type : 'POST',
                cache: false,
                success : function(reponse){
                    var reponseDecode = JSON.parse(reponse);
                    if (reponseDecode.code == 1) {
                        // Update config (we dont change our current TS)
                        updateLiveCheckConfig(reponseDecode.check_for_update_cooldown, -1);
                        // Is update needed?
                        if (reponseDecode.update == 1) {
                            consoleDebug("[LIVE] Update needed!");
                            displayPTREPopUpMessage("New update available");
                            addToLogs("[LIVE] New update available");
                            setTimeout(syncDataWithPTRE, 100);
                        } else {
                            consoleDebug("[LIVE] NO Update needed");
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
// Use _autoCheckScheduled as Guard flag to avoid multiple concurrent timers
var _autoCheckScheduled = false;

function runAutoCheckForPTREUpdate() {
    _autoCheckScheduled = false;
    const currentTime = getIGCurrentTS();
    const cooldown = Number(GM_getValue(ptreCheckForUpdateCooldown, 0));
    // If Auto-Check is enabled
    if (cooldown > 0) {
        // Should we check?
        if (currentTime > (Math.floor(Number(GM_getValue(ptreLastUpdateCheck, 0)) + cooldown))) {
            consoleDebug("[LIVE] Need to Check For Updates");
            checkForPTREUpdate();
        }
        if (!_autoCheckScheduled) {
            _autoCheckScheduled = true;
            setTimeout(runAutoCheckForPTREUpdate, 10*1000);
        }
    } else {
        consoleDebug("[LIVE] Auto-Check For Updates is DISABLED: nothing to do.");
    }
}

// Sync all data with PTRE
async function globalPTRESync(mode = "auto") {
    const startMiliTS = Date.now();
    const currentTime = getIGCurrentTS();

    if (currentTime < Number(GM_getValue(ptreLastGlobalSync, 0)) + 60) {
        consoleDebug("[SYNC] Global sync skipped (60-sec cooldown)");
        updateHtmlById("ptreLastDataSyncMessageField", "Global sync skipped (60-sec cooldown)");
        updateHtmlById("ptreLastTargetsSyncMessageField", "Global sync skipped (60-sec cooldown)");
        return;
    }

    updateHtmlById("ptreLastDataSyncMessageField", "Loading...");
    updateHtmlById("ptreLastTargetsSyncMessageField", "Loading...");

    await updateDataFromEmpireMoonPage();

    syncTargets();

    syncDataWithPTRE(mode);

    GM_setValue(ptreLastGlobalSync, currentTime);
    updateHtmlById("ptreLastGlobalSyncField", getLastUpdateLabel(currentTime));
    var tempDuration = Date.now() - startMiliTS;
    addToLogs("[SYNC] Global Sync (Mode: " + mode + ". Duration: " + round(tempDuration) + " ms)");
}

