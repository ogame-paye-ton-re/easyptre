// ****************************************
// IMPROVE VIEWS
// ****************************************

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

    const start = performance.now();
    const currentMiliTime = serverTime.getTime();
    const currentTime = Math.floor(currentMiliTime / 1000);

    consoleDebug("[GALAXY] Improving Galaxy Table " + galaxy + ":" + system);
    cleanGalaxyMiniMessage();

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
            //TODO: GET additionnalSSInfos[pos].playerStatus
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
                const cellPlayerName = row.querySelector('.cellPlayerName');
                if (cellPlayerName) {
                    const playerSpan = cellPlayerName.querySelector('span[rel^="player"]');
                    if (playerSpan) {
                        // Player ID
                        const rel = playerSpan.getAttribute('rel');
                        newSystemToStore[pos].playerId = Number(rel.replace(/\D/g, ''));
                        // Player rank
                        additionnalSSInfos[pos].playerRank = Number(document.getElementById(playerSpan.getAttribute('rel'))?.querySelector('li.rank a')?.textContent);
                        // Player name
                        const playerSpanName = row.querySelector('.galaxyCell .playerName.tooltipRel');
                        additionnalSSInfos[pos].playerName = playerSpanName.childNodes[0].textContent.trim();
                    } else if (cellPlayerName.querySelector('.ownPlayerRow')) {
                        // This is OUR row. No playerID is provided, we replace it.
                        newSystemToStore[pos].playerId = Number(currentPlayerID);
                        additionnalSSInfos[pos].playerName = currentPlayerName;
                        // TODO: add own rank
                    }
                }
            }

            // Check if an event already exists for this position
            // We are comparing to already saved events from PTRE DB (saved in local)
            let galaEventDetected = false;
            if (galaEventsList.includes(galaxy+":"+system+":"+pos)) {
                galaEventDetected = true;
            }
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
                // Display button only if settings allow it
                if (ptreDisplayGalaPopup === true) {
                    btn.innerHTML = '<a class="tooltip" title="PTRE actions"><img id="ptreActionPos-' + galaxy + ":" + system + ":" + pos + '" style="cursor:pointer;" class="mouseSwitch" src="' + imgPTREOK + '" height="16" width="16"></a>';
                    cellPlayerName.appendChild(btn);
                    // Add action
                    btn.addEventListener('click', function () {
                        //openPTREGalaxyActions(this.dataset.galaxy, this.dataset.system, this.dataset.pos);
                        openPTREGalaxyActions(this.dataset.galaxy, this.dataset.system, this.dataset.pos, this.dataset.playerId, this.dataset.playerName);
                    });
                }
            }

            // Get activities infos
            if (ptrePushActivities === true) {
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

// To run on all pages
function improvePageAny() {
    console.log("[EasyPTRE] Improving Any Page");
    if (isAGREnabled() && !isOGLorOGIEnabled()) {
        if (document.getElementById('ago_panel_Player')) {
            let observer2 = new MutationObserver(updateLocalAGRList);
            var node2 = document.getElementById('ago_panel_Player');
            observer2.observe(node2, {
                attributes: true,
                childList: true, // observer les enfants directs
                subtree: true, // et les descendants aussi
                characterDataOldValue: true // transmettre les anciennes données au callback
            });
        }
        if (document.getElementById('ago_box_title')) {
            // Add PTRE link to AGR pinned player
            addPTRELinkToAGRPinnedTarget();
            // Check if pinned player is updated
            let observer = new MutationObserver(addPTRELinkToAGRPinnedTarget);
            var node = document.getElementById('ago_box_title');
            observer.observe(node, {
                attributes: true,
                childList: true, // observer les enfants directs
                subtree: true, // et les descendants aussi
                characterDataOldValue: true // transmettre les anciennes données au callback
            });
        }
    }
}

// Add PTRE buttons to messages page
function improvePageMessages() {
    console.log("[EasyPTRE] Improving Messages Page");
    if (!isOGLorOGIEnabled() && !isOGLorOGIEnabled()) {
        if (GM_getValue(ptreTeamKey) != '') {
            // Update Message Page (spy report part)
            setTimeout(addPTREStuffsToMessagesPage, 1000);
            // Update AGR Spy Table
            if (isAGREnabled() && (GM_getValue(ptreImproveAGRSpyTable, 'true') == 'true')) {
                let spyTableObserver = new MutationObserver(improveAGRSpyTable);
                var nodeSpyTable = document.getElementById('messagecontainercomponent');
                spyTableObserver.observe(nodeSpyTable, {
                    attributes: true,
                    childList: true, // observer les enfants directs
                    subtree: true, // et les descendants aussi
                });
            }
        }
    }
}

/*
    Called when Galaxy page is displayed
    - add PTRE TOOLBAR at the bottom of the page
    - setup the wait for the galaxy to be displayed
*/
function improvePageGalaxy() {
    console.log("[EasyPTRE] Improving Galaxy Page");
    const minerMode = GM_getValue(ptreEnableMinerMode, 'false');
    const betaMode = GM_getValue(ptreEnableBetaMode, 'false');
    let toolComment = "";

    // Update status once for the gala browsing session
    if (isAGREnabled()) {
        toolComment+= " - AGR detected";
    }
    if (isOGLorOGIEnabled()) {
        ptreSendGalaEvents = false;
        ptrePushActivities = false;
        toolComment+= " - OGL/OGI detected";
    }
    //TODO: remove after Beta
    if (betaMode == 'true') {
        ptreDisplayGalaPopup = true;
    }

    // Prepare galaxy check and update
    waitForGalaxyToBeLoaded();

    if (minerMode == 'false') {
        // Add PTRE Toolbar (not if miner mode)
        //TODO:   a udatder quand la fct AGR passe
        var tempContent = '<table width="100%"><tr>';
        tempContent+= '<td><div class="ptreBoxTitle">EasyPTRE<br>TOOLBAR</div></td>';
        tempContent+= '<td><div id="ptreGalaxyPhalanxButton" type="button" class="button btn_blue">FRIENDS & PHALANX</div> <div id="ptreGalaxyGEEButton" type="button" class="button btn_blue">GALAXY EVENTS</div></td>';
        tempContent+= '<td align="right">Activities: <span id="ptreGalaxyActivityCount" class="ptreSuccess">';
        if (ptrePushActivities === true) {
            tempContent+= '<a class="tooltip ptreSuccess" title="Sent by EasyPTRE">yes</a>';
        } else {
            tempContent+= '<a class="tooltip ptreWarning" title="Sent by OGL/OGI">no</a>';
        }
        tempContent+= '</span> | Galaxy Events: <span id="ptreGalaxyEventCount" class="ptreSuccess">';
        if (ptreSendGalaEvents === true) {
            tempContent+= '<a class="tooltip ptreSuccess" title="Sent by EasyPTRE">yes</a>';
        } else {
            tempContent+= '<a class="tooltip ptreWarning" title="Sent by OGL/OGI">no</a>';
        }
        tempContent+= '</span>';
        tempContent+= '</td></tr><tr><td valign="top" colspan="3"><hr></td></tr>';
        tempContent+= '<tr><td valign="top" colspan="3"><div id="ptreGalaxyMessageBoxContent"></div></td></tr>';
        tempContent+= '<tr><td valign="top" colspan="3"><hr></td></tr><tr><td colspan="3"><div class="ptreSmall">BetaMode: ' + betaMode + ' - MinerMode: ' + minerMode + toolComment;
        if (ptrePushActivities === true) {
            tempContent+= ' - Targets: <span id="ptreTrackedPlayerCount" class="ptreSuccess">?</span>';
        }
        tempContent+= '</div></td></tr></table>';

        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = tempContent;
        tempDiv.id = 'ptreGalaxyToolBar';
        if (document.getElementsByClassName("galaxyTable")) {
            document.getElementsByClassName("galaxyTable")[0].appendChild(tempDiv);
        }
        if (document.getElementById('ptreGalaxyPhalanxButton')) {
            document.getElementById('ptreGalaxyPhalanxButton').addEventListener("click", function (event) {
                getPhalanxInfosFromGala();
            });
        }
        if (document.getElementById('ptreGalaxyGEEButton')) {
            document.getElementById('ptreGalaxyGEEButton').addEventListener("click", function (event) {
                getGEEInfosFromGala();
            });
        }
    }
}

// Save lifeforms researchs
// Save JSON "API 2" from fleet page
function improvePageFleet() {
    console.log("[EasyPTRE] Improving Fleet Page");
    var currentTime = Math.floor(serverTime.getTime() / 1000);
    if (currentTime > GM_getValue(ptreLastTechnosRefresh, 0) + technosCheckTimeout) {
        var spanElement = document.querySelector('.show_fleet_apikey');
        var tooltipContent = spanElement.getAttribute('data-tooltip-title');
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = tooltipContent;
        var inputElements = tempDiv.querySelectorAll('input');
        var secondInputElement = inputElements[1];
        var techJSON = secondInputElement ? secondInputElement.value : null;
        if (techJSON != null) {
            //techList = JSON.parse(techJSON);
            GM_setValue(ptreTechnosJSON, techJSON);
            var tempMessage = 'Saving Lifeforms researches: <a href="https://ptre.chez.gg/?page=lifeforms_researchs" target="_blank">Display on PTRE</a>';
            displayPTREPopUpMessage(tempMessage);
            // Update last check TS
            GM_setValue(ptreLastTechnosRefresh, currentTime);
            if (document.getElementById("ptreLastTechnosRefreshField")) {
                document.getElementById("ptreLastTechnosRefreshField").innerHTML = getLastUpdateLabel(currentTime);
            }
        } else {
            console.log("[EasyPTRE] Cant find Techs!");
        }
    }
}

// Update Phalanx data
function improvePageFacilities() {
    console.log("[EasyPTRE] Improving Facilities Page");
    if (document.getElementById('technologies')) {
        const technologiesDiv = document.getElementById('technologies');
        if (technologiesDiv.querySelector('li.sensorPhalanx')) {
            const sensorPhalanxLi = technologiesDiv.querySelector('li.sensorPhalanx');
            const levelSpan = sensorPhalanxLi.querySelector('span.level');
            var phalanx_level = levelSpan.getAttribute('data-value');
            var coords = document.getElementsByName('ogame-planet-coordinates')[0].content;
            var moonID = document.getElementsByName('ogame-planet-id')[0].content;
            consoleDebug(coords + ': Found Phalanx level '+phalanx_level);

            //var moon = {type: "moon", id: coords, val: {pha_lvl: phalanx_level, toto: "titi", tata: "tutu"}};
            var phalanx = {type: "phalanx", id: moonID, coords: coords, val: phalanx_level};
            addDataToPTREData(phalanx);
        }
    } else {
        consoleDebug("Cant find technologies element");
    }
}

// Parse Buddies page
function improvePageBuddies() {
    console.log("[EasyPTRE] Improving Buddies Page");
    const currentTime = Math.floor(serverTime.getTime() / 1000);
    const playerLinks = document.querySelectorAll('a[data-playerid]');
    const playerIds = Array.from(playerLinks).map(link => link.getAttribute('data-playerid'));
    consoleDebug(playerIds);
    const dataJSON = JSON.stringify(playerIds);
    GM_setValue(ptreBuddiesList, dataJSON);
    GM_setValue(ptreBuddiesListLastRefresh, currentTime);
    displayPTREPopUpMessage('Saving buddies list (for Friends & Phalanx)');
}

// This function adds PTRE link to AGR pinned target
function addPTRELinkToAGRPinnedTarget() {
    if (document.getElementById('ago_box_title')) {
        var pseudoAGR = document.getElementById('ago_box_title').innerHTML;
        updateLocalAGRList();
        var playerID = getAGRPlayerIDFromPseudo(pseudoAGR);
        if (playerID != 0) {
            document.getElementById('ago_box_title').innerHTML = pseudoAGR + ' [<a href="' + buildPTRELinkToPlayer(playerID) + '" target="_blank">PTRE</a>]';
        }
    }
}

// This function adds PTRE send SR button to AGR Spy Table
function improveAGRSpyTable(mutationList, observer) {
    if (document.getElementById('agoSpyReportOverview')) {
        // Stop observer
        observer.disconnect();
        var TKey = GM_getValue(ptreTeamKey, '');
        if (TKey != '') {
            console.log("[EasyPTRE] Updating AGR Spy Table");
            var table = document.getElementsByClassName("ago_reports")[0];
            for (var i = 0, row; row = table.rows[i]; i++) {
                var nbCol = row.cells.length;
                if (row.cells[0].tagName == "TD") {
                    var rowCurrent = table.getElementsByTagName("tr")[i];
                    var messageID = rowCurrent.id.slice(2);
                    if (document.getElementById("m"+messageID)) {
                        // Find API Key in page
                        var apiKeyRE;
                        var rawMessageData = document.querySelector('div.msg[data-msg-id="' + messageID + '"] .rawMessageData');
                        if (rawMessageData) {
                            // Obtenir la valeur de data-raw-hashcode
                            apiKeyRE = rawMessageData.getAttribute('data-raw-hashcode');
                        }
                        var tdAGRButtons = rowCurrent.getElementsByTagName("td")[nbCol-1];
                        tdAGRButtons.style.width = "110px";
                        // Create PTRE button
                        var PTREbutton = document.createElement('a');
                        PTREbutton.style.cursor = 'pointer';
                        PTREbutton.className = "spyTableIcon icon_galaxy mouseSwitch";
                        PTREbutton.id = "sendSRFromAGRTable-" + apiKeyRE;
                        PTREbutton.setAttribute('apikey', apiKeyRE);
                        PTREbutton.innerHTML = "P";
                        tdAGRButtons.append(PTREbutton);
                        // Add event to button
                        document.getElementById('sendSRFromAGRTable-' + apiKeyRE).addEventListener("click", function (event) {
                            apiKeyRE = this.getAttribute("apikey");
                            var urlPTRESpy = urlPTREImportSR + '&team_key=' + TKey + '&sr_id=' + apiKeyRE;
                            $.ajax({
                                dataType: "json",
                                url: urlPTRESpy,
                                success: function(reponse) {
                                    if (reponse.code == 1) {
                                        document.getElementById('sendSRFromAGRTable-'+apiKeyRE).remove();
                                    } else {
                                        addToLogs(reponse.message_verbose);
                                    }
                                    displayPTREPopUpMessage(reponse.message_verbose);
                                }
                            });
                        });
                    } else {
                        console.log("[EasyPTRE] Error. Cant find data element: m" + messageID);
                    }
                }
            }
        } else {
            displayPTREPopUpMessage(ptreMissingTKMessage);
        }
    }
}

// Add PTRE button to spy reports
function addPTREStuffsToMessagesPage() {

    // Add PTRE button to messages
    var TKey = GM_getValue(ptreTeamKey, '');
    if (TKey != '') {
        if (document.getElementsByClassName('messagesHolder')[0]) {
            var maxCounterSpyTsSeen = GM_getValue(ptreMaxCounterSpyTsSeen, 0);
            var maxCounterSpyTsSeenNow = 0;
            var tabActiPos = [];
            var messages = document.getElementsByClassName('msgWithFilter');
            Array.prototype.forEach.call(messages, function(current_message) {
                var apiKeyRE = "";

                var messageID = current_message.getAttributeNode("data-msg-id").value;
                var rawMessageData = document.querySelector('div.msg[data-msg-id="' + messageID + '"] .rawMessageData');
                if (rawMessageData) {
                    // Obtenir la valeur de data-raw-hashcode
                    apiKeyRE = rawMessageData.getAttribute('data-raw-hashcode');
                    if (currentPlayerID !== rawMessageData.getAttribute('data-raw-targetplayerid')) {
                        // This is a Spy Report
                        var spanBtnPTRE = document.createElement("span"); // Create new div
                        spanBtnPTRE.innerHTML = '<a class="tooltip" target="ptre" title="Send to PTRE"><img id="sendRE-' + apiKeyRE + '" apikey="' + apiKeyRE + '" style="cursor:pointer;" class="mouseSwitch" src="' + imgPTRE + '" height="26" width="26"></a>';
                        spanBtnPTRE.id = 'PTREspan';
                        current_message.getElementsByClassName("msg_actions")[0].getElementsByTagName("message-footer-actions")[0].appendChild(spanBtnPTRE);
                        document.getElementById('sendRE-' + apiKeyRE).addEventListener("click", function (event) {
                            var urlPTRESpy = urlPTREImportSR + '&team_key=' + TKey + '&sr_id=' + apiKeyRE;
                            $.ajax({
                                dataType: "json",
                                url: urlPTRESpy,
                                success: function(reponse) {
                                    console.log('[EasyPTRE] [FROM PTRE] ' + reponse);
                                    if (reponse.code == 1) {
                                        document.getElementById('sendRE-'+apiKeyRE).src = imgPTREOK;
                                    } else {
                                        document.getElementById('sendRE-'+apiKeyRE).src = imgPTREKO;
                                        addToLogs(reponse.message_verbose);
                                    }
                                    displayPTREPopUpMessage(reponse.message_verbose);
                                }
                            });
                        });
                    } else {
                        var planet_acti;
                        var jsonLune;
                        const message_ts = rawMessageData.dataset.rawTimestamp;
                        const spy_message_ts = message_ts * 1000;
                        var alreadySentLabel = "";

                        if (message_ts > maxCounterSpyTsSeen) {
                            if (message_ts > maxCounterSpyTsSeenNow) {
                                maxCounterSpyTsSeenNow = message_ts;
                            }
                            // Get Spy coords
                            var temp = current_message.getElementsByClassName("msgTitle")[0].innerHTML;
                            const regex = /\[(\d+):(\d+):(\d+)\]/;
                            var coords;
                            coords = temp.match(regex);
                            // Set both position as active
                            // TODO: [LOW] find a way to find out if planet or moon in text :(
                            planet_acti = "*";
                            jsonLune = {activity:"*"};
                            // Find Player ID
                            const tmpHTML = document.createElement('div');
                            tmpHTML.insertAdjacentHTML("afterbegin", current_message.querySelector("span.player").dataset.tooltipTitle);
                            const playerID = tmpHTML.querySelector("[data-playerId]").dataset.playerid;

                            // Send counter-spy messages
                            var jsonActiPos = {
                                messageID : messageID,
                                player_id : playerID,
                                teamkey : TKey,
                                coords : coords[1]+':'+coords[2]+':'+coords[3],
                                galaxy : coords[1],
                                system : coords[2],
                                position : coords[3],
                                main : false,
                                activity : planet_acti,
                                moon : jsonLune,
                                spy_message_ts: spy_message_ts
                            };
                            tabActiPos.push(jsonActiPos);
                        } else {
                            alreadySentLabel = " already";
                        }

                        // Add button
                        var spanBtnPTRE2 = document.createElement("span"); // Create new div
                        spanBtnPTRE2.innerHTML = '<a class="tooltip" target="ptre" title="Counter Spy' + alreadySentLabel + ' sent to PTRE"><img style="cursor:pointer;" class="mouseSwitch" src="' + imgPTREOK + '" height="26" width="26"></a>';
                        spanBtnPTRE2.id = 'PTREspan';
                        current_message.getElementsByClassName("msg_actions")[0].getElementsByTagName("message-footer-actions")[0].appendChild(spanBtnPTRE2);
                    }
                }
            });

            if (tabActiPos.length > 0){
                // Save New max TS to not re-send same counter spy messages
                GM_setValue(ptreMaxCounterSpyTsSeen, maxCounterSpyTsSeenNow);

                // Build JSON
                var jsonSystem = '{';
                $.each(tabActiPos, function(nb, jsonPos){
                    jsonSystem += '"'+jsonPos.coords+'-'+jsonPos.messageID+'":'+JSON.stringify(jsonPos)+',';
                });
                jsonSystem = jsonSystem.substr(0,jsonSystem.length-1);
                jsonSystem += '}';

                // Sent to PTRE
                $.ajax({
                    url : urlPTREPushActivity,
                    type : 'POST',
                    data: jsonSystem,
                    cache: false,
                    success : function(reponse){
                        var reponseDecode = jQuery.parseJSON(reponse);
                        displayPTREPopUpMessage(reponseDecode.message);
                        if (reponseDecode.code != 1) {
                            displayPTREPopUpMessage(reponseDecode.message);
                            addToLogs(reponseDecode.message);
                        }
                    }
                });
                console.log('[EasyPTRE] Pushing counter spy messages');
            }
        }
    }
}

// Called when user clicks on the PTRE icon in galaxy view
function openPTREGalaxyActions(galaxy, system, pos, playerId, playerName) {
    consoleDebug("Click on pos " + galaxy + ":" + system + ":" + pos);
    const currentTime = Math.floor(serverTime.getTime() / 1000);

    // Clean previous Galaxy box
    if (window.ptreGalaxyCleanup) {
        window.ptreGalaxyCleanup();
    }

    const button = document.getElementById('ptreActionPos-' + galaxy + ":" + system + ":" + pos);
    if (button) {
        var dnpButtonLabel = "DNP";
        var targetComment = "";

        // If it our player
        if (playerId == Number(currentPlayerID)) {
            targetComment+= '<span class="ptreSuccess">This is you, but you already know that, right?</span><br>';
        }

        // Lookup in galaxy events
        const galaEventsList = GM_getValue(ptreGalaxyEventsPos, []);
        if (galaEventsList.includes(galaxy+":"+system+":"+pos)) {
            targetComment+= '<span class="ptreWarning">This position has changed recently!</span><br>';
        }

        // Get players to highlight
        const highlightedPlayersList = GM_getValue(ptreHighlightedPlayers, {});
        if (highlightedPlayersList[playerId]) {
            if (highlightedPlayersList[playerId]["status"] == "dnp") {
                const duration = round((highlightedPlayersList[playerId]["ts"] - currentTime) / 60);
                targetComment+= '<span class="ptreError">Do Not Probe ' + playerName + ' for ' + duration + ' min</span><br>';
                dnpButtonLabel = "DNP (+)";
            } else if (highlightedPlayersList[playerId]["status"] == "hot") {
                targetComment+= '<span class="ptreSuccess">' + playerName + ' Recently spied and shared to PTRE</span><br>';
            }
        }

        // Create panel
        const panel = document.createElement('div');
        panel.id = 'ptreGalaxyPopUp';
        panel.innerHTML = `
            <table border="1" width="100%"><tr><td><div class="ptreBoxTitle">EasyPTRE Galaxy Box</div></td><td align="right"><div id="btnCloseGalaxyActions" type="button" class="button btn_blue">CLOSE</div></td></tr></table>
            <table border="1" width="100%">
            <tr>
                <td>
                    <hr>
                    <div id="ptreGalaxyActionsContent">
                        <div class="ptreCategoryTitle">Informations</div>
                        [` + galaxy + `:` + system + `:` + pos + `] - <b>` + playerName + `</b> - <a href="` + buildPTRELinkToPlayer(playerId) + `" target="_blank">PTRE Profile</a> - <a href="` + buildPTRELinkToAdvancedActivityTable(playerId) + `" target="_blank">Activity Table</a><br><br>
                        ` + targetComment + `
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <hr>
                    <div class="ptreCategoryTitle">New Galaxy Events</div>
                    <div id="ptreGalaxyPosEvent-` + galaxy + `:` + system + `:` + pos + `"></div><br>
                </td>
            </tr>`;
        if (playerId > 0) {
            panel.innerHTML+= `
            <tr>
                <td>
                    <hr>
                    <div class="ptreCategoryTitle">Actions</div>
                    <div id="btnGetPlayerInfos2`+playerId+`" type="button" class="button btn_blue">FLEET</div> <div id="btnManageList" type="button" class="button btn_blue">ADD TO LIST</div> <div id="synctTargetsWithPTREViaGalaxy" class="button btn_blue">SYNC TARGETS</div> <div id="btnDNP" type="button" class="button btn_blue">` + dnpButtonLabel + `</div>
                </td>
            </tr>
            <tr>
                <td>
                    <hr>
                    <div class="ptreCategoryTitle">Shared notes (shared with PTRE Team)</div>
                    <div id="ptreGalaxyPlayerNoteStatus-` + playerId + `"></div><br>
                    <textarea name="note" id="ptreGalaxyPlayerNote-` + playerId + `" rows="5" cols="50"></textarea><br>
                    <div id="savePlayerNote" type="button" class="button btn_blue">SAVE NOTE</div>
                </td>
            </tr>
            <tr>
                <td>
                    <hr>
                    <div class="ptreCategoryTitle">Points and Ranks, last days</div>
                    <div id="ptreGalaxyPlayerRanksPopUp"><div id="ptreGalaxyPlayerRanksPlaceholder-` + playerId + `">Highscores will be loaded after a 2 secs delay...</div></div>
                </td>
            </tr>`;
        } else {
            panel.innerHTML+= `
            <tr>
                <td>
                    <hr>
                    <div class="ptreCategoryTitle">Deep space</div>
                    Nothing here...
                </td>
            </tr>`;
        }
        panel.innerHTML+= `</table>`;

        // Position panel next to button
        const planetList = document.getElementById('planetList');
        const rect = planetList.getBoundingClientRect();
        panel.style.top = (window.scrollY + rect.top) + 'px';
        panel.style.left = (window.scrollX + rect.left) + 'px';
        document.body.appendChild(panel);

        // Close if we click outside the Div
        const cleanupGalaxyBox = () => {
            if (panel && panel.parentNode) {
                panel.parentNode.removeChild(panel);
            }
            document.removeEventListener('click', clickHandler);
            // If fleet menu was open
            if (document.getElementById('divPTREInfos')) {
                document.getElementById('divPTREInfos').parentNode.removeChild(document.getElementById('divPTREInfos'));
            }
        };
        const clickHandler = (event) => {
            if (!panel.contains(event.target) && event.target !== button) {
                cleanupGalaxyBox();
            }
        };
        document.addEventListener('click', clickHandler);
        window.ptreGalaxyCleanup = cleanupGalaxyBox;
        // Close button
        const closeBtn = document.getElementById('btnCloseGalaxyActions');
        if (closeBtn) {
            closeBtn.addEventListener("click", cleanupGalaxyBox);
        }

        if (playerId > 0) {
            // Target sync button
            if (document.getElementById('synctTargetsWithPTREViaGalaxy')) {
                document.getElementById('synctTargetsWithPTREViaGalaxy').addEventListener("click", function (event) {
                    syncTargets("manual");
                });
            }
            // Target list button
            const btnManageList = document.getElementById('btnManageList');
            if (btnManageList) {
                if (isPlayerInTheList(playerId, 'PTRE')) {
                    btnManageList.innerHTML = "REMOVE FROM LIST";
                    btnManageList.addEventListener("click", function (event) {
                        var retSupp = deletePlayerFromList(playerId, 'PTRE');
                        displayPTREPopUpMessage(retSupp);
                        btnManageList.style.display = 'none';
                    });
                } else {
                    btnManageList.addEventListener("click", function (event) {
                        var retAdd = addPlayerToList(playerId, playerName, 'PTRE');
                        displayPTREPopUpMessage(retAdd[1]);
                        btnManageList.style.display = 'none';
                    });
                }
            }
            // DNP button
            if (document.getElementById('btnDNP')) {
                document.getElementById('btnDNP').addEventListener("click", function (event) {
                    consoleDebug("Adding " + playerId + " to DNP list");
                    // Push data to PTRE
                    $.ajax({
                        url : urlPTREIngameAction + '&team_key=' + GM_getValue(ptreTeamKey, ''),
                        type : 'POST',
                        data: JSON.stringify({"0":{type: "dnp", id: playerId, val: 0, name: playerName}}),
                        cache: false,
                        success : function(reponse){
                            var reponseDecode = jQuery.parseJSON(reponse);
                            displayPTREPopUpMessage(reponseDecode.message);
                            if (reponseDecode.updated > 0) {
                                // Update button color
                                button.style.border = ptreBorderStyleDnpList;
                                // Add player to local list (this will be rewritten by the real update after)
                                const temp = GM_getValue(ptreHighlightedPlayers, {});
                                const ts_tmp = currentTime + 2*60*60;
                                temp[String(playerId)] = {name: playerName, status: "dnp", ts: ts_tmp};
                                GM_setValue(ptreHighlightedPlayers, temp);
                                // Enable Live
                                updateLiveCheckConfig(reponseDecode.check_for_update_cooldown, -1);
                                consoleDebug("Added player "+playerName+" to DNP ("+ts_tmp+")");
                            } else {
                                addToLogs(reponseDecode.message);
                            }
                        }
                    });
                });
            }
            // Note button
            if (document.getElementById('savePlayerNote')) {
                document.getElementById('savePlayerNote').addEventListener("click", function (event) {
                    pushPlayerNote(playerId);
                });
            }
            // Fleet button
            if (document.getElementById('btnGetPlayerInfos2'+playerId)) {
                document.getElementById('btnGetPlayerInfos2'+playerId).addEventListener("click", function (event) {
                    getPlayerInfos(playerId, playerName);
                });
            }
            // Get ranks call
            // Set a delay, so we dont fetch data if player closes the box too fast
            // Once function is run, it will check if Pop-up is still waiting
            setTimeout(function() {updateGalaxyBoxWithPlayerRanks(playerId)}, 2000);
        }
        // We still want event for empty positions
        setTimeout(function() {updateGalaxyBoxWithEventsAndPlayerNote(playerId, galaxy, system, pos)}, 200);
    }
}

