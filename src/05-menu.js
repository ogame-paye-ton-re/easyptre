// ****************************************
// MENUS
// ****************************************

// Creates the unified main box on first call, then only updates title and active nav.
// navKey: 'Settings' | 'Data' | 'Galaxy' | 'Changelog' | 'Help' | 'Logs' | null
function setupMainBox(title, navKey) {
    if (!document.getElementById('ptreMainWrapper')) {
        var defaultMessageDivInPanel = "";
        if (!isValidTeamKey(GM_getValue(ptreTeamKey, ''))) {
            defaultMessageDivInPanel = ptreMissingTKMessage;
        }
        const agrEnabled = isAGREnabled();

        var html = '<div id="ptreMainBox">';
        html += '<div id="ptreMainHeader">';
        html += '<div id="ptreMainHeaderTop">';
        html += '<span id="ptreMainTitle"></span>';
        html += '<div id="ptreMainHeaderButtons">';
        html += ' <div id="ptreMainRefresh" type="button" class="button btn_blue ptreNavBtn">&#8635; Refresh View</div>';
        html += ' <div id="ptreMainClose" type="button" class="button btn_blue ptreNavBtn">&#10005; Close</div>';
        html += '</div>';
        html += '</div>';
        html += '<div id="messageDivInPanel" class="ptreWarning">' + defaultMessageDivInPanel + '</div>';
        html += '</div>';
        html += '<div id="ptreMainBody">';
        html += '<div id="ptreMainContent"></div>';
        html += '<div id="ptreMainNav">';
        html += '<div id="ptreNavOverview" class="button btn_blue ptreNavBtn">Overview</div>';
        html += '<div id="ptreNavSettings" class="button btn_blue ptreNavBtn">&#9881; Settings</div>';
        html += '<div id="ptreNavData" class="button btn_blue ptreNavBtn">&#9733; Shared Data</div>';
        html += '<div id="ptreNavPTRETargets" class="button btn_blue ptreNavBtn">&#9992; PTRE Targets</div>';
        if (agrEnabled) {
            html += '<div id="ptreNavAGRTargets" class="button btn_blue ptreNavBtn">&#9992; AGR Targets</div>';
        }
        html += '<div id="ptreNavGalaxy" class="button btn_blue ptreNavBtn">&#128506; Galaxy</div>';
        html += '<div id="ptreNavSharedNotes" class="button btn_blue ptreNavBtn">&#128221; Shared Notes</div>';
        html += '<div><hr></div>';
        html += '<div id="ptreNavHelp" class="button btn_blue ptreNavBtn">&#10067; Help</div>';
        html += '<div id="ptreNavLogs" class="button btn_blue ptreNavBtn">&#128221; Logs</div>';
        html += '<div id="ptreNavToolsCompatibility" class="button btn_blue ptreNavBtn">&#9881; Tools Compat</div>';
        html += '<div id="ptreNavChangelog" class="button btn_blue ptreNavBtn">&#128221; Changelog</div>';
        html += '<div><hr></div>';
        html += '<div id="ptreNavUpdates" class="button btn_blue ptreNavBtn">&#128640; Updates</div>';
        html += '<div id="ptreNavTMKeys" class="button btn_blue ptreNavBtn">&#128273; TM Keys</div>';
        html += '</div></div>';
        html += '<div id="ptreMainFooter">';
        html += '<div id="ptreMainFooterLeft"><a href="https://ptre.chez.gg/" target="_blank">PTRE website</a>&nbsp;|&nbsp;<a href="https://discord.gg/WsJGC9G" target="_blank">Discord</a>&nbsp;|&nbsp;<a href="https://ko-fi.com/ptreforogame" target="_blank">Donate</a></div>';
        html += '<div id="ptreMainFooterRight"><span class="ptreBold">EasyPTRE v' + GM_info.script.version + '</span></div>';
        html += '</div>';
        html += '<div id="ptreMainFooterMsg"><span id="ptreUpdateVersionMessage"></span></div>';
        html += '</div>';
        var wrapper = document.createElement('div');
        wrapper.id = 'ptreMainWrapper';
        wrapper.innerHTML = html;
        document.body.appendChild(wrapper);
        document.getElementById('ptreMainClose').addEventListener('click', function() {
            closePTREMenu();
        });
        document.getElementById('ptreMainRefresh').addEventListener('click', function() {
            if (ptreCurrentView) {
                document.getElementById('ptreMainContent').innerHTML = '';
                setTimeout(() => {
                    ptreCurrentView();
                }, 100);
            }
        });
        document.getElementById('ptreNavSettings').addEventListener('click', function() { displaySettings(); });
        document.getElementById('ptreNavOverview').addEventListener('click', function() { displayOverview(); });
        document.getElementById('ptreNavData').addEventListener('click', function() { displaySharedData(); });
        document.getElementById('ptreNavGalaxy').addEventListener('click', function() { displayGalaxyTracking(); });
        if (agrEnabled) {
            document.getElementById('ptreNavAGRTargets').addEventListener('click', function() { displayAGRTargetsList(); });
        }
        document.getElementById('ptreNavPTRETargets').addEventListener('click', function() { displayPTRETargetsList(); });
        document.getElementById('ptreNavChangelog').addEventListener('click', function() { displayChangelog(); });
        document.getElementById('ptreNavHelp').addEventListener('click', function() { displayHelp(); });
        document.getElementById('ptreNavLogs').addEventListener('click', function() { displayLogs(); });
        document.getElementById('ptreNavUpdates').addEventListener('click', function() { displayUpdateBox(''); });
        document.getElementById('ptreNavToolsCompatibility').addEventListener('click', function() { displayToolsCompatibility(); });
        document.getElementById('ptreNavSharedNotes').addEventListener('click', function() { displayAllSharedNotes(); });
        document.getElementById('ptreNavTMKeys').addEventListener('click', function() { displayTamperMonkeyKeys(); });
    }
    document.getElementById('ptreMainTitle').textContent = title;
    var badge = document.getElementById('ptreTopRightMenuButton');
    if (badge) { badge.style.display = 'none'; }
    document.querySelectorAll('.ptreNavBtn').forEach(function(b) { b.classList.remove('ptreNavActive'); });
    if (navKey) {
        var activeBtn = document.getElementById('ptreNav' + navKey);
        if (activeBtn) { activeBtn.classList.add('ptreNavActive'); }
    }
    document.getElementById('ptreMainContent').innerHTML = '<br><center><span class="ptreWarning">LOADING...</span></center><br>';
}

// Displays PTRE settings
function displaySettings() {
    const currentTime = getIGCurrentTS();
    ptreCurrentView = displaySettings;
    setupMainBox('EasyPTRE Settings', 'Settings');

    var ptreStoredTK = GM_getValue(ptreTeamKey, '');

    // Check if AGR is enabled
    var isAGROn = false;
    if (isAGREnabled()) {
        isAGROn = true;
    }

    //const betaMessage = '<br><span class="ptreSmall ptreError">Enables Beta features that might be unpolished.</span>';
    const betaMessage = '<br><span class="ptreSmall ptreSuccess">No Beta feature, at the moment. Previous one: Galaxy Pop-up (jan 2026).</span>';
    const recommendedLabelOn = '<br><span class="ptreSmall ptreWarning">Recommended: ON.</span>';
    const recommendedLabelOff = '<br><span class="ptreSmall ptreWarning">Recommended: OFF.</span>';
    const minerModeOnLabel = '<br><span class="ptreSmall ptreWarning">Disable Miner Mode if you want to enable it.</span>';

    // Get every settings
    var improveAGRTableOn = (GM_getValue(ptreImproveAGRSpyTable, 'true') == 'true' ? 'checked' : '');
    var buddiesOn = (GM_getValue(ptreAddBuddiesToFriendsAndPhalanx, 'true') == 'true' ? 'checked' : '');
    var galaxyPopupOn = (GM_getValue(ptreEnableGalaxyPopup, 'true') == 'true' ? 'checked' : '');
    var toogleEventsOn = (GM_getValue(ptreToogleEventsOverview, 'false') == 'true' ? 'checked' : '');
    var BetaModeOn = (GM_getValue(ptreEnableBetaMode, 'false') == 'true' ? 'checked' : '');
    var MinerModeOn = (GM_getValue(ptreEnableMinerMode, 'false') == 'true' ? 'checked' : '');
    var debugMode = (GM_getValue(ptreEnableConsoleDebug, 'false') == 'true' ? 'checked' : '');

    var tdId = 0;
    var divPTRE = '<table border="1" width="100%">';
    // Settings
    divPTRE += '<tr><td class="td_cell"><div class="ptreCategoryTitle">Settings</div></td><td class="td_cell" align="right"><div id="btnSaveOptPTRE" type="button" class="button btn_blue">&#128190; SAVE</div></td></tr>';
    divPTRE += '<tr><td colspan="2"><table width="100%"><tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'"><div>PTRE Team Key:';
    if (ptreStoredTK == '') {
        divPTRE += '<br><span class="ptreError">Add your PTRE TEAM KEY</span><br><span class="ptreSmall ptreError">Looks like: TM-????-????-????-????</span>';
    } else if (!isValidTeamKey(ptreStoredTK)) {
        divPTRE += '<br><span class="ptreError">Invalid PTRE TEAM KEY</span><br><span class="ptreSmall ptreError">Looks like: TM-????-????-????-????</span>';
    } else {
        divPTRE += '<br><span class="ptreSmall">Team Name: </span><span class="ptreSmall ptreSuccess">'+GM_getValue(ptreTeamName, '???')+'</span>';
    }
    divPTRE += '</div></td><td class="td_cell_radius_'+(tdId%2)+'" align="center"><div><input onclick="document.getElementById(\'ptreTK\').type = \'text\'" style="width:160px;" type="password" id="ptreTK" value="'+ ptreStoredTK +'"></div></td></tr>';
    tdId++;
    // Separator
    divPTRE += '<tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'" style="text-align: center;" colspan="2"><hr></td></tr>';
    tdId++;
    // If AGR is detected
    if (isAGROn) {
        // AGR Spy Table Improvement
        divPTRE += '<tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'">Improve AGR Spy Table:';
        if (improveAGRTableOn != 'checked') {
            divPTRE += recommendedLabelOn;
        }
        divPTRE += '</td>';
        divPTRE += '<td class="td_cell_radius_'+(tdId%2)+'" style="text-align: center;"><input id="PTREImproveAGRSpyTable" type="checkbox" ';
        divPTRE += improveAGRTableOn;
        divPTRE += ' />';
        divPTRE += '</td></tr>';
        tdId++;
    }
    // Add Buddies to Friends and Phalanx feature
    divPTRE += '<tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'">Add Buddies to Friends & Phalanx feature:<br><span class="ptreSmall">List is not shared, nor stored by PTRE. <a href="/game/index.php?page=ingame&component=buddies">Update</a>.<br>(Last Refresh: ' +getLastUpdateLabel(GM_getValue(ptreBuddiesListLastRefresh, 0)) + ')</span>';
    if (buddiesOn != 'checked') {
        divPTRE += recommendedLabelOn;
    }
    divPTRE += '</td>';
    divPTRE += '<td class="td_cell_radius_'+(tdId%2)+'" style="text-align: center;"><input id="PTREAddBuddiesToFriendsAndPhalanx" type="checkbox" ';
    divPTRE += buddiesOn;
    divPTRE += ' />';
    divPTRE += '</td></tr>';
    tdId++;
    // Enable Galaxy Pop-up
    divPTRE += '<tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'">Enable Galaxy Pop-up:<br><span class="ptreSmall">Add a PTRE icon close to players in galaxy view.</span>';
    if (galaxyPopupOn != 'checked') {
        divPTRE += recommendedLabelOn;
    }
    var tempCheckbox = '';
    if (MinerModeOn == 'checked') {
        divPTRE += minerModeOnLabel;
        tempCheckbox = ' disabled';
    }
    divPTRE += '</td>';
    divPTRE += '<td class="td_cell_radius_'+(tdId%2)+'" style="text-align: center;"><input id="PTREToogleGalaxyPopup" type="checkbox" ';
    divPTRE += galaxyPopupOn;
    divPTRE += tempCheckbox;
    divPTRE += ' />';
    divPTRE += '</td></tr>';
    tdId++;
    // Toogle Events on Overview Page
    divPTRE += '<tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'">Toogle Events on Overview Page:<br><span class="ptreSmall">Works well with option "Always show events" set to "Hide".</span></td>';
    divPTRE += '<td class="td_cell_radius_'+(tdId%2)+'" style="text-align: center;"><input id="PTREToogleEventOnOverviewPage" type="checkbox" ';
    divPTRE += toogleEventsOn;
    divPTRE += ' />';
    divPTRE += '</td></tr>';
    tdId++;
    // Beta Mode
    divPTRE += '<tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'">Enable Beta Mode:'+betaMessage;
    divPTRE += '</td>';
    divPTRE += '<td class="td_cell_radius_'+(tdId%2)+'" style="text-align: center;"><input id="PTREToogleBetaMode" type="checkbox" ';
    divPTRE += BetaModeOn;
    divPTRE += ' />';
    divPTRE += '</td></tr>';
    tdId++;
    // Console Debug mode
    divPTRE += '<tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'">Enable Debug Mode:<br><span class="ptreSmall">Displays debug information in the console.</span></td>';
    divPTRE += '<td class="td_cell_radius_'+(tdId%2)+'" style="text-align: center;"><input id="PTREEnableConsoleDebug" type="checkbox" ';
    divPTRE += debugMode;
    divPTRE += ' />';
    divPTRE += '</td></tr>';
    tdId++;
    // Separator
    divPTRE += '<tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'" style="text-align: center;" colspan="2"><hr></td></tr>';
    tdId++;
    // Miner Mode
    divPTRE += '<tr class="tr_cell_radius"><td class="td_cell_radius_'+(tdId%2)+'">Enable Miner Mode:<br><span class="ptreSmall">If you do not want every UX improvements, but you still want to help your Team.<br>This will disable some active features (Galaxy Toolbar, Galaxy pop-up).</span>';
    if (MinerModeOn == 'checked') {
        divPTRE += recommendedLabelOff;
    }
    divPTRE += '</td>';
    divPTRE += '<td class="td_cell_radius_'+(tdId%2)+'" style="text-align: center;"><input id="PTREToogleMinerMode" type="checkbox" ';
    divPTRE += MinerModeOn;
    divPTRE += ' />';
    divPTRE += '</td></tr>';
    tdId++;
    // End Settings
    divPTRE += '</table>';

    document.getElementById('ptreMainContent').innerHTML = divPTRE;

    // Action: Save
    document.getElementById('btnSaveOptPTRE').addEventListener("click", function (event) {
        savePTRESettings();
        displaySettings();
    });
}

// Displays overview (team data, targets, galaxy, lifeforms)
function displayOverview() {
    const currentTime = getIGCurrentTS();
    const currentUnixTS = getCurrentUnixTS();
    ptreCurrentView = displayOverview;
    setupMainBox('EasyPTRE Overview', 'Overview');

    // Shared data
    var dataJSON = '';
    dataJSON = GM_getValue(ptreDataToSync, '');
    var phalanxCountTotal = 0;
    var dnpCount = 0;
    var hotCount = 0;
    var oglOrOgiEnabled = false;
    var toolComment = "";

    if (isAGREnabled()) {
        toolComment+= "AGR ";
    }
    if (isOGLEnabled()) {
        oglOrOgiEnabled = true;
        toolComment+= "OGLight ";
    }
    if (isOGIEnabled()) {
        oglOrOgiEnabled = true;
        toolComment+= "Infinity ";
    }

    var dataList = [];
    if (dataJSON != '') {
        dataList = JSON.parse(dataJSON);
        dataList.forEach(function(elem) {
            if (elem.type == "phalanx") {
                // Count total Phalanx
                phalanxCountTotal++;
            }
        });
    }
    const galaEventsList = GM_getValue(ptreGalaxyEventsPos, []);
    const galaEventsCount = galaEventsList.length;
    const highlightedPlayersList = GM_getValue(ptreHighlightedPlayers, {});
    Object.values(highlightedPlayersList).forEach(function(elem) {
        if (elem.status == "hot") {
            hotCount++;
        } else if (elem.status == "dnp") {
            dnpCount++;
        }
    });
    var divOV = '<table border="1" width="100%">';
    divOV += '<tr><td class="td_cell"><div class="ptreCategoryTitle"></div></td><td class="td_cell" align="right"><div id="synctDataWithPTRE" class="button btn_blue">&#8635; SYNC DATA</div></td></tr>';
    divOV += '<tr><td class="td_cell" colspan="2">';
    divOV += '<table border="1" width="100%">';
    divOV += '<tr><td class="td_cell_radius_0">Team Name:<br><a href="https://ptre.chez.gg/" target="_blank">Manage Team on ptre.chez.gg</a></td><td class="td_cell_radius_0" align="center"><span class="ptreSuccess">' + GM_getValue(ptreTeamName, '???') + '</span></td></tr>';
    divOV += '<tr><td class="td_cell_radius_1">Phalanx:<br><span class="ptreSmall">Last Update: </span><span id="ptreEmpireMoonLastRefreshField">'+getLastUpdateLabel(GM_getValue(ptreEmpireMoonLastRefresh, 0))+'</span></td><td class="td_cell_radius_1" align="center"><span class="ptreSuccess">' + phalanxCountTotal + '</span></td></tr>';
    divOV += '<tr><td class="td_cell_radius_0">Hot Targets list:<br><span class="ptreSmall">Recent spy reports</span></td><td class="td_cell_radius_0" align="center"><span class="ptreSuccess">' + hotCount + '</span></td></tr>';
    divOV += '<tr><td class="td_cell_radius_1">Galaxy Events:<br><span class="ptreSmall">Changes non-listed in public API but detected by your Team</span></td><td class="td_cell_radius_1" align="center"><span class="ptreSuccess">' + galaEventsCount + '</span></td></tr>';
    divOV += '<tr><td class="td_cell_radius_0">Do Not Probe list:<br><span class="ptreSmall">Added via galaxy</span></td><td class="td_cell_radius_0" align="center"><span class="ptreSuccess">' + dnpCount + '</span></td></tr>';

    divOV += '<tr><td class="td_cell_radius_1">Last Global Sync:<br><span class="ptreSmall">All data synchronized</span></td><td class="td_cell_radius_1" align="center"><span id="ptreLastGlobalSyncField">' + getLastUpdateLabel(GM_getValue(ptreLastGlobalSync, 0)) + '</span></td></tr>';
    divOV += '<tr><td class="td_cell_radius_0">Last Data Sync:<br><span class="ptreSmall">Phalanx, Hot Spy reports, Do Not Probe list, Galaxy events<br><span id="ptreLastDataSyncMessageField" class="ptreWarning"></span></span></td><td class="td_cell_radius_0" align="center"><span id="ptreLastDataSyncField">' + getLastUpdateLabel(GM_getValue(ptreLastDataSync, 0)) + '</span></td></tr>';
    divOV += '<tr><td class="td_cell_radius_1">Last Targets Sync:<br><span class="ptreSmall">Targets list<br><span id="ptreLastTargetsSyncMessageField" class="ptreWarning"></span></span></td><td class="td_cell_radius_1" align="center"><span id="ptreLastTargetsSyncField">' + getLastUpdateLabel(GM_getValue(ptreLastTargetsSync, 0)) + '</span></td></tr>';
    divOV += '<tr><td class="td_cell_radius_0">Lifeforms researchs update:<br><span class="ptreSmall"><a href="/game/index.php?page=ingame&component=fleetdispatch">Fleet menu to update</a>. Synced to <a href="https://ptre.chez.gg/?page=lifeforms_researchs" target="_blank">PTRE Lifeforms Researchs</a></span></td><td class="td_cell_radius_0" align="center"><span id="ptreLastTechnosRefreshField">' + getLastUpdateLabel(GM_getValue(ptreLastTechnosRefresh, 0)) + '</span></td></tr>';
    divOV += '<tr><td class="td_cell_radius_1">Detected tool:<br><span class="ptreSmall">Other tools running</span></td><td class="td_cell_radius_1" align="center">' + toolComment + '</td></tr>';
    divOV += '</table></td></tr>';
    divOV += '<tr><td class="td_cell" align="center" colspan="2"><hr /></td></tr>';
    divOV += '</table>';

    // Update version message in footer
    var lastAvailableVersion = GM_getValue(ptreLastAvailableVersion, -1);
    if (lastAvailableVersion != -1 && lastAvailableVersion !== GM_info.script.version) {
        displayUpdateVersionMessage('<span class="ptreError">New version '+ lastAvailableVersion + ' is available. Update <a href="https://openuserjs.org/scripts/GeGe_GM/EasyPTRE" target="_blank">EasyPTRE</a>.</span>');
    }

    document.getElementById('ptreMainContent').innerHTML = divOV;

    // Action: Sync data to PTRE
    document.getElementById('synctDataWithPTRE').addEventListener("click", function (event) {
        globalPTRESync('manual');
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
            displayPTRETargetsList();
        });
    }

    // Action: Display Shared Data
    if (document.getElementById('displaySharedData')) {
        document.getElementById('displaySharedData').addEventListener("click", function (event) {
            displaySharedData();
        });
    }

    // Action: OGI/OGI infos
    if (document.getElementById('btnOGLOGIDetails')) {
        document.getElementById('btnOGLOGIDetails').addEventListener("click", function (event) {
            displayToolsCompatibility();
        });
    }

    // Global Sync
    if (currentTime > (GM_getValue(ptreLastGlobalSync, 0) + 15*60)) {
        setTimeout(globalPTRESync, 1000);
    }

    // Run garbage collection
    if (currentUnixTS > (Number(GM_getValue(ptreLastGarbageCollection, 0)) + ptreGarbageCollectionTimeout)) {
        runGarbageCollection();
    }

    // Check last script version
    updateLastAvailableVersion(false);
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

    // Manage imcompatible settings
    // This setting overwrites some other settings
    var galaxyPopupMode = document.getElementById('PTREToogleGalaxyPopup').checked + '';
    var minerMode = document.getElementById('PTREToogleMinerMode').checked + '';
    //console.log('Popup mode: ' + galaxyPopupMode);
    //console.log('Miner mode: ' + minerMode);

    if (minerMode == 'true') {
        galaxyPopupMode = 'false';
    }
    // Update Galaxy Popup Mode
    GM_setValue(ptreEnableGalaxyPopup, galaxyPopupMode + '');
    // Update Miner Mode
    GM_setValue(ptreEnableMinerMode, minerMode + '');


    // Update Beta Mode
    GM_setValue(ptreEnableBetaMode, document.getElementById('PTREToogleBetaMode').checked + '');

    // Save PTRE Team Key
    var newTK = document.getElementById('ptreTK').value;
    // Check PTRE Team Key Format
    if (newTK == '' || isValidTeamKey(newTK)) {
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
    addToLogs('[SETTINGS] Saving settings (Miner mode: ' + minerMode + ' | Beta mode: ' + document.getElementById('PTREToogleBetaMode').checked + ')');
    // Update menu image and remove it after few sec
    document.getElementById('ptreMenuImg').src = imgPTRESaveOK;
    setTimeout(function() {document.getElementById('ptreMenuImg').src = imgPTRE;}, ptreMenuImageDisplayTime);
}

function displayHelp() {
    ptreCurrentView = displayHelp;
    setupMainBox('Help', 'Help');
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

    document.getElementById('ptreMainContent').innerHTML = content;
}

function displayChangelog() {
    ptreCurrentView = displayChangelog;
    setupMainBox('Changelog', 'Changelog');
    var content = '<div class="ptreCategoryTitle">Versions:</div>';
    content+= '<div class="ptreSubTitle">0.16.0 (jul 2026)</div>- [Fix] OGame V13 compatibility (should still work on V12)<br>- [Fix] Lifeform researches are now auto-injected into the simulator when you open a PTRE spy report link (from Discord / Website)<br>- [Polish] Phalanx list sorted by coordinates';
    content+= '<div><hr></div>';
    content+= '<div class="ptreSubTitle">0.15.1 (apr 2026)</div>- [Polish] Add pop-up button legend<br>- [Fix] Disable galaxy pop-up button when no TK';
    content+= '<div class="ptreSubTitle">0.15.0 (apr 2026)</div>- [Polish] Refacto menus and design<br>- [Feature] Add Ingame notes menu<br>- [Feature] Improve Phalanx update (all at once)<br>- [Feature] Move galaxy pop-up feature from Beta to release<br>- [Feature] Add a setting to disable galaxy pop-up<br>- [Feature] Add TamperMonkey Keys management menu<br>- [Fix] Fix galaxy popup conflict with OGLight';
    content+= '<div><hr></div>';
    content+= '<div class="ptreSubTitle">0.14.3 (mar 2026)</div>- [Fix] Add openuserjs.org to connect list';
    content+= '<div class="ptreSubTitle">0.14.2 (mar 2026)</div>- [Feature] Add in-memory cache during galaxy browsing<br>- [Feature] Add little alert when TeamKey is missing or EasyPTRE not up-to-date<br>- [Fix] Fix timestamp management<br>- [Fix] Several code cleaning and optimizations';
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
    document.getElementById('ptreMainContent').innerHTML = content;
}

function displayUpdateBox() {
    ptreCurrentView = displayUpdateBox;
    setupMainBox('EasyPTRE Updates', 'Updates');
    var content = '<div class="ptreCategoryTitle">Check for updates</div>Last check: ' + getUnixTSLabel(GM_getValue(ptreLastAvailableVersionRefresh, 0)) + '<br><br><div id="forceCheckVersionButton" type="button" class="button btn_blue">CHECK VERSION NOW</div><br>';
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
    document.getElementById('ptreMainContent').innerHTML = content;
    document.getElementById('forceCheckVersionButton').addEventListener('click', function() {
        displayUpdateVersionMessage("Checking...");
        updateLastAvailableVersion(true);
    });
}

function displayToolsCompatibility() {
    ptreCurrentView = displayToolsCompatibility;
    setupMainBox('Tools Compatibility', 'ToolsCompatibility');
    var content = '';
    if (isOGLEnabled() || isOGIEnabled()) {
        content += '<span class="ptreWarning">OGLight or OGInfinity is enabled: some EasyPTRE features are disabled to leave priority to your favorite tool, OGL / OGI. Please also add your PTRE TeamKey into OGL / OGI.</span>';
        content += '<br><br>EasyPTRE is still managing some tasks like:<br>- Galaxy Event Explorer Infos (in galaxy view)<br>- Lifeforms/combat researchs sync (for PTRE spy reports)<br>- Phalanx infos sharing (in galaxy view or Discord)';
    }
    if (isAGREnabled()) {
        content += '<span class="ptreWarning">AGR is enabled. Your AGR target list can be synced to PTRE</span>';
    }

    document.getElementById('ptreMainContent').innerHTML = content;
}

function displayLogs() {
    ptreCurrentView = displayLogs;
    setupMainBox('Logs', 'Logs');
    var content = 'Internal logs only (errors, migrations, etc) for debug purposes if you share it with developer.<br>Logs are kept '+ (ptreLogsRetentionDuration/(24*60*60)) +' days.<br><br><div id="purgeLogs" type="button" class="button btn_blue">PURGE LOGS</div><br><br>';
    content+= '<table id="logTable"><tr><td class="td_cell_radius_0" align="center">Date</td><td class="td_cell_radius_0" align="center">Universe</td><td class="td_cell_radius_0" align="center">Log</td></tr>';

    var logsJSON = GM_getValue(ptreLogsList, '');
    var logsList = [];
    if (logsJSON != '') {
        logsList = JSON.parse(logsJSON);
    }
    logsList.sort((a, b) => b.ts - a.ts);
    logsList.forEach(function(elem) {
        if (elem.uni == country + "-" + universe) {
            content+= '<tr><td class="td_cell_radius_1" align="center"><span class="ptreSmall">' + getUnixTSLabel(elem.ts) + '</span></td><td class="td_cell_radius_1" align="center"><span class="ptreSmall">' + elem.uni + '</span></td><td class="td_cell_radius_1"><span class="ptreSmall">' + elem.log + '</span></td></tr>';
        }
    });
    content+= '</table>';

    document.getElementById('ptreMainContent').innerHTML = content;
    document.getElementById('purgeLogs').addEventListener("click", function (event) {
        cleanCurrentUniverseLogs();
        displayLogs();
    });
}

function displayGalaxyTracking() {
    ptreCurrentView = displayGalaxyTracking;
    setupMainBox('Galaxy', 'Galaxy');

    var content = '<div class="ptreCategoryTitle">Galaxy details</div>';
    if (isOGLorOGIEnabled()) {
        content += '<span class="ptreWarning">OGLight or OGInfinity is enabled: EasyPTRE is not managing galaxy pushs.<br>EasyPTRE still get Galaxy events to highlight updated positions.</span><br><br>';
    }
    content+='Storage Version: ' + GM_getValue(ptreGalaxyStorageVersion, 2) + ' | Retention: ' + ptreGalaxyStorageRetention + ' days<br>';
    content+='Last Public API Update: ' + getLastUpdateLabel(GM_getValue(ptreGalaxyAPIUpdateIGTS, 0)) + '<br><br>';

    const allGalaxyKeys = GM_listValues().filter(key => key.includes(ptreGalaxyData)).sort();

    content+='<table><tr>';
    content+='<td class="td_cell_radius_0" align="center">Galaxy</td>';
    content+='<td class="td_cell_radius_0" align="center">Systems in storage</td>';
    content+='<td class="td_cell_radius_0" align="center">Systems in cache</td>';
    content+='<td class="td_cell_radius_0" align="center">Cache status</td>';
    content+='</tr>';
    allGalaxyKeys.forEach(function(key) {
        const storedData = GM_getValue(key, {});
        const storedCount = Object.keys(storedData).length;
        // Extract galaxy number from key (key = ptreGalaxyData + gala)
        const gala = key.replace(ptreGalaxyData, '');
        const inCache = ptreGalaxyCache[gala] !== undefined;
        const cachedCount = inCache ? Object.keys(ptreGalaxyCache[gala]).length : '-';
        let statusLabel;
        if (!inCache) {
            statusLabel = '<span class="ptreWarning">not loaded</span>';
        } else if (cachedCount === storedCount) {
            statusLabel = '<span class="ptreSuccess">in sync</span>';
        } else {
            statusLabel = '<span class="ptreWarning">cache ahead (+' + (cachedCount - storedCount) + ')</span>';
        }
        content+='<tr>';
        content+='<td class="td_cell_radius_1" align="center">G' + gala + '</td>';
        content+='<td class="td_cell_radius_1" align="center">' + storedCount + '</td>';
        content+='<td class="td_cell_radius_1" align="center">' + cachedCount + '</td>';
        content+='<td class="td_cell_radius_1" align="center">' + statusLabel + '</td>';
        content+='</tr>';
    });
    if (allGalaxyKeys.length === 0) {
        content+='<tr><td class="td_cell_radius_1" colspan="4" align="center"><span class="ptreWarning">No galaxy data in storage</span></td></tr>';
    }
    content+='</table>';

    content += '<div class="ptreCategoryTitle">Distribution</div>';
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

    content+='<div class="ptreCategoryTitle">Reset galaxy data</div>';
    content+= '<div id="purgeGalaxyTracking" class="button btn_blue">PURGE DATA</div>';
    document.getElementById('ptreMainContent').innerHTML = content;

    // Action: Purge Galaxy Tracking
    document.getElementById('purgeGalaxyTracking').addEventListener("click", function (event) {
        validatePurgeGalaxyTracking();
    });
}

function displayAGRTargetsList() {
    ptreCurrentView = displayAGRTargetsList;
    setupMainBox('AGR Targets', 'AGRTargets');

    var content = '<div id="targetsListDiv"><table width="100%"><tr><td><a href="https://ptre.chez.gg/?country='+country+'&univers='+universe+'&page=players_list" target="_blank">Manage list on PTRE website</a></td><td align="right"><div id="reloadLocalList" class="button btn_blue">&#8635; RELOAD LOCAL LIST</div> <div id="synctTargetsWithPTRE" class="button btn_blue">&#8635; SYNC TARGETS</div></td></tr></table><br><br>';

    var isAGROn = false;
    if (isAGREnabled()) {
        isAGROn = true;
        updateLocalAGRList();
    }

    var targetJSON = '';
    var targetList = '';
    if (!isAGROn) {
        content += '<span class="ptreError">AGR is not enabled.</span>';
    } else {
        content += 'AGR Target List<br><span class="ptreSmall">This list is based on your AGR list</span><br><br><table width="100%">';
        content += '<tr class="tr_cell_radius"><td class="td_cell_radius_0"><div class="ptreSubTitle">Player<br>Name</div></td><td class="td_cell_radius_0" align="center"><div class="ptreSubTitle">Fleet<br>Infos</div></td><td class="td_cell_radius_0" align="center"><div class="ptreSubTitle">PTRE<br>Profile</div></td><td class="td_cell_radius_0" align="center"><div class="ptreSubTitle">Keep<br>Private</div></td><td class="td_cell_radius_0" align="center"><div class="ptreSubTitle">Remove<br>Target</div></td></tr>';
        targetJSON = GM_getValue(ptreAGRPlayerListJSON, '');
        if (targetJSON != '') {
            targetList = JSON.parse(targetJSON);
            if (targetList) {
                targetList.forEach(function(PlayerCheck, index) {
                    const i = index + 1;
                    content += '<tr id="rawPLayer_'+PlayerCheck.id+'" class="tr_cell_radius"><td class="td_cell_radius_'+(i%2)+'">'+PlayerCheck.pseudo+'</td>';
                    content += '<td class="td_cell_radius_'+(i%2)+'" align="center"><div id="btnGetPlayerInfos'+PlayerCheck.id+'" type="button" class="button btn_blue">FLEET</div></td>';
                    content += '<td class="td_cell_radius_'+(i%2)+'" align="center"><a href="' + buildPTRELinkToPlayer(PlayerCheck.id) + '" target="_blank">Profile</a></td>';
                    var checked = '';
                    if (isTargetPrivate(PlayerCheck.id)) {
                        checked = ' checked';
                    }
                    content += '<td class="td_cell_radius_'+(i%2)+'" align="center"><input class="sharedTargetStatus" id="'+PlayerCheck.id+'" type="checkbox"' + checked + '></td>';
                    content += '<td class="td_cell_radius_'+(i%2)+'" align="center"><a class="tooltip" id="removePlayerFromListBySettings_'+PlayerCheck.id+'" style="cursor:pointer;"><img class="mouseSwitch" src="' + imgSupPlayer + '" height="12" width="12"></a></td>';
                    content += '</tr>';
                });
            }
        }
        content += '</table> (x' + (targetList ? targetList.length : 0) + ')';
    }
    content += '</div>';
    document.getElementById('ptreMainContent').innerHTML = content;

    // Action: reload list
    document.getElementById('reloadLocalList').addEventListener("click", function (event) {
        setTimeout(displayAGRTargetsList, 100);
    });
    // Action: sync targets
    document.getElementById('synctTargetsWithPTRE').addEventListener("click", function (event) {
        syncTargets("manual");
    });
    // Action: Toggle target status
    var targetStatus = document.getElementsByClassName('sharedTargetStatus');
    Array.from(targetStatus).forEach(function(target) {
        document.getElementById(target.id).addEventListener("click", function (event) {
            var status = toogleTargetPrivateStatus(target.id);
            displayMessageInSettings('Target is now ' + status);
        });
    });
    // Action: Player Infos + Delete
    if (targetList) {
        targetList.forEach(function(PlayerCheck) {
            document.getElementById('btnGetPlayerInfos'+PlayerCheck.id).addEventListener("click", function (event) {
                getPlayerInfos(PlayerCheck.id, PlayerCheck.pseudo);
            });
            document.getElementById('removePlayerFromListBySettings_'+PlayerCheck.id).addEventListener("click", function (event) {
                var mess = deletePlayerFromList(PlayerCheck.id, "AGR");
                displayMessageInSettings(mess);
                document.getElementById('rawPLayer_'+PlayerCheck.id).remove();
            });
        });
    }
}

function displayPTRETargetsList() {
    ptreCurrentView = displayPTRETargetsList;
    setupMainBox('PTRE Targets', 'PTRETargets');

    var content = '<div id="targetsListDiv"><table width="100%"><tr><td><a href="https://ptre.chez.gg/?country='+country+'&univers='+universe+'&page=players_list" target="_blank">Manage list on PTRE website</a></td><td align="right"><div id="reloadLocalList" class="button btn_blue">&#8635; RELOAD LOCAL LIST</div> <div id="synctTargetsWithPTRE" class="button btn_blue">&#8635; SYNC TARGETS</div></td></tr></table><br><br>';

    var targetJSON = '';
    var targetListPTRE = '';
    content += 'PTRE Team Target List<br><span class="ptreSmall">Common list with your Team</span><br><br><table width="100%">';
    content += '<tr class="tr_cell_radius"><td class="td_cell_radius_0"><div class="ptreSubTitle">Player<br>Name</div></td><td class="td_cell_radius_0" align="center"><div class="ptreSubTitle">Fleet<br>Infos</div></td><td class="td_cell_radius_0" align="center"><div class="ptreSubTitle">PTRE<br>Profile</div></td><td class="td_cell_radius_0" align="center"><div class="ptreSubTitle">Remove<br>Target</div></td></tr>';
    targetJSON = GM_getValue(ptrePTREPlayerListJSON, '');
    if (targetJSON != '') {
        targetListPTRE = JSON.parse(targetJSON);
        if (targetListPTRE) {
            targetListPTRE.forEach(function(PlayerCheck, index) {
                const i = index + 1;
                content += '<tr id="rawPLayer_'+PlayerCheck.id+'" class="tr_cell_radius"><td class="td_cell_radius_'+(i%2)+'">'+PlayerCheck.pseudo+'</td>';
                content += '<td class="td_cell_radius_'+(i%2)+'" align="center"><div id="btnGetPlayerInfos'+PlayerCheck.id+'" type="button" class="button btn_blue">FLEET</div></td>';
                content += '<td class="td_cell_radius_'+(i%2)+'" align="center"><a href="' + buildPTRELinkToPlayer(PlayerCheck.id) + '" target="_blank">Profile</a></td>';
                content += '<td class="td_cell_radius_'+(i%2)+'" align="center"><a class="tooltip" id="removePlayerFromListBySettings_'+PlayerCheck.id+'" style="cursor:pointer;"><img class="mouseSwitch" src="' + imgSupPlayer + '" height="12" width="12"></a></td>';
                content += '</tr>';
            });
        }
    }
    content += '</table> (x' + (targetListPTRE ? targetListPTRE.length : 0) + ')';
    content += '</div>';
    document.getElementById('ptreMainContent').innerHTML = content;

    // Action: reload list
    document.getElementById('reloadLocalList').addEventListener("click", function (event) {
        setTimeout(displayPTRETargetsList, 100);
    });
    // Action: sync targets
    document.getElementById('synctTargetsWithPTRE').addEventListener("click", function (event) {
        syncTargets("manual");
    });
    // Action: Player Infos + Delete
    if (targetListPTRE) {
        targetListPTRE.forEach(function(PlayerCheck) {
            document.getElementById('btnGetPlayerInfos'+PlayerCheck.id).addEventListener("click", function (event) {
                getPlayerInfos(PlayerCheck.id, PlayerCheck.pseudo);
            });
            document.getElementById('removePlayerFromListBySettings_'+PlayerCheck.id).addEventListener("click", function (event) {
                var mess = deletePlayerFromList(PlayerCheck.id, "PTRE");
                displayMessageInSettings(mess);
                document.getElementById('rawPLayer_'+PlayerCheck.id).remove();
            });
        });
    }
}

function displaySharedData() {
    ptreCurrentView = displaySharedData;
    setupMainBox('Shared Data', 'Data');
    const currentTime = getIGCurrentTS();
    var content = '';
    var phalanxCount = 0;
    var dataJSON = '';
    var dataList = [];
    var missingPhalanx = 0;
    dataJSON = GM_getValue(ptreDataToSync, '');
    const highlightedPlayersList = GM_getValue(ptreHighlightedPlayers, {});

    // TODO: [LOW] factorise loops
    content += '<div class="ptreCategoryTitle">Synced data</div><table><tr><td width="200px" valign="top" align="center"><div class="ptreSubTitle">Phalanx</div><table width="90%"><tr class="tr_cell_radius"><td class="td_cell_radius_0" align="center">Coords</td><td class="td_cell_radius_0" align="center">Level</td></tr>';
    if (dataJSON != '') {
        dataList = JSON.parse(dataJSON);
        var phalanxList = dataList.filter(function(elem) { return elem.type == "phalanx"; });
        phalanxList.sort(function(a, b) {
            var pa = a.coords.split(':').map(Number);
            var pb = b.coords.split(':').map(Number);
            return (pa[0] - pb[0]) || (pa[1] - pb[1]) || (pa[2] - pb[2]);
        });
        phalanxList.forEach(function(elem) {
            let val = elem.val;
            if (val == -1) {
                missingPhalanx++;
                val = '<span class="ptreWarning">???</span>';
            }
            content += '<tr class="tr_cell_radius"><td class="td_cell_radius_1" align="center">' + elem.coords + 'L</td><td class="td_cell_radius_1" align="center">' + val + '</td></tr>';
            phalanxCount++;
        });
    }
    content += '<tr class="tr_cell_radius"><td class="td_cell_radius_1" colspan="3" align="center">Total: ' + phalanxCount + ' phalanx<br><span class="ptreSmall">Empty: ' + missingPhalanx + '</span></td></tr></table><br><a href="https://ptre.chez.gg/?page=phalanx_debug" target="_blank">Phalanx Debug</a><br><br><div id="refreshEmpireMoonDataButton" class="button btn_blue">&#8635; UPDATE</div><br><span id="ptreEmpireMoonLastRefreshField">'+getLastUpdateLabel(GM_getValue(ptreEmpireMoonLastRefresh, 0))+'</span>';

    content += '</td><td width="200px" valign="top" align="center"><div class="ptreSubTitle">Hot Targets</div><table width="90%"><tr class="tr_cell_radius"><td class="td_cell_radius_0" align="center">Player</td></tr>';
    Object.values(highlightedPlayersList).forEach(function(elem) {
        if (elem.status == "hot") {
            content += '<tr class="tr_cell_radius"><td class="td_cell_radius_1" align="center">' + elem.name + '</td></tr>';
        }
    });
    content += '</table><br><br><span class="ptreSuccess">Players recently spied</span>';

    content += '</td><td width="200px" valign="top" align="center"><div class="ptreSubTitle">Do Not Probe</div><table width="90%"><tr class="tr_cell_radius"><td class="td_cell_radius_0" align="center">Player</td><td class="td_cell_radius_0" align="center">Duration</td></tr>';
    Object.values(highlightedPlayersList).forEach(function(elem) {
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
        const lastDataSync = GM_getValue(ptreLastDataSync, 0);
        const lastCheck = GM_getValue(ptreLastUpdateCheck, 0);
        const lastGlobalSync = GM_getValue(ptreLastGlobalSync, 0);
        const nextGlobalSync = Math.round((lastGlobalSync + ptreGlobalPTRESyncTimeout - currentTime) / 3600);
        const syncTimeout = ptreGlobalPTRESyncTimeout / 3600;
        content += '<hr><div class="ptreCategoryTitle">Debug</div>';
        content += 'Last Global Sync (every ' + syncTimeout + 'h): ' + getLastUpdateLabel(lastGlobalSync) + '<br>';
        content += 'Next Global Sync in ' + nextGlobalSync + 'h<br><br>';

        if (updateCooldown > 0) {
            content += 'Live Auto-Update is enabled<br>';
            content += 'Last Check (every ' + updateCooldown + ' sec): ' + getLastUpdateLabel(lastCheck) + '<br>';
            content += 'Last Data Sync: ' + getLastUpdateLabel(lastDataSync) + '<br>';
        } else {
            content += 'Auto-Update is disabled<br>';
        }
    }

    document.getElementById('ptreMainContent').innerHTML = content;

    // Action: Empire Moon page refresh
    if (document.getElementById('refreshEmpireMoonDataButton')) {
        document.getElementById('refreshEmpireMoonDataButton').addEventListener("click", function (event) {
            document.getElementById('refreshEmpireMoonDataButton').remove();
            updateDataFromEmpireMoonPage();
        });
    }
}

function validatePurgeGalaxyTracking() {
    setupMainBox('Delete Galaxy data?', 'Galaxy');
    var content = '<span class="ptreError">This will delete galaxy data from local storage.</span><br><br>';
    content+= 'It is recommended to delete thoses data only if you have issues with galaxy feature<br>or if you have not play for a long time this universe.<br><br>';
    content+= '<div id="purgeGalaxyTracking" class="button btn_blue">PURGE DATA, REALLY?</div>';
    document.getElementById('ptreMainContent').innerHTML = content;

    // Action: Purge Galaxy Tracking
    document.getElementById('purgeGalaxyTracking').addEventListener("click", function (event) {
        for(var gala = 1; gala <= 15 ; gala++) {
            GM_deleteValue(ptreGalaxyData+gala);
        }
        ptreGalaxyCache = {}; // Clear in-memory cache after purge
        displayGalaxyTracking();
        addToLogs("[PURGE] Galaxy data");
    });
}

function displayAllSharedNotes() {
    ptreCurrentView = displayAllSharedNotes;
    setupMainBox('Shared Notes', 'SharedNotes');

    const TKey = GM_getValue(ptreTeamKey, '');
    if (TKey == '') {
        document.getElementById('ptreMainContent').innerHTML = '<span class="ptreError">' + ptreMissingTKMessage + '</span>';
        return;
    }

    fetch(urlPTREIngamePopUp + '&team_key=' + TKey + '&action=getallnotes', { method: 'POST' })
        .then(function(response) { return response.json(); })
        .then(function(reponseDecode) {
            if (!document.getElementById('ptreMainContent')) { return; }
            consoleDebug('[FROM PTRE] ' + reponseDecode.message);
            if (reponseDecode.code == 1) {
                var notesHtml = atob(reponseDecode.allnotes);
                document.getElementById('ptreMainContent').innerHTML = notesHtml;
                // Add events on buttons
                document.querySelectorAll('.updatePlayerNote').forEach(function(el) {
                    var playerId = el.id.split('-')[1];
                    el.addEventListener('click', function() {
                        pushPlayerNote(playerId);
                        //displayAllSharedNotes();
                    });
                });
            } else {
                document.getElementById('ptreMainContent').innerHTML = '<span class="ptreError">' + reponseDecode.message + '</span>';
                addToLogs('[NOTES] ' + reponseDecode.message);
            }
        })
        .catch(function(e) {
            updateHtmlById('ptreMainContent', '<span class="ptreError">Request failed</span>');
            addToLogs('[NOTES] ' + e);
        });
}

// List every universes keys
// Key format: "ptre-" + country + "-" + universe + "-"
function displayTamperMonkeyKeys() {
    ptreCurrentView = displayTamperMonkeyKeys;
    setupMainBox('Tampermonkey Keys', 'TMKeys');

    const allKeys = GM_listValues();
    const uniMap = {};
    allKeys.forEach(function(key) {
        const match = key.match(/^ptre-([a-z]+)-(\d+)-(.+)$/);
        if (match) {
            const c = match[1];
            const u = match[2];
            const uniKey = c + '-' + u;
            if (!uniMap[uniKey]) {
                uniMap[uniKey] = { country: c, universe: u, keys: [] };
            }
            uniMap[uniKey].keys.push(key);
        }
    });

    var content = '<div class="ptreCategoryTitle">Garbage Collection</div>Last run: ' + getUnixTSLabel(GM_getValue(ptreLastGarbageCollection, 0)) + ' (every ' + (ptreGarbageCollectionTimeout/3600) + 'h)<br><br>';
    content += '<div class="ptreCategoryTitle">Tampermonkey Keys per Universe</div>';
    content += 'All stored keys grouped by universe. The Team Key (TK) is preserved when purging.<br><br>';

    const uniKeys = Object.keys(uniMap).sort();
    if (uniKeys.length === 0) {
        content += '<span class="ptreWarning">No per-universe keys found.</span>';
    } else {
        content += '<table width="100%">';
        content += '<tr><td class="td_cell_radius_0" align="center">Universe</td><td class="td_cell_radius_0" align="center">Keys</td><td class="td_cell_radius_0" align="center">Action</td></tr>';
        uniKeys.forEach(function(uniKey, index) {
            const entry = uniMap[uniKey];
            const i = (index + 1) % 2;
            const isCurrent = (entry.country === country && entry.universe === universe);
            const hasTK = entry.keys.includes('ptre-' + entry.country + '-' + entry.universe + '-TK');
            const label = entry.country + '-' + entry.universe
                + (hasTK ? ' <span class="ptreSuccess">(TK exists)</span>' : ' <span class="ptreWarning">(TK missing)</span>')
                + (isCurrent ? ' <span class="ptreError">(current)</span>' : '');
            content += '<tr>';
            content += '<td class="td_cell_radius_' + i + '">' + label + '</td>';
            content += '<td class="td_cell_radius_' + i + '" align="center">' + entry.keys.length + '</td>';
            content += '<td class="td_cell_radius_' + i + '" align="center"><div id="purgeUniKeys_' + entry.country + '_' + entry.universe + '" class="button btn_blue">PURGE</div></td>';
            content += '</tr>';
        });
        content += '</table>';
    }

    // All logs section
    content += '<div class="ptreCategoryTitle">All Logs</div>';
    content += 'Internal logs for all universes.<br><br>';
    var logsJSON = GM_getValue(ptreLogsList, '');
    var logsList = [];
    if (logsJSON != '') {
        logsList = JSON.parse(logsJSON);
    }
    logsList.sort((a, b) => b.ts - a.ts);
    content += '<table width="100%"><tr><td class="td_cell_radius_0" align="center">Date</td><td class="td_cell_radius_0" align="center">Universe</td><td class="td_cell_radius_0" align="center">Log</td></tr>';
    if (logsList.length === 0) {
        content += '<tr><td class="td_cell_radius_1" colspan="3" align="center"><span class="ptreWarning">No logs.</span></td></tr>';
    } else {
        logsList.forEach(function(elem) {
            content += '<tr><td class="td_cell_radius_1" align="center"><span class="ptreSmall">' + getUnixTSLabel(elem.ts) + '</span></td><td class="td_cell_radius_1" align="center"><span class="ptreSmall">' + elem.uni + '</span></td><td class="td_cell_radius_1"><span class="ptreSmall">' + elem.log + '</span></td></tr>';
        });
    }
    content += '</table>';

    document.getElementById('ptreMainContent').innerHTML = content;

    uniKeys.forEach(function(uniKey) {
        const entry = uniMap[uniKey];
        var btn = document.getElementById('purgeUniKeys_' + entry.country + '_' + entry.universe);
        if (btn) {
            btn.addEventListener('click', function() {
                validatePurgeTamperMonkeyKeys(entry.country, entry.universe, entry.keys.slice());
            });
        }
    });

}

function displayUpdateVersionMessage(message) {
    updateHtmlById('ptreUpdateVersionMessage', message);
}

function displayMessageInSettings(message) {
    const mess = document.getElementById('messageDivInPanel');
    if (mess) {
        mess.innerHTML = message;
    } else {
        displayPTREPopUpMessage(message);
    }
}

function closePTREMenu() {
    var menu = document.getElementById('ptreMainWrapper');
    if (menu) {
        menu.remove();
    }
    var badge = document.getElementById('ptreTopRightMenuButton');
    if (badge) {
        badge.style.display = '';
    }
}

