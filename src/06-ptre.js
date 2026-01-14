// ****************************************
// CALLS TO PTRE
// ****************************************

// Process galaxy data
// Sends player activity and galaxy updates
/*
    playerId != -1 => Player is here (at least a planet)
        moonId != -1 => Player also has a moon

    playerId == -1 => No player here
        planetId != -1 => This is his previous planet
        moonId != -1 => This is his previous moon
*/
function processGalaxyUpdates(galaxy, system, newSystemInfos, additionnalSSInfos) {
    var previousSystemFound = false;
    var updatedPositions = 0;
    var newSystemToPush = [];
    const ptreStoredTK = GM_getValue(ptreTeamKey, '');

    if (ptreStoredTK == '') {
        return;
    }

    consoleDebug("[GALAXY] Process Galaxy Updates");
    // Get LOCAL Galaxy content from Storage
    var previousSystem = null;
    previousSystem = fetchSystemV2(galaxy, system);
    if (previousSystem) {
        previousSystemFound = true;
    } else {
        consoleDebug("[GALAXY] No previous system " + galaxy + ":" + system);
        // We prepare an empty system
        const generateEmptySystem = () => {
            const system = {};
            for (let pos = 1; pos <= 15; pos++) {
                system[pos] = { playerId: -1, planetId: -1, moonId: -1, ts: -1 };
            }
            return system;
        };
        previousSystem = generateEmptySystem();
    }

    // Go throught gala pos
    for(let pos = 1; pos <= 15 ; pos++) {
        // Compare new positions with previous one
        consoleDebug("[GALAXY] [" + galaxy + ":" + system + ":" + pos + "] Player " + additionnalSSInfos[pos].playerName + " ("+additionnalSSInfos[pos].playerRank+"): "+previousSystem[pos].playerId+"=>"+newSystemInfos[pos].playerId+" | Planet: "+previousSystem[pos].planetId+"=>"+newSystemInfos[pos].planetId+" | Moon: "+previousSystem[pos].moonId+"=>"+newSystemInfos[pos].moonId);
        if (previousSystemFound === false || newSystemInfos[pos].playerId != previousSystem[pos].playerId || newSystemInfos[pos].planetId != previousSystem[pos].planetId || newSystemInfos[pos].moonId != previousSystem[pos].moonId) {
            if (newSystemInfos[pos].playerId != -1 || previousSystem[pos].playerId != -1) {
                consoleDebug("[GALAXY] [" + galaxy + ":" + system + ":" + pos + "] has changed");
                updatedPositions++;
                // Build data to send to PTRE
                // Use Mili-sec TS
                const jsonLuneG = {id: newSystemInfos[pos].moonId, size: additionnalSSInfos[pos].moonSize};
                const jsonTemp = {player_id : newSystemInfos[pos].playerId,
                                teamkey : ptreStoredTK,
                                timestamp_ig : additionnalSSInfos[pos].timestamp_ig,
                                id : newSystemInfos[pos].planetId,
                                coords : galaxy+":"+system+":"+pos,
                                galaxy : Number(galaxy),
                                system : Number(system),
                                position : pos,
                                name: additionnalSSInfos[pos].playerName,
                                old_player_id: previousSystem[pos].playerId,
                                old_name: "",
                                status: additionnalSSInfos[pos].playerStatus,
                                rank: additionnalSSInfos[pos].playerRank,
                                moon : jsonLuneG};
                //console.log(jsonTemp);
                newSystemToPush.push(jsonTemp);
            }
        }
    }

    // If change were detected
    if (updatedPositions > 0) {
        // Save current System to storage
        updateSystemV2(galaxy, system, newSystemInfos);
        // Push to PTRE
        var jsonSystem = '{';
        $.each(newSystemToPush, function(nb, jsonPos){
            jsonSystem += '"'+jsonPos.coords+'":'+JSON.stringify(jsonPos)+',';
            //consoleDebug(jsonSystem);
        });
        jsonSystem = jsonSystem.substr(0,jsonSystem.length-1);
        jsonSystem += '}';
        // Send to PTRE
        $.ajax({
            url : urlPTREPushGalaUpdate,
            type : 'POST',
            data: jsonSystem,
            cache: false,
            success : function(reponse){
                let reponseDecode = jQuery.parseJSON(reponse);
                if (reponseDecode.code == 1) {
                    consoleDebug("[GALAXY] [FROM PTRE]" + reponseDecode.message);
                    // If we saw real events (confirmed by PTRE)
                    if (reponseDecode.event_count > 0) {
                        // Update counter indicator
                        ptreGalaxyEventCount += reponseDecode.event_count;
                        if (document.getElementById('ptreGalaxyEventCount')) {
                            document.getElementById('ptreGalaxyEventCount').innerHTML = ptreGalaxyEventCount;
                        }
                        // Display message at the bottom of the galaxy
                        displayGalaxyMiniMessage(reponseDecode.message);
                        // Highlight galaxy events!!!
                        let updated = 0;
                        let list = GM_getValue(ptreGalaxyEventsPos, []);
                        reponseDecode.event_array.forEach(function(elem) {
                            //consoleDebug("[GALAXY] Event at " + elem);
                            // Update galaxy icon
                            const btnTmp = document.getElementById('ptreActionPos-'+elem);
                            if (btnTmp) {
                                btnTmp.style.border = ptreBorderStyleGalaxyEvent;
                            }
                            // Add to LOCAL list of events
                            if (!list.includes(elem)) {
                                list.push(elem);
                                updated++;
                            }
                        });
                        // Store new list
                        if (updated > 0) {
                            GM_setValue(ptreGalaxyEventsPos, list);
                            consoleDebug("[GALAXY] Galaxy Events list updated");
                        }
                    }
                } else {
                    // Something went wrong
                    displayGalaxyMiniMessage(reponseDecode.message);
                    displayPTREPopUpMessage(reponseDecode.message);
                    addToLogs(reponseDecode.message);
                }
            }
        });
        consoleDebug('[GALAXY] [' + galaxy + ':' + system + '] Pushing ' + updatedPositions + ' Galaxy updates to PTRE');
    }
}

function processPlayerActivities(galaxy, system, activityTab) {
    const ptreStoredTK = GM_getValue(ptreTeamKey, '');

    if (ptreStoredTK == '') {
        return;
    }
    // Send to PTRE
    $.ajax({
        url : urlPTREPushActivity,
        type : 'POST',
        data: JSON.stringify(activityTab),
        cache: false,
        success : function(reponse){
            var reponseDecode = jQuery.parseJSON(reponse);
            consoleDebug("[GALAXY] [FROM PTRE]" + reponseDecode.message);
            displayGalaxyMiniMessage(reponseDecode.message);
            if (reponseDecode.code == 1) {
                ptreGalaxyActivityCount = ptreGalaxyActivityCount + reponseDecode.activity_count;
                if (document.getElementById('ptreGalaxyActivityCount')) {
                    document.getElementById('ptreGalaxyActivityCount').innerHTML = ptreGalaxyActivityCount;
                }
            } else {
                displayPTREPopUpMessage(reponseDecode.message);
                addToLogs(reponseDecode.message);
            }
        }
    });
    consoleDebug('[GALAXY] [' + galaxy + ':' + system + '] Pushing Activities to PTRE');
}

// This function calls PTRE backend to get player informations
// And sends results to Info Box
function getPlayerInfos(playerID, pseudo) {
    const TKey = GM_getValue(ptreTeamKey, '');
    if (TKey != '') {
        setupInfoBox("Player " + pseudo);
        var content = '<center><div id="backToTargetsList" class="button btn_blue">BACK TO TARGETS LIST</div><br><br>';
        $.ajax({
            dataType: "json",
            url: urlPTREGetPlayerInfos + '&team_key=' + TKey + '&player_id=' + playerID + '&pseudo=' + pseudo + '&noacti=yes',
            success: function(reponse) {
                if (reponse.code == 1) {
                    content+= '<table width="90%"><tr><td class="td_ship" align="center"><div class="ptreSubTitle">' + pseudo + '</div></td><td class="td_ship" align="center"><div class="ptreSubTitle">' + setNumber(reponse.top_sr_fleet_points) + ' fleet points</div></td></tr>';
                    content+= '<tr><td class="td_ship" align="center">[<a href="' + buildPTRELinkToPlayer(playerID) + '" target="_blank">PROFILE</a>]</td><td class="td_ship" align="center">[<a href="' + reponse.top_sr_link + '" target="_blank">BEST REPORT</a>]</td></tr>';
                    content+= '<tr><td class="td_ship" colspan="2"><hr></td></tr>';
                    reponse.fleet_json.forEach(function(item, index, object) {
                        content+= '<tr><td class="td_ship" align="center"><span class="ptre_ship ptre_ship_' + item.ship_type + '"></td><td class="td_ship" align="center"></span><span class="ptreBold">' + setNumber(item.count) + '</span></td></tr>';
                    });
                    content+= '</table>';
                } else {
                    content+= '<span class="ptreError">' + reponse.message + '</span>';
                    addToLogs(reponse.message);
                }
                content+= '</center>';
                document.getElementById('infoBoxContent').innerHTML = content;
                if (document.getElementById('backToTargetsList')) {
                    document.getElementById('backToTargetsList').addEventListener("click", function (event) {
                        displayTargetsList();
                    });
                }
            }
        });
    } else {
        displayPTREPopUpMessage(ptreMissingTKMessage);
        document.getElementById('infoBoxContent').innerHTML = ptreMissingTKMessage;
    }
}

function updateGalaxyBoxWithEventsAndPlayerNote(playerId, galaxy, system, pos) {
    const TKey = GM_getValue(ptreTeamKey, '');
    if (TKey != '') {
        // Check if Galaxy Box is still waiting the infos
        if (document.getElementById("ptreGalaxyPlayerNoteStatus-" + playerId) || document.getElementById("ptreGalaxyPosEvent-" + galaxy + ":" + system + ":" + pos)) {
            consoleDebug("Getting Player notes");
            if (document.getElementById("ptreGalaxyPlayerNoteStatus-" + playerId)) {
                document.getElementById("ptreGalaxyPlayerNoteStatus-" + playerId).innerHTML = "Loading note...";
            }
            if (document.getElementById("ptreGalaxyPosEvent-" + galaxy + ":" + system + ":" + pos)) {
                document.getElementById("ptreGalaxyPosEvent-" + galaxy + ":" + system + ":" + pos).value = "Loading events...";
            }
            $.ajax({
                url: urlPTREIngamePopUp + "&team_key=" + TKey + "&action=get&player_id=" + playerId + "&galaxy=" + galaxy + "&system=" + system + "&pos=" + pos,
                type: 'POST',
                success: function (reponse) {
                    var reponseDecode = jQuery.parseJSON(reponse);
                    consoleDebug(reponseDecode.message);
                    if (reponseDecode.code == 1) {
                        // Message
                        if (document.getElementById("ptreGalaxyPlayerNoteStatus-" + playerId)) {
                            document.getElementById("ptreGalaxyPlayerNoteStatus-" + playerId).innerHTML = reponseDecode.message;
                        }
                        // Update note content
                        if (document.getElementById("ptreGalaxyPlayerNote-" + playerId)) {
                            document.getElementById("ptreGalaxyPlayerNote-" + playerId).value = reponseDecode.note;
                        }
                        // Galaxy event
                        if (document.getElementById("ptreGalaxyPosEvent-" + galaxy + ":" + system + ":" + pos)) {
                            document.getElementById("ptreGalaxyPosEvent-" + galaxy + ":" + system + ":" + pos).innerHTML = atob(reponseDecode.event);
                        }
                    }
                },
            });
        }
    }
}

function pushPlayerNote(playerId) {
    const TKey = GM_getValue(ptreTeamKey, '');
    if (TKey != '') {
        if (document.getElementById("ptreGalaxyPlayerNote-" + playerId)) {
            if (document.getElementById("ptreGalaxyPlayerNoteStatus-" + playerId)) {
                document.getElementById("ptreGalaxyPlayerNoteStatus-" + playerId).innerHTML = "Saving note...";
            }
            const note = $("#ptreGalaxyPlayerNote-" + playerId).val();
            consoleDebug("Saving note for " + playerId);
            $.ajax({
                url: urlPTREIngamePopUp + "&team_key=" + TKey + "&action=set&player_id=" + playerId,
                type: 'POST',
                data: {
                    note: note
                },
                success: function (reponse) {
                    var reponseDecode = jQuery.parseJSON(reponse);
                    consoleDebug(reponseDecode.message);
                    if (document.getElementById("ptreGalaxyPlayerNoteStatus-" + playerId)) {
                        document.getElementById("ptreGalaxyPlayerNoteStatus-" + playerId).innerHTML = reponseDecode.message;
                    }
                },
            });
        }
    }
}

// Get ranks
function updateGalaxyBoxWithPlayerRanks(playerId) {
    const TKey = GM_getValue(ptreTeamKey, '');
    if (TKey != '') {
        // Check if Galaxy Box is still waiting the infos
        if (!document.getElementById("ptreGalaxyPlayerRanksPlaceholder-" + playerId)) {
            consoleDebug("Rank update canceled");
            return;
        }
        if (document.getElementById("ptreGalaxyPlayerRanksPopUp")) {
            document.getElementById("ptreGalaxyPlayerRanksPopUp").innerHTML = "Loading ranks...";
        }
        $.ajax({
            url : urlPTREGetRanks + "&team_key=" + TKey + "&player_id=" + playerId,
            type : 'POST',
            cache: false,
            success : function(reponse){
                var reponseDecode = jQuery.parseJSON(reponse);
                consoleDebug(reponseDecode.message);
                displayGalaxyMiniMessage(reponseDecode.message);
                if (reponseDecode.code == 1) {
                    if (document.getElementById("ptreGalaxyPlayerRanksPopUp")) {
                        document.getElementById("ptreGalaxyPlayerRanksPopUp").innerHTML = "Processing ranks...";
                        var content = '<table><tr><td class="td_cell_radius_0" align="center">Date</td><td class="td_cell_radius_0" align="center">Points</td><td class="td_cell_radius_0" align="center">Points diff</td><td class="td_cell_radius_0" align="center">Global rank</td></tr>';
                        $.each(reponseDecode.ranks_array, function(i, rank) {
                            const previousRank = reponseDecode.ranks_array[i + 1];
                            var classR = "";
                            var diff = "-";
                            if (previousRank) {
                                if (Number(rank.total_score) < Number(previousRank.total_score)) {
                                    classR = "ptreError";
                                    diff = setNumber(Number(rank.total_score) - Number(previousRank.total_score));
                                } else if (Number(rank.total_score) > Number(previousRank.total_score)) {
                                    classR = "ptreSuccess";
                                    diff = setNumber(Number(rank.total_score) - Number(previousRank.total_score));
                                    diff = "+" + diff;
                                }
                            }
                            var when = "";
                            if (i == 0) {
                                when = "at midnight";
                            } else {
                                when = i + " days ago";
                            }
                            content+= '<tr><td class="td_cell_radius_1" align="center">' + when + '</td><td class="td_cell_radius_1" align="center">' + setNumber(rank.total_score) + ' pts</td><td class="td_cell_radius_1" align="center"><span class="' + classR + '">' + diff + '</span></td><td class="td_cell_radius_1" align="center">#' + rank.total_rank + '</td></tr>';
                        });
                        content+= '</table>';
                        document.getElementById("ptreGalaxyPlayerRanksPopUp").innerHTML = content;
                    }
                } else {
                    if (document.getElementById("ptreGalaxyPlayerRanksPopUp")) {
                        document.getElementById("ptreGalaxyPlayerRanksPopUp").innerHTML = reponseDecode.message;
                    }
                    addToLogs(reponseDecode.message);
                }
            }
        });
    } else {
        displayPTREPopUpMessage(ptreMissingTKMessage);
    }
}

// This function fetchs closest friend phalanx
function getPhalanxInfosFromGala() {
    const currentTime = Math.floor(serverTime.getTime() / 1000);
    var warning = '';
    var systemElem = $("input#system_input")[0];
    var galaxyElem = $("input#galaxy_input")[0];
    var galaxy = galaxyElem.value;
    var system = systemElem.value;
    displayGalaxyMessageContent("Loading info for " + galaxy + ":" + system + " ...");
    const teamKey = GM_getValue(ptreTeamKey, '');

    if (teamKey == '') {
        displayGalaxyMessageContent('<span class="ptreError">' + ptreMissingTKMessage + '</span>');
        return -1;
    }

    // Buddies List warnings
    var dataJSON = '';
    if (GM_getValue(ptreAddBuddiesToFriendsAndPhalanx, 'true') == 'true') {
        dataJSON = GM_getValue(ptreBuddiesList, '');
        if (dataJSON != '') {
            if ((currentTime - GM_getValue(ptreBuddiesListLastRefresh, 0)) > 7*24*60*60) {
                warning = '<span class="ptreWarning">Buddies list might be outdated: </span> <a href="/game/index.php?page=ingame&component=buddies">Visit buddies page to update your friends list</a><br><br>';
            }
        } else {
            warning = '<span class="ptreWarning">Buddies list is empty: </span> <a href="/game/index.php?page=ingame&component=buddies">Visit buddies page to add your friends to this view</a><br><br>';
        }
    } else {
        warning = '<span class="ptreWarning">Buddies list is not managed: you may enable it in EasyPTRE settings</span><br><br>';
    }

    $.ajax({
        url : urlPTREGetPhalanxInfos + '&team_key=' + teamKey + '&galaxy=' + galaxy + '&system=' + system,
        type : 'POST',
        data: dataJSON,
        cache: false,
        success : function(reponse){
            var reponseDecode = jQuery.parseJSON(reponse);
            var message = atob(reponseDecode.message);
            if (reponseDecode.code != 1) {
                addToLogs(reponseDecode.message_debug);
            }
            displayGalaxyMessageContent(warning+message);
        }
    });
}

// This function fetchs Galaxy Event Explorer infos
function getGEEInfosFromGala() {
    var systemElem = $("input#system_input")[0];
    var galaxyElem = $("input#galaxy_input")[0];
    var galaxy = galaxyElem.value;
    var system = systemElem.value;
    displayGalaxyMessageContent("Loading info for " + galaxy + ":" + system + " ...");
    const teamKey = GM_getValue(ptreTeamKey, '');
    if (teamKey == '') {
        displayGalaxyMessageContent('<span class="ptreError">' + ptreMissingTKMessage + '</span>');
        return -1;
    }
    $.ajax({
        url : urlPTREGetGEEInfos + '&team_key=' + teamKey + '&galaxy=' + galaxy + '&system=' + system,
        type : 'POST',
        data: null,
        cache: false,
        success : function(reponse){
            var reponseDecode = jQuery.parseJSON(reponse);
            var message = atob(reponseDecode.message);
            if (reponseDecode.code != 1) {
                addToLogs(reponseDecode.message_debug);
            }
            displayGalaxyMessageContent(message);
        }
    });
}

// This function sends commun data to Team
// Like:
// - Phalanx levels
function syncDataWithPTRE(mode = "auto") {
    const currentTime = Math.floor(serverTime.getTime() / 1000);
    console.log("[EasyPTRE] Syncing data "+currentTime);
    const hot_ts_max = currentTime + 24*3600;
    const teamKey = GM_getValue(ptreTeamKey, "notk");
    var addParams = "";

    if (mode == "auto") {
        addParams+= "&mode=a";
    }
    const betaMode = GM_getValue(ptreEnableBetaMode, 'false');
    if (betaMode == "true") {
        addParams+= "&beta=1";
    }

    // Push data to PTRE
    var dataJSON = GM_getValue(ptreDataToSync, '');
    $.ajax({
        url : urlPTRESyncData + '&team_key=' + teamKey + '&cooldown=' + GM_getValue(ptreCheckForUpdateCooldown, 0) + addParams,
        type : 'POST',
        data: dataJSON,
        cache: false,
        success : function(reponse){
            var reponseDecode = jQuery.parseJSON(reponse);
            if (reponseDecode.code == 1) {
                consoleDebug("Received data from TS "+reponseDecode.timestamp);
                GM_setValue(ptreTeamName, reponseDecode.team_name);
                // Update highlighted players received from PTRE
                //var temp = JSON.parse(JSON.stringify(reponseDecode.player_highlight_array));
                GM_deleteValue(ptreHighlightedPlayers);
                var temp = reponseDecode.player_highlight_array;
                Object.keys(temp).forEach(i => {
                    if (temp[i].ts && temp[i].ts > 0) {
                        temp[i].ts += currentTime;
                    }
                });
                GM_setValue(ptreHighlightedPlayers, temp);

                // Update Galaxy Events positions received from PTRE
                const galaxyEventsList = JSON.parse(JSON.stringify(reponseDecode.galaxy_events_array));
                GM_setValue(ptreGalaxyEventsPos, galaxyEventsList);

                // Update configuration
                updateLiveCheckConfig(reponseDecode.check_for_update_cooldown, reponseDecode.last_update_ts);
                GM_setValue(ptreLastDataSync, currentTime);
                GM_setValue(ptreLastUpdateCheck, currentTime);

                consoleDebug('[EasyPTRE] ' + reponseDecode.message);

                // Update info in menu
                if (document.getElementById("ptreLastDataSyncField")) {
                    document.getElementById("ptreLastDataSyncField").innerHTML = getLastUpdateLabel(currentTime);
                }
            } else {
                addToLogs(reponseDecode.message_debug);
            }
            if (mode == 'manual') {
                displayMessageInSettings(reponseDecode.message_debug);
            }
        }
    });
}

// Action: Sync targets
function syncTargets(mode) {
    const currentTime = Math.floor(serverTime.getTime() / 1000);
    const ptreStoredTK = GM_getValue(ptreTeamKey, '');
    var AGRJSON = GM_getValue(ptreAGRPlayerListJSON, '');
    var PTREJSON = GM_getValue(ptrePTREPlayerListJSON, '');
    var targetList = [];
    var targetListTemp;
    var player;
    var nb_private = 0;

    if (ptreStoredTK == '') {
        displayPTREPopUpMessage(ptreMissingTKMessage);
        return -1;
    }

    // Create full target list
    if (AGRJSON != '' && PTREJSON != '') {
        targetListTemp = JSON.parse(AGRJSON);
        var targetListPTRE = JSON.parse(PTREJSON);
        targetListTemp = targetListTemp.concat(targetListPTRE);
    } else if (AGRJSON != '') {
        targetListTemp = JSON.parse(AGRJSON);
    } else if (PTREJSON != '') {
        targetListTemp = JSON.parse(PTREJSON);
    } else {
        targetListTemp = [];
    }

    // Remove private targets from list
    targetListTemp.forEach(function(item, index, object) {
        //consoleDebug(item.id + ' ' + item.pseudo);
        if (isTargetPrivate(item.id)) {
            //consoleDebug("Ignoring " + item.pseudo);
            nb_private++;
        } else {
            player = {id: item.id, pseudo: item.pseudo};
            targetList.push(player);
        }
    });

    // Sync to PTRE
    $.ajax({
        url : urlPTRESyncTargets + '&version=' + GM_info.script.version + '&team_key=' + ptreStoredTK,
        type : 'POST',
        data: JSON.stringify(targetList),
        cache: false,
        success : function(reponse){
            var reponseDecode = jQuery.parseJSON(reponse);
            if (reponseDecode.code == 1) {
                var count = 0;
                var newTargetList = JSON.parse(JSON.stringify(reponseDecode.targets_array));
                $.each(newTargetList, function(i, incomingPlayer) {
                    if (!isPlayerInLists(incomingPlayer.player_id)) {
                        addPlayerToList(incomingPlayer.player_id, incomingPlayer.pseudo, 'PTRE');
                        count++;
                    }
                });
                if (mode == "manual") {
                    displayMessageInSettings(nb_private + ' private targets ignored. ' + reponseDecode.message + ' ' + count + ' new targets added.');
                }
                GM_setValue(ptreLastTargetsSync, currentTime);
                if (document.getElementById("ptreLastTargetsSyncField")) {
                    document.getElementById("ptreLastTargetsSyncField").innerHTML = getLastUpdateLabel(currentTime);
                }
                // Refresh targets list if displayed
                if (document.getElementById('targetsListDiv')) {
                    displayTargetsList();
                }
            } else {
                displayMessageInSettings(reponseDecode.message);
                addToLogs(reponseDecode.message);
            }
        }
    });
}

