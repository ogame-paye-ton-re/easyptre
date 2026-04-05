// ****************************************
// IMPROVE VIEWS
// ****************************************

// Improve any pages except Empire page
function improvePageAny() {
    console.log("[EasyPTRE] Improving Any Page");

    // Setup Menu Button
    var ptreMenuName = ptreToolName;
    var lastAvailableVersion = GM_getValue(ptreLastAvailableVersion, -1);
    var updateClass = '';
    var ptreStoredTK = GM_getValue(ptreTeamKey, '');
    var configAlertActive = (lastAvailableVersion != -1 && lastAvailableVersion !== GM_info.script.version) || ptreStoredTK == '' || !isValidTeamKey(ptreStoredTK);
    if (configAlertActive) {
        ptreMenuName = "CLICK ME";
        updateClass = " ptreError";
    }
    // When alert is active, clicking the icon opens EasyPTRE settings instead of the PTRE website
    var iconLink = configAlertActive
        ? '<a id="ptreMenuIcon" href="#" target="_self">'
        : '<a id="ptreMenuIcon" href="https://ptre.chez.gg" target="blank_">';
    var aff_option = '<span class="menu_icon">' + iconLink + '<img id="ptreMenuImg" class="mouseSwitch" src="' + imgPTRE + '" height="26" width="26"></a></span>';
    aff_option += '<a id="ptreMenuText" class="menubutton " href="#" accesskey="" target="_self"><span class="textlabel' + updateClass + '" id="ptreMenuName">' + ptreMenuName + '</span></a>';
    if (configAlertActive) {
        var badgeTitle = (ptreStoredTK == '')
            ? 'EasyPTRE: No Team Key set. Click to configure.'
            : 'EasyPTRE: Update available. Click to open settings.';
        aff_option += '<span id="ptreMissingTKBadge" title="' + badgeTitle + '">!</span>';
    }

    var tab = document.createElement("li");
    tab.innerHTML = aff_option;
    tab.id = 'optionPTRE';
    document.getElementById('menuTableTools').appendChild(tab);

    document.getElementById('ptreMenuText').addEventListener("click", function (event) {
        displayOverview();
    }, true);

    if (configAlertActive) {
        document.getElementById('ptreMenuIcon').addEventListener("click", function (event) {
            event.preventDefault();
            displaySettings();
        }, true);
        document.getElementById('ptreMissingTKBadge').addEventListener("click", function (event) {
            displaySettings();
        }, true);
    }

    // Add fixed button in top right corner
    var badge = document.createElement("div");
    badge.id = 'ptreTopRightMenuButton';
    badge.classList.add('button', 'btn_blue');
    badge.innerHTML = '&#9881; EasyPTRE';
    document.body.appendChild(badge);
    document.getElementById('ptreTopRightMenuButton').addEventListener("click", function (event) {
        displayOverview();
    });

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
            const pseudoAGR = document.getElementById('ago_box_title').innerHTML;
            updateLocalAGRList();
            const playerID = getAGRPlayerIDFromPseudo(pseudoAGR);
            if (playerID != 0) {
                document.getElementById('ago_box_title').innerHTML = pseudoAGR + ' [<a href="' + buildPTRELinkToPlayer(playerID) + '" target="_blank">PTRE</a>]';
            }
        }
    }
}

// Add PTRE buttons to messages page
function improvePageMessages() {
    console.log("[EasyPTRE] Improving Messages Page");
    if (!isOGLorOGIEnabled()) {
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
    const galaxyPopupMode = GM_getValue(ptreEnableGalaxyPopup, 'true');
    const betaMode = GM_getValue(ptreEnableBetaMode, 'false');
    const ptreStoredTK = GM_getValue(ptreTeamKey, '');
    let tkComment = "";
    let toolComment = "Detected tool: ";

    // Update status once for the gala browsing session
    if (isAGREnabled()) {
        toolComment+= "AGR ";
    }
    if (isOGLEnabled()) {
        ptreSendGalaEvents = false;
        ptrePushActivities = false;
        toolComment+= "OGL ";
    }
    if (isOGIEnabled()) {
        ptreSendGalaEvents = false;
        ptrePushActivities = false;
        toolComment+= "OGI ";
    }
    // Enable Galaxy Pop-up for the entire galaxy browsing session
    if (galaxyPopupMode == 'false' || minerMode == 'true') {
        ptreDisplayGalaPopup = false;
    }

    if (ptreStoredTK == '') {
        tkComment = '<span class="ptreError">Missing Team Key</span> - ';
        consoleDebug("[GALAXY] No Team Key found: galaxy features disabled.");
    } else {
        // Prepare galaxy check and update
        waitForGalaxyToBeLoaded();
    }

    if (minerMode == 'false') {
        // Add PTRE Toolbar (not if miner mode)
        //TODO:   a udatder quand la fct AGR passe
        var tempContent = '<table width="100%"><tr>';
        tempContent+= '<td><div class="ptreBoxTitle">EasyPTRE<br>TOOLBAR</div></td>';
        tempContent+= '<td><div id="ptreGalaxyPhalanxButton" type="button" class="button btn_blue">&#128225; FRIENDS & PHALANX</div> <div id="ptreGalaxyGEEButton" type="button" class="button btn_blue">&#128225; GALAXY EVENTS</div></td>';
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
        tempContent+= '</span></td></tr>';
        tempContent+= '<tr>';
        tempContent+= '<td align="center" colspan="3" style="vertical-align: middle;"><span class="ptreCategoryTitle">Pop-up Legend: </span><img style="border: 3px solid green; vertical-align: middle;" src="' + imgPTREOK + '" height="10px" width="10px"></a> : Hot target - ';
        tempContent+= '<img style="border: 3px solid orange; vertical-align: middle;" src="' + imgPTREOK + '" height="10px" width="10px"></a> : Galaxy Event - ';
        tempContent+= '<img style="border: 3px solid red; vertical-align: middle;" src="' + imgPTREOK + '" height="10px" width="10px"></a> : Do Not Probe - ';
        tempContent+= '<img style="vertical-align: middle;" src="' + imgPTREOK + '" height="10px" width="10px"></a> : Nothing</td>';
        tempContent+= '</tr>';
        tempContent+= '<tr><td valign="top" colspan="3"><hr></td></tr>';
        tempContent+= '<tr><td valign="top" colspan="3"><div id="ptreGalaxyMessageBoxContent"></div></td></tr>';
        tempContent+= '<tr><td valign="top" colspan="3"><hr></td></tr><tr><td colspan="3"><div class="ptreSmall">' + tkComment + 'Galaxy Popup: ' + galaxyPopupMode + ' - BetaMode: ' + betaMode + ' - MinerMode: ' + minerMode + ' - ' + toolComment;
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
    var currentTime = getIGCurrentTS();
    if (currentTime > GM_getValue(ptreLastTechnosRefresh, 0) + ptreTechnosCheckTimeout) {
        var spanElement = document.querySelector('.show_fleet_apikey');
        if (spanElement) {
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
                updateHtmlById("ptreLastTechnosRefreshField", getLastUpdateLabel(currentTime));
            } else {
                console.log("[EasyPTRE] [FLEET] Cant find Techs!");
            }
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
            var phalanxLevel = levelSpan.getAttribute('data-value');
            var coords = document.getElementsByName('ogame-planet-coordinates')[0].content;
            var moonID = document.getElementsByName('ogame-planet-id')[0].content;
            consoleDebug("[PHALANX] " + coords + ': Found Phalanx level '+phalanxLevel);
            refreshPhalanxStorage(moonID, coords, phalanxLevel);
        }
    } else {
        consoleDebug("[PHALANX] Cant find technologies element");
    }
}

// Parse Buddies page
function improvePageBuddies() {
    console.log("[EasyPTRE] [BUDDIES] Improving Buddies Page");
    const currentTime = getIGCurrentTS();
    const playerLinks = document.querySelectorAll('a[data-playerid]');
    const playerIds = Array.from(playerLinks).map(link => link.getAttribute('data-playerid'));
    consoleDebug("[BUDDIES] " + playerIds);
    const dataJSON = JSON.stringify(playerIds);
    GM_setValue(ptreBuddiesList, dataJSON);
    GM_setValue(ptreBuddiesListLastRefresh, currentTime);
    displayPTREPopUpMessage('Saving buddies list (for Friends & Phalanx)');
}

// This function adds PTRE send SR button to AGR Spy Table
function improveAGRSpyTable(mutationList, observer) {
    if (document.getElementById('agoSpyReportOverview')) {
        // Stop observer
        observer.disconnect();
        var TKey = GM_getValue(ptreTeamKey, '');
        if (TKey != '') {
            console.log("[EasyPTRE] [SPY-TABLE] Updating AGR Spy Table");
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
                                        addToLogs('[PUSH] ' + reponse.message_verbose);
                                    }
                                    displayPTREPopUpMessage(reponse.message_verbose);
                                }
                            });
                        });
                    } else {
                        console.log("[EasyPTRE] [SPY-TABLE] Error. Cant find data element: m" + messageID);
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
                                        addToLogs('[PUSH] ' + reponse.message_verbose);
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
                const jsonSystemObj = {};
                tabActiPos.forEach(function(jsonPos) {
                    jsonSystemObj[jsonPos.coords+'-'+jsonPos.messageID] = jsonPos;
                });
                const jsonSystem = JSON.stringify(jsonSystemObj);

                // Sent to PTRE
                $.ajax({
                    url : urlPTREPushActivity,
                    type : 'POST',
                    data: jsonSystem,
                    cache: false,
                    success : function(reponse){
                        var reponseDecode = JSON.parse(reponse);
                        displayPTREPopUpMessage(reponseDecode.message);
                        if (reponseDecode.code != 1) {
                            displayPTREPopUpMessage(reponseDecode.message);
                            addToLogs('[C-SPY] ' + reponseDecode.message);
                        }
                    }
                });
                console.log('[EasyPTRE] [PUSH] Pushing counter spy messages');
            }
        }
    }
}

// Called when user clicks on the PTRE icon in galaxy view
function openPTREGalaxyActions(galaxy, system, pos, playerId, playerName) {
    consoleDebug("[POP-UP] Click on pos " + galaxy + ":" + system + ":" + pos);
    const currentTime = getIGCurrentTS();

    // Close PTRE menu
    closePTREMenu();

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
                    consoleDebug("[DNP] Adding " + playerId + " to DNP list");
                    // Push data to PTRE
                    $.ajax({
                        url : urlPTREIngameAction + '&team_key=' + GM_getValue(ptreTeamKey, ''),
                        type : 'POST',
                        data: JSON.stringify({"0":{type: "dnp", id: playerId, val: 0, name: playerName}}),
                        cache: false,
                        success : function(reponse){
                            var reponseDecode = JSON.parse(reponse);
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
                                consoleDebug("[DNP] Added player "+playerName+" to DNP ("+ts_tmp+")");
                            } else {
                                addToLogs('[DNP] ' + reponseDecode.message);
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

