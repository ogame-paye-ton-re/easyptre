// ****************************************
// MENUS
// ****************************************

// Main panel navigation: [navKey, icon, label, function] (null = separator)
function getMainPanelNavItems() {
    const items = [
        ['Overview', '&#127760;', 'Overview', displayOverview],
        ['Settings', '&#9881;', 'Settings', displaySettings],
        null,
        ['GalaxyEvents', '&#128225;', 'Galaxy Events', getGEEInfosFromGala],
        ['FightEvents', '&#9876;', 'Fight Events', getFightEventsFromXPD],
        ['FriendsPhalanx', '&#128101;', 'Friends & Phalanx', getPhalanxInfosFromGala],
        ['Data', '&#9733;', 'Shared Data', displaySharedData],
        ['PTRETargets', '&#9992;', 'PTRE Targets', displayPTRETargetsList],
    ];
    if (isAGREnabled()) {
        items.push(['AGRTargets', '&#9992;', 'AGR Targets', displayAGRTargetsList]);
    }
    items.push(
        ['SharedNotes', '&#128221;', 'Shared Notes', displayAllSharedNotes],
        null,
        ['Help', '&#10067;', 'Help', displayHelp],
        ['Logs', '&#128220;', 'Logs', displayLogs],
        ['ToolsCompatibility', '&#129513;', 'Tools Compat', displayToolsCompatibility],
        ['Changelog', '&#128221;', 'Changelog', displayChangelog],
        null,
        ['Galaxy', '&#128506;', 'Galaxy', displayGalaxyTracking],
        ['Updates', '&#128640;', 'Updates', displayUpdateBox],
        ['TMKeys', '&#128273;', 'TM Keys', displayTamperMonkeyKeys]
    );
    return items;
}

// Creates the unified main box on first call, then only updates title and active nav.
// navKey: see getMainPanelNavItems() (or null)
function setupMainBox(title, navKey) {
    if (!document.getElementById('ptreMainWrapper')) {
        var defaultMessageDivInPanel = "";
        if (!isValidTeamKey(GM_getValue(ptreTeamKey, ''))) {
            defaultMessageDivInPanel = ptreMissingTKMessage;
        }
        const navItems = getMainPanelNavItems();

        var html = '<div id="ptreMainBox">';
        html += '<div id="ptreMainHeader">';
        html += '<div id="ptreMainHeaderTop" title="Drag to move, double-click to reset position">';
        html += '<span id="ptreMainTitle"></span>';
        html += '<div id="ptreMainHeaderButtons">';
        html += '<div id="ptreMainRefresh" class="button btn_blue ptreHeaderBtn" title="Refresh view">&#8635;<span class="ptreHeaderBtnLabel"> Refresh View</span></div>';
        html += '<div id="ptreMainClose" class="button btn_blue ptreHeaderBtn" title="Close (Escape)">&#10005;<span class="ptreHeaderBtnLabel"> Close</span></div>';
        html += '</div>';
        html += '</div>';
        html += '<div id="messageDivInPanel" class="ptreWarning">' + defaultMessageDivInPanel + '</div>';
        html += '</div>';
        html += '<div id="ptreMainBody">';
        html += '<div id="ptreMainContent"></div>';
        html += '<div id="ptreMainNav">';
        navItems.forEach(function(item) {
            if (item === null) {
                html += '<div class="ptreNavSeparator"></div>';
            } else {
                html += '<div id="ptreNav' + item[0] + '" class="button btn_blue ptreNavBtn" title="' + item[2] + '"><span class="ptreNavIcon">' + item[1] + '</span><span class="ptreNavLabel"> ' + item[2] + '</span></div>';
            }
        });
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
        applyMainPanelPosition(GM_getValue(ptreMainPanelPosition, null));
        setupMainPanelDrag(wrapper);
        document.addEventListener('keydown', onMainPanelKeyDown);

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
        navItems.forEach(function(item) {
            if (item !== null) {
                document.getElementById('ptreNav' + item[0]).addEventListener('click', function() { item[3](); });
            }
        });
    }
    document.getElementById('ptreMainTitle').textContent = title;
    var badge = document.getElementById('ptreTopRightMenuButton');
    if (badge) { badge.style.display = 'none'; }
    document.querySelectorAll('.ptreNavBtn').forEach(function(b) { b.classList.remove('ptreNavActive'); });
    if (navKey) {
        var activeBtn = document.getElementById('ptreNav' + navKey);
        if (activeBtn) { activeBtn.classList.add('ptreNavActive'); }
    }
    document.getElementById('ptreMainContent').innerHTML = ptreLoading();
}

// Moves the main panel to a saved position (kept inside the window), or to the default top right position
function applyMainPanelPosition(position) {
    const wrapper = document.getElementById('ptreMainWrapper');
    if (!wrapper) {
        return;
    }
    if (!position) {
        wrapper.style.left = '';
        wrapper.style.top = '';
        wrapper.style.right = '';
        return;
    }
    const maxLeft = Math.max(0, window.innerWidth - wrapper.offsetWidth);
    const maxTop = Math.max(0, window.innerHeight - 40);
    wrapper.style.left = Math.min(Math.max(0, position.left), maxLeft) + 'px';
    wrapper.style.top = Math.min(Math.max(0, position.top), maxTop) + 'px';
    wrapper.style.right = 'auto';
}

// Drag the main panel by its header (position is saved for every universe)
function setupMainPanelDrag(wrapper) {
    const handle = document.getElementById('ptreMainHeaderTop');
    handle.addEventListener('mousedown', function(event) {
        if (event.button !== 0 || event.target.closest('#ptreMainHeaderButtons')) {
            return;
        }
        event.preventDefault();
        const rect = wrapper.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        wrapper.classList.add('ptreDragging');
        const onMove = function(moveEvent) {
            applyMainPanelPosition({left: moveEvent.clientX - offsetX, top: moveEvent.clientY - offsetY});
        };
        const onUp = function() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            wrapper.classList.remove('ptreDragging');
            GM_setValue(ptreMainPanelPosition, {left: parseInt(wrapper.style.left, 10) || 0, top: parseInt(wrapper.style.top, 10) || 0});
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    });
    handle.addEventListener('dblclick', function(event) {
        if (event.target.closest('#ptreMainHeaderButtons')) {
            return;
        }
        GM_deleteValue(ptreMainPanelPosition);
        applyMainPanelPosition(null);
    });
}

// Escape closes the main panel (except while typing in a field)
function onMainPanelKeyDown(event) {
    if (event.key !== 'Escape' || event.target.closest('input, textarea, select')) {
        return;
    }
    closePTREMenu();
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

    // Get every settings
    var improveAGRTableOn = (GM_getValue(ptreImproveAGRSpyTable, 'true') == 'true' ? 'checked' : '');
    var buddiesOn = (GM_getValue(ptreAddBuddiesToFriendsAndPhalanx, 'true') == 'true' ? 'checked' : '');
    var galaxyPopupOn = (GM_getValue(ptreEnableGalaxyPopup, 'true') == 'true' ? 'checked' : '');
    var toogleEventsOn = (GM_getValue(ptreToogleEventsOverview, 'false') == 'true' ? 'checked' : '');
    var BetaModeOn = (GM_getValue(ptreEnableBetaMode, 'false') == 'true' ? 'checked' : '');
    var MinerModeOn = (GM_getValue(ptreEnableMinerMode, 'false') == 'true' ? 'checked' : '');
    var debugMode = (GM_getValue(ptreEnableConsoleDebug, 'false') == 'true' ? 'checked' : '');

    const checkbox = (id, checked, extra = '') => '<input id="' + id + '" type="checkbox" ' + checked + extra + ' />';
    const small = (text, className = '') => '<span class="ptreSmall' + (className ? ' ' + className : '') + '">' + text + '</span>';

    // Team
    var tkDescription;
    if (ptreStoredTK == '') {
        tkDescription = '<span class="ptreError">Add your PTRE TEAM KEY</span><br>' + small('Looks like: TM-????-????-????-????', 'ptreError');
    } else if (!isValidTeamKey(ptreStoredTK)) {
        tkDescription = '<span class="ptreError">Invalid PTRE TEAM KEY</span><br>' + small('Looks like: TM-????-????-????-????', 'ptreError');
    } else {
        tkDescription = 'Team Name: ' + small(GM_getValue(ptreTeamName, '???'), 'ptreSuccess');
    }
    const teamRows = [
        {label: 'PTRE Team Key:', description: tkDescription, value: '<input style="width:160px;" type="password" id="ptreTK">'},
    ];

    // Features
    const featureRows = [];
    if (isAGROn) {
        featureRows.push({label: 'Improve AGR Spy Table:', description: improveAGRTableOn != 'checked' ? small('Recommended: ON.', 'ptreWarning') : '',
            value: checkbox('PTREImproveAGRSpyTable', improveAGRTableOn)});
    }
    featureRows.push({label: 'Add Buddies to Friends & Phalanx feature:',
        description: 'List is not shared, nor stored by PTRE. <a href="/game/index.php?page=ingame&component=buddies">Update</a>.<br>(Last Refresh: ' + getLastUpdateLabel(GM_getValue(ptreBuddiesListLastRefresh, 0)) + ')'
            + (buddiesOn != 'checked' ? '<br>' + small('Recommended: ON.', 'ptreWarning') : ''),
        value: checkbox('PTREAddBuddiesToFriendsAndPhalanx', buddiesOn)});
    featureRows.push({label: 'Enable Galaxy Pop-up:',
        description: 'Add a PTRE icon close to players in galaxy view.'
            + (galaxyPopupOn != 'checked' ? '<br>' + small('Recommended: ON.', 'ptreWarning') : '')
            + (MinerModeOn == 'checked' ? '<br>' + small('Disable Miner Mode if you want to enable it.', 'ptreWarning') : ''),
        value: checkbox('PTREToogleGalaxyPopup', galaxyPopupOn, MinerModeOn == 'checked' ? ' disabled' : '')});
    featureRows.push({label: 'Toogle Events on Overview Page:', description: 'Works well with option "Always show events" set to "Hide".',
        value: checkbox('PTREToogleEventOnOverviewPage', toogleEventsOn)});

    // Orion
    const orionRows = [
        {label: 'Orion anomalies - Military top:', description: 'Show players of the universe military top X (1-200).',
            value: '<input id="PTREOrionMilitaryTop" type="number" min="1" max="200" style="width:60px;" value="' + GM_getValue(ptreOrionMilitaryTop, ptreOrionMilitaryTopDefault) + '" />'},
        {label: 'Orion anomalies - Systems range:', description: '... located within Y systems around the anomaly (0-50).',
            value: '<input id="PTREOrionSystemRange" type="number" min="0" max="50" style="width:60px;" value="' + GM_getValue(ptreOrionSystemRange, ptreOrionSystemRangeDefault) + '" />'},
    ];

    // Advanced
    const advancedRows = [
        {label: 'Enable Beta Mode:', description: small('No Beta feature, at the moment. Previous one: Galaxy Pop-up (jan 2026).', 'ptreSuccess'),
            value: checkbox('PTREToogleBetaMode', BetaModeOn)},
        {label: 'Enable Debug Mode:', description: 'Displays debug information in the console.',
            value: checkbox('PTREEnableConsoleDebug', debugMode)},
        {label: 'Enable Miner Mode:',
            description: 'If you do not want every UX improvements, but you still want to help your Team.<br>This will disable some active features (Galaxy Toolbar, Galaxy pop-up).'
                + (MinerModeOn == 'checked' ? '<br>' + small('Recommended: OFF.', 'ptreWarning') : ''),
            value: checkbox('PTREToogleMinerMode', MinerModeOn)},
    ];

    var divPTRE = ptreSection('Team', ptreInfoTable(teamRows), ptreButton('btnSaveOptPTRE', '&#128190; SAVE'));
    divPTRE += ptreSection('Features', ptreInfoTable(featureRows));
    divPTRE += ptreSection('Orion', ptreInfoTable(orionRows));
    divPTRE += ptreSection('Advanced', ptreInfoTable(advancedRows));

    document.getElementById('ptreMainContent').innerHTML = divPTRE;

    // Team Key field: value set as text (not as HTML), displayed in clear on click
    const tkInput = document.getElementById('ptreTK');
    tkInput.value = ptreStoredTK;
    tkInput.addEventListener('click', function() {
        tkInput.type = 'text';
    });

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
    const count = value => '<span class="ptreSuccess">' + value + '</span>';
    const teamRows = [
        {label: 'Team Name:', description: '<a href="https://ptre.chez.gg/" target="_blank">Manage Team on ptre.chez.gg</a>', value: count(GM_getValue(ptreTeamName, '???'))},
        {label: 'Phalanx:', description: 'Last Update: <span id="ptreEmpireMoonLastRefreshField">' + getLastUpdateLabel(GM_getValue(ptreEmpireMoonLastRefresh, 0)) + '</span>', value: count(phalanxCountTotal)},
        {label: 'Hot Targets list:', description: 'Recent spy reports', value: count(hotCount)},
        {label: 'Galaxy Events:', description: 'Changes non-listed in public API but detected by your Team', value: count(galaEventsCount)},
        {label: 'Do Not Probe list:', description: 'Added via galaxy', value: count(dnpCount)},
    ];
    const syncRows = [
        {label: 'Last Global Sync:', description: 'All data synchronized', value: '<span id="ptreLastGlobalSyncField">' + getLastUpdateLabel(GM_getValue(ptreLastGlobalSync, 0)) + '</span>'},
        {label: 'Last Data Sync:', description: 'Phalanx, Hot Spy reports, Do Not Probe list, Galaxy events<br><span id="ptreLastDataSyncMessageField" class="ptreWarning"></span>',
            value: '<span id="ptreLastDataSyncField">' + getLastUpdateLabel(GM_getValue(ptreLastDataSync, 0)) + '</span>'},
        {label: 'Last Targets Sync:', description: 'Targets list<br><span id="ptreLastTargetsSyncMessageField" class="ptreWarning"></span>',
            value: '<span id="ptreLastTargetsSyncField">' + getLastUpdateLabel(GM_getValue(ptreLastTargetsSync, 0)) + '</span>'},
        {label: 'Lifeforms researchs update:', description: '<a href="/game/index.php?page=ingame&component=fleetdispatch">Fleet menu to update</a>. Synced to <a href="https://ptre.chez.gg/?page=lifeforms_researchs" target="_blank">PTRE Lifeforms Researchs</a>',
            value: '<span id="ptreLastTechnosRefreshField">' + getLastUpdateLabel(GM_getValue(ptreLastTechnosRefresh, 0)) + '</span>'},
    ];
    const toolRows = [
        {label: 'Detected tool:', description: 'Other tools running', value: toolComment || '-'},
    ];
    var divOV = ptreSection('Team', ptreInfoTable(teamRows), ptreButton('synctDataWithPTRE', '&#8635; SYNC DATA'));
    divOV += ptreSection('Synchronization', ptreInfoTable(syncRows));
    divOV += ptreSection('Tools', ptreInfoTable(toolRows));

    // Update version message in footer
    var lastAvailableVersion = GM_getValue(ptreLastAvailableVersion, -1);
    if (lastAvailableVersion != -1 && isNewerVersion(lastAvailableVersion, GM_info.script.version)) {
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
    // Orion settings (invalid input falls back to default)
    const orionTop = parseInt(document.getElementById('PTREOrionMilitaryTop').value);
    GM_setValue(ptreOrionMilitaryTop, isNaN(orionTop) ? ptreOrionMilitaryTopDefault : Math.max(1, Math.min(200, orionTop)));
    const orionRange = parseInt(document.getElementById('PTREOrionSystemRange').value);
    GM_setValue(ptreOrionSystemRange, isNaN(orionRange) ? ptreOrionSystemRangeDefault : Math.max(0, Math.min(50, orionRange)));

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
    // ptreChangelogHTML is generated at build time from CHANGELOG.md (see build.sh)
    var content = '<div class="ptreCategoryTitle">Versions:</div>' + ptreChangelogHTML;
    content += '<div><hr></div><a href="https://github.com/ogame-paye-ton-re/easyptre/blob/master/CHANGELOG.md" target="_blank">Full changelog on GitHub</a>';
    document.getElementById('ptreMainContent').innerHTML = content;
}

function displayUpdateBox() {
    ptreCurrentView = displayUpdateBox;
    setupMainBox('EasyPTRE Updates', 'Updates');
    var content = ptreSection('Check for updates', 'Last check: ' + getUnixTSLabel(GM_getValue(ptreLastAvailableVersionRefresh, 0)), ptreButton('forceCheckVersionButton', 'CHECK VERSION NOW'));
    content += ptreSection('Automatic updates', 'Tampermonkey should automatically update EasyPTRE when an update is available. It may take some time to be triggered, though.');
    content += ptreSection('Manual update', 'If you want to proceed to a manual update here is how to:<ol class="ptreList">'
        + '<li>Click on Tampermonkey Extension in the top right corner of your browser</li>'
        + '<li>Click on "Dashboard"</li>'
        + '<li>Click on "Installed Userscripts" tab</li>'
        + '<li>Select "EasyPTRE" checkbox</li>'
        + '<li>From the dropdown menu called "Please choose an option", select "Trigger Update"</li>'
        + '<li>Press "Start"</li>'
        + '<li>(optionnal) If TamperMonkey proposes "Overwrite", validate it</li>'
        + '<li>Update should be done</li>'
        + '</ol>');
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
        content += ptreMessageBlock('warning', 'OGLight or OGInfinity is enabled: some EasyPTRE features are disabled to leave priority to your favorite tool, OGL / OGI. Please also add your PTRE TeamKey into OGL / OGI.'
            + '<br><br>EasyPTRE is still managing some tasks like:<ul class="ptreList"><li>Galaxy Event Explorer Infos (in galaxy view)</li><li>Lifeforms/combat researchs sync (for PTRE spy reports)</li><li>Phalanx infos sharing (in galaxy view or Discord)</li></ul>');
    }
    if (isAGREnabled()) {
        content += ptreMessageBlock('warning', 'AGR is enabled. Your AGR target list can be synced to PTRE');
    }
    if (content == '') {
        content = ptreMessageBlock('info', 'No other tool detected (AGR / OGLight / OGInfinity): every EasyPTRE feature is enabled.');
    }

    document.getElementById('ptreMainContent').innerHTML = content;
}

function displayLogs() {
    ptreCurrentView = displayLogs;
    setupMainBox('Logs', 'Logs');

    var logsJSON = GM_getValue(ptreLogsList, '');
    var logsList = [];
    if (logsJSON != '') {
        logsList = JSON.parse(logsJSON);
    }
    logsList.sort((a, b) => b.ts - a.ts);
    const rows = logsList.filter(elem => elem.uni == country + "-" + universe).map(function(elem) {
        return [{html: '<span class="ptreSmall">' + getUnixTSLabel(elem.ts) + '</span>', align: 'center'},
            {html: '<span class="ptreSmall">' + elem.uni + '</span>', align: 'center'},
            '<span class="ptreSmall">' + elem.log + '</span>'];
    });
    var content = ptreSection('Logs', 'Internal logs only (errors, migrations, etc) for debug purposes if you share it with developer.<br>Logs are kept ' + (ptreLogsRetentionDuration/(24*60*60)) + ' days.<br><br>'
        + ptreTable(rows, {id: 'logTable', header: ['Date', 'Universe', 'Log'], empty: '<span class="ptreWarning">No logs.</span>'}),
        ptreButton('purgeLogs', 'PURGE LOGS'));

    document.getElementById('ptreMainContent').innerHTML = content;
    document.getElementById('purgeLogs').addEventListener("click", function (event) {
        cleanCurrentUniverseLogs();
        displayLogs();
    });
}

function displayGalaxyTracking() {
    ptreCurrentView = displayGalaxyTracking;
    setupMainBox('Galaxy', 'Galaxy');

    var details = '';
    if (isOGLorOGIEnabled()) {
        details += ptreMessageBlock('warning', 'OGLight or OGInfinity is enabled: EasyPTRE is not managing galaxy pushs.<br>EasyPTRE still get Galaxy events to highlight updated positions.');
    }
    details += 'Storage Version: ' + GM_getValue(ptreGalaxyStorageVersion, 2) + ' | Retention: ' + ptreGalaxyStorageRetention + ' days<br>';
    details += 'Last Public API Update: ' + getLastUpdateLabel(GM_getValue(ptreGalaxyAPIUpdateIGTS, 0)) + '<br><br>';

    const allGalaxyKeys = GM_listValues().filter(key => key.includes(ptreGalaxyData)).sort();
    const rows = allGalaxyKeys.map(function(key) {
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
        return [{html: 'G' + gala, align: 'center'}, {html: storedCount, align: 'center'}, {html: cachedCount, align: 'center'}, {html: statusLabel, align: 'center'}];
    });
    details += ptreTable(rows, {header: ['Galaxy', 'Systems in storage', 'Systems in cache', 'Cache status'], empty: '<span class="ptreWarning">No galaxy data in storage</span>'});

    var distribution = 'X => 10/10 systems recently updated<br>+ => some systems recently updated<br><br>';
    distribution += '<div class="ptreMonospace">';
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
        distribution += `<div>Galaxy ${String(gala).padStart(2, ' ')} | ${line}</div>`;
    }
    distribution += '</div>';

    var content = ptreSection('Galaxy details', details);
    content += ptreSection('Distribution', distribution);
    content += ptreSection('Reset galaxy data', 'Deletes galaxy data of this universe from local storage.', ptreButton('purgeGalaxyTracking', 'PURGE DATA'));
    document.getElementById('ptreMainContent').innerHTML = content;

    // Action: Purge Galaxy Tracking
    document.getElementById('purgeGalaxyTracking').addEventListener("click", function (event) {
        validatePurgeGalaxyTracking();
    });
}

function displayAGRTargetsList() {
    ptreCurrentView = displayAGRTargetsList;
    setupMainBox('AGR Targets', 'AGRTargets');

    var isAGROn = false;
    if (isAGREnabled()) {
        isAGROn = true;
        updateLocalAGRList();
    }

    var targetList = [];
    var listHtml;
    if (!isAGROn) {
        listHtml = ptreMessageBlock('error', 'AGR is not enabled.');
    } else {
        const targetJSON = GM_getValue(ptreAGRPlayerListJSON, '');
        if (targetJSON != '') {
            targetList = JSON.parse(targetJSON) || [];
        }
        const privateTargetIds = getPrivateTargetIds();
        const rows = targetList.map(function(PlayerCheck) {
            const checked = privateTargetIds.has(String(PlayerCheck.id)) ? ' checked' : '';
            return {id: 'rawPLayer_' + PlayerCheck.id, cells: [
                PlayerCheck.pseudo,
                {html: ptreButton('btnGetPlayerInfos' + PlayerCheck.id, 'FLEET'), align: 'center'},
                {html: '<a href="' + buildPTRELinkToPlayer(PlayerCheck.id) + '" target="_blank">Profile</a>', align: 'center'},
                {html: '<input class="sharedTargetStatus" id="ptrePrivateTarget_' + PlayerCheck.id + '" data-player-id="' + PlayerCheck.id + '" type="checkbox"' + checked + '>', align: 'center'},
                {html: '<a class="tooltip" id="removePlayerFromListBySettings_' + PlayerCheck.id + '" style="cursor:pointer;"><img class="mouseSwitch" src="' + imgSupPlayer + '" height="12" width="12"></a>', align: 'center'},
            ]};
        });
        listHtml = '<span class="ptreSmall">This list is based on your AGR list (' + targetList.length + ' targets)</span><br><br>'
            + ptreTable(rows, {header: ['Player Name', 'Fleet Infos', 'PTRE Profile', 'Keep Private', 'Remove Target'], empty: '<span class="ptreWarning">No AGR target.</span>'});
    }
    var content = '<div id="targetsListDiv">';
    content += ptreSection('AGR Target List', '<a href="https://ptre.chez.gg/?country=' + country + '&univers=' + universe + '&page=players_list" target="_blank">Manage list on PTRE website</a><br><br>' + listHtml,
        ptreButton('reloadLocalList', '&#8635; RELOAD LOCAL LIST') + ptreButton('synctTargetsWithPTRE', '&#8635; SYNC TARGETS'));
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
    Array.from(document.getElementsByClassName('sharedTargetStatus')).forEach(function(target) {
        target.addEventListener("click", function (event) {
            var status = toogleTargetPrivateStatus(target.dataset.playerId);
            displayMessageInSettings('Target is now ' + status);
        });
    });
    // Action: Player Infos + Delete
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

function displayPTRETargetsList() {
    ptreCurrentView = displayPTRETargetsList;
    setupMainBox('PTRE Targets', 'PTRETargets');

    var targetListPTRE = [];
    const targetJSON = GM_getValue(ptrePTREPlayerListJSON, '');
    if (targetJSON != '') {
        targetListPTRE = JSON.parse(targetJSON) || [];
    }
    const rows = targetListPTRE.map(function(PlayerCheck) {
        return {id: 'rawPLayer_' + PlayerCheck.id, cells: [
            PlayerCheck.pseudo,
            {html: ptreButton('btnGetPlayerInfos' + PlayerCheck.id, 'FLEET'), align: 'center'},
            {html: '<a href="' + buildPTRELinkToPlayer(PlayerCheck.id) + '" target="_blank">Profile</a>', align: 'center'},
            {html: '<a class="tooltip" id="removePlayerFromListBySettings_' + PlayerCheck.id + '" style="cursor:pointer;"><img class="mouseSwitch" src="' + imgSupPlayer + '" height="12" width="12"></a>', align: 'center'},
        ]};
    });
    var content = '<div id="targetsListDiv">';
    content += ptreSection('PTRE Team Target List',
        '<a href="https://ptre.chez.gg/?country=' + country + '&univers=' + universe + '&page=players_list" target="_blank">Manage list on PTRE website</a><br>'
        + '<span class="ptreSmall">Common list with your Team (' + targetListPTRE.length + ' targets)</span><br><br>'
        + ptreTable(rows, {header: ['Player Name', 'Fleet Infos', 'PTRE Profile', 'Remove Target'], empty: '<span class="ptreWarning">No PTRE target: sync targets to get your Team list.</span>'}),
        ptreButton('reloadLocalList', '&#8635; RELOAD LOCAL LIST') + ptreButton('synctTargetsWithPTRE', '&#8635; SYNC TARGETS'));
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

function displaySharedData() {
    ptreCurrentView = displaySharedData;
    setupMainBox('Shared Data', 'Data');
    const currentTime = getIGCurrentTS();
    var dataList = [];
    const dataJSON = GM_getValue(ptreDataToSync, '');
    const highlightedPlayersList = GM_getValue(ptreHighlightedPlayers, {});
    const galaEventsList = GM_getValue(ptreGalaxyEventsPos, []);

    // Phalanx
    if (dataJSON != '') {
        dataList = JSON.parse(dataJSON);
    }
    const phalanxList = dataList.filter(function(elem) { return elem.type == "phalanx"; });
    phalanxList.sort(function(a, b) {
        var pa = a.coords.split(':').map(Number);
        var pb = b.coords.split(':').map(Number);
        return (pa[0] - pb[0]) || (pa[1] - pb[1]) || (pa[2] - pb[2]);
    });
    const missingPhalanx = phalanxList.filter(elem => elem.val == -1).length;
    const phalanxRows = phalanxList.map(elem => [
        {html: elem.coords + 'L', align: 'center'},
        {html: elem.val == -1 ? '<span class="ptreWarning">???</span>' : elem.val, align: 'center'},
    ]);
    var phalanxColumn = ptreTable(phalanxRows, {header: ['Coords', 'Level'], empty: '<span class="ptreWarning">No phalanx</span>'});
    phalanxColumn += 'Total: ' + phalanxList.length + ' phalanx<br><span class="ptreSmall">Empty: ' + missingPhalanx + '</span><br><br>';
    phalanxColumn += '<a href="https://ptre.chez.gg/?page=phalanx_debug" target="_blank">Phalanx Debug</a><br><br>';
    phalanxColumn += ptreButton('refreshEmpireMoonDataButton', '&#8635; UPDATE') + '<br><span id="ptreEmpireMoonLastRefreshField">' + getLastUpdateLabel(GM_getValue(ptreEmpireMoonLastRefresh, 0)) + '</span>';

    // Hot targets
    const hotRows = Object.values(highlightedPlayersList).filter(elem => elem.status == "hot").map(elem => [{html: elem.name, align: 'center'}]);
    const hotColumn = ptreTable(hotRows, {header: ['Player'], empty: '-'}) + '<span class="ptreSuccess">Players recently spied</span>';

    // Do Not Probe
    const dnpRows = Object.values(highlightedPlayersList).filter(elem => elem.status == "dnp").map(elem => [
        {html: elem.name, align: 'center'},
        {html: Math.round((elem.ts - currentTime) / 60) + ' min', align: 'center'},
    ]);
    const dnpColumn = ptreTable(dnpRows, {header: ['Player', 'Duration'], empty: '-'}) + '<span class="ptreError">Do not probe thoses players</span><br>This feature requires Live Update';

    // Galaxy events
    const eventsColumn = 'Galaxy Events count:<br><span class="ptreSuccess">' + galaEventsList.length + '</span><br><br>'
        + 'You may display events in<br>the <span class="ptreSuccess">PTRE toolbar</span><br><br>(<a href="/game/index.php?page=ingame&component=galaxy">on galaxy page</a>)';

    const column = (title, html) => '<div class="ptreColumn"><div class="ptreSubTitle">' + title + '</div>' + html + '</div>';
    var content = ptreSection('Synced data', '<div class="ptreColumns">'
        + column('Phalanx', phalanxColumn)
        + column('Hot Targets', hotColumn)
        + column('Do Not Probe', dnpColumn)
        + column('Recent Galaxy Events', eventsColumn)
        + '</div>');

    if (GM_getValue(ptreEnableConsoleDebug, 'false') == 'true') {
        const updateCooldown = GM_getValue(ptreCheckForUpdateCooldown, 0);
        const lastDataSync = GM_getValue(ptreLastDataSync, 0);
        const lastCheck = GM_getValue(ptreLastUpdateCheck, 0);
        const lastGlobalSync = GM_getValue(ptreLastGlobalSync, 0);
        const nextGlobalSync = Math.round((lastGlobalSync + ptreGlobalPTRESyncTimeout - currentTime) / 3600);
        const syncTimeout = ptreGlobalPTRESyncTimeout / 3600;
        var debug = 'Last Global Sync (every ' + syncTimeout + 'h): ' + getLastUpdateLabel(lastGlobalSync) + '<br>';
        debug += 'Next Global Sync in ' + nextGlobalSync + 'h<br><br>';
        if (updateCooldown > 0) {
            debug += 'Live Auto-Update is enabled<br>';
            debug += 'Last Check (every ' + updateCooldown + ' sec): ' + getLastUpdateLabel(lastCheck) + '<br>';
            debug += 'Last Data Sync: ' + getLastUpdateLabel(lastDataSync) + '<br>';
        } else {
            debug += 'Auto-Update is disabled<br>';
        }
        content += ptreSection('Debug', debug);
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
    var content = ptreMessageBlock('error', 'This will delete galaxy data from local storage.');
    content += 'It is recommended to delete thoses data only if you have issues with galaxy feature<br>or if you have not play for a long time this universe.<br><br>';
    content += ptreButton('purgeGalaxyTracking', 'PURGE DATA, REALLY?');
    document.getElementById('ptreMainContent').innerHTML = content;

    // Action: Purge Galaxy Tracking
    document.getElementById('purgeGalaxyTracking').addEventListener("click", function (event) {
        // Write pending changes first, so nothing is written after the purge
        flushGalaxyStorage();
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
        document.getElementById('ptreMainContent').innerHTML = ptreMessageBlock('error', ptreMissingTKMessage);
        return;
    }

    ptreRequest(urlPTREIngamePopUp, {params: {team_key: TKey, action: 'getallnotes'}})
        .then(function(reponseDecode) {
            if (!document.getElementById('ptreMainContent')) { return; }
            consoleDebug('[FROM PTRE] ' + reponseDecode.message);
            if (reponseDecode.code == 1) {
                var notesHtml = decodeBase64UTF8(reponseDecode.allnotes);
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
                document.getElementById('ptreMainContent').innerHTML = ptreMessageBlock('error', reponseDecode.message);
                addToLogs('[NOTES] ' + reponseDecode.message);
            }
        })
        .catch(function(error) {
            updateHtmlById('ptreMainContent', ptreMessageBlock('error', getPTRERequestErrorLabel(error)));
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

    var content = ptreSection('Garbage Collection', 'Last run: ' + getUnixTSLabel(GM_getValue(ptreLastGarbageCollection, 0)) + ' (every ' + (ptreGarbageCollectionTimeout/3600) + 'h)');

    const uniKeys = Object.keys(uniMap).sort();
    const uniRows = uniKeys.map(function(uniKey) {
        const entry = uniMap[uniKey];
        const isCurrent = (entry.country === country && entry.universe === universe);
        const hasTK = entry.keys.includes('ptre-' + entry.country + '-' + entry.universe + '-TK');
        const label = entry.country + '-' + entry.universe
            + (hasTK ? ' <span class="ptreSuccess">(TK exists)</span>' : ' <span class="ptreWarning">(TK missing)</span>')
            + (isCurrent ? ' <span class="ptreError">(current)</span>' : '');
        const lastGC = Number(GM_getValue('ptre-' + uniKey + '-' + ptreLastGarbageCollectionKeySuffix, 0));
        const inactivitySince = Number(GM_getValue('ptre-' + uniKey + '-' + ptreInactivitySinceKeySuffix, 0));
        var activityLabel = 'unknown';
        if (lastGC > 0) {
            activityLabel = getUnixTSLabel(lastGC);
        } else if (inactivitySince > 0) {
            activityLabel = 'unknown<br><span class="ptreSmall">(tracked since ' + getUnixTSLabel(inactivitySince) + ')</span>';
        }
        return [label, {html: activityLabel, align: 'center'}, {html: entry.keys.length, align: 'center'},
            {html: ptreButton('purgeUniKeys_' + entry.country + '_' + entry.universe, 'PURGE'), align: 'center'}];
    });
    content += ptreSection('Tampermonkey Keys per Universe',
        'All stored keys grouped by universe. The Team Key (TK) is preserved when purging.<br>'
        + 'Other universes are automatically cleaned by Garbage Collection: galaxy data after ' + ptreGalaxyStorageRetention + ' days of inactivity, every key (except TK) after ' + ptreInactiveUniverseFullPurgeDays + ' days.<br><br>'
        + ptreTable(uniRows, {header: ['Universe', 'Last activity<br><span class="ptreSmall">(last GC)</span>', 'Keys', 'Action'], empty: '<span class="ptreWarning">No per-universe keys found.</span>'}));

    // All logs section
    var logsJSON = GM_getValue(ptreLogsList, '');
    var logsList = [];
    if (logsJSON != '') {
        logsList = JSON.parse(logsJSON);
    }
    logsList.sort((a, b) => b.ts - a.ts);
    const logRows = logsList.map(elem => [
        {html: '<span class="ptreSmall">' + getUnixTSLabel(elem.ts) + '</span>', align: 'center'},
        {html: '<span class="ptreSmall">' + elem.uni + '</span>', align: 'center'},
        '<span class="ptreSmall">' + elem.log + '</span>',
    ]);
    content += ptreSection('All Logs', 'Internal logs for all universes.<br><br>'
        + ptreTable(logRows, {header: ['Date', 'Universe', 'Log'], empty: '<span class="ptreWarning">No logs.</span>'}));

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
    document.removeEventListener('keydown', onMainPanelKeyDown);
    var badge = document.getElementById('ptreTopRightMenuButton');
    if (badge) {
        badge.style.display = '';
    }
}

