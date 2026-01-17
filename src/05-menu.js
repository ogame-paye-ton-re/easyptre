// ****************************************
// MENUS
// ****************************************

// Displays PTRE settings
function displayPTREMenu() {
    const currentTime = Math.floor(serverTime.getTime() / 1000);

    if (!document.getElementById('btnSaveOptPTRE')) {
        migrateDataAndCleanStorage();

        var ptreStoredTK = GM_getValue(ptreTeamKey, '');

        // Check if AGR is enabled
        var isAGROn = false;
        if (isAGREnabled()) {
            isAGROn = true;
        }

        const recommendedLabelOn = '<br><span class="ptreSmall ptreWarning">(recommended: ON)</span>';
        const recommendedLabelOff = '<br><span class="ptreSmall ptreWarning">(recommended: OFF)</span>';
        var tdId = 0;
        var divPTRE = '<div id="boxPTRESettings"><table border="1" width="100%">';
        divPTRE += '<tr><td class="td_cell" width="50%"><div class="ptreBoxTitle">EasyPTRE PANNEL</div></td><td class="td_cell" align="right"><div id="btnHelpPTRE" type="button" class="button btn_blue">HELP</div> <div id="btnRefreshOptPTRE" type="button" class="button btn_blue">REFRESH</div> <div id="btnCloseOptPTRE" type="button" class="button btn_blue">CLOSE</div></td></tr>';
        divPTRE += '<tr><td class="td_cell" align="center" colspan="2"><div id=messageDivInSettings class="ptreWarning"></div></td></tr>';
        divPTRE += '<tr><td class="td_cell" align="center" colspan="2"><hr /></td></tr>';
        // Settings
        divPTRE += '<tr><td class="td_cell"><div class="ptreCategoryTitle">Settings</div></td><td class="td_cell" align="right"><div id="btnSaveOptPTRE" type="button" class="button btn_blue">SAVE</div></td></tr>';
        divPTRE += '<tr><td colspan="2"><table width="100%"><tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'"><div>PTRE Team Key:';
        if (ptreStoredTK == '') {
            divPTRE += '<br><span class="ptreError">Add your PTRE TEAM KEY</span><br><span class="ptreSmall ptreError">Looks like: TM-????-????-????-????</span>';
        } else {
            divPTRE += '<br><span class="ptreSmall">Team Name: </span><span class="ptreSmall ptreSuccess">'+GM_getValue(ptreTeamName, '')+'</span>';
        }
        divPTRE += '</div></td><td class="td_cell_radius_'+(tdId%2)+'" align="center"><div><input onclick="document.getElementById(\'ptreTK\').type = \'text\'" style="width:160px;" type="password" id="ptreTK" value="'+ ptreStoredTK +'"></div></td></tr>';
        tdId++;
        // If AGR is detected
        if (isAGROn) {
            // AGR Spy Table Improvement
            var improveAGRSpyTableValue = (GM_getValue(ptreImproveAGRSpyTable, 'true') == 'true' ? 'checked' : '');
            divPTRE += '<tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'">Improve AGR Spy Table:';
            if (improveAGRSpyTableValue != 'checked') {
                divPTRE += recommendedLabelOn;
            }
            divPTRE += '</td>';
            divPTRE += '<td class="td_cell_radius_'+(tdId%2)+'" style="text-align: center;"><input id="PTREImproveAGRSpyTable" type="checkbox" ';
            divPTRE += improveAGRSpyTableValue;
            divPTRE += ' />';
            divPTRE += '</td></tr>';
            tdId++;
        }
        // Add Buddies to Friends and Phalanx feature
        var buddiesOn = (GM_getValue(ptreAddBuddiesToFriendsAndPhalanx, 'true') == 'true' ? 'checked' : '');
        divPTRE += '<tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'">Add Buddies to Friends & Phalanx feature:<br><span class="ptreSmall">List is not shared, nor stored by PTRE</span>';
        if (buddiesOn != 'checked') {
            divPTRE += recommendedLabelOn;
        }
        divPTRE += '</td>';
        divPTRE += '<td class="td_cell_radius_'+(tdId%2)+'" style="text-align: center;"><input id="PTREAddBuddiesToFriendsAndPhalanx" type="checkbox" ';
        divPTRE += buddiesOn;
        divPTRE += ' />';
        divPTRE += '</td></tr>';
        tdId++;
        // Toogle Events on Overview Page
        var toogleEventsOn = (GM_getValue(ptreToogleEventsOverview, 'false') == 'true' ? 'checked' : '');
        divPTRE += '<tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'">Toogle Events on Overview Page:<br><span class="ptreSmall">Works well with option "Always show events" set to "Hide"</span></td>';
        divPTRE += '<td class="td_cell_radius_'+(tdId%2)+'" style="text-align: center;"><input id="PTREToogleEventOnOverviewPage" type="checkbox" ';
        divPTRE += toogleEventsOn;
        divPTRE += ' />';
        divPTRE += '</td></tr>';
        tdId++;
        // Miner Mode
        var MinerModeOn = (GM_getValue(ptreEnableMinerMode, 'false') == 'true' ? 'checked' : '');
        divPTRE += '<tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'">Enable Miner Mode:<br><span class="ptreSmall">I do not want every UX improvements,<br>but I sill want to help my Team</span>';
        if (MinerModeOn == 'checked') {
            divPTRE += recommendedLabelOff;
        }
        divPTRE += '</td>';
        divPTRE += '<td class="td_cell_radius_'+(tdId%2)+'" style="text-align: center;"><input id="PTREToogleMinerMode" type="checkbox" ';
        divPTRE += MinerModeOn;
        divPTRE += ' />';
        divPTRE += '</td></tr>';
        tdId++;
        // Beta Mode
        var BetaModeOn = (GM_getValue(ptreEnableBetaMode, 'false') == 'true' ? 'checked' : '');
        divPTRE += '<tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'">Enable Beta Mode:<br><span class="ptreSmall ptreError">Enables Beta features that might be unpolished (galaxy)</span>';
        divPTRE += '</td>';
        divPTRE += '<td class="td_cell_radius_'+(tdId%2)+'" style="text-align: center;"><input id="PTREToogleBetaMode" type="checkbox" ';
        divPTRE += BetaModeOn;
        divPTRE += ' />';
        divPTRE += '</td></tr>';
        tdId++;
        // Console Debug mode
        var debugMode = (GM_getValue(ptreEnableConsoleDebug, 'false') == 'true' ? 'checked' : '');
        divPTRE += '<tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'">Enable Debug Mode:</td>';
        divPTRE += '<td class="td_cell_radius_'+(tdId%2)+'" style="text-align: center;"><input id="PTREEnableConsoleDebug" type="checkbox" ';
        divPTRE += debugMode;
        divPTRE += ' />';
        divPTRE += '</td></tr>';
        tdId++;
        //
        divPTRE += '<tr><td class="td_cell" align="center" colspan="2"><hr /></td></tr></table></td></tr>';
        // End Settings

        // Shared data
        var dataJSON = '';
        dataJSON = GM_getValue(ptreDataToSync, '');
        var phalanxCount = 0;
        var dnpCount = 0;
        var hotCount = 0;
        var dataList = [];
        if (dataJSON != '') {
            dataList = JSON.parse(dataJSON);
            $.each(dataList, function(i, elem) {
                if (elem.type == "phalanx") {
                    phalanxCount++;
                }
            });
        }
        const galaEventsList = GM_getValue(ptreGalaxyEventsPos, []);
        const galaEventsCount = galaEventsList.length;
        const highlightedPlayersList = GM_getValue(ptreHighlightedPlayers, {});
        $.each(highlightedPlayersList, function(i, elem) {
            if (elem.status == "hot") {
                hotCount++;
            } else if (elem.status == "dnp") {
                dnpCount++;
            }
        });
        divPTRE += '<tr><td class="td_cell"><div class="ptreCategoryTitle">Team shared data (<span id="ptreLastDataSyncField">' + getLastUpdateLabel(GM_getValue(ptreLastDataSync, 0)) + '</span>)</div></td><td class="td_cell" align="right"><div id="synctDataWithPTRE" class="button btn_blue">SYNC DATA</div> <div id="displaySharedData" class="button btn_blue">DETAILS</div></td></tr>';
        divPTRE += '<tr><td class="td_cell" colspan="2">';
        divPTRE += '<table border="1" width="100%"><tr><td class="td_cell_radius_0">Phalanx:<br><span class="ptreSmall"><a href="/game/index.php?page=ingame&component=facilities">Visit every moon\'s buildings to update</a></span></td><td class="td_cell_radius_0" align="center"><span class="ptreSuccess">' + phalanxCount + '</span></td></tr>';
        divPTRE += '<tr><td class="td_cell_radius_0">Hot Targets list:<br><span class="ptreSmall">Recent spy reports</span></td><td class="td_cell_radius_0" align="center"><span class="ptreSuccess">' + hotCount + '</span></td></tr>';
        divPTRE += '<tr><td class="td_cell_radius_0">Galaxy Events:<br><span class="ptreSmall">Changes non-listed in public API but detected by your Team</span></td><td class="td_cell_radius_0" align="center"><span class="ptreSuccess">' + galaEventsCount + '</span></td></tr>';
        divPTRE += '<tr><td class="td_cell_radius_1">Do Not Probe list:<br><span class="ptreSmall">Added via galaxy</span></td><td class="td_cell_radius_1" align="center"><span class="ptreSuccess">' + dnpCount + '</span></td></tr>';
        divPTRE += '</table></td></tr>';
        divPTRE += '<tr><td class="td_cell" align="center" colspan="2"><hr /></td></tr>';

        // Features diabled when OGL/OGI detected
        if (!isOGLorOGIEnabled()) {
            // Targets list
            divPTRE += '<tr><td class="td_cell"><div class="ptreCategoryTitle">Targets list (<span id="ptreLastTargetsSyncField">' + getLastUpdateLabel(GM_getValue(ptreLastTargetsSync, 0)) + '</span>)</div></td><td class="td_cell" align="right"><div id="displayTargetsList" class="button btn_blue">OPEN LIST</div></td></tr>';
            divPTRE += '<tr><td class="td_cell" align="center" colspan="2"><a href="https://ptre.chez.gg/?country='+country+'&univers='+universe+'&page=players_list" target="_blank">Manage PTRE targets via website.</a></td></tr>';
            divPTRE += '<tr><td class="td_cell" align="center" colspan="2"><hr /></td></tr>';
        }

        // Galaxy Data
        divPTRE += '<tr><td class="td_cell"><div class="ptreCategoryTitle">Galaxy data (V' + GM_getValue(ptreGalaxyStorageVersion, 1) + ')</div></td><td class="td_cell" align="right"><div id="displayGalaxyTracking" class="button btn_blue">DETAILS</div></td></tr>';
        divPTRE += '<tr><td class="td_cell" colspan="2" align="center">'+displayTotalSystemsSaved()+'</td></tr>';
        if (isOGLorOGIEnabled()) {
            divPTRE += '<tr><td colspan="2" class="td_cell" align="center"><span class="ptreSuccess ptre Small">OGL/OGI enabled: some EasyPTRE features are disabled.</span> <div id="btnOGLOGIDetails" type="button" class="button btn_blue">DETAILS</div></td></tr>';
        }
        divPTRE += '<tr><td class="td_cell" align="center" colspan="2"><hr /></td></tr>';

        // Lifeforms Menu
        divPTRE += '<tr><td class="td_cell" colspan="2"><div class="ptreCategoryTitle">Lifeforms researchs (<span id="ptreLastTechnosRefreshField">' + getLastUpdateLabel(GM_getValue(ptreLastTechnosRefresh, 0)) + '</span>)</div></td></tr>';
        divPTRE += '<tr><td class="td_cell" align="center" colspan="2"><a href="/game/index.php?page=ingame&component=fleetdispatch">Fleet menu to update</a> - <a href="https://ptre.chez.gg/?page=lifeforms_researchs" target="_blank">Check it out on PTRE</a></td></tr>';
        divPTRE += '<tr><td class="td_cell" align="center" colspan="2"><hr /></td></tr>';

        // Footer
        //divPTRE += '<tr>';
        divPTRE += '<tr><td class="td_cell" align="right" colspan="2"><div id="displayLogs" type="button" class="button btn_blue">LOGS</div> <div id="forceCheckVersionButton" type="button" class="button btn_blue">CHECK VERSION</div> <div id="displayChangelog" type="button" class="button btn_blue">CHANGELOG</div></td></tr>';
        divPTRE += '<tr><td class="td_cell" align="left"><a href="https://ptre.chez.gg/" target="_blank">PTRE website</a>&nbsp;|&nbsp;<a href="https://discord.gg/WsJGC9G" target="_blank">Discord</a>&nbsp;|&nbsp;<a href="https://ko-fi.com/ptreforogame" target="_blank">Donate</a></td><td class="td_cell" align="right"><span class="ptreBold">EasyPTRE v' + GM_info.script.version + '</span></td></tr>';
        divPTRE += '<tr><td class="td_cell" align="center" colspan="2"><span id="ptreUpdateVersionMessage">';
        var lastAvailableVersion = GM_getValue(ptreLastAvailableVersion, -1);
        if (lastAvailableVersion != -1 && lastAvailableVersion !== GM_info.script.version) {
            var updateMessageShort = '<span class="ptreError">New version '+ lastAvailableVersion + ' is available. Update <a href="https://openuserjs.org/scripts/GeGe_GM/EasyPTRE" target="_blank">EasyPTRE</a>.</span>';
            divPTRE += updateMessageShort;
            displayUpdateBox(updateMessageShort);
        }
        divPTRE += '</span></td></tr>';

        //fin div table tr
        divPTRE += '</table></div>';

        var elementSetPTRE = document.createElement("div");
        elementSetPTRE.innerHTML = divPTRE;
        elementSetPTRE.id = 'divPTRESettings';

        if (document.getElementById('bottom')) {
            document.getElementById('bottom').appendChild(elementSetPTRE);
        }

        // Action: Sync data to PTRE
        document.getElementById('synctDataWithPTRE').addEventListener("click", function (event) {
            syncDataWithPTRE('manual');
        });

        // Action: Check version
        document.getElementById('forceCheckVersionButton').addEventListener("click", function (event) {
            document.getElementById('ptreUpdateVersionMessage').innerHTML = 'Checking EasyPTRE version...';
            updateLastAvailableVersion(true);
        });

        // Action: Check version
        document.getElementById('displayLogs').addEventListener("click", function (event) {
            displayLogs();
        });

        // Action: Help
        document.getElementById('btnHelpPTRE').addEventListener("click", function (event) {
            displayHelp();
        });

        // Action: Changelog
        document.getElementById('displayChangelog').addEventListener("click", function (event) {
            displayChangelog();
        });

        // Action: Display Galaxy Tracking
        if (document.getElementById('displayGalaxyTracking')) {
            document.getElementById('displayGalaxyTracking').addEventListener("click", function (event) {
                displayGalaxyTracking();
            });
        }

        // Action: Display Targets List
        if (document.getElementById('displayTargetsList')) {
            document.getElementById('displayTargetsList').addEventListener("click", function (event) {
                displayTargetsList();
            });
        }

        // Action: Display Shared Data
        if (document.getElementById('displaySharedData')) {
            document.getElementById('displaySharedData').addEventListener("click", function (event) {
                displaySharedData();
            });
        }

        // Action: Close
        document.getElementById('btnCloseOptPTRE').addEventListener("click", function (event) {
            document.getElementById('divPTRESettings').parentNode.removeChild(document.getElementById('divPTRESettings'));
            if (document.getElementById('divPTREInfos')) {
                document.getElementById('divPTREInfos').parentNode.removeChild(document.getElementById('divPTREInfos'));
            }
        });

        // Action: Save
        document.getElementById('btnSaveOptPTRE').addEventListener("click", function (event) {
            savePTRESettings();
            setTimeout(function() {document.getElementById('divPTRESettings').parentNode.removeChild(document.getElementById('divPTRESettings')); displayPTREMenu();}, 2000);
        });

        // Action: Refresh
        document.getElementById('btnRefreshOptPTRE').addEventListener("click", function (event) {
            document.getElementById('divPTRESettings').parentNode.removeChild(document.getElementById('divPTRESettings'));
            setTimeout(function() {displayPTREMenu();}, 100);
        });

        // Action: OGI/OGI infos
        if (document.getElementById('btnOGLOGIDetails')) {
            document.getElementById('btnOGLOGIDetails').addEventListener("click", function (event) {
                displayOGLOGIInfos();
            });
        }

        // Check last script version
        updateLastAvailableVersion(false);
    }

    // Sync targets
    if (currentTime > (GM_getValue(ptreLastTargetsSync, 0) + 15*60)) {
        setTimeout(syncTargets, 1000);
    }
    // Sync Data
    if (currentTime > (GM_getValue(ptreLastDataSync, 0) + 15*60)) {
        setTimeout(syncDataWithPTRE, 2000);
    }
}

function savePTRESettings() {
    // General settings
    if (isAGREnabled()) {
        // Update AGR settings
        GM_setValue(ptreImproveAGRSpyTable, document.getElementById('PTREImproveAGRSpyTable').checked + '');
    }
    // Update Console Debug Mode
    GM_setValue(ptreEnableConsoleDebug, document.getElementById('PTREEnableConsoleDebug').checked + '');
    // Save Buddies status
    GM_setValue(ptreAddBuddiesToFriendsAndPhalanx, document.getElementById('PTREAddBuddiesToFriendsAndPhalanx').checked + '');
    // Update Toggle Events on Overview page
    GM_setValue(ptreToogleEventsOverview, document.getElementById('PTREToogleEventOnOverviewPage').checked + '');
    // Update Miner Mode
    GM_setValue(ptreEnableMinerMode, document.getElementById('PTREToogleMinerMode').checked + '');
    // Update Beta Mode
    GM_setValue(ptreEnableBetaMode, document.getElementById('PTREToogleBetaMode').checked + '');

    // Save PTRE Team Key
    var newTK = document.getElementById('ptreTK').value;
    // Check PTRE Team Key Format
    if (newTK == '' || (newTK.replace(/-/g, "").length == 18 && newTK.substr(0,2) == "TM")) {
        // If new TK, store it
        if (newTK != GM_getValue(ptreTeamKey, '')) {
            GM_setValue(ptreTeamKey, newTK);
        }
        if (newTK == '') {
            displayMessageInSettings('Team Key removed');
        } else {
            displayMessageInSettings('Team Key Format OK');
        }
    } else {
        displayMessageInSettings('Wrong Team Key Format');
    }
    addToLogs('Saving settings (Miner mode: ' + document.getElementById('PTREToogleMinerMode').checked + ' | Beta mode: ' + document.getElementById('PTREToogleBetaMode').checked + ')');
    // Update menu image and remove it after few sec
    document.getElementById('imgPTREmenu').src = imgPTRESaveOK;
    setTimeout(function() {document.getElementById('imgPTREmenu').src = imgPTRE;}, menuImageDisplayTime);
}

// This function creates empty Info Box.
// Its ready to be updated
function setupInfoBox(title) {
    if (document.getElementById('divPTREInfos')) {
        document.getElementById('divPTREInfos').parentNode.removeChild(document.getElementById('divPTREInfos'));
    }
    var divPTRE = '<div id="boxPTREInfos"><table border="1" width="100%"><tr><td align="right"><div class="ptreBoxTitle">' + title + '</div></td><td align="right"><div id="btnCloseInfosPTRE" type="button" class="button btn_blue">CLOSE</div></td></tr></table><hr>';
    divPTRE+='<div id="infoBoxContent"><br><br><center><span class="ptreWarning">LOADING...</span></center><br><br><br></div>';
    var elementSetPTRE = document.createElement("div");
    elementSetPTRE.innerHTML = divPTRE;
    elementSetPTRE.id = 'divPTREInfos';

    if (document.getElementById('ingamepage')) {
        document.getElementById('ingamepage').appendChild(elementSetPTRE);
    }

    document.getElementById('btnCloseInfosPTRE').addEventListener("click", function (event) {
        document.getElementById('divPTREInfos').parentNode.removeChild(document.getElementById('divPTREInfos'));
    });
}

function displayHelp() {
    setupInfoBox("EasyPTRE Help");
    var content = '<div class="ptreCategoryTitle">Purpose</div>EasyPTRE works as a side-car of AGR in order to enable PTRE basic features. Once configured, you will be able to: <br>- Push and share spy reports<br>- Push counter spy messages as acivities<br>- Track targets galaxy activities and check results on PTRE website<br>- Track galaxy events (new moons, etc)<br>- Display player top fleet from PTRE<br>- Sync targets list with your Team';
    content+= '<div class="ptreCategoryTitle">Team Key setting</div>To use it, you need to create a Team on <a href="https://ptre.chez.gg?page=team" target="_blank">PTRE website</a> and add Team Key to EasyPTRE settings.<br>PTRE Team Key should look like: TM-XXXX-XXXX-XXXX-XXXX. Create your Team or ask your teammates for it.';
    content+= '<div class="ptreCategoryTitle">Spy report push</div>You can push spy reports from the messages page or when opening a spy report. Spy report will be shared to your Team and over Discord (if <a href="https://ptre.chez.gg/?page=discord_integration" target="_blank">configuration</a> is done).';
    content+= '<div class="ptreCategoryTitle">Galaxy tracking</div>EasyPTRE will track galaxy modifications (new moon, destroyed planet, etc) when you browse it and send data to your PTRE Team.<br>You can also enable notifications on Discord (type "!ptre !gala") or check all events on the <a href="https://ptre.chez.gg/?page=galaxy_event_explorer" target="_blank">Galaxy Event Explorer</a>.<br>This feature is disable if you use OGL or OGI, as it is directly integrated to thoses tools.';
    content+= '<div class="ptreCategoryTitle">Lifeforms Researchs synchronization</div>EasyPTRE will save your LF researchs so you never have to manually enter thme into simulator when using PTRE links. <a href="https://ptre.chez.gg/?page=lifeforms_researchs" target="_blank">Details here</a>.';
    content+= '<div class="ptreCategoryTitle">Activity sharing</div>EasyPTRE will send targets activities from galaxy and counter-spy messages from Inbox.<br>It allows you to check activity table and what your opponent is doing.<br>This feature is disable if you use OGL or OGI, as it is directly integrated to thoses tools.';
    content+= '<div class="ptreCategoryTitle">Target lists</div>EasyPTRE targets lists determines players that will be activity-tracked when exploring the galaxy. ';
    content+= 'EasyPTRE manages two targets lists that works at same time (both lists are tracked):<br>- AGR target list: it is based on you AGR left pannel: Target, To attack, Watch, Miner. It ignores Friends and traders. To update this list, open your AGR target pannels<br>- PTRE target list: this list containes targets shared by your team';
    content+= '<br>You can sync your target lists with your teammates (you may ignore some of your targets in order to NOT share them with friends and keep it to yourself).';
    content+= '<br>Common targets list (for your PTRE Team) can be configured <a href="https://ptre.chez.gg/?page=players_list" target="_blank">on PTRE players list page</a>.';
    content+= '<div class="ptreCategoryTitle">Need more help?</div>You can get some help on <a href="https://discord.gg/WsJGC9G" target="_blank">Discord</a>, come and ask us.';

    document.getElementById('infoBoxContent').innerHTML = content;
}

function displayChangelog() {
    setupInfoBox("EasyPTRE Changelog");
    var content = '<div class="ptreCategoryTitle">Versions:</div>';
    content+= '<div class="ptreSubTitle">0.14.0 (jan 2026)</div>- Global code refacto and polish';
    content+= '<div><hr></div>';
    content+= '<div class="ptreSubTitle">0.13.3 (jan 2026)</div>- Several bugfix and polish';
    content+= '<div class="ptreSubTitle">0.13.0 (jan 2026)</div>- [Feature] Sync galaxy events and recents targets from PTRE<br>- [Feature] Highlight galaxy events and targets in galaxy view (beta)<br>- [Feature] Improve galaxy pop-up (beta)<br>- [Feature] Send debris fields alongside activities<br>- Improve galaxy info storage';
    content+= '<div><hr></div>';
    content+= '<div class="ptreSubTitle">0.12.2 (jan 2026)</div>- [Feature] Add ingame shared notes, linked to targets (beta)';
    content+= '<div class="ptreSubTitle">0.12.0 (jan 2026)</div>- [Feature] Improve galaxy view with recents targets highlighting and ranks (beta)<br>- [Feature] Implement Do Not Probe feature (beta)<br>- [Feature] Setting: Toogle events on Overview page<br>- [Feature] Setting: Add Miner mode (if you want to help Team without every UX improvements)<br>- [Feature] Setting: Add Beta mode (to get Tech Preview features in advance)<br>- Add logs system (for debug)<br>- Refacto targets display<br>- A lot of background improvements';
    content+= '<div><hr></div>';
    content+= '<div class="ptreSubTitle">0.11.4 (oct 2025)</div>- Fix phalanx purge and update';
    content+= '<div class="ptreSubTitle">0.11.3</div>- Improve update visibility<br>- Add manual update procedure';
    content+= '<div class="ptreSubTitle">0.11.2</div>- Fix Galaxy pushs';
    content+= '<div class="ptreSubTitle">0.11.1</div>- Add buddies to Friends & Phalanx feature<br>- Add filters to Friends & Phalanx feature';
    content+= '<div class="ptreSubTitle">0.11.0</div>- Add Friends & Phalanx feature';
    content+= '<div><hr></div>';
    content+= '<div class="ptreSubTitle">0.10.4</div>- Add Changelog feature<br>- Fix some minor CSS issues';
    content+= '<div class="ptreSubTitle">0.10.3</div>- Manage moon ID and relocation related to phalanx sharing<br>- Rework global design';
    content+= '<div class="ptreSubTitle">0.10.2</div>- Fix counter-spy timestamp after V12 update';
    content+= '<div class="ptreSubTitle">0.10.1</div>- Allow removing TeamKey from settings';
    content+= '<div class="ptreSubTitle">0.10.0</div>- Add Galaxy events tracking and sharing (same feature as OGL/OGI but for AGR)<br>- Share Phalanx level with PTRE Team (AGR/OGL/OGI)<br>- Add PTRE Toolbar to galaxy view (AGR/OGL/OGI)<br>- New button to fetch events from Galaxy Event Explorer (AGR/OGL/OGI)<br>- New button to fetch closest friend Phalanx (AGR/OGL/OGI)<br>- Save lifeform researchs to PTRE in order to send them from website to simulator (AGR/OGL/OGI)<br>- Rework buttons and UI';
    content+= '<div><hr></div>';
    content+= '<div class="ptreSubTitle">0.8.0</div>- Send counter spy messages as activities<br>- Fix AGR spy table customization (following message page rework)<br>- Fix send spy report button in message page (following message page rework)';
    content+= '<div><hr></div>';
    content+= '<div class="ptreSubTitle">0.7.6</div>- Import AGR custom lists to PTRE tracking list (in addition of basic lists)<br>- Improve notification system (keep 5 sec history)';
    content+= '<div class="ptreSubTitle">0.7.5</div>- Display target top fleet directly into EasyPTRE pannel<br>- [Feature] Add help menu';
    content+= '<div class="ptreSubTitle">0.7.4</div>- [Feature] Sync AGR/PTRE targets list with teammates via PTRE (non-mandatory)<br>- [Feature] Add a private targets list management system (in order to not share)<br>- [Feature] Add a debug mode option<br>- [Feature] Script will check, once a day, for updates and display a label<br>- [Fix] Fix pushing activities when refreshing same system<br>- [Fix] Remove AGR "Traders" from targets lists ("Friends" were already removed)<br>- [Fix] Fix galaxy page detection (depending on from where player clicks)<br>- [Fix] Add scrollbar to targets list<br>- [Fix] Move EasyPTRE pannel to right side in order to not overlap with AGR';
    document.getElementById('infoBoxContent').innerHTML = content;
}

function displayUpdateBox(updateMessageShort) {
    setupInfoBox("EasyPTRE update");
    var content = updateMessageShort;
    content += '<div class="ptreCategoryTitle">Automatic updates</div>Tampermonkey should automatically update EasyPTRE when an update is available. It may take some time to be triggered, though.';
    content += '<div class="ptreCategoryTitle">Manual update</div>If you want to proceed to a manual update here is how to:<br>';
    content += '<br>- Click on Tampermonkey Extension in the top right corner of your browser';
    content += '<br>- Click on "Dashboard"';
    content += '<br>- Click on "Installed Userscripts" tab';
    content += '<br>- Select "EasyPTRE" checkbox';
    content += '<br>- From the dropdown menu called "Please choose an option", select "Trigger Update"';
    content += '<br>- Press "Start"';
    content += '<br>- (optionnal) If TamperMonkey proposes "Overwrite", validate it';
    content += '<br>- Update should be done';
    document.getElementById('infoBoxContent').innerHTML = content;
}

function displayOGLOGIInfos() {
    setupInfoBox("OGLight or OGInfinity: enabled");
    var content = '<span class="ptreWarning">OGLight or OGInfinity is enabled: some EasyPTRE features are disabled to leave priority to your favorite tool, OGL / OGI. Please also add your PTRE TeamKey into OGL / OGI.</span>';
    content += '<br><br>EasyPTRE is still managing some tasks like:<br>- Galaxy Event Explorer Infos (in galaxy view)<br>- Lifeforms/combat researchs sync (for PTRE spy reports)<br>- Phalanx infos sharing (in galaxy view or Discord)';

    document.getElementById('infoBoxContent').innerHTML = content;
}

function displayLogs() {
    setupInfoBox("EasyPTRE Logs");
    var content = 'Internal logs only (errors, migrations, etc) for debug purposes if you share it with developer. <div id="purgeLogs" type="button" class="button btn_blue">PURGE LOGS</div><br><br>';
    content+= '<table id="logTable"><tr><td class="td_cell_radius_0" align="center">Date</td><td class="td_cell_radius_0" align="center">Universe</td><td class="td_cell_radius_0" align="center">Log</td></tr>';

    var currentTime = Math.floor(serverTime.getTime() / 1000);
    var logsJSON = GM_getValue(ptreLogsList, '');
    var logsList = [];
    if (logsJSON != '') {
        logsList = JSON.parse(logsJSON);
    }
    logsList.sort((a, b) => b.ts - a.ts);
    $.each(logsList, function(i, elem) {
        if (elem.uni == country + "-" + universe) {
            content+= '<tr><td class="td_cell_radius_1" align="center">' + getLastUpdateLabel(elem.ts) + '</td><td class="td_cell_radius_1" align="center">' + elem.uni + '</td><td class="td_cell_radius_1">' + elem.log + '</td></tr>';
        }
    });
    content+= '</table>';

    document.getElementById('infoBoxContent').innerHTML = content;
    document.getElementById('purgeLogs').addEventListener("click", function (event) {
        GM_deleteValue(ptreLogsList);
        addToLogs("Logs cleaned");
        displayLogs();
    });
}

function displayGalaxyTracking() {
    setupInfoBox("Galaxy tracking distribution");

    var content = '<div class="ptreCategoryTitle">Distribution</div>';
    content += 'X => 10/10 systems recently updated<br>+ => some systems recently updated<br><br>';
    content += '<div style="font-family: monospace; white-space: pre;">';

    for (var gala = 1; gala <= 15; gala++) {
        var galaxyKey = ptreGalaxyData + gala;
        var galaxyData = GM_getValue(galaxyKey, '');
        if (galaxyData === '' || typeof galaxyData !== 'object') {
            continue;
        }
        const trackedSystems = new Set(
            Object.keys(galaxyData).map(Number)
        );
        let line = '';
        for (let start = 1; start <= 500; start += 10) {
            let trackedCount = 0;
            for (let s = start; s < start + 10; s++) {
                if (trackedSystems.has(s)) {
                    trackedCount++;
                }
            }
            if (trackedCount === 10) {
                line += 'X';
            } else if (trackedCount > 0) {
                line += '+';
            } else {
                line += '-';
            }
        }
        content += `<div>Galaxy ${String(gala).padStart(2, ' ')} | ${line}</div>`;
    }
    content += '</div>';
    if (GM_getValue(ptreEnableConsoleDebug, 'false') == 'true') {
        content+='<div class="ptreCategoryTitle">Galaxy details</div>';
        content+='Galaxy Storage Version: ' + GM_getValue(ptreGalaxyStorageVersion, 1) + '<br>';
        content+='Galaxy Storage Retention: ' + ptreGalaxyStorageRetention + ' days<br><br>';
        content+='Galaxy keys:<br>';
        GM_listValues().filter(key => key.includes(ptreGalaxyData)).sort().forEach(key => {
            content+='- Found galaxy key: ' + key + '<br>';
        });
        content+='<br><span class="ptreSmall">If you dont see galaxies from "Galaxy keys" in the "Distribution" tab, you may purge data.</span>';
    }

    content+='<div class="ptreCategoryTitle">Reset galaxy data</div>';
    content+= '<div id="purgeGalaxyTracking" class="button btn_blue">PURGE DATA</div>';
    document.getElementById('infoBoxContent').innerHTML = content;

    // Action: Purge Galaxy Tracking
    document.getElementById('purgeGalaxyTracking').addEventListener("click", function (event) {
        validatePurgeGalaxyTracking();
    });
}

function displayTargetsList() {
    setupInfoBox("Targets List");

    var content = '<div id="targetsListDiv"><table width="100%"><tr><td><a href="https://ptre.chez.gg/?country='+country+'&univers='+universe+'&page=players_list" target="_blank">Manage list on PTRE website</a></td><td align="right"><div id="reloadLocalList" class="button btn_blue">RELOAD LOCAL LIST</div> <div id="synctTargetsWithPTRE" class="button btn_blue">SYNC TARGETS</div></td></tr></table><br><br>';

    // Check if AGR is enabled
    var isAGROn = false;
    if (isAGREnabled()) {
        isAGROn = true;
        updateLocalAGRList();
    }
    content += '<table width="800px"><tr><td align="center" valign="top">';
    // EasyPTRE enabled (AGR mode or vanilla mode)
    // Targets list
    if (!isAGROn) {
        content += '<span class="ptreError">AGR is not enabled: Only using PTRE list.</span>';
    } else {
        // Display PTRE list if AGR list setting is disabled OR AGR extension not installed
        var targetJSON = '';
        var targetList = '';
        content += 'AGR Target List<br><span class="ptreSmall">This list is based on your AGR list</span><br><br><table width="90%">';
        content += '<tr class="tr_cell_radius"><td class="td_cell_radius_0"><div class="ptreSubTitle">Player<br>Name</div></td><td class="td_cell_radius_0" align="center"><div class="ptreSubTitle">Fleet<br>Infos</div></td><td class="td_cell_radius_0" align="center"><div class="ptreSubTitle">PTRE<br>Profile</div></td><td class="td_cell_radius_0" align="center"><div class="ptreSubTitle">Keep<br>Private</div></td><td class="td_cell_radius_0" align="center"><div class="ptreSubTitle">Remove<br>Target</div></td></tr>';
        targetJSON = GM_getValue(ptreAGRPlayerListJSON, '');
        if (targetJSON != '') {
            targetList = JSON.parse(targetJSON);
            if (targetList) {
                var i = 0;
                $.each(targetList, function(i, PlayerCheck) {
                    //consoleDebug(PlayerCheck);
                    i++;
                    content += '<tr id="rawPLayer_'+PlayerCheck.id+'" class="tr_cell_radius"><td class="td_cell_radius_'+ (i%2) +'">'+PlayerCheck.pseudo+'</td>';
                    content += '<td class="td_cell_radius_'+ (i%2) +'" align="center"><div id="btnGetPlayerInfos'+PlayerCheck.id+'" type="button" class="button btn_blue">FLEET</div></td>';
                    content += '<td class="td_cell_radius_'+ (i%2) +'" align="center"><a href="' + buildPTRELinkToPlayer(PlayerCheck.id) + '" target="_blank">Profile</a></td>';
                    var checked = '';
                    if (isTargetPrivate(PlayerCheck.id)) {
                        checked = ' checked';
                    }
                    content += '<td class="td_cell_radius_'+ (i%2) +'" align="center"><input class="sharedTargetStatus" id="'+PlayerCheck.id+'" type="checkbox"' + checked + '></td>';
                    content += '<td class="td_cell_radius_'+ (i%2) +'" align="center"><a class="tooltip" id="removePlayerFromListBySettings_'+PlayerCheck.id+'" style="cursor:pointer;"><img class="mouseSwitch" src="' + imgSupPlayer + '" height="12" width="12"></a></td>';
                    content += '</tr>';
                });
            }
        }
        content += '</table> (x' + targetList.length + ')';
    }
    content += '</td><td align="center" valign="top">';
    // Display PTRE list if AGR list setting is disabled OR AGR extension not installed
    targetJSON = '';
    var targetListPTRE = '';
    content += 'PTRE Team Target List<br><span class="ptreSmall">Common list with your Team</span><br><br><table width="90%">';
    content += '<tr class="tr_cell_radius"><td class="td_cell_radius_0"><div class="ptreSubTitle">Player<br>Name</div></td><td class="td_cell_radius_0" align="center"><div class="ptreSubTitle">Fleet<br>Infos</div></td><td class="td_cell_radius_0" align="center"><div class="ptreSubTitle">PTRE<br>Profile</div></td><td class="td_cell_radius_0" align="center"><div class="ptreSubTitle">Remove<br>Target</div></td></tr>';
    targetJSON = GM_getValue(ptrePTREPlayerListJSON, '');
    if (targetJSON != '') {
        targetListPTRE = JSON.parse(targetJSON);
        if (targetListPTRE) {
            i = 0;
            $.each(targetListPTRE, function(i, PlayerCheck) {
                //consoleDebug(PlayerCheck);
                i++;
                content += '<tr id="rawPLayer_'+PlayerCheck.id+'" class="tr_cell_radius"><td class="td_cell_radius_'+ (i%2) +'">'+PlayerCheck.pseudo+'</td>';
                content += '<td class="td_cell_radius_'+ (i%2) +'" align="center"><div id="btnGetPlayerInfos'+PlayerCheck.id+'" type="button" class="button btn_blue">FLEET</div></td>';
                content += '<td class="td_cell_radius_'+ (i%2) +'" align="center"><a href="' + buildPTRELinkToPlayer(PlayerCheck.id) + '" target="_blank">Profile</a></td>';
                content += '<td class="td_cell_radius_'+ (i%2) +'" align="center"><a class="tooltip" id="removePlayerFromListBySettings_'+PlayerCheck.id+'" style="cursor:pointer;"><img class="mouseSwitch" src="' + imgSupPlayer + '" height="12" width="12"></a></td>';
                content += '</tr>';
            });
        }
    }
    content += '</table> (x' + targetListPTRE.length + ')';
    content += '</td></tr></table></div>';
    document.getElementById('infoBoxContent').innerHTML = content;

    // Action: reload list
    document.getElementById('reloadLocalList').addEventListener("click", function (event) {
        setupInfoBox();
        setTimeout(displayTargetsList, 100);
    });
    // Action: sync targets
    document.getElementById('synctTargetsWithPTRE').addEventListener("click", function (event) {
        syncTargets("manual");
    });
    // Action: Toogle target status
    var targetStatus = document.getElementsByClassName('sharedTargetStatus');
    $.each(targetStatus, function(nb, target) {
        document.getElementById(target.id).addEventListener("click", function (event)
        {
            var status = toogleTargetPrivateStatus(target.id);
            displayMessageInSettings('Target is now ' + status);
        });
    });
    // Action: Player Infos
    if (targetList) {
        $.each(targetList, function(i, PlayerCheck) {
            document.getElementById('btnGetPlayerInfos'+PlayerCheck.id).addEventListener("click", function (event) {
                getPlayerInfos(PlayerCheck.id, PlayerCheck.pseudo);
            });
        });
    }
    if (targetListPTRE) {
        $.each(targetListPTRE, function(i, PlayerCheck) {
            document.getElementById('btnGetPlayerInfos'+PlayerCheck.id).addEventListener("click", function (event) {
                getPlayerInfos(PlayerCheck.id, PlayerCheck.pseudo);
            });
        });
    }
    // Action: Delete player
    if (targetList) {
        $.each(targetList, function(i, PlayerCheck) {
            document.getElementById('removePlayerFromListBySettings_'+PlayerCheck.id).addEventListener("click", function (event) {
                // Delete player from list
                var mess = deletePlayerFromList(PlayerCheck.id, "AGR");
                displayMessageInSettings(mess);
                document.getElementById('rawPLayer_'+PlayerCheck.id).remove();
            });
        });
    }
    if (targetListPTRE) {
        $.each(targetListPTRE, function(i, PlayerCheck) {
            document.getElementById('removePlayerFromListBySettings_'+PlayerCheck.id).addEventListener("click", function (event) {
                // Delete player from list
                var mess = deletePlayerFromList(PlayerCheck.id, "PTRE");
                displayMessageInSettings(mess);
                document.getElementById('rawPLayer_'+PlayerCheck.id).remove();
            });
        });
    }
}

function displaySharedData() {
    setupInfoBox("Team Shared data");
    const currentTime = Math.floor(serverTime.getTime() / 1000);
    var content = '';
    var phalanxCount = 0;
    var dataJSON = '';
    var dataList = [];
    var undefElem = 0;
    dataJSON = GM_getValue(ptreDataToSync, '');
    const highlightedPlayersList = GM_getValue(ptreHighlightedPlayers, {});

    // TODO: [LOW] factorise loops
    content += '<div class="ptreCategoryTitle">Synced data</div><table><tr><td width="200px" valign="top" align="center"><div class="ptreSubTitle">Phalanx</div><table width="90%"><tr class="tr_cell_radius"><td class="td_cell_radius_0" align="center">Coords</td><td class="td_cell_radius_0" align="center">Level</td></tr>';
    if (dataJSON != '') {
        dataList = JSON.parse(dataJSON);
        $.each(dataList, function(i, elem) {
            if (elem.type == "phalanx") {
                content += '<tr class="tr_cell_radius"><td class="td_cell_radius_1" align="center">' + elem.coords + 'L</td><td class="td_cell_radius_1" align="center">' + elem.val + '</td></tr>';
                phalanxCount++;
            }
        });
    }
    content += '<tr class="tr_cell_radius"><td class="td_cell_radius_1" colspan="3" align="center">Total: ' + phalanxCount + ' phalanx (' + undefElem + ')</td></tr></table><br><a href="/game/index.php?page=ingame&component=facilities">Visit every moon\'s buildings to update</a>';

    content += '</td><td width="200px" valign="top" align="center"><div class="ptreSubTitle">Hot Targets</div><table width="90%"><tr class="tr_cell_radius"><td class="td_cell_radius_0" align="center">Player</td></tr>';
    $.each(highlightedPlayersList, function(i, elem) {
        if (elem.status == "hot") {
            content += '<tr class="tr_cell_radius"><td class="td_cell_radius_1" align="center">' + elem.name + '</td></tr>';
        }
    });
    content += '</table><br><br><span class="ptreSuccess">Players recently spied</span>';

    content += '</td><td width="200px" valign="top" align="center"><div class="ptreSubTitle">Do Not Probe</div><table width="90%"><tr class="tr_cell_radius"><td class="td_cell_radius_0" align="center">Player</td><td class="td_cell_radius_0" align="center">Duration</td></tr>';
    $.each(highlightedPlayersList, function(i, elem) {
        if (elem.status == "dnp") {
            var duration = Math.round((elem.ts - currentTime) / 60);
            content += '<tr class="tr_cell_radius"><td class="td_cell_radius_1" align="center">' + elem.name + '</td><td class="td_cell_radius_1" align="center">' + duration + ' min</td></tr>';
        }
    });
    content += '</table><br><br><span class="ptreError">Do not probe thoses players</span><br>This feature requires Live Update';

    const galaEventsList = GM_getValue(ptreGalaxyEventsPos, []);
    content += '</td><td width="200px" valign="top" align="center"><div class="ptreSubTitle">Recent Galaxy Events</div>';
    content += 'Galaxy Events count:<br><span class="ptreSuccess">' + galaEventsList.length + '</span><br><br>';
    content += 'You may display events in<br>the <span class="ptreSuccess">PTRE toolbar</span><br><br>(<a href="/game/index.php?page=ingame&component=galaxy">on galaxy page</a>)';
    content += '</td></tr></table>';

    if (GM_getValue(ptreEnableConsoleDebug, 'false') == 'true') {
        const updateCooldown = GM_getValue(ptreCheckForUpdateCooldown, 0);
        const lastDataSync = getLastUpdateLabel(GM_getValue(ptreLastDataSync, 0));
        const lastCheck = getLastUpdateLabel(GM_getValue(ptreLastUpdateCheck, 0));
        const lastGlobalSync = getLastUpdateLabel(GM_getValue(ptreLastGlobalSync, 0));
        const nextGlobalSync = Math.round((lastGlobalSync + globalPTRESyncTimeout - currentTime) / 3600);
        const syncTimeout = globalPTRESyncTimeout / 3600;
        content += '<hr><div class="ptreCategoryTitle">Debug</div>';
        content += 'Last Global Sync (every ' + syncTimeout + 'h): ' + lastGlobalSync + '<br>';
        content += 'Next Global Sync in ' + nextGlobalSync + 'h<br><br>';

        if (updateCooldown > 0) {
            content += 'Live Auto-Update is enabled<br>';
            content += 'Last Check (every ' + updateCooldown + ' sec): ' + lastCheck + '<br>';
            content += 'Last Data Sync: ' + lastDataSync + '<br>';
        } else {
            content += 'Auto-Update is disabled<br>';
        }
    }

    document.getElementById('infoBoxContent').innerHTML = content;
}

function validatePurgeGalaxyTracking() {
    setupInfoBox("Delete Galaxy tracking data ?");
    var content = '<span class="ptreError">This will delete galaxy data from local storage.</span><br><br>';
    content+= 'It is recommended to delete thoses data only if you have issues with galaxy feature<br>or if you have not play for a long time this universe.<br><br>';
    content+= '<div id="purgeGalaxyTracking" class="button btn_blue">PURGE DATA, REALLY?</div>';
    document.getElementById('infoBoxContent').innerHTML = content;

    // Action: Purge Galaxy Tracking
    document.getElementById('purgeGalaxyTracking').addEventListener("click", function (event) {
        for(var gala = 1; gala <= 12 ; gala++) {
            GM_deleteValue(ptreGalaxyData+gala);
        }
        displayGalaxyTracking();
        addToLogs("Purged Galaxy data");
    });
}

function displayTotalSystemsSaved() {
    var countGala = 0;
    var countSsystem = 0;

    if (GM_getValue(ptreGalaxyStorageVersion, 1) == 2) {
        for(var gala = 1; gala <= 15 ; gala++) {
            var galaxyData = GM_getValue(ptreGalaxyData+gala, '');
            if (galaxyData != '') {
                countGala++;
                countSsystem = countSsystem + Object.keys(galaxyData).length;
            }
        }
        return 'Tracked Galaxies: <span class="ptreSuccess">'+countGala+'</span> | Tracked Systems: <span class="ptreSuccess">'+countSsystem+'</span>';
    } else {
        return '<span class="ptreError">Wrong Galaxy Cache Version</span>';
    }
}

