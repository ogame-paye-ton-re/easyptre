// ==UserScript==
// @name         EasyPTRE
// @namespace    https://openuserjs.org/users/GeGe_GM
// @version      0.21.0
// @description  Plugin to use PTRE's features with AGR / OGL / OGI. Check https://ptre.chez.gg/
// @author       GeGe_GM
// @license      MIT
// @copyright    2022, GeGe_GM
// @match        https://*.ogame.gameforge.com/game/*
// @match        https://ptre.chez.gg/*
// @updateURL    https://openuserjs.org/meta/GeGe_GM/EasyPTRE.meta.js
// @downloadURL  https://openuserjs.org/install/GeGe_GM/EasyPTRE.user.js
// @icon         https://ptre.chez.gg/img/easyptre/easyptre_icon_mini.png
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @connect      www.tampermonkey.net
// @connect      ogame.gameforge.com
// @connect      ptre.chez.gg
// @connect      openuserjs.org
// @supportURL   https://discord.gg/WsJGC9G
// ==/UserScript==

// ****************************************
// Build date: lun. 23 nov. 2026 08:29:55 CET
// ****************************************

// Generated from CHANGELOG.md by scripts/changelog-to-html.js
const ptreChangelogHTML = "<div class=\"ptreSubTitle\">0.21.0 (2026-11-22)</div>- [Changed] Redesigned EasyPTRE panel: cleaner layout, adapts to small screens, can be moved (drag the title, double-click to reset), closes with Escape<br>- [Changed] New notifications: colored by type (success, warning, error), can be closed, stay displayed while hovered<br>- [Changed] Galaxy toolbar, galaxy pop-up and Orion pop-up redesigned with the same look<div><hr></div><div class=\"ptreSubTitle\">0.20.0 (2026-11-22)</div>- [Added] Inactive universes are automatically cleaned: galaxy data after 7 days of inactivity, every key (except Team Key) after 1 year<br>- [Added] TM Keys menu: option to also delete the Team Key when purging a universe<br>- [Added] Changelog is now available on <a href=\"https://github.com/ogame-paye-ton-re/easyptre/blob/master/CHANGELOG.md\" target=\"_blank\">GitHub</a><br>- [Changed] All calls to PTRE now use a single HTTP client: an error message is displayed instead of an endless &quot;Loading...&quot; when PTRE cannot be reached<br>- [Changed] Galaxy storage is written after 2 seconds of inactivity instead of after each system<br>- [Changed] Live check is paused while the OGame tab is hidden<br>- [Changed] Notifications: each message is removed independently<br>- [Removed] jQuery library<br>- [Removed] OGame V12 compatibility code<div><hr></div><div class=\"ptreSubTitle\">0.19.1 (2026-11-06)</div>- [Fixed] Orion: PTRE button moved to the lithium cost cell on scanner page<div class=\"ptreSubTitle\">0.19.0 (2026-11-06)</div>- [Added] Orion: PTRE button on scanner and missions anomalies, showing players of the system and the military top X within Y systems (settings)<div><hr></div><div class=\"ptreSubTitle\">0.18.1 (2026-11-05)</div>- [Fixed] Lifeform researches not saved anymore from fleet page (OGame changed the fleet API tooltip format)<div class=\"ptreSubTitle\">0.18.0 (2026-08-06)</div>- [Added] Integrate Fight Events module from <a href=\"https://www.expedetector.eu\" target=\"_blank\">Expedetector.eu</a><div><hr></div><div class=\"ptreSubTitle\">0.17.1 (2026-08-06)</div>- [Fixed] Missing menu reload for GEE and F&amp;P<div class=\"ptreSubTitle\">0.17.0 (2026-08-02)</div>- [Added] Full rework of the Galaxy Events Explorer (GEE)<br>- [Changed] Integrate Friends &amp; Phalanx to main menu<br>- [Changed] Rework menu icons<div><hr></div><div class=\"ptreSubTitle\">0.16.0 (2026-07-28)</div>- [Changed] Phalanx list sorted by coordinates<br>- [Fixed] OGame V13 compatibility (should still work on V12)<br>- [Fixed] Lifeform researches are now auto-injected into the simulator when you open a PTRE spy report link (from Discord / Website)<div><hr></div><div class=\"ptreSubTitle\">0.15.1 (2026-04-05)</div>- [Changed] Add pop-up button legend<br>- [Fixed] Disable galaxy pop-up button when no Team Key<div class=\"ptreSubTitle\">0.15.0 (2026-03-29)</div>- [Added] Ingame notes menu<br>- [Added] Improve Phalanx update (all at once)<br>- [Added] Move galaxy pop-up feature from Beta to release<br>- [Added] Setting to disable galaxy pop-up<br>- [Added] Tampermonkey Keys management menu<br>- [Changed] Refacto menus and design<br>- [Fixed] Galaxy pop-up conflict with OGLight<div><hr></div><div class=\"ptreSubTitle\">0.14.3 (2026-03-25)</div>- [Fixed] Add openuserjs.org to connect list<div class=\"ptreSubTitle\">0.14.2 (2026-03-22)</div>- [Added] In-memory cache during galaxy browsing<br>- [Added] Little alert when Team Key is missing or EasyPTRE is not up-to-date<br>- [Fixed] Timestamp management<br>- [Fixed] Several code cleaning and optimizations<div class=\"ptreSubTitle\">0.14.0 (2026-01-13)</div>- [Changed] Global code refacto and polish<div><hr></div><div class=\"ptreSubTitle\">0.13.3 (2026-01-13)</div>- [Fixed] Several bugfix and polish<div class=\"ptreSubTitle\">0.13.0 (2026-01-07)</div>- [Added] Sync galaxy events and recent targets from PTRE<br>- [Added] Highlight galaxy events and targets in galaxy view (beta)<br>- [Added] Improve galaxy pop-up (beta)<br>- [Added] Send debris fields alongside activities<br>- [Changed] Improve galaxy info storage<div><hr></div><div class=\"ptreSubTitle\">0.12.2 (2026-01-03)</div>- [Added] Ingame shared notes, linked to targets (beta)<div class=\"ptreSubTitle\">0.12.0 (2026-01-02)</div>- [Added] Improve galaxy view with recent targets highlighting and ranks (beta)<br>- [Added] Do Not Probe feature (beta)<br>- [Added] Setting: Toggle events on Overview page<br>- [Added] Setting: Miner mode (if you want to help your Team without every UX improvements)<br>- [Added] Setting: Beta mode (to get Tech Preview features in advance)<br>- [Added] Logs system (for debug)<br>- [Changed] Refacto targets display<br>- [Changed] A lot of background improvements<div><hr></div><div class=\"ptreSubTitle\">0.11.4 (2025-10-21)</div>- [Fixed] Phalanx purge and update<div class=\"ptreSubTitle\">0.11.3 (2025-10-20)</div>- [Added] Manual update procedure<br>- [Changed] Improve update visibility<div class=\"ptreSubTitle\">0.11.2 (2024-11-10)</div>- [Fixed] Galaxy pushs<div class=\"ptreSubTitle\">0.11.1 (2024-10-23)</div>- [Added] Buddies in Friends &amp; Phalanx feature<br>- [Added] Filters in Friends &amp; Phalanx feature<div class=\"ptreSubTitle\">0.11.0 (2024-10-21)</div>- [Added] Friends &amp; Phalanx feature<div><hr></div><div class=\"ptreSubTitle\">0.10.4 (2024-10-19)</div>- [Added] Changelog feature<br>- [Fixed] Some minor CSS issues<div class=\"ptreSubTitle\">0.10.3 (2024-10-18)</div>- [Added] Manage moon ID and relocation related to phalanx sharing<br>- [Changed] Rework global design<div class=\"ptreSubTitle\">0.10.2 (2024-10-17)</div>- [Fixed] Counter-spy timestamp after V12 update<div class=\"ptreSubTitle\">0.10.1 (2024-09-16)</div>- [Added] Allow removing Team Key from settings<div class=\"ptreSubTitle\">0.10.0 (2024-09-09)</div>- [Added] Galaxy events tracking and sharing (same feature as OGL/OGI but for AGR)<br>- [Added] Share Phalanx level with PTRE Team (AGR/OGL/OGI)<br>- [Added] PTRE Toolbar in galaxy view (AGR/OGL/OGI)<br>- [Added] New button to fetch events from Galaxy Event Explorer (AGR/OGL/OGI)<br>- [Added] New button to fetch closest friend Phalanx (AGR/OGL/OGI)<br>- [Added] Save lifeform researches to PTRE in order to send them from website to simulator (AGR/OGL/OGI)<br>- [Changed] Rework buttons and UI<div><hr></div><div class=\"ptreSubTitle\">0.8.0 (2024-06-28)</div>- [Added] Send counter spy messages as activities<br>- [Fixed] AGR spy table customization (following message page rework)<br>- [Fixed] Send spy report button in message page (following message page rework)<div><hr></div><div class=\"ptreSubTitle\">0.7.6 (2024-01-09)</div>- [Added] Import AGR custom lists to PTRE tracking list (in addition of basic lists)<br>- [Changed] Improve notification system (keep 5 sec history)<div class=\"ptreSubTitle\">0.7.5 (2023-12-25)</div>- [Added] Display target top fleet directly into EasyPTRE panel<br>- [Added] Help menu<div class=\"ptreSubTitle\">0.7.4 (2023-11-30)</div>- [Added] Sync AGR/PTRE targets list with teammates via PTRE (non-mandatory)<br>- [Added] Private targets list management system (in order to not share)<br>- [Added] Debug mode option<br>- [Added] Script will check, once a day, for updates and display a label<br>- [Fixed] Pushing activities when refreshing same system<br>- [Fixed] Remove AGR &quot;Traders&quot; from targets lists (&quot;Friends&quot; were already removed)<br>- [Fixed] Galaxy page detection (depending on from where player clicks)<br>- [Fixed] Add scrollbar to targets list<br>- [Fixed] Move EasyPTRE panel to right side in order to not overlap with AGR";

// ****************************************
// INIT
// ****************************************

console.log("[EasyPTRE] Version " + GM_info.script.version);
// Check current website
var modeEasyPTRE = "ingame";
if (/ptre.chez.gg/.test(location.href)) {
    modeEasyPTRE = "ptre";
    console.log("[EasyPTRE] Mode PTRE");
}

// Settings
const ptreMessageDisplayTime = 5*1000;
const ptreErrorMessageDisplayTime = 8*1000; // Errors and warnings stay longer
const ptreMaxToasts = 5;
const ptreMenuImageDisplayTime = 3*1000;
const ptrePushDelayMiliSec = 500;
const ptreVersionCheckTimeout = 6*60*60;
const ptreTechnosCheckTimeout = 3*60;
const ptreDataSharingDelay = 200;
const ptreImprovePageDelay = 200;
const ptreTargetListMaxSize = 300;
const ptreLogsRetentionDuration = 15*24*60*60;
const ptreLogsMaxEntries = 1000; // All universes
const ptreGlobalPTRESyncTimeout = 8*60*60;
const ptreGarbageCollectionTimeout = 24*60*60;
const ptreInactiveUniverseFullPurgeDays = 365; // Other universes: all keys (except TK) are deleted after this inactivity
const ptreGalaxyStorageRetention = 7; // nb of days we keep planets infos
const ptreGalaxyFlushDelayMiliSec = 2*1000; // Galaxy storage is written after this idle delay
const ptreHttpTimeoutMiliSec = 15*1000;
const ptreBorderStyleHotList = "3px solid green"; // For player with recent Spy Report
const ptreBorderStyleGalaxyEvent = "3px solid orange"; // For galaxy position recently updated
const ptreBorderStyleDnpList = "3px solid red"; // For player part of the Do Not Probe list
// TODO: [LOW] Set ptreAGRTargetListMaxSize

// Consts
const ptreShipNames = {202:"Small Cargo",203:"Large Cargo",204:"Light Fighter",205:"Heavy Fighter",206:"Cruiser",207:"Battleship",208:"Colony Ship",209:"Recycler",210:"Espionage Probe",211:"Bomber",212:"Solar Satellite",213:"Destroyer",214:"Deathstar",215:"Battlecruiser",217:"Crawler",218:"Reaper",219:"Pathfinder"};
const ptreToolName = 'EasyPTRE';
const ptreID = "ptre-id";
const ptreMissingTKMessage = "NO PTRE TEAM KEY: Add a Team Key via EasyPTRE settings";

// Variables
var ogameVersion = "";
var server = -1;
var country = "";
var universe = -1;
var currentPlayerID = -1;
var currentPlayerName = "";
var currentPlanetID = -1;
var currentPlanetCoords = "";
var currentPlanetType = "";
var ptreCurrentView = null;

var ptreGalaxyActivityCount = 0;
var ptreGalaxyEventCount = 0;
var ptreGalaxyInitMiliTS = 0;
var ptreGalaxyCache = {};
var ptreGalaxyPendingWrites = new Set(); // Galaxies updated in cache but not yet written to storage
var ptreGalaxyFlushTimer = null;
var ptrePushActivities = true;
var ptreSendGalaEvents = true;
var ptreDisplayGalaPopup = true;
var ptreEnableConsoleDebugValue = false;

var ptrePageLoadClientMiliTS = 0; // Client timestamp (en ms)
var ptrePageLoadServerMiliTS = 0; // Server clock (en ms et TZ dependant)
var ptrePageLoadUnixTS = 0;
var ptreTimezoneDiffSec = 0;

if (modeEasyPTRE == "ingame") {
    // Only get serverTime one time
    // this is NOT a UNIX timestamp
    ptrePageLoadServerMiliTS = serverTime.getTime();
    ptrePageLoadClientMiliTS = Date.now();
    ptrePageLoadUnixTS = Number(document.getElementsByName('ogame-timestamp')[0].content); // Unix Timestamp
    ogameVersion = document.getElementsByName('ogame-version')[0].content;
    if (unsafeWindow.timeZoneDiffSeconds !== undefined) {
        ptreTimezoneDiffSec = Number(unsafeWindow.timeZoneDiffSeconds);
    }
    console.log("[EasyPTRE] OGame version: " + ogameVersion);
    console.log("[EasyPTRE] UNIX TS: " + ptrePageLoadUnixTS + " | Server time: " + new Date(ptrePageLoadServerMiliTS).toLocaleString() + " (timestamp: " + ptrePageLoadServerMiliTS/1000 + ") | ptreTimezoneDiffSec: " + (ptreTimezoneDiffSec/3600) + " hours");
    //console.log("[EasyPTRE] Client time: " + new Date(ptrePageLoadClientMiliTS).toLocaleString() + " (timestamp: " + ptrePageLoadClientMiliTS/1000 + ")");
    server = document.getElementsByName('ogame-universe')[0].content;
    var splitted = server.split('-');
    universe = splitted[0].slice(1);
    var splitted2 = splitted[1].split('.');
    country = splitted2[0];
    currentPlayerID = document.getElementsByName('ogame-player-id')[0].content;
    currentPlayerName = document.getElementsByName('ogame-player-name')[0].content;
    currentPlanetID = document.getElementsByName('ogame-planet-id')[0].content;
    currentPlanetCoords = document.getElementsByName('ogame-planet-coordinates')[0].content;
    currentPlanetType = document.getElementsByName('ogame-planet-type')[0].content;
    GM_setValue("ptre-" + country + "-" + universe + "-PlayerID", currentPlayerID);
} else {
    country = document.getElementsByName('ptre-country')[0].content;
    universe = document.getElementsByName('ptre-universe')[0].content;
    GM_setValue(ptreID, document.getElementsByName('ptre-id')[0].content);
}

const ptrePerUniKeysPrefix = "ptre-" + country + "-" + universe + "-";// Do not change!

// GM keys (common to every universes)
const ptreLastAvailableVersion = "ptre-LastAvailableVersion";
const ptreLastAvailableVersionRefresh = "ptre-LastAvailableVersionRefresh";// Unix TS
const ptreLogsList = "ptre-Logs";// Unix TS
const ptreMainPanelPosition = "ptre-MainPanelPosition";// {left, top} in px, set when the panel is dragged

// GM keys (specific to each universes)
// Suffixes also used to build keys of OTHER universes (GC cleanup)
const ptreLastGarbageCollectionKeySuffix = "LastGarbageCollection";
const ptreInactivitySinceKeySuffix = "InactivitySince";
const ptreLastGarbageCollection = ptrePerUniKeysPrefix + ptreLastGarbageCollectionKeySuffix;// Unix TS, only written by the universe own GC
const ptreInactivitySince = ptrePerUniKeysPrefix + ptreInactivitySinceKeySuffix;// Unix TS, written by another universe GC when activity is unknown
const ptreTeamKey = ptrePerUniKeysPrefix + "TK";
const ptreTeamName = ptrePerUniKeysPrefix + "TeamName";
const ptreImproveAGRSpyTable = ptrePerUniKeysPrefix + "ImproveAGRSpyTable";
const ptrePTREPlayerListJSON = ptrePerUniKeysPrefix + "PTREPlayerListJSON";
const ptreAGRPlayerListJSON = ptrePerUniKeysPrefix + "AGRPlayerListJSON";
const ptreAGRPrivatePlayerListJSON = ptrePerUniKeysPrefix + "AGRPrivatePlayerListJSON";
const ptreEnableConsoleDebug = ptrePerUniKeysPrefix + "EnableConsoleDebug";
const ptreAddBuddiesToFriendsAndPhalanx = ptrePerUniKeysPrefix + "AddBuddiesToFriendsAndPhalanx";
const ptreMaxCounterSpyTsSeen = ptrePerUniKeysPrefix + "MaxCounterSpyTsSeen";
const ptreTechnosJSON = ptrePerUniKeysPrefix + "Technos";
const ptreLastTechnosRefresh = ptrePerUniKeysPrefix + "LastTechnosRefresh";
const ptreLastTechnosRefreshUnix = ptrePerUniKeysPrefix + "LastTechnosRefreshUnix"; // Unix TS companion (usable on PTRE website context)
const ptrePlayerID = ptrePerUniKeysPrefix + "PlayerID";
const ptreDataToSync = ptrePerUniKeysPrefix + "DataToSync";
const ptreEmpireMoonLastRefresh = ptrePerUniKeysPrefix + "EmpireMoonLastRefresh";
const ptreGalaxyData = ptrePerUniKeysPrefix + "GalaxyDataG"; // Object
const ptreGalaxyAPIUpdateIGTS = ptrePerUniKeysPrefix + "ptreGalaxyAPIUpdateIGTS"; // IG timestamp
const ptreBuddiesList = ptrePerUniKeysPrefix + "BuddiesList";
const ptreBuddiesListLastRefresh = ptrePerUniKeysPrefix + "BuddiesListLastRefresh";
const ptreToogleEventsOverview = ptrePerUniKeysPrefix + "ToogleEventsOverview";
const ptreLastTargetsSync = ptrePerUniKeysPrefix + "LastTargetsSync";
const ptreLastDataSync = ptrePerUniKeysPrefix + "LastSharedDataSync";
const ptreLastUpdateCheck = ptrePerUniKeysPrefix + "LastUpdateCheck";
const ptreCurrentBackendUpdateTS = ptrePerUniKeysPrefix + "CurrentBackendUpdateTS"; // TS from Backend (Not Local)
const ptreCheckForUpdateCooldown = ptrePerUniKeysPrefix + "CheckForUpdateCooldown";
const ptreLastGlobalSync = ptrePerUniKeysPrefix + "LastGlobalSync";
const ptreEnableGalaxyPopup = ptrePerUniKeysPrefix + "EnableGalaxyPopup";
const ptreEnableMinerMode = ptrePerUniKeysPrefix + "EnableMinerMode";
const ptreEnableBetaMode = ptrePerUniKeysPrefix + "EnableBetaMode";
const ptreOrionMilitaryTop = ptrePerUniKeysPrefix + "OrionMilitaryTop";
const ptreOrionSystemRange = ptrePerUniKeysPrefix + "OrionSystemRange";
const ptreOrionMilitaryTopDefault = 30;
const ptreOrionSystemRangeDefault = 10;
const ptreGalaxyStorageVersion = ptrePerUniKeysPrefix + "GalaxyStorageVersion";
const ptreGalaxyEventsPos = ptrePerUniKeysPrefix + "GalaxyEventsPos"; // Array
const ptreHighlightedPlayers = ptrePerUniKeysPrefix + "HighlightedPlayers"; // Object

// Images
var imgPTRE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB1FBMVEUAAEAAAEE1IjwvHTsEA0GBTCquYhxbNjINCUAFBEEqGjwyIDsAAUAYED+kXR++aBS7aBaKUCctHDwTDUBDKTeBSymwYxuYVyQPCkA8JTm4Zxi7ZxW9aBSrYR2fWyG+aRS8ZxS2Zhg6JDlqPzC+aRW8ZxV1RCwBAkEMCEGUVSW8aBSlXh8bET8oGj27aBdNLzZSMjW8aBaHTigGBUEXDz5kOS1qOymbWCG9aRayZBt0QihnOisiFj0PCj9FKjdKLDVIKzVGKjZHKjZILDYXDz8BAUENCD4OCD4KBj8OCT4MCD8CAkEiFj6MUSadWB+fWR2NUSYVDj8HBUBqPzGJTyeYViGeWB6fWR8+JzkFA0AWDj4kFz2ITiazZBl2RSwIBkASDD8ZED5hOTCwYhqbWSIHBD80IDodEz4PCT8kFjsKB0AhFDwTDD8DA0E1IToQCTybVh6pYB6ETSlWNDQrGzwHBUEjFj1PMDV+SSqoXhwfETmdVhyxZBuWViRrPy8DAkFjOzGPUiarXhgeETm9aBWiXCB9SSp4RiyeWiG1ZRm9aRW8aBWrXhmdVxysXhgPCT2UVCKzZRyxZByyZRyiXB8dEDoDAkAhFj4oGj4kGD4GBED///9i6fS4AAAAAWJLR0Sb79hXhAAAAAlwSFlzAAAOwgAADsIBFShKgAAAAAd0SU1FB+YMAw4EFzatfRkAAAE3SURBVCjPY2AgDBhxSzEx45JkYWVj5wDq5eTi5kGT4uXjFxAUEhYRFROXQLNJUkpaWkZWTkpeQVEJ1WRGZRVpaWlVGSChoqaOIqWhCRIFAy1tHRQpXTFVmJS0nj6yiYwGhnAZaX4jY7iEiamZuYUAHBhaWlnbQKVs7ewdHEHAyQlC2Tu7wM1jdHVzd3PzYGT08HRz8/JmRLbMh9XXzz8gMCg4JDQsPALFY5FR0TGxcfEMCYlJySnRcOHUtHROoLqMzCywouwcxlzePDewVH5BYVFxCQfUAsbSsvIKvsoqiFS1vLxhTW2dpEu9q3BeQyOboTx/UzNUqgUUfCpSrW3tHZ1d/MBw6e5BkgIBGXl5aEhiSCEAXKqXXxUNyPRBpPonTJyEBiZPmQqWmjZ9BgaYOYuIRIgVAABizF3wXn23IAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0xMi0wM1QxNDowNDoxNyswMDowMEeHM70AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMTItMDNUMTQ6MDQ6MTcrMDA6MDA22osBAAAAAElFTkSuQmCC';
var imgPTRESaveOK = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABg1BMVEUSFhoRFBn///+03f9fdpECAwQAAAACAgMAAAAhKTElLTYlLTYkLTYlLTYhKTEeJS0gJzAgJzAeJS0WGyEcIyscIysWGyEWGyEWGyEVGh8UGR8UGR8UGR4UGR8TGB0TGB0QFBgQFBgKDA8TGB0TGB0JDA4LDhETFx0TFxwLDhEJCw0OERUQFBkRFRkQFBgNERUICw0cIioaICcZICcZHyYZHiYZISUYJiQYJyMXMCAPZg0NdAgNdggNdAkNdQgNdwcTShcPZA4TTBYMfQUURRkVOxwVPBwSUhQMegYSUBUNeQcTSxcYJSQNcwkXMSAYKiIZHScZHCcTSBgUQBsWMiAXLCIVPRwUQBoNegcWNh4VPxsNcgkZHicMfAYURxgRWxEYKCMQYw4ObAsObQsRWBIZIiUVPRsZICYYJCQSURURWhESURQMfgUQYQ8WMSAXKiIWMx8PagwPaQwXKyIUQxkURhgUQhoYKSIWMh8OcgkOcQoXMiAPZQ4TTRYYHSQXHST////VYAyAAAAAMXRSTlMAAAAAAAAAAAFIs+HlsUVh6uhePOXjOJqUx8HMxcXHwZmTO+TiN2Dp6F1GseDl4K9EdwVsxAAAAAFiS0dEAmYLfGQAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAHdElNRQfmDAMOAyYoMuvkAAABm0lEQVQoz22S61vTMBSHI6gMUbmIIiL3myIojCxZ1zQMaLPBegmKwyFKYWBhAkWHclmBf510K2UD3k/nyfv8niTnHAAijU+ant6i6dnzyANQ19wyFb3DVGtbPXjRPg1DYoJKFX35CnRExQnCGMcDcOBeg05hpIRMFEWRBXSGJivuDeiCECVm5+ZVjQm0VHphMVNWb32lG8ykFud8iX3WDP1LOhMqrLBl8lXcz1OJrIFjK9+S1you+6klkcqtat9xbC1D8bWizPyx8NNHXac65JocD1XW3tiskN/ahpxVqV8cOgHi2zUqu7NbCPmtVysm7e0X1ssU9vek6rvYAXW5gxByHO7SgxplUvfwTz6f3/x76FJTozWpon30T1XV/3ZRpG6ULLpRdGzXPT62nSJZvnmGaNQJsXKnhFJ6lrPICVNwVXuJhaRSqWRKyCImM/RAIc87F0MJUOfPPQ9B2A16/FF6BjEMuYwhSk8SY+gFfRf+AujhBohCR8Jc9IOBQXgvQ8OgbmT08q64fPf+IXgUGfswPnGLj58mHzdcAcEAo6hY/dQmAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTEyLTAzVDE0OjAzOjMyKzAwOjAwtUYAHgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0xMi0wM1QxNDowMzozMiswMDowMMQbuKIAAAAASUVORK5CYII=';
var imgPTREOK = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACEFBMVEXO6eHO6ODP7ejL07/KyrHQ9fTO597O593O6+TO6eDP8/HFqXy6YArFroXO7ObP7unO6N/P8/DN4tbO6uPP7ujAh0e6Xwm6Xge/gj/P8vDP7+rP8u/N4NPHtpG+eTLBklnP8O3O59/M3My8bB27ZhS7ahm6YQu7ZhPKz7nCmmW8byK8axvM28zP8e7IvZy7aRi7ZxW7ZBC7ZRG8ahrGsYnP8u7CmGK7aBa7aBe6YQy/gkDO6uK9eC+6Yw+7Zxa7ZBHKzra6XgbDoXDFq3+7aRm9dizO5tzAhkbIwKDP8e3O5t29dSq7ZRK6Yg29dy7L1MDKzrfJx6zJya/KzLTKy7PKzLPKzbXKy7LJyK3N5NnP7+vQ8/HQ+frQ+PnQ9/fQ9vbQ9/bP8OzJxKjAiEnBjlLBk1rEonHGtY+/gT7AiUrBj1TAjE/Fr4XP7efP7ObL1cLFrYPGtI24VQC4UQDO7OW5VwC3TwDCl2HQ9/jL1cHAi07BkljM28vJx6u/hUXDm2fIwqTN49fO6+XN5tzFqX3M2ce9dCq5XAO9cyjBkVbL1sTM3c7Iv5++eTHK0Lq+fjm6XwjEpXfJyrHN5dvL077GsIjAi028biC6YAnL0r2+fDa7ZxS6Yg7Cll7Iv57DoG6+fTi7aRfL0ry6Ygy+fTe9dy+5XAS6Yw7K0bvIwqPHuJTHupjHupfHu5jN4dT///8mUFEXAAAAAWJLR0SvzmyjMQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+YMAw4AFMvI6acAAAHoSURBVCjPY2AAAUYmZhZWBjYQi52Bg5MBCbBxcfPw8vGzC7BxCDIICSNLCYiIiolLMEtKScvIyskrKCJkGPmUlFVU1dR5NTS1xHm0dfgYEebp6onpG+irqxmKG+kbi5tIsiGkTM3E9Q0MzC3M9c0NLCytELo4rdltbM0NYMDOXkNKAKZJysEQIWOg7+gkyQ53urOjC0LKwtDVjQMsYS3MyORuqW+OAPpqHp6MQM9Ze4l62/jYGiIDX2U5P39+oLaAwKDgkNCQkJDQsDAQIzQ8OCQiKBIUJlIKUdExsXHxCfFR/KwgRhxrVGIiOLQEvESSrJJTUlPS2PjTMzKzUrNzctnBrmdjE8jLLyjUKirOyC0JLeC1LS0rlwYGNDD8PT052DmkKyqrqmty2aSiK2rr6oUYGKKkhRnYChoaPXWb3Dj4E3MZGQTYmnNFuLh02RxaWhkY29o7OmW7+HT5Ob3YFNkY+D35u3s0e23F+hgY+219JohbZEycNFnXM1FSeMrUadNniNsaaM9kYJzlq6+vP9vScY7r3Hm18xeoOPL46OtbqCxcBJKyAAWcvrmtOM9iR18DfX1QUCNJAYG5/kILfSgbTQoFqOgDpZbY6ltgAjtVoDOWLlvuiwnUbFcwcK5ctXoNFrB2HQBKf5KDmlHLoAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0xMi0wM1QxMzo1OTo1NyswMDowMDoXHO0AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMTItMDNUMTM6NTk6NTcrMDA6MDBLSqRRAAAAAElFTkSuQmCC';
var imgPTREKO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABfVBMVEXEDxjEDhjCLR/CKR3EDxnEEhq+UB28YxnAPh7EFxvEExrDJh3CKx7DHRy9Xxq7aBS7aBa+VBzCKB3DGhzBMx68ZBi9WhzEGBvEDRjCMB67Zxe7ZxW7aBW8Yhm9XRu7ZhfCLh7ARR67aRW/Sh3EEBnEFhu+WBzDHhzDJR28ZBnBOB7BOh6+UxzDHBvAQBq/Qhi9Wxq7aRa8ZRm/Rxm/QRnDIhzBNR3BNB3BMx3BNR7DHBzDFhnEFRnEFBnEFhnDIh2/UB69Wxi8Wxe+VRzDGxvARh+9WRq9Wxe9XBnCMR7EEhnDIxy+Uhu8ZRe/Sx3EFBrDGRvDHRvAQB28Yxi9WxvDIx3EExnCKx3DHxzDFxrDIhvEFRrDIBvDGhvEERrCLB3DFxi9WRe8YRq+UR3BPB7CJx3EDBjEDhm/Th28XxjDHRjDFhi8WRW9WRzARh7CLx7EERnAQh6+Vhy8YBW9Xhq9XBu8ZhjDHRe9Vxm8Zhq8ZRrDJh/DJh7DJB7///+TS0aXAAAAAWJLR0R+P7hBcwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAAd0SU1FB+YMAw4FCdW5cTsAAAE5SURBVCjPY2AgAjDilGFiZgFLMmIoYWVj5+BkZGTk4uZBN42Xj19AUEhYhE1UTBxVn4SklLS0jKyclIy0vAKqFIuikjQQyICwsgqKlKoaSBQMZPjUkbUxamhKw4GAFpIUo4S2AEJKRocLJseoq6dvYCiAAEbGJqYQSUZxETNzCxAwh1JmllYwfRISKtZAYMPIaGttbWenIiGBsI3R3kHQ0cnZhctVx83dwxNJgpHBS9fbx9fPnyEgMCg4JJQRFpBh4RFcjBISkVHRIFVeMbGMcbzx1mCphMSk5JRUTpY0RpBUur+pVgZfZhZYX3aOjIyAaG5evlWBinB4YRG7gIxMMVwK5FElqZIMv9IyGXCIoUiBZGVkYCGJLoUEcEvJFJdDpCoqq9BBCURXgX11DRqorg2DhQYmwJ8wAVajTZNVjYEMAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTEyLTAzVDE0OjA1OjA1KzAwOjAw83BJNAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0xMi0wM1QxNDowNTowNSswMDowMIIt8YgAAAAASUVORK5CYII=';
var imgAddPlayer = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABIFBMVEV+oLt6mrRcdotVbYFMXm5ZcIJcdIhcdYlcdYhcdIhZcIJLXm1GWWhZcYVZcYVGWGdQZ3lQZnhRaHtRaHpRZ3pQZ3lQZ3lPZnlRaHpPZXdOZXZDVmVCVWQpNT9IXG1HXGwpND4nMjs8TVtFWWlGWmpFWWo8TVomMTpdd4xcdotbdYpkfI9lfI9cdoqSoa3b3uLb3+KUo65whZbp6+z////r7e5xhpdadIp+kJ/29/f4+PmAkqH3+PhYc4h8j55+kaBYcoiYprH4+fn5+fqaqLKVo67q7O1lfY/d4eRmfZDe4eSXpbDs7e/5+vpyh5ecqbNXcohxhpbr7O7s7u9zh5hac4fg4+Xg4+aZp7JddotZc4dZcodnfpBnfpFcdYpZcobNc5NHAAAAKHRSTlMAAAAAOrnq7Ozstzk11NMzqKTY09rV2tXa2NOnozTU0jI6t+rs7LY38nTtTwAAAAFiS0dENKmx6f0AAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAHdElNRQfmDAMNMw+3gPsiAAAA/0lEQVQY022QeVPCMBDF1wuKJ4qANwqiEI1HXU3axBa5oYAH4H18/29hk8wwMMP+s29/s0leHsD8QiRqWVY0FtMtsrg0A8srhaIqcnZOtCisrkFcqyK9uLy6pkavw4bZs28Qb+/MbgI2dWfcQXQF00NyHMpxSBi79xT0S4wRA6nNufdQRqxUPc5tqiCp1R3HCRliORT1GklCqtHEiWo20pBqtSdhu5UOjwcdV8qKmrtSup2A6Id6QvjV8NLuoy9Ej44slYylp5GlKea3pn1z2wTy/ILYH5hAdmB3aKILXt/eP7T83IP9gy+z+/3zq8Vf5hBmj7K5Y1X5vG65k9O5fzTlR68NJU1NAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTEyLTAzVDEzOjUxOjA3KzAwOjAwYSBSfQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0xMi0wM1QxMzo1MTowNyswMDowMBB96sEAAAAASUVORK5CYII=';
var imgSupPlayer = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAvVBMVEV+oLt6mrRcdotVbYFMXm5ZcIJcdIhcdYlcdYhZcIJLXm1GWWhZcYVZcYVGWGdQZ3lQZnhRaHtRaHpRZ3pQZ3lQZ3lPZnlRaHpPZXdOZXZDVmVCVWQpNT9IXG1HXGwpND4nMjs8TVtFWWlGWmo8TVomMTpdd4xcdotbdYpadIpcdopwhZZ+kJ+Vo67q7O329/dlfY/d4eT///9mfZDe4eSXpbDs7e/4+Pn3+Phyh5eAkqFac4dZc4dZcodZcoZxO/KfAAAAJnRSTlMAAAAAOrnq7Oy3OTXU0zOopNjT2tXa1drY06ejNNTSMjq36uy2N8+M6pEAAAABYktHRDJA0kzIAAAACXBIWXMAAAsSAAALEgHS3X78AAAAB3RJTUUH5gwDDgk1VmNCsAAAAJNJREFUGNN1ztcOgkAURdFjA3sF7KKoMA6CIE1s//9ZtoTMOLAfV3JzD1CtSXI9S5YazRJabdPiMjtd9CyhPgYiDjESUSlEcmAiP6T2kcmmHySOe2JyHaJA9fwzl+9pUIOQxzDQ3udRnFyykjgi30fplSmlxZNyxo/zcCLiFLPbv93nWCwfvD1XOsrrjbFlMnb7ygvg8zvdxWLNowAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0xMi0wM1QxNDowOTo0OCswMDowMAzRxoAAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMTItMDNUMTQ6MDk6NDgrMDA6MDB9jH48AAAAAElFTkSuQmCC';

// PTRE URLs
var galaxyContentLinkTest = "https:\/\/"+server+"\/game\/index.php?page=ingame&component=galaxy&action=fetchGalaxyContent&ajax=1&asJson=1";
var urlToScriptMetaInfos = 'https://openuserjs.org/meta/GeGe_GM/EasyPTRE.meta.js';
var ptreCommonUrlParams = '?tool=' + ptreToolName + '&country=' + country + '&univers=' + universe;
var ptreEasyPTREUrlParams = ptreCommonUrlParams + '&version=' + GM_info.script.version + '&current_player_id=' + currentPlayerID + '&ptre_id=' + GM_getValue(ptreID, '');
// Common endpoints (with OGL / OGI / EasyPTRE)
var urlPTREImportSR = 'https://ptre.chez.gg/scripts/oglight_import.php?tool=' + ptreToolName;
var urlPTREPushActivity = 'https://ptre.chez.gg/scripts/oglight_import_player_activity.php' + ptreCommonUrlParams;
var urlPTRESyncTargets = 'https://ptre.chez.gg/scripts/api_sync_target_list.php' + ptreCommonUrlParams;
var urlPTREGetPlayerInfos = 'https://ptre.chez.gg/scripts/oglight_get_player_infos.php' + ptreCommonUrlParams;
var urlPTREPushGalaUpdate = 'https://ptre.chez.gg/scripts/api_galaxy_import_infos.php' + ptreCommonUrlParams;
var urlPTREGetRanks = 'https://ptre.chez.gg/scripts/api_get_ranks.php' + ptreCommonUrlParams;
// EasyPTRE specific endpoints
var urlPTRESyncData = 'https://ptre.chez.gg/scripts/api_sync_data.php' + ptreEasyPTREUrlParams;
var urlPTREGetPhalanxInfos = 'https://ptre.chez.gg/scripts/api_get_phalanx_infos.php' + ptreEasyPTREUrlParams;
var urlPTREGetGEEInfos = 'https://ptre.chez.gg/scripts/api_get_gee_infos_v2.php' + ptreEasyPTREUrlParams;
var urlPTREGetXpdEvents = 'https://ptre.chez.gg/scripts/api_get_xpd_events.php' + ptreEasyPTREUrlParams;
var urlcheckForPTREUpdate = 'https://ptre.chez.gg/scripts/api_check_updates.php' + ptreEasyPTREUrlParams;
var urlPTREIngameAction = 'https://ptre.chez.gg/scripts/api_ingame_action.php' + ptreEasyPTREUrlParams;
var urlPTREIngamePopUp = 'https://ptre.chez.gg/scripts/api_ingame_popup.php' + ptreEasyPTREUrlParams;
var urlPTREGetOrionInfos = 'https://ptre.chez.gg/scripts/api_get_orion_infos.php' + ptreEasyPTREUrlParams;

// Load debug value once
if (GM_getValue(ptreEnableConsoleDebug, 'false') == 'true') {
    ptreEnableConsoleDebugValue = true;
}

// ****************************************
// MAIN EXEC
// OGame pages
// ****************************************

if (modeEasyPTRE == "ingame") {
    // Run on EVERY pages (except Empire page)
    if (!/page=standalone&component=empire/.test(location.href)) {
        consoleDebug("[INIT] Any page detected");
        setTimeout(improvePageAny, ptreImprovePageDelay);

        // Global Sync (no need to run it if only browsing pages)
        if (getIGCurrentTS() > (Number(GM_getValue(ptreLastGlobalSync, 0)) + ptreGlobalPTRESyncTimeout)) {
            setTimeout(globalPTRESync, 3000);
        }

        // Check for new script version only (no need to run it if only browsing pages)
        setTimeout(updateLastAvailableVersion, 4000);

        // Prepare next Backend Check
        // This is not enabled by default (ptreCheckForUpdateCooldown <= 0)
        // It only check if update is needed, it does not do the update
        setTimeout(runAutoCheckForPTREUpdate, 5000);

        // Run garbage collector
        if (getCurrentUnixTS() > (Number(GM_getValue(ptreLastGarbageCollection, 0)) + ptreGarbageCollectionTimeout)) {
            setTimeout(runGarbageCollection, 6000);
        }
    }

    // SPECIFIC PAGES
    if (/component=overview/.test(location.href)) {
        // Toogle events on Overview page
        if (GM_getValue(ptreToogleEventsOverview, 'false') == 'true') {
            toggleEvents();
        }
    } else if (/component=galaxy/.test(location.href)) {
        // Galaxy page: Set routines
        consoleDebug("[INIT] Galaxy page detected");
        setTimeout(improvePageGalaxy, ptreImprovePageDelay);
        setTimeout(checkForPTREUpdate, 200);//TODO:
    } else if (/component=messages/.test(location.href)) {
        // Message page: Add PTRE send SR button
        consoleDebug("[INIT] Message page detected");
        setTimeout(improvePageMessages, ptreImprovePageDelay);
    } else if (/page=ingame&component=fleetdispatch/.test(location.href)) {
        // Save fleeters techs in order to send it to simulator from PTRE pages
        // Huge QOL to not add them manually
        consoleDebug("[INIT] Fleet page detected");
        setTimeout(improvePageFleet, ptreImprovePageDelay);
    } else if (/page=ingame&component=facilities/.test(location.href)) {
        // Capture Phalanx level
        consoleDebug("[INIT] Facilities page detected");
        setTimeout(improvePageFacilities, ptreImprovePageDelay);
    } else if (/page=ingame&component=buddies/.test(location.href)) {
        // Buddies Page
        consoleDebug("[INIT] Buddies page detected");
        setTimeout(improvePageBuddies, ptreImprovePageDelay);
    } else if (/page=ingame&component=orion/.test(location.href)) {
        // Orion page: add context infos on anomalies (scanner tab)
        consoleDebug("[INIT] Orion page detected");
        setTimeout(improvePageOrion, ptreImprovePageDelay);
    }
}

// ****************************************
// MAIN EXEC
// PTRE pages only
// ****************************************

if (modeEasyPTRE == "ptre") {
    // Remove EasyPTRE notification from PTRE website
    if (document.getElementById("easyptre_install_notification")) {
        document.getElementById("easyptre_install_notification").remove();
    }

    // Display Lifeforms research on PTRE Lifeforms page
    if (/ptre.chez.gg\/\?page=lifeforms_researchs/.test(location.href)){
        if (universe != 0) {
            console.log("[EasyPTRE] [LF] PTRE Lifeforms page detected: "+country+"-"+universe);
            const json = GM_getValue(ptreTechnosJSON, '');
            if (json != '') {
                const tab = parsePlayerResearchs(json, "tab");
                const lastRefreshUnix = GM_getValue(ptreLastTechnosRefreshUnix, 0);
                const lastRefreshLabel = '<div>Last EasyPTRE update: ' + getUnixTSLabel(lastRefreshUnix) + '</div>';
                document.getElementById("tech_from_easyptre").innerHTML = lastRefreshLabel + tab;
                console.log("[EasyPTRE] [LF] Updating lifeforms page");
            } else {
                console.log("[EasyPTRE] [LF] No lifeforms data saved");
            }
        }
    }

    // Update PTRE Spy Report Pages
    if (/ptre.chez.gg\/\?iid/.test(location.href)){
        console.log("[EasyPTRE] [SR] PTRE Spy Report page detected: "+country+"-"+universe);
        const json = GM_getValue(ptreTechnosJSON, '');
        if (json != '') {
            const linkElement = document.getElementById("simulate_link");
            let hrefValue = linkElement.getAttribute("href");
            var prefill = parsePlayerResearchs(json, "prefill");
            hrefValue = hrefValue.replace("replaceme", prefill);
            linkElement.setAttribute("href", hrefValue);
            document.getElementById("simulator_comment").innerHTML = "Your researches has been detected by EasyPTRE and will be sent to the simulator";
            console.log("[EasyPTRE] [SR] Updating simulator link");
        } else {
            console.log("[EasyPTRE] [SR] No lifeforms data saved");
        }
    }

    // Simulate landing page - inject local techs into prefill + show tech preview
    if (/ptre\.chez\.gg\/scripts\/simulate\.php/.test(location.href)) {
        var landingMeta = document.querySelector('meta[name="ptre-simulate-landing"]');
        if (landingMeta) {
            console.log("[EasyPTRE] [SIM] Simulate landing page detected: "+country+"-"+universe);
            const srKey = document.querySelector('meta[name="ptre-sr-key"]').content;
            const simUrlBase = document.querySelector('meta[name="ptre-simulator-url-base"]').content;
            const techsJSON = GM_getValue(ptreTechnosJSON, '');
            const techsDiv = document.getElementById('ptre-detected-techs');
            const updateDiv = document.getElementById('ptre-last-update');
            const continueBtn = document.getElementById('ptre-continue-btn');

            if (techsJSON != '') {
                try {
                    const prefill = parsePlayerResearchs(techsJSON, 'prefill');
                    if (continueBtn) {
                        continueBtn.href = simUrlBase + '/en?SR_KEY=' + srKey + '#prefill=' + prefill;
                    }
                    if (updateDiv) {
                        updateDiv.innerHTML = 'Last EasyPTRE update: ' + getUnixTSLabel(GM_getValue(ptreLastTechnosRefreshUnix, 0));
                    }
                    if (techsDiv) {
                        techsDiv.innerHTML = parsePlayerResearchs(techsJSON, 'tab');
                    }
                    console.log("[EasyPTRE] [SIM] Prefill built from local techs ("+country+"-"+universe+")");
                } catch (e) {
                    console.error("[EasyPTRE] [SIM] Failed to build prefill", e);
                }
            } else {
                if (techsDiv) {
                    var fleetUrl = 'https://s'+universe+'-'+country+'.ogame.gameforge.com/game/index.php?page=ingame&component=fleetdispatch';
                    techsDiv.innerHTML = '<div class="ptre-warning">'
                        + '&#9888; EasyPTRE is installed, but no lifeform data cached for <b>'+country+'-'+universe+'</b>.<br>'
                        + 'Visit your <a href="'+fleetUrl+'" target="_blank" style="color: var(--clr-primary);">ingame Fleet page</a> for that universe to pre-fill the simulator with your researches.'
                        + '</div>';
                }
                console.log("[EasyPTRE] [SIM] No local techs cached for "+country+"-"+universe);
            }
        }
    }
}

// ****************************************
// Add PTRE styles
// Every color / size used by EasyPTRE is a --ptre-* variable (OGame look)
// ****************************************
GM_addStyle(`
:root {
    --ptre-success: #99CC00;
    --ptre-error: #D43635;
    --ptre-warning: #D29D00;
    --ptre-vacation: aqua;
    --ptre-title: #6f9fc8;
    --ptre-accent: #299f9b;
    --ptre-bg: #171d22;
    --ptre-bg-dark: #101518;
    --ptre-border: #2a3540;
    --ptre-border-dark: black;
    --ptre-cell: #12171C;
    --ptre-cell-alt: #0d1014;
    --ptre-cell-highlight: #1031a0;
    --ptre-radius: 8px;
    --ptre-radius-small: 6px;
}
.ptreSuccess {
    color: var(--ptre-success);
}
.ptreError {
    color: var(--ptre-error);
}
.ptreWarning {
    color: var(--ptre-warning);
}
.ptreVacation {
    color: var(--ptre-vacation);
}
.ptreBold {
    font-weight: bold;
}
.ptreSmall {
    font-size: 8pt;
    font-weight: normal;
}
.ptreCategoryTitle {
    color: var(--ptre-title);
    font-weight: bold;
    margin: 10px;
}
.ptreSubTitle {
    color: var(--ptre-title);
    margin: 10px;
}
.ptreNotificationTitle {
    color: var(--ptre-title);
    font-weight: bold;
}
.ptre_ship {
    background-image: url('https://gf3.geo.gfsrv.net/cdn84/3b19b4263662f5a383524052047f4f.png');
    background-repeat: no-repeat;
    height: 28px;
    width: 28px;
    display: block;
}
.ptre_ship_202 {
    background-position: 0 0;
}
.ptre_ship_203 {
    background-position: -28px 0;
}
.ptre_ship_204 {
    background-position: -56px 0;
}
.ptre_ship_205 {
    background-position: -84px 0;
}
.ptre_ship_206 {
    background-position: -112px 0;
}
.ptre_ship_207 {
    background-position: -140px 0;
}
.ptre_ship_208 {
    background-position: -168px 0;
}
.ptre_ship_209 {
    background-position: -196px 0;
}
.ptre_ship_210 {
    background-position: -224px 0;
}
.ptre_ship_211 {
    background-position: -252px 0;
}
.ptre_ship_212 {
    background-position: -280px 0;
}
.ptre_ship_213 {
    background-position: -308px 0;
}
.ptre_ship_214 {
    background-position: -336px 0;
}
.ptre_ship_215 {
    background-position: -364px 0;
}
.ptre_ship_217 {
    background-position: -448px 0;
}
.ptre_ship_218 {
    background-position: -392px 0;
}
.ptre_ship_219 {
    background-position: -420px 0;
}
/* EasyPTRE buttons only (OGame / other tools buttons are not affected), :where() keeps a low specificity */
:where(#ptreMainWrapper, .ptrePopup, #ptreGalaxyToolBar, #ptreTopRightMenuButton) .button,
:where(.ptreButton) {
    padding: 0px;
}
/* ---------- UI helpers (13-ui.js) ---------- */
.ptreTable {
    width: 100%;
    border-collapse: separate;
    border-spacing: 2px;
}
.ptreTable th, .ptreTable td {
    padding: 3px 6px;
    border: 1px solid var(--ptre-border-dark);
    border-radius: var(--ptre-radius-small);
    background-color: var(--ptre-cell-alt);
    font-weight: normal;
    vertical-align: middle;
}
.ptreTable th {
    background-color: var(--ptre-cell);
    color: var(--ptre-title);
    text-align: center;
}
.ptreTable tbody tr:nth-child(even) td {
    background-color: var(--ptre-cell);
}
.ptreTable tbody tr.ptreRowHighlight td {
    background-color: var(--ptre-cell-highlight);
}
.ptreNoteTextarea {
    width: 100%;
    min-height: 60px;
    box-sizing: border-box;
}
.ptreAlign-left {
    text-align: left;
}
.ptreAlign-center {
    text-align: center;
}
.ptreAlign-right {
    text-align: right;
}
.ptreInfoTable td:last-child {
    width: 35%;
}
.ptreSection {
    margin-bottom: 14px;
}
.ptreSectionHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}
.ptreSectionHeader .ptreCategoryTitle {
    margin: 0;
}
.ptreSectionActions {
    display: flex;
    gap: 4px;
}
.ptreButton {
    cursor: pointer;
}
.ptreList {
    margin: 4px 0 4px 20px;
    padding: 0;
}
ol.ptreList {
    list-style: decimal;
}
ul.ptreList {
    list-style: disc;
}
.ptreColumns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 10px;
    text-align: center;
}
.ptreColumn .ptreTable {
    margin-bottom: 6px;
}
.ptreColumn .ptreSubTitle {
    margin: 0 0 6px 0;
}
.ptreMonospace {
    font-family: monospace;
    white-space: pre;
}
.ptreLoading {
    text-align: center;
    padding: 20px;
    color: var(--ptre-warning);
}
.ptreSpinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 8px;
    vertical-align: middle;
    border: 2px solid var(--ptre-title);
    border-top-color: transparent;
    border-radius: 50%;
    animation: ptreSpin 0.8s linear infinite;
}
@keyframes ptreSpin {
    to { transform: rotate(360deg); }
}
.ptreMessageBlock {
    padding: 6px 10px;
    margin: 6px 0;
    border-left: 3px solid var(--ptre-title);
    border-radius: var(--ptre-radius-small);
    background-color: var(--ptre-bg-dark);
}
.ptreMessageBlock-success {
    border-left-color: var(--ptre-success);
}
.ptreMessageBlock-error {
    border-left-color: var(--ptre-error);
}
.ptreMessageBlock-warning {
    border-left-color: var(--ptre-warning);
}
/* ---------- Main panel ---------- */
#ptreMainWrapper {
    position: fixed;
    top: 30px;
    right: 10px;
    z-index: 11000;
    width: min(750px, calc(100vw - 20px));
    font-size: 10pt;
}
#ptreMainBox {
    display: flex;
    flex-direction: column;
    /* Keep room for the OGame fixed footer bar (#siteFooter) */
    max-height: min(820px, calc(100vh - 60px));
    background-color: var(--ptre-bg);
    border: 2px solid var(--ptre-border-dark);
    border-radius: var(--ptre-radius);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
    overflow: hidden;
}
#ptreMainHeader {
    display: flex;
    flex-direction: column;
    padding: 5px 10px;
    border-bottom: 1px solid var(--ptre-border);
    background-color: var(--ptre-bg-dark);
}
#ptreMainHeaderTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    cursor: move;
    user-select: none;
}
#ptreMainTitle {
    color: var(--ptre-title);
    font-weight: bold;
    font-size: 11pt;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
#ptreMainHeaderButtons {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
    cursor: default;
}
.ptreHeaderBtn {
    cursor: pointer;
    padding: 4px 8px;
    min-width: 0;
}
#messageDivInPanel {
    min-height: 0;
    padding: 4px 10px 2px 10px;
    font-size: 9pt;
    text-align: center;
}
#messageDivInPanel:empty {
    display: none;
}
#ptreMainBody {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
}
#ptreMainContent {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    min-width: 0;
}
#ptreMainNav {
    width: 110px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 6px;
    overflow-y: auto;
    border-left: 1px solid var(--ptre-border);
    background-color: var(--ptre-bg-dark);
}
.ptreNavBtn {
    display: block;
    text-align: center;
    cursor: pointer;
    padding: 4px 2px;
    min-width: 0;
}
.ptreNavBtn.ptreNavActive {
    outline: 2px solid var(--ptre-accent);
}
.ptreNavSeparator {
    border-top: 1px solid var(--ptre-border);
    margin: 4px 0;
}
#ptreMainWrapper.ptreDragging {
    opacity: 0.85;
}
/* Narrow windows: icons only in navigation and header buttons */
@media (max-width: 900px) {
    #ptreMainNav {
        width: 36px;
    }
    .ptreNavLabel, .ptreHeaderBtnLabel {
        display: none;
    }
}
#ptreMainFooter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 10px;
    border-top: 1px solid var(--ptre-border);
    background-color: var(--ptre-bg-dark);
    font-size: 9pt;
}
#ptreMainFooterMsg {
    padding: 2px 10px 4px 10px;
    background-color: var(--ptre-bg-dark);
    font-size: 9pt;
    text-align: center;
}
#ptreMainFooterMsg:has(#ptreUpdateVersionMessage:empty) {
    display: none;
}
#ptreToasts {
    position: fixed;
    bottom: 30px;
    right: 10px;
    z-index: 11001;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    pointer-events: none;
}
.ptreToast {
    pointer-events: auto;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    min-width: 220px;
    max-width: 380px;
    padding: 8px 10px;
    font-size: 9pt;
    background-color: var(--ptre-bg);
    border: 1px solid var(--ptre-border-dark);
    border-left: 4px solid var(--ptre-title);
    border-radius: var(--ptre-radius);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
    animation: ptreToastIn 0.2s ease-out;
    transition: opacity 0.2s, transform 0.2s;
}
.ptreToast.ptreToastOut {
    opacity: 0;
    transform: translateX(20px);
}
@keyframes ptreToastIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
}
.ptreToastIcon {
    font-weight: bold;
    color: var(--ptre-title);
}
.ptreToastBody {
    flex: 1;
    word-break: break-word;
}
.ptreToastClose {
    cursor: pointer;
    opacity: 0.6;
}
.ptreToastClose:hover {
    opacity: 1;
}
.ptreToast-success {
    border-left-color: var(--ptre-success);
}
.ptreToast-success .ptreToastIcon {
    color: var(--ptre-success);
}
.ptreToast-warning {
    border-left-color: var(--ptre-warning);
}
.ptreToast-warning .ptreToastIcon {
    color: var(--ptre-warning);
}
.ptreToast-error {
    border-left-color: var(--ptre-error);
}
.ptreToast-error .ptreToastIcon {
    color: var(--ptre-error);
}
#btnSaveOptPTRE {
    cursor:pointer;
}
#ptreGalaxyToolBar {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 4px;
    padding: 6px 10px;
    font-weight: revert;
    background-color: var(--ptre-bg);
    border: 1px solid var(--ptre-border-dark);
    border-radius: var(--ptre-radius);
}
.ptreToolbarRow {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}
.ptreToolbarTitle {
    color: var(--ptre-title);
    font-weight: bold;
}
.ptreToolbarStats {
    margin-left: auto;
}
.ptreToolbarLegend {
    gap: 14px;
}
.ptreToolbarLegend .ptreSubTitle {
    margin: 0;
}
.ptreLegendItem {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}
.ptreLegendIcon {
    width: 10px;
    height: 10px;
    border: 3px solid transparent;
}
.ptreLegend-hot {
    border-color: green;
}
.ptreLegend-event {
    border-color: orange;
}
.ptreLegend-dnp {
    border-color: red;
}
.ptreToolbarFooter {
    padding-top: 4px;
    border-top: 1px solid var(--ptre-border);
    color: #848484;
}
/* ---------- Pop-ups (galaxy, Orion) ---------- */
.ptrePopup {
    font-size: 10pt;
    background-color: var(--ptre-bg);
    border: 2px solid var(--ptre-border-dark);
    border-radius: var(--ptre-radius);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
    overflow: hidden;
}
.ptrePopupHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 5px 10px;
    border-bottom: 1px solid var(--ptre-border);
    background-color: var(--ptre-bg-dark);
}
.ptrePopupTitle {
    color: var(--ptre-title);
    font-weight: bold;
    font-size: 11pt;
}
.ptrePopupBody {
    padding: 8px 10px;
}
#ptreGalaxyPopUp {
    position: absolute;
    z-index: 10000;
    width: 420px;
    max-width: calc(100vw - 20px);
}
#ptreOrionPopUp {
    position: fixed;
    top: 30px;
    right: 10px;
    z-index: 11000;
    display: flex;
    flex-direction: column;
    min-width: 350px;
    max-width: min(600px, calc(100vw - 20px));
    max-height: calc(100vh - 60px);
}
#ptreOrionPopUp .ptrePopupBody {
    overflow-y: auto;
}
.ptrePopupFooter {
    padding: 4px 10px;
    border-top: 1px solid var(--ptre-border);
    background-color: var(--ptre-bg-dark);
}
.ptreOrionButton {
    vertical-align: middle;
    margin-left: 4px;
}
.ptreIconAnim {
    cursor: pointer;
    transition: transform 0.15s ease, filter 0.15s ease;
}
.ptreIconAnim:hover {
    transform: scale(1.25);
    filter: brightness(1.3);
}
.ptreIconAnim:active {
    transform: scale(0.9);
}
.ptreIconActive {
    animation: ptreIconPulse 1s ease-in-out infinite;
}
@keyframes ptreIconPulse {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 var(--ptre-title)); }
    50% { transform: scale(1.3); filter: drop-shadow(0 0 4px var(--ptre-title)); }
}
#optionPTRE {
    position: relative;
}
#ptreTopRightMenuButton {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000;
    padding: 3px 0;
    cursor: pointer;
}
#ptreMissingTKBadge {
    position: absolute;
    top: 2px;
    right: 2px;
    background-color: var(--ptre-error);
    color: white;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    font-size: 9px;
    font-weight: bold;
    text-align: center;
    line-height: 14px;
    z-index: 10000;
    cursor: pointer;
}
`);

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
    var configAlertActive = (lastAvailableVersion != -1 && isNewerVersion(lastAvailableVersion, GM_info.script.version)) || ptreStoredTK == '' || !isValidTeamKey(ptreStoredTK);
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
                var nodeSpyTable = document.getElementById('messagescomponent');
                if (nodeSpyTable) {
                    let spyTableObserver = new MutationObserver(improveAGRSpyTable);
                    spyTableObserver.observe(nodeSpyTable, {
                        attributes: true,
                        childList: true, // observer les enfants directs
                        subtree: true, // et les descendants aussi
                    });
                } else {
                    consoleDebug("[SPY-TABLE] #messagescomponent not found. AGR Spy Table not improved.");
                }
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
    const detectedTools = [];

    // Update status once for the gala browsing session
    if (isAGREnabled()) {
        detectedTools.push("AGR");
    }
    if (isOGLEnabled()) {
        ptreSendGalaEvents = false;
        ptrePushActivities = false;
        detectedTools.push("OGL");
    }
    if (isOGIEnabled()) {
        ptreSendGalaEvents = false;
        ptrePushActivities = false;
        detectedTools.push("OGI");
    }
    // Enable Galaxy Pop-up for the entire galaxy browsing session
    if (galaxyPopupMode == 'false' || minerMode == 'true') {
        ptreDisplayGalaPopup = false;
    }

    // Write pending galaxy storage when leaving or hiding the page
    window.addEventListener('pagehide', flushGalaxyStorage);
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            flushGalaxyStorage();
        }
    });

    if (minerMode == 'false') {
        // Add PTRE Toolbar (not if miner mode)
        // Counters (ptreGalaxyActivityCount, ptreGalaxyEventCount, ptreTrackedPlayerCount) are updated while browsing the galaxy
        const pushStatus = (id, sentByEasyPTRE) => sentByEasyPTRE
            ? '<span id="' + id + '" class="ptreSuccess" title="Sent by EasyPTRE">yes</span>'
            : '<span id="' + id + '" class="ptreWarning" title="Sent by OGL/OGI">no</span>';
        const legendItem = (className, label) => '<span class="ptreLegendItem"><img class="ptreLegendIcon ' + className + '" src="' + imgPTREOK + '">' + label + '</span>';

        var tempContent = '';
        if (ptreStoredTK == '') {
            tempContent += ptreMessageBlock('error', ptreMissingTKMessage);
        }
        tempContent += '<div class="ptreToolbarRow">';
        tempContent += '<span class="ptreToolbarTitle">EasyPTRE</span>';
        tempContent += '<span class="ptreSectionActions">'
            + ptreButton('ptreGalaxyPhalanxButton', '&#128101; FRIENDS & PHALANX')
            + ptreButton('ptreGalaxyGEEButton', '&#128225; GALAXY EVENTS')
            + ptreButton('ptreGalaxyFightEventsButton', '&#9876; FIGHT EVENTS') + '</span>';
        // Without Team Key, nothing is sent and there is no pop-up: no stats nor legend
        if (ptreStoredTK != '') {
            tempContent += '<span class="ptreToolbarStats">Activities: ' + pushStatus('ptreGalaxyActivityCount', ptrePushActivities === true)
                + ' | Galaxy Events: ' + pushStatus('ptreGalaxyEventCount', ptreSendGalaEvents === true);
            if (ptrePushActivities === true) {
                tempContent += ' | Targets: <span id="ptreTrackedPlayerCount" class="ptreSuccess">?</span>';
            }
            tempContent += '</span>';
        }
        tempContent += '</div>';
        if (ptreStoredTK != '' && ptreDisplayGalaPopup === true) {
            tempContent += '<div class="ptreToolbarRow ptreToolbarLegend"><span class="ptreSubTitle">Pop-up legend:</span>'
                + legendItem('ptreLegend-hot', 'Hot target')
                + legendItem('ptreLegend-event', 'Galaxy Event')
                + legendItem('ptreLegend-dnp', 'Do Not Probe')
                + legendItem('', 'Nothing') + '</div>';
        }
        tempContent += '<div class="ptreToolbarFooter ptreSmall">Galaxy Popup: ' + galaxyPopupMode + ' | Beta Mode: ' + betaMode + ' | Miner Mode: ' + minerMode
            + ' | Detected tools: ' + (detectedTools.length > 0 ? detectedTools.join(', ') : 'none') + '</div>';

        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = tempContent;
        tempDiv.id = 'ptreGalaxyToolBar';
        const galaxyTables = document.getElementsByClassName("galaxyTable");
        if (galaxyTables.length > 0) {
            galaxyTables[0].appendChild(tempDiv);
        } else {
            consoleDebug("[GALAXY] .galaxyTable not found (vacation mode? V13 change?). Toolbar not attached.");
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
        if (document.getElementById('ptreGalaxyFightEventsButton')) {
            document.getElementById('ptreGalaxyFightEventsButton').addEventListener("click", function (event) {
                getFightEventsFromXPD();
            });
        }
    }

    // Toolbar is created first: its counters are updated while processing the galaxy
    if (ptreStoredTK == '') {
        consoleDebug("[GALAXY] No Team Key found: galaxy features disabled.");
    } else {
        // Prepare galaxy check and update
        waitForGalaxyToBeLoaded();
    }
}

// Save lifeforms researchs
// Save JSON "API 2" from fleet page
function improvePageFleet() {
    console.log("[EasyPTRE] Improving Fleet Page");
    var currentTime = getIGCurrentTS();
    var lastRefresh = Number(GM_getValue(ptreLastTechnosRefresh, 0));
    var nextAllowed = lastRefresh + ptreTechnosCheckTimeout;
    if (currentTime <= nextAllowed) {
        consoleDebug("[FLEET] Skipping techs refresh: cooldown active (last IG TS: " + lastRefresh + ", next allowed: " + nextAllowed + ", now: " + currentTime + ", " + (nextAllowed - currentTime) + " sec remaining)");
        return;
    }
    var spanElement = document.querySelector('.show_fleet_apikey');
    if (!spanElement) {
        //console.log("[EasyPTRE] [FLEET] Cant find .show_fleet_apikey element. Fleet page structure may have changed.");
        return;
    }
    consoleDebug("[FLEET] Found .show_fleet_apikey element");
    var tooltipContent = spanElement.getAttribute('data-tooltip-title');
    if (!tooltipContent) {
        //console.log("[EasyPTRE] [FLEET] .show_fleet_apikey has no data-tooltip-title attribute (empty or missing).");
        return;
    }
    //consoleDebug("[FLEET] data-tooltip-title length: " + tooltipContent.length);
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = tooltipContent;
    // New format: single input #FLEETAPI_JSON. Old format: 2 inputs, JSON in the second one.
    var jsonInput = tempDiv.querySelector('#FLEETAPI_JSON');
    if (!jsonInput) {
        var inputElements = tempDiv.querySelectorAll('input');
        consoleDebug("[FLEET] No #FLEETAPI_JSON input, falling back to last of " + inputElements.length + " input(s)");
        jsonInput = inputElements[inputElements.length - 1];
    }
    if (!jsonInput || !jsonInput.value) {
        console.log("[EasyPTRE] [FLEET] Cant find techs JSON input in tooltip. Tooltip HTML sample: " + tooltipContent.slice(0, 300));
        return;
    }
    var techJSON = jsonInput.value;
    try {
        var parsedTechs = JSON.parse(techJSON);
        if (!parsedTechs.researches || !parsedTechs.ships) {
            console.log("[EasyPTRE] [FLEET] Techs JSON missing expected keys (researches/ships).");
            return;
        }
    } catch (e) {
        console.log("[EasyPTRE] [FLEET] Invalid techs JSON: " + e);
        return;
    }
    consoleDebug("[FLEET] Techs JSON length: " + techJSON.length + " (sample: " + techJSON.slice(0, 120) + ")");
    GM_setValue(ptreTechnosJSON, techJSON);
    var tempMessage = 'Saving Lifeforms researches: <a href="https://ptre.chez.gg/?page=lifeforms_researchs" target="_blank">Display on PTRE</a>';
    displayPTREPopUpMessage(tempMessage, 'success');
    // Update last check TS (IG for cooldown, Unix companion for cross-context display on PTRE website)
    GM_setValue(ptreLastTechnosRefresh, currentTime);
    GM_setValue(ptreLastTechnosRefreshUnix, getCurrentUnixTS());
    updateHtmlById("ptreLastTechnosRefreshField", getLastUpdateLabel(currentTime));
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
    displayPTREPopUpMessage('Saving buddies list (for Friends & Phalanx)', 'success');
}

// Orion page: add a PTRE button next to each anomaly coords (scanner results and missions tabs)
function improvePageOrion() {
    console.log("[EasyPTRE] [ORION] Improving Orion Page");
    const orionInfos = {};
    const pendingCoords = new Set();
    let debounceTimer = null;

    // Anomaly coords links: first galaxy link of each scanner result, and mission target coords
    const getOrionLinks = () => {
        const links = [];
        document.querySelectorAll('.scannerResultRow').forEach(row => {
            const link = row.querySelector('a[href*="component=galaxy"]');
            if (link) {
                links.push(link);
            }
        });
        document.querySelectorAll('.anomalyMission a.nodeCoords').forEach(link => links.push(link));
        return links;
    };

    const addOrionButtons = () => {
        getOrionLinks().forEach(link => {
            const coords = link.dataset.ptreOrion;
            if (!coords || !orionInfos[coords] || link.dataset.ptreOrionButton) {
                return;
            }
            const btn = document.createElement('img');
            btn.className = 'ptreOrionButton ptreIconAnim';
            btn.title = 'EasyPTRE: anomaly infos';
            btn.src = imgPTREOK;
            btn.width = 16;
            btn.height = 16;
            // Hover shows a preview, click pins the popup until closed
            btn.addEventListener('mouseenter', function () {
                if (!ptreOrionPopUpState || !ptreOrionPopUpState.pinned) {
                    openPTREOrionPopUp(coords, orionInfos[coords], btn, false);
                }
            });
            btn.addEventListener('mouseleave', function () {
                if (ptreOrionPopUpState && ptreOrionPopUpState.anchor === btn && !ptreOrionPopUpState.pinned) {
                    ptreOrionPopUpState.cleanup();
                }
            });
            btn.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                if (ptreOrionPopUpState && ptreOrionPopUpState.anchor === btn) {
                    ptreOrionPopUpState.pinned = true;
                } else {
                    openPTREOrionPopUp(coords, orionInfos[coords], btn, true);
                }
            });
            // Scanner coords cell is too narrow: use the lithium cost cell of the row instead
            const row = link.closest('.scannerResultRow');
            if (row) {
                const lithiumIcon = row.querySelector('lithium-icon');
                if (!lithiumIcon) {
                    return;
                }
                lithiumIcon.closest('.cell').appendChild(btn);
            } else {
                link.after(btn);
            }
            link.dataset.ptreOrionButton = '1';
        });
    };

    const processRows = () => {
        const coordsToFetch = [];
        getOrionLinks().forEach(link => {
            if (link.dataset.ptreOrion) {
                return;
            }
            const params = new URL(link.href, location.origin).searchParams;
            let galaxy = parseInt(params.get('galaxy'));
            let system = parseInt(params.get('system'));
            let position = parseInt(params.get('position'));
            // Missions tab links have no position in href, only in text ("9:144:9")
            if (!position) {
                const match = link.textContent.match(/(\d+):(\d+):(\d+)/);
                if (match) {
                    galaxy = parseInt(match[1]);
                    system = parseInt(match[2]);
                    position = parseInt(match[3]);
                }
            }
            if (!galaxy || !system || !position) {
                return;
            }
            const coords = galaxy + ':' + system + ':' + position;
            link.dataset.ptreOrion = coords;
            if (!orionInfos[coords] && !pendingCoords.has(coords)) {
                pendingCoords.add(coords);
                coordsToFetch.push({galaxy: galaxy, system: system, position: position});
            }
        });
        addOrionButtons();
        if (coordsToFetch.length > 0) {
            consoleDebug("[ORION] Fetching infos for " + coordsToFetch.length + " anomalies");
            getOrionInfos(coordsToFetch, function (anomalies) {
                coordsToFetch.forEach(c => pendingCoords.delete(c.galaxy + ':' + c.system + ':' + c.position));
                Object.assign(orionInfos, anomalies);
                addOrionButtons();
            });
        }
    };

    processRows();

    // Scan button and tab switches refresh content without page reload
    const observerRoot = document.getElementById('orion') || document.getElementById('middle') || document.body;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(processRows, 300);
    });
    observer.observe(observerRoot, {childList: true, subtree: true});
}

// Currently displayed Orion popup: {anchor, pinned, cleanup}
let ptreOrionPopUpState = null;

// Displays the Orion popup (top right corner), the anchor button is animated to show which anomaly it is about
function openPTREOrionPopUp(coords, html, anchor, pinned) {
    consoleDebug("[ORION] " + (pinned ? "Click" : "Hover") + " on anomaly " + coords);
    closePTREMenu();
    if (ptreOrionPopUpState) {
        ptreOrionPopUpState.cleanup();
    }

    const panel = document.createElement('div');
    panel.id = 'ptreOrionPopUp';
    panel.className = 'ptrePopup';
    // Anomaly content is HTML from PTRE, displayed as-is
    panel.innerHTML = '<div class="ptrePopupHeader"><span class="ptrePopupTitle">EasyPTRE Orion Box</span>'
        + '<div id="btnCloseOrionPopUp" class="button btn_blue ptreHeaderBtn" title="Close">&#10005; Close</div></div>'
        + '<div class="ptrePopupBody">' + ptreSection('Anomaly [' + coords + ']', html) + '</div>'
        + '<div class="ptrePopupFooter ptreSmall">Hover an anomaly PTRE icon to preview its infos. Click it to pin this pop-up (or replace the pinned one).</div>';
    document.body.appendChild(panel);
    anchor.classList.add('ptreIconActive');

    const cleanupOrionBox = () => {
        panel.remove();
        anchor.classList.remove('ptreIconActive');
        document.removeEventListener('click', clickHandler);
        ptreOrionPopUpState = null;
    };
    const clickHandler = (event) => {
        if (!panel.contains(event.target) && event.target !== anchor) {
            cleanupOrionBox();
        }
    };
    document.addEventListener('click', clickHandler);
    document.getElementById('btnCloseOrionPopUp').addEventListener('click', cleanupOrionBox);
    ptreOrionPopUpState = {anchor: anchor, pinned: pinned, cleanup: cleanupOrionBox};
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
                    // AGR row ID format: "m_<messageID>"
                    var messageID = rowCurrent.id.slice(2);
                    // Find API Key in page
                    var rawMessageData = document.querySelector('div.msg[data-msg-id="' + messageID + '"] .rawMessageData');
                    if (rawMessageData) {
                        var apiKeyRE = rawMessageData.getAttribute('data-raw-hashcode');
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
                            const srKey = this.getAttribute("apikey");
                            ptreRequest(urlPTREImportSR, {method: 'GET', params: {team_key: TKey, sr_id: srKey}})
                                .then(function(reponse) {
                                    if (reponse.code == 1) {
                                        document.getElementById('sendSRFromAGRTable-'+srKey).remove();
                                    } else {
                                        addToLogs('[PUSH] ' + reponse.message_verbose);
                                    }
                                    displayPTREPopUpMessage(reponse.message_verbose, reponse.code == 1 ? 'success' : 'error');
                                })
                                .catch(function(error) {
                                    displayPTREPopUpMessage(getPTRERequestErrorLabel(error), 'error');
                                });
                        });
                    } else {
                        console.log("[EasyPTRE] [SPY-TABLE] Error. Cant find spy report data for message " + messageID);
                    }
                }
            }
        } else {
            displayPTREPopUpMessage(ptreMissingTKMessage, 'error');
        }
    }
}

// Add PTRE button to spy reports
function addPTREStuffsToMessagesPage() {

    // Add PTRE button to messages
    var TKey = GM_getValue(ptreTeamKey, '');
    if (TKey != '') {
        if (document.getElementsByClassName('messagesHolder')[0]) {
            var maxCounterSpyTsSeen = Number(GM_getValue(ptreMaxCounterSpyTsSeen, 0));
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
                        spanBtnPTRE.className = 'ptreMessageButton';
                        current_message.getElementsByClassName("msg_actions")[0].getElementsByTagName("message-footer-actions")[0].appendChild(spanBtnPTRE);
                        document.getElementById('sendRE-' + apiKeyRE).addEventListener("click", function (event) {
                            ptreRequest(urlPTREImportSR, {method: 'GET', params: {team_key: TKey, sr_id: apiKeyRE}})
                                .then(function(reponse) {
                                    consoleDebug('[PUSH] [FROM PTRE] ' + reponse.message_verbose);
                                    if (reponse.code == 1) {
                                        document.getElementById('sendRE-'+apiKeyRE).src = imgPTREOK;
                                    } else {
                                        document.getElementById('sendRE-'+apiKeyRE).src = imgPTREKO;
                                        addToLogs('[PUSH] ' + reponse.message_verbose);
                                    }
                                    displayPTREPopUpMessage(reponse.message_verbose, reponse.code == 1 ? 'success' : 'error');
                                })
                                .catch(function(error) {
                                    document.getElementById('sendRE-'+apiKeyRE).src = imgPTREKO;
                                    displayPTREPopUpMessage(getPTRERequestErrorLabel(error), 'error');
                                });
                        });
                    } else {
                        var planet_acti;
                        var jsonLune;
                        const message_ts = Number(rawMessageData.dataset.rawTimestamp);
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
                        spanBtnPTRE2.className = 'ptreMessageButton';
                        current_message.getElementsByClassName("msg_actions")[0].getElementsByTagName("message-footer-actions")[0].appendChild(spanBtnPTRE2);
                    }
                }
            });

            if (tabActiPos.length > 0){
                // Build JSON
                const jsonSystemObj = {};
                tabActiPos.forEach(function(jsonPos) {
                    jsonSystemObj[jsonPos.coords+'-'+jsonPos.messageID] = jsonPos;
                });

                // Sent to PTRE
                ptreRequest(urlPTREPushActivity, {body: jsonSystemObj})
                    .then(function(reponseDecode) {
                        // PTRE answered: save new max TS to not re-send same counter spy messages
                        // (on network failure, it is not saved so messages will be pushed again next time)
                        GM_setValue(ptreMaxCounterSpyTsSeen, maxCounterSpyTsSeenNow);
                        displayPTREPopUpMessage(reponseDecode.message, reponseDecode.code == 1 ? 'success' : 'error');
                        if (reponseDecode.code != 1) {
                            addToLogs('[C-SPY] ' + reponseDecode.message);
                        }
                    })
                    .catch(function(error) {
                        displayPTREPopUpMessage(getPTRERequestErrorLabel(error), 'error');
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
        const posKey = galaxy + ':' + system + ':' + pos;
        var body = ptreSection('Informations', '<div id="ptreGalaxyActionsContent">[' + posKey + '] - <b>' + playerName + '</b> - <a href="' + buildPTRELinkToPlayer(playerId) + '" target="_blank">PTRE Profile</a> - <a href="' + buildPTRELinkToAdvancedActivityTable(playerId) + '" target="_blank">Activity Table</a>'
            + (targetComment != '' ? '<br><br>' + targetComment : '') + '</div>');
        body += ptreSection('New Galaxy Events', '<div id="ptreGalaxyPosEvent-' + posKey + '"></div>');
        if (playerId > 0) {
            body += ptreSection('Actions', '<div class="ptreSectionActions">'
                + ptreButton('btnGetPlayerInfos2' + playerId, 'FLEET')
                + ptreButton('btnManageList', 'ADD TO LIST')
                + ptreButton('synctTargetsWithPTREViaGalaxy', 'SYNC TARGETS')
                + ptreButton('btnDNP', dnpButtonLabel) + '</div>');
            body += ptreSection('Shared notes (shared with PTRE Team)',
                '<div id="ptreGalaxyPlayerNoteStatus-' + playerId + '" class="ptreSmall"></div>'
                + '<textarea name="note" class="ptreNoteTextarea" id="ptreGalaxyPlayerNote-' + playerId + '" rows="4"></textarea>',
                ptreButton('savePlayerNote', 'SAVE NOTE'));
            body += ptreSection('Points and Ranks, last days', '<div id="ptreGalaxyPlayerRanksPopUp"><div id="ptreGalaxyPlayerRanksPlaceholder-' + playerId + '" class="ptreSmall">Highscores will be loaded after a 2 secs delay...</div></div>');
        } else {
            body += ptreSection('Deep space', 'Nothing here...');
        }
        const panel = document.createElement('div');
        panel.id = 'ptreGalaxyPopUp';
        panel.className = 'ptrePopup';
        panel.innerHTML = '<div class="ptrePopupHeader"><span class="ptrePopupTitle">EasyPTRE Galaxy Box</span>'
            + '<div id="btnCloseGalaxyActions" class="button btn_blue ptreHeaderBtn" title="Close">&#10005; Close</div></div>'
            + '<div class="ptrePopupBody">' + body + '</div>';

        // Position panel next to button
        const planetList = document.getElementById('planetList');
        const rect = planetList.getBoundingClientRect();
        panel.style.top = (window.scrollY + rect.top) + 'px';
        panel.style.left = (window.scrollX + rect.left) + 'px';
        document.body.appendChild(panel);
        // Keep the pop-up inside the window
        const overflow = panel.getBoundingClientRect().right - (window.innerWidth - 10);
        if (overflow > 0) {
            panel.style.left = Math.max(window.scrollX + 10, window.scrollX + rect.left - overflow) + 'px';
        }

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
                    ptreRequest(urlPTREIngameAction, {params: {team_key: GM_getValue(ptreTeamKey, '')}, body: {"0": {type: "dnp", id: playerId, val: 0, name: playerName}}})
                        .then(function(reponseDecode) {
                            displayPTREPopUpMessage(reponseDecode.message, reponseDecode.updated > 0 ? 'success' : 'warning');
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
                        })
                        .catch(function(error) {
                            displayPTREPopUpMessage(getPTRERequestErrorLabel(error), 'error');
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

// ****************************************
// PTRE/AGR LIST RELATED
// ****************************************

// Add data to sharable structure
// Element should be like: {type: string_type, id: ID, coords: coords, val: a_value};
// Not called at the moment
/*
function addDataToPTREData(newData, syncToPTRE = true) {
    var dataJSON = '';
    dataJSON = GM_getValue(ptreDataToSync, '');
    var dataList = [];
    if (dataJSON != '') {
        dataList = JSON.parse(dataJSON);
    }

    // Look for same entry
    var idASup = -1;
    dataList.forEach(function(elem, i) {
        //console.log("[EasyPTRE] Checking elem " + elem.type + " / " + elem.id);
        if (elem.type == newData.type && elem.id == newData.id) {
            if (elem.val == newData.val) {
                consoleDebug("Element " + newData.type + " has not changed. No update.");
                idASup = -2;
            } else {
                consoleDebug("Element " + newData.type + " has changed (" + newData.val + " VS " + elem.val + "). Need to update.");
                idASup = i;
            }
        }
    });
    if (idASup == -2) {
        return -1;
    } else if (idASup != -1) {
        // Delete entry if found
        dataList.splice(idASup, 1);
    }
    // Add the new entry
    console.log("[EasyPTRE] Adding/Updating " + newData.type + " ID:" + newData.id + " / val: " + newData.val, newData);
    dataList.push(newData);

    // Save list
    dataJSON = JSON.stringify(dataList);
    GM_setValue(ptreDataToSync, dataJSON);

    //debugSharableData();

    // Sync data to PTRE
    if (syncToPTRE === true) {
        setTimeout(syncDataWithPTRE, ptreDataSharingDelay);
    }
}
*/

function refreshPhalanxStorage(moonIdNew, coordsNew, phalanxLevelNew, syncToPTRE = true) {
    phalanxLevelNew = Number(phalanxLevelNew);
    consoleDebug("[PHALANX] Checking Phalanx update for " + moonIdNew + " at " + coordsNew + " (level " + phalanxLevelNew + ")");

    var dataJSON = GM_getValue(ptreDataToSync, '');
    var dataList = dataJSON != '' ? JSON.parse(dataJSON) : [];

    var found = false;
    var needToSave = false;

    dataList.forEach(function(elem) {
        if (elem.type == "phalanx" && elem.id == moonIdNew) {
            found = true;
            if (elem.coords == coordsNew && elem.val == phalanxLevelNew) {
                consoleDebug("[PHALANX] Already up to date, no change");
            } else {
                consoleDebug("[PHALANX] Updated: coords " + elem.coords + " -> " + coordsNew + ", level " + elem.val + " -> " + phalanxLevelNew);
                elem.coords = coordsNew;
                elem.val = phalanxLevelNew;
                needToSave = true;
            }
        }
    });

    if (!found) {
        consoleDebug("[PHALANX] New entry, inserting");
        dataList.push({type: "phalanx", id: moonIdNew, coords: coordsNew, val: phalanxLevelNew});
        needToSave = true;
    }

    if (needToSave) {
        GM_setValue(ptreDataToSync, JSON.stringify(dataList));
        displayPTREPopUpMessage("Phalanx updated", 'success');
        consoleDebug("[PHALANX] 1 phalanx updated");
        if (syncToPTRE === true) {
            setTimeout(syncDataWithPTRE, ptreDataSharingDelay);
        }
    }
}

function debugSharableData() {
    var dataJSON = '';
    dataJSON = GM_getValue(ptreDataToSync, '');

    var dataList = [];
    if (dataJSON != '') {
        dataList = JSON.parse(dataJSON);
        dataList.forEach(function(elem) {
            console.log("[" + elem.type + "] " + elem.id + " => " + elem.val + " (" + elem.coords + ")");
        });
    } else {
        console.log("[EasyPTRE] No data to display");
    }
}

// Remove player from PTRE/AGR list
function deletePlayerFromList(playerId, type) {

    // Check if player is part of the list
    if (isPlayerInTheList(playerId, type)) {
        // Get list content depending on if its PTRE or AGR list
        var targetJSON = '';
        var pseudo = '';
        if (type == 'PTRE') {
            targetJSON = GM_getValue(ptrePTREPlayerListJSON, '');
        } else if (type == 'AGR') {
            targetJSON = GM_getValue(ptreAGRPlayerListJSON, '');
        }
        var targetList = [];
        var idASup = '_';
        if (targetJSON != '') {
            targetList = JSON.parse(targetJSON);
        }

        targetList.forEach(function(PlayerCheck, i) {
            if (PlayerCheck.id == playerId) {
                idASup = i;
                pseudo = PlayerCheck.pseudo;
            }
        });

        if (idASup != '_') {
            targetList.splice(idASup, 1);
        }

        // Save list
        targetJSON = JSON.stringify(targetList);
        if (type == 'PTRE') {
            GM_setValue(ptrePTREPlayerListJSON, targetJSON);
        } else if (type == 'AGR') {
            GM_setValue(ptreAGRPlayerListJSON, targetJSON);
        }

        return 'Player ' + pseudo + ' was removed from ' + type + ' list';
    } else {
        return 'Player is not part of ' + type + ' list';
    }
}

// Add player to PTRE/AGR list
function addPlayerToList(playerId, playerPseudo, type) {

    // Check if player is part of the list
    if (!isPlayerInTheList(playerId, type)) {
        // Get list content depending on if its PTRE or AGR list
        var targetJSON = '';
        if (type == 'PTRE') {
            targetJSON = GM_getValue(ptrePTREPlayerListJSON, '');
        } else if (type == 'AGR') {
            targetJSON = GM_getValue(ptreAGRPlayerListJSON, '');
        }

        var targetList = [];
        if (targetJSON != '') {
            targetList = JSON.parse(targetJSON);
        }
        if (type == 'PTRE' && targetList.length >= ptreTargetListMaxSize) {
            return [0, type + ' targets list is full, please remove a target'];
        } else {
            // Add player to list
            var player = {id: playerId, pseudo: playerPseudo};
            targetList.push(player);

            // Save list
            targetJSON = JSON.stringify(targetList);
            var ret_code = 0;
            if (type == 'PTRE') {
                GM_setValue(ptrePTREPlayerListJSON, targetJSON);
            } else if (type == 'AGR') {
                GM_setValue(ptreAGRPlayerListJSON, targetJSON);
                // We want to detect and notify when an AGR target is added
                ret_code = 1;
            }
            consoleDebug('[LIST] [' + type + '] Player ' + playerPseudo + ' has been added to ' + type + ' list');
            return [ret_code, 'Player has been added to ' + type + ' list'];
        }
    } else {
        return [0, 'Player is already in ' + type + ' list'];
    }
}

// This list contains targets that should not be shared to PTRE Team
function toogleTargetPrivateStatus(playerId) {
    var targetJSON = '';
    var targetList = [];
    var status = '';
    targetJSON = GM_getValue(ptreAGRPrivatePlayerListJSON , '');

    var idASup = -1;
    if (targetJSON != '') {
        targetList = JSON.parse(targetJSON);

        targetList.forEach(function(PlayerCheck, i) {
            if (PlayerCheck.id == playerId) {
                // Present => Delete
                idASup = i;
            }
        });
        if (idASup != -1) {
            targetList.splice(idASup, 1);
            status = 'shareable (sync to share)';
            consoleDebug("[LIST] [AGR] Deleting private player (" + idASup + "): " + playerId);
        }
    }
    if (idASup == -1) {
        var player = {id: playerId};
        targetList.push(player);
        status = 'private';
        consoleDebug("[LIST] [AGR] Adding private player " + playerId);
    }
    // Save new list
    targetJSON = JSON.stringify(targetList);
    GM_setValue(ptreAGRPrivatePlayerListJSON, targetJSON);

    return status;
}

// Returns a Set of private targets IDs (as strings)
function getPrivateTargetIds() {
    const targetJSON = GM_getValue(ptreAGRPrivatePlayerListJSON, '');
    if (targetJSON == '') {
        return new Set();
    }
    return new Set(JSON.parse(targetJSON).map(PlayerCheck => String(PlayerCheck.id)));
}

function debugListContent() {

    var targetJSON = '';

    targetJSON = GM_getValue(ptreAGRPlayerListJSON, '');
    var targetList = JSON.parse(targetJSON);
    console.log("[EasyPTRE] [AGR] list: ");
    console.log(targetList);

    targetJSON = GM_getValue(ptrePTREPlayerListJSON, '');
    targetList = JSON.parse(targetJSON);
    console.log("[EasyPTRE] [PTRE] list: ");
    console.log(targetList);
}

function isPlayerInTheList(playerId, type = 'PTRE') {

    var targetJSON = '';
    if (type == 'PTRE') {
        targetJSON = GM_getValue(ptrePTREPlayerListJSON, '');
    } else if (type == 'AGR') {
        targetJSON = GM_getValue(ptreAGRPlayerListJSON, '');
    }

    var ret = false;
    if (targetJSON != '') {
        var targetList = JSON.parse(targetJSON);

        targetList.forEach(function(PlayerCheck) {
            if (PlayerCheck.id == playerId) {
                ret = true;
            }
        });
    }
    return ret;
}

/*
    Send back a merged list of AGR and PTRE targets list
    Sent int back, not strings
*/
function getMergedTargetsList() {
    var targetJSON = '';
    var mergedTargetsList = [];
    targetJSON = GM_getValue(ptrePTREPlayerListJSON, '');
    if (targetJSON != '') {
        var targetList = JSON.parse(targetJSON);
        targetList.forEach(function(PlayerCheck) {
            if (!mergedTargetsList.includes(Number(PlayerCheck.id))) {
                mergedTargetsList.push(Number(PlayerCheck.id));
            }
        });
    }
    targetJSON = GM_getValue(ptreAGRPlayerListJSON, '');
    if (targetJSON != '') {
        var targetList = JSON.parse(targetJSON);
        targetList.forEach(function(PlayerCheck) {
            if (!mergedTargetsList.includes(Number(PlayerCheck.id))) {
                mergedTargetsList.push(Number(PlayerCheck.id));
            }
        });
    }
    return mergedTargetsList;
}

function getAGRPlayerIDFromPseudo(playerPseudo) {
    var ret = 0;
    var targetJSON = GM_getValue(ptreAGRPlayerListJSON, '');
    if (targetJSON != '') {
        var targetList = JSON.parse(targetJSON);
        targetList.forEach(function(PlayerCheck) {
            if (PlayerCheck.pseudo == playerPseudo) {
                ret = PlayerCheck.id;
            }
        });
    }
    return ret;
}

// Copy AGR internal players list to local AGR list
// AGR list IDs
// Friend: 52 => NO
// Trader: 55 => NO
// Watch: 62 => YES
// Miner: 64 => YES
// Target: 66 => YES
// To attack: 67 => YES
function updateLocalAGRList() {
    console.log("[EasyPTRE] [LIST] [AGR] Update AGR local list");
    var tabAgo = document.getElementsByClassName('ago_panel_overview');

    var count = 0;
    if (tabAgo && tabAgo[1] && tabAgo[1].children) {
        Array.from(tabAgo[1].children).forEach(function(ligneJoueurAGR) {
            if (ligneJoueurAGR.getAttributeNode('ago-data')) {
                var txtjsonDataAgo = ligneJoueurAGR.getAttributeNode('ago-data').value;
                var jsonDataAgo = JSON.parse(txtjsonDataAgo);
                var token = jsonDataAgo.action.token;
                // Do not add Friends and Traders to target list
                // This will add user custom list too
                if (token != 52 && token != 55) {
                    var IdPlayer = jsonDataAgo.action.id;
                    var PseudoPlayer = ligneJoueurAGR.children[1].innerText;
                    //consoleDebug('AGR native list member: ' + PseudoPlayer + ' (' + IdPlayer + ') | token:' + token + ')');
                    var ret = addPlayerToList(IdPlayer, PseudoPlayer, 'AGR');
                    count+= ret[0];
                }
            }
        });
    }
    if (count > 0) {
        displayPTREPopUpMessage(count + ' targets added to AGR list', 'success');
        console.log("[EasyPTRE] [LIST] [AGR] " + count + " targets added to AGR list");
    }
}

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
        let moved = false;
        const onMove = function(moveEvent) {
            moved = true;
            applyMainPanelPosition({left: moveEvent.clientX - offsetX, top: moveEvent.clientY - offsetY});
        };
        const onUp = function() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            wrapper.classList.remove('ptreDragging');
            // A simple click (no move) must not save the default position as 0,0
            if (!moved) {
                return;
            }
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
        previousSystem = generateEmptySystem();
    }

    // Go throught gala pos
    for(let pos = 1; pos <= 15 ; pos++) {
        // Compare new positions with previous one
        //consoleDebug("[GALAXY] [" + galaxy + ":" + system + ":" + pos + "] Player "+previousSystem[pos].playerId+"=>"+newSystemInfos[pos].playerId+" | Planet: "+previousSystem[pos].planetId+"=>"+newSystemInfos[pos].planetId+" | Moon: "+previousSystem[pos].moonId+"=>"+newSystemInfos[pos].moonId+" ("+additionnalSSInfos[pos].playerName + " - "+additionnalSSInfos[pos].playerRank+")");
        if (previousSystemFound === false || newSystemInfos[pos].playerId != previousSystem[pos].playerId || newSystemInfos[pos].planetId != previousSystem[pos].planetId || newSystemInfos[pos].moonId != previousSystem[pos].moonId) {
            if (newSystemInfos[pos].playerId != -1 || previousSystem[pos].playerId != -1) {
                consoleDebug("[GALAXY] [" + galaxy + ":" + system + ":" + pos + "] has changed: Player "+previousSystem[pos].playerId+"=>"+newSystemInfos[pos].playerId+" | Planet: "+previousSystem[pos].planetId+"=>"+newSystemInfos[pos].planetId+" | Moon: "+previousSystem[pos].moonId+"=>"+newSystemInfos[pos].moonId+" ("+additionnalSSInfos[pos].playerName + " - "+additionnalSSInfos[pos].playerRank+")");
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
        const jsonSystemObj = {};
        newSystemToPush.forEach(function(jsonPos) {
            jsonSystemObj[jsonPos.coords] = jsonPos;
        });
        // Send to PTRE
        ptreRequest(urlPTREPushGalaUpdate, {body: jsonSystemObj})
            .then(function(reponseDecode) {
                if (reponseDecode.code == 1) {
                    console.log("[EasyPTRE] [GALAXY] [FROM PTRE] " + reponseDecode.message);
                    // If we saw real events (confirmed by PTRE)
                    if (reponseDecode.event_count > 0) {
                        // Update counter indicator
                        ptreGalaxyEventCount += reponseDecode.event_count;
                        updateHtmlById('ptreGalaxyEventCount', ptreGalaxyEventCount);
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
                    displayPTREPopUpMessage(reponseDecode.message, 'error');
                    addToLogs('[GALA PUSH] ' + reponseDecode.message);
                }
            })
            .catch(function(error) {
                displayGalaxyMiniMessage('Galaxy push failed (' + error.message + ')');
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
    ptreRequest(urlPTREPushActivity, {body: activityTab})
        .then(function(reponseDecode) {
            console.log("[EasyPTRE] [GALAXY] [FROM PTRE] " + reponseDecode.message);
            displayGalaxyMiniMessage(reponseDecode.message);
            if (reponseDecode.code == 1) {
                ptreGalaxyActivityCount = ptreGalaxyActivityCount + reponseDecode.activity_count;
                updateHtmlById('ptreGalaxyActivityCount', ptreGalaxyActivityCount);
            } else {
                displayPTREPopUpMessage(reponseDecode.message, 'error');
                addToLogs('[ACTI PUSH] ' + reponseDecode.message);
            }
        })
        .catch(function(error) {
            displayGalaxyMiniMessage('Activities push failed (' + error.message + ')');
        });
    consoleDebug('[GALAXY] [' + galaxy + ':' + system + '] Pushing Activities to PTRE');
}

// This function calls PTRE backend to get player informations
// And sends results to Info Box
function getPlayerInfos(playerID, pseudo) {
    const TKey = GM_getValue(ptreTeamKey, '');
    setupMainBox("Player " + pseudo, null);
    if (TKey == '') {
        displayPTREPopUpMessage(ptreMissingTKMessage, 'error');
        updateHtmlById('ptreMainContent', ptreMessageBlock('error', ptreMissingTKMessage));
        return;
    }
    ptreRequest(urlPTREGetPlayerInfos, {method: 'GET', params: {team_key: TKey, player_id: playerID, pseudo: pseudo, noacti: 'yes'}})
        .then(function(reponse) {
            var content = '';
            if (reponse.code == 1) {
                const rows = reponse.fleet_json.map(function(item) {
                    const shipName = ptreShipNames[item.ship_type] || 'Ship ' + item.ship_type;
                    return [shipName, {html: '<span class="ptre_ship ptre_ship_' + item.ship_type + '"></span>', align: 'center'}, {html: '<span class="ptreBold">' + setNumber(item.count) + '</span>', align: 'right'}];
                });
                content = ptreSection('Best known fleet',
                    'Player: ' + pseudo + ' | Fleet points: <b>' + setNumber(reponse.top_sr_fleet_points) + '</b> | <a href="' + buildPTRELinkToPlayer(playerID) + '" target="_blank">PTRE Profile</a> | <a href="' + reponse.top_sr_link + '" target="_blank">Best Spy Report</a><br><br>'
                    + ptreTable(rows, {header: ['Ship', '', 'Count'], empty: '-'}));
            } else {
                content = ptreMessageBlock('error', reponse.message);
                addToLogs('[PLAYER INFOS] ' + reponse.message);
            }
            updateHtmlById('ptreMainContent', content);
        })
        .catch(function(error) {
            updateHtmlById('ptreMainContent', ptreMessageBlock('error', getPTRERequestErrorLabel(error)));
        });
}

function updateGalaxyBoxWithEventsAndPlayerNote(playerId, galaxy, system, pos) {
    const TKey = GM_getValue(ptreTeamKey, '');
    if (TKey != '') {
        // Check if Galaxy Box is still waiting the infos
        if (document.getElementById("ptreGalaxyPlayerNoteStatus-" + playerId) || document.getElementById("ptreGalaxyPosEvent-" + galaxy + ":" + system + ":" + pos)) {
            consoleDebug("[POP-UP] Getting Player notes");
            updateHtmlById("ptreGalaxyPlayerNoteStatus-" + playerId, "Loading note...");
            updateHtmlById("ptreGalaxyPosEvent-" + galaxy + ":" + system + ":" + pos, ptreLoading("Loading events..."));
            ptreRequest(urlPTREIngamePopUp, {params: {team_key: TKey, action: 'get', player_id: playerId, galaxy: galaxy, system: system, pos: pos}})
                .then(function (reponseDecode) {
                    consoleDebug("[POP-UP] [FROM PTRE] " + reponseDecode.message);
                    if (reponseDecode.code == 1) {
                        // Message
                        if (document.getElementById("ptreGalaxyPlayerNoteStatus-" + playerId)) {
                            document.getElementById("ptreGalaxyPlayerNoteStatus-" + playerId).innerHTML = reponseDecode.message;
                            addToLogs('[POP-UP] ' + reponseDecode.message);
                        }
                        // Update note content
                        if (document.getElementById("ptreGalaxyPlayerNote-" + playerId)) {
                            document.getElementById("ptreGalaxyPlayerNote-" + playerId).value = reponseDecode.note;
                        }
                        // Galaxy event
                        if (document.getElementById("ptreGalaxyPosEvent-" + galaxy + ":" + system + ":" + pos)) {
                            document.getElementById("ptreGalaxyPosEvent-" + galaxy + ":" + system + ":" + pos).innerHTML = decodeBase64UTF8(reponseDecode.event);
                        }
                    }
                })
                .catch(function (error) {
                    updateHtmlById("ptreGalaxyPlayerNoteStatus-" + playerId, getPTRERequestErrorLabel(error));
                    updateHtmlById("ptreGalaxyPosEvent-" + galaxy + ":" + system + ":" + pos, ptreMessageBlock('error', getPTRERequestErrorLabel(error)));
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
            const note = document.getElementById("ptreGalaxyPlayerNote-" + playerId).value;
            consoleDebug("[IG NOTES] Saving note for " + playerId);
            ptreRequest(urlPTREIngamePopUp, {params: {team_key: TKey, action: 'set', player_id: playerId}, form: {note: note}})
                .then(function (reponseDecode) {
                    consoleDebug("[IG NOTES] [FROM PTRE] " + reponseDecode.message);
                    updateHtmlById("ptreGalaxyPlayerNoteStatus-" + playerId, reponseDecode.message);
                })
                .catch(function (error) {
                    updateHtmlById("ptreGalaxyPlayerNoteStatus-" + playerId, getPTRERequestErrorLabel(error));
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
            consoleDebug("[POP-UP] Rank update canceled");
            return;
        }
        updateHtmlById("ptreGalaxyPlayerRanksPopUp", ptreLoading("Loading ranks..."));
        ptreRequest(urlPTREGetRanks, {params: {team_key: TKey, player_id: playerId}})
            .then(function(reponseDecode) {
                consoleDebug("[POP-UP] [FROM PTRE] " + reponseDecode.message);
                displayGalaxyMiniMessage(reponseDecode.message);
                if (reponseDecode.code == 1) {
                    const rows = reponseDecode.ranks_array.map(function(rank, i) {
                        const previousRank = reponseDecode.ranks_array[i + 1];
                        var classR = "";
                        var diff = "-";
                        if (previousRank) {
                            if (Number(rank.total_score) < Number(previousRank.total_score)) {
                                classR = "ptreError";
                                diff = setNumber(Number(rank.total_score) - Number(previousRank.total_score));
                            } else if (Number(rank.total_score) > Number(previousRank.total_score)) {
                                classR = "ptreSuccess";
                                diff = "+" + setNumber(Number(rank.total_score) - Number(previousRank.total_score));
                            }
                        }
                        const when = (i == 0) ? "at midnight" : i + " days ago";
                        return [{html: when, align: 'center'}, {html: setNumber(rank.total_score) + ' pts', align: 'right'},
                            {html: '<span class="' + classR + '">' + diff + '</span>', align: 'right'}, {html: '#' + rank.total_rank, align: 'center'}];
                    });
                    updateHtmlById("ptreGalaxyPlayerRanksPopUp", ptreTable(rows, {header: ['Date', 'Points', 'Points diff', 'Global rank'], empty: '-'}));
                } else {
                    updateHtmlById("ptreGalaxyPlayerRanksPopUp", ptreMessageBlock('error', reponseDecode.message));
                    addToLogs('[RANKS] ' + reponseDecode.message);
                }
            })
            .catch(function(error) {
                updateHtmlById("ptreGalaxyPlayerRanksPopUp", ptreMessageBlock('error', getPTRERequestErrorLabel(error)));
            });
    } else {
        displayPTREPopUpMessage(ptreMissingTKMessage, 'error');
    }
}

// This function fetchs closest friend phalanx
function getPhalanxInfosFromGala() {
    const currentTime = getIGCurrentTS();
    const splitted = currentPlanetCoords.split(':');
    var galaxy = splitted[0];
    var system = splitted[1];
    //var position = splitted[2];
    if (/component=galaxy/.test(location.href)) {
        galaxy = document.getElementById('galaxy_input').value;
        system = document.getElementById('system_input').value;
    }
    var warning = '';
    ptreCurrentView = getPhalanxInfosFromGala;
    setupMainBox('Friends & Phalanx', 'FriendsPhalanx');
    document.getElementById('ptreMainContent').innerHTML = ptreLoading("Loading info for " + galaxy + ":" + system + "...");
    const teamKey = GM_getValue(ptreTeamKey, '');

    if (teamKey == '') {
        document.getElementById('ptreMainContent').innerHTML = ptreMessageBlock('error', ptreMissingTKMessage);
        return -1;
    }

    // Buddies List warnings
    var dataJSON = '';
    if (GM_getValue(ptreAddBuddiesToFriendsAndPhalanx, 'true') == 'true') {
        dataJSON = GM_getValue(ptreBuddiesList, '');
        if (dataJSON != '') {
            if ((currentTime - GM_getValue(ptreBuddiesListLastRefresh, 0)) > 7*24*60*60) {
                warning = ptreMessageBlock('warning', '<span class="ptreWarning">Buddies list might be outdated: </span> <a href="/game/index.php?page=ingame&component=buddies">Visit buddies page to update your friends list</a>');
            }
        } else {
            warning = ptreMessageBlock('warning', '<span class="ptreWarning">Buddies list is empty: </span> <a href="/game/index.php?page=ingame&component=buddies">Visit buddies page to add your friends to this view</a>');
        }
    } else {
        warning = ptreMessageBlock('warning', '<span class="ptreWarning">Buddies list is not managed: you may enable it in EasyPTRE settings</span>');
    }

    ptreRequest(urlPTREGetPhalanxInfos, {params: {team_key: teamKey, galaxy: galaxy, system: system}, body: dataJSON})
        .then(function(reponseDecode) {
            var message = decodeBase64UTF8(reponseDecode.message);
            if (reponseDecode.code != 1) {
                addToLogs('[F&PHA] ' + reponseDecode.message_debug);
            }
            updateHtmlById('ptreMainContent', warning + message);
        })
        .catch(function(error) {
            updateHtmlById('ptreMainContent', warning + ptreMessageBlock('error', getPTRERequestErrorLabel(error)));
        });
}

// This function fetchs Galaxy Event Explorer infos
function getGEEInfosFromGala() {
    const splitted = currentPlanetCoords.split(':');
    var galaxy = splitted[0];
    var system = splitted[1];
    var position = splitted[2];
    ptreCurrentView = getGEEInfosFromGala;
    setupMainBox('Galaxy Events Explorer', 'GalaxyEvents');
    document.getElementById('ptreMainContent').innerHTML = ptreLoading("Loading info for " + galaxy + ":" + system + ":" + position + "...");
    const teamKey = GM_getValue(ptreTeamKey, '');
    if (teamKey == '') {
        document.getElementById('ptreMainContent').innerHTML = ptreMessageBlock('error', ptreMissingTKMessage);
        return -1;
    }
    ptreRequest(urlPTREGetGEEInfos, {params: {team_key: teamKey, galaxy: galaxy, system: system, position: position}})
        .then(function(reponseDecode) {
            var message = decodeBase64UTF8(reponseDecode.message);
            if (reponseDecode.code != 1) {
                addToLogs('[GEE] ' + reponseDecode.message_debug);
            }
            updateHtmlById('ptreMainContent', message);
        })
        .catch(function(error) {
            updateHtmlById('ptreMainContent', ptreMessageBlock('error', getPTRERequestErrorLabel(error)));
        });
}

// This function fetchs last multi-player Fight Events for the current universe (proxied via PTRE to XPD)
function getFightEventsFromXPD() {
    ptreCurrentView = getFightEventsFromXPD;
    setupMainBox('Fight Events', 'FightEvents');
    const teamKey = GM_getValue(ptreTeamKey, '');
    if (teamKey == '') {
        document.getElementById('ptreMainContent').innerHTML = ptreMessageBlock('error', ptreMissingTKMessage);
        return -1;
    }
    ptreRequest(urlPTREGetXpdEvents, {params: {team_key: teamKey}})
        .then(function(reponseDecode) {
            var message = decodeBase64UTF8(reponseDecode.message);
            if (reponseDecode.code != 1) {
                addToLogs('[EVENTS] ' + reponseDecode.message_debug);
            }
            updateHtmlById('ptreMainContent', message);
        })
        .catch(function(error) {
            updateHtmlById('ptreMainContent', ptreMessageBlock('error', getPTRERequestErrorLabel(error)));
        });
}

// This function fetchs Orion anomalies context infos (Team Key is optional)
// onDone always receives an object {"g:s:p": html} (empty on failure)
function getOrionInfos(coordsList, onDone) {
    const teamKey = GM_getValue(ptreTeamKey, '');
    const params = {
        top: GM_getValue(ptreOrionMilitaryTop, ptreOrionMilitaryTopDefault),
        range: GM_getValue(ptreOrionSystemRange, ptreOrionSystemRangeDefault)
    };
    if (teamKey != '') {
        params.team_key = teamKey;
    }
    const coordsLabel = coordsList.map(c => c.galaxy + ':' + c.system + ':' + c.position).join(', ');
    consoleDebug('[ORION] [TO PTRE] Sending ' + coordsList.length + ' coords (Team Key: ' + (teamKey != '' ? 'yes' : 'no') + '): ' + coordsLabel);
    ptreRequest(urlPTREGetOrionInfos, {params: params, body: coordsList})
        .then(function(reponseDecode) {
            if (reponseDecode.code != 1) {
                consoleDebug('[ORION] [FROM PTRE] Code ' + reponseDecode.code + ': ' + reponseDecode.message + ' | ' + reponseDecode.message_debug);
                addToLogs('[ORION] ' + reponseDecode.message_debug);
                return {};
            }
            consoleDebug('[ORION] [FROM PTRE] Code ' + reponseDecode.code + ': ' + reponseDecode.message);
            const anomalies = {};
            for (const [coords, html64] of Object.entries(reponseDecode.anomalies || {})) {
                anomalies[coords] = decodeBase64UTF8(html64);
            }
            const missing = coordsList.map(c => c.galaxy + ':' + c.system + ':' + c.position).filter(c => !anomalies[c]);
            consoleDebug('[ORION] [FROM PTRE] Received infos for ' + Object.keys(anomalies).length + '/' + coordsList.length + ' coords: ' + Object.keys(anomalies).join(', ') + (missing.length > 0 ? ' | Missing: ' + missing.join(', ') : ''));
            return anomalies;
        })
        .catch(function() {
            // Already logged by ptreRequest
            return {};
        })
        .then(onDone);
}

// This function sends commun data to Team
// Like:
// - Phalanx levels
function syncDataWithPTRE(mode = "auto") {
    const currentTime = getIGCurrentTS();
    console.log("[EasyPTRE] [DATA] Syncing data. IG TS: "+currentTime);
    const teamKey = GM_getValue(ptreTeamKey, "notk");
    const params = {
        team_key: teamKey,
        cooldown: GM_getValue(ptreCheckForUpdateCooldown, 0),
        galaxy_api_update_timestamp: GM_getValue(ptreGalaxyAPIUpdateIGTS, 0)
    };

    if (mode == "auto") {
        params.mode = "a";
    }
    const betaMode = GM_getValue(ptreEnableBetaMode, 'false');
    if (betaMode == "true") {
        params.beta = 1;
    }

    // Push data to PTRE
    var dataJSON = GM_getValue(ptreDataToSync, '');
    ptreRequest(urlPTRESyncData, {params: params, body: dataJSON})
        .then(function(reponseDecode) {
            if (reponseDecode.code == 1) {
                consoleDebug("[DATA] Received data from PTRE. TS "+reponseDecode.timestamp);
                // Update Team name
                GM_setValue(ptreTeamName, reponseDecode.team_name);

                // Update highlighted players received from PTRE
                GM_deleteValue(ptreHighlightedPlayers);
                var temp = reponseDecode.player_highlight_array;
                // Convert TS from Unix to IG (ts received is a duration, not a TS)
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
                GM_setValue(ptreGalaxyAPIUpdateIGTS, convertUnixTSToIGTS(reponseDecode.galaxy_api_update_timestamp));

                // Update info in menu
                updateHtmlById("ptreLastDataSyncField", getLastUpdateLabel(currentTime));
            } else {
                addToLogs('[SYNC DATA] ' + reponseDecode.message_debug);
            }
            consoleDebug('[FROM PTRE] ' + reponseDecode.message);
            displayMessageInSettings(reponseDecode.message_debug);
            updateHtmlById("ptreLastDataSyncMessageField", reponseDecode.message_debug);
        })
        .catch(function(error) {
            displayMessageInSettings(getPTRERequestErrorLabel(error));
            updateHtmlById("ptreLastDataSyncMessageField", getPTRERequestErrorLabel(error));
        });
}

// Action: Sync targets
function syncTargets(mode) {
    const currentTime = getIGCurrentTS();
    const ptreStoredTK = GM_getValue(ptreTeamKey, '');
    var AGRJSON = GM_getValue(ptreAGRPlayerListJSON, '');
    var PTREJSON = GM_getValue(ptrePTREPlayerListJSON, '');
    var targetList = [];
    var targetListTemp;
    var player;
    var nb_private = 0;

    if (ptreStoredTK == '') {
        displayPTREPopUpMessage(ptreMissingTKMessage, 'error');
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
    const privateTargetIds = getPrivateTargetIds();
    targetListTemp.forEach(function(item) {
        if (privateTargetIds.has(String(item.id))) {
            //consoleDebug("Ignoring " + item.pseudo);
            nb_private++;
        } else {
            player = {id: item.id, pseudo: item.pseudo};
            targetList.push(player);
        }
    });

    // Sync to PTRE
    ptreRequest(urlPTRESyncTargets, {params: {version: GM_info.script.version, team_key: ptreStoredTK}, body: targetList})
        .then(function(reponseDecode) {
            if (reponseDecode.code == 1) {
                // Rebuild entire local PTRE list (players already in AGR list are skipped)
                const agrJSON = GM_getValue(ptreAGRPlayerListJSON, '');
                const agrIds = new Set(agrJSON != '' ? JSON.parse(agrJSON).map(p => String(p.id)) : []);
                const addedIds = new Set();
                const newPTREList = [];
                (reponseDecode.targets_array || []).forEach(function(incomingPlayer) {
                    const id = String(incomingPlayer.player_id);
                    if (!agrIds.has(id) && !addedIds.has(id) && newPTREList.length < ptreTargetListMaxSize) {
                        addedIds.add(id);
                        newPTREList.push({id: incomingPlayer.player_id, pseudo: incomingPlayer.pseudo});
                    }
                });
                GM_setValue(ptrePTREPlayerListJSON, JSON.stringify(newPTREList));
                var count = newPTREList.length;

                // Update configuration
                GM_setValue(ptreLastTargetsSync, currentTime);

                // Update info in menu
                displayMessageInSettings(nb_private + ' private targets ignored. ' + reponseDecode.message + ' ' + count + ' new targets added.');
                updateHtmlById("ptreLastTargetsSyncField", getLastUpdateLabel(currentTime));

                // Refresh targets list if displayed
                if (document.getElementById('targetsListDiv')) {
                    displayPTRETargetsList();
                }
            } else {
                displayMessageInSettings(reponseDecode.message);
                addToLogs('[SYNC TARGETS] ' + reponseDecode.message);
            }
            updateHtmlById("ptreLastTargetsSyncMessageField", reponseDecode.message);
        })
        .catch(function(error) {
            displayMessageInSettings(getPTRERequestErrorLabel(error));
            updateHtmlById("ptreLastTargetsSyncMessageField", getPTRERequestErrorLabel(error));
        });
}

// Get Account Info as JSON
// Update Phalanx
function updateDataFromEmpireMoonPage() {
    consoleDebug("[EMPIRE] Fetching Account Info (moons)");
    const currentTime = getIGCurrentTS();
    return fetch('https://' + window.location.host + '/game/index.php?page=componentOnly&component=externaldataexport&action=accountInfo&asJson=1', {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        var moons = data.moons;
        if (!moons || Object.keys(moons).length === 0) {
            addToLogs('[EMPIRE] No moons found in Account Info');
            displayMessageInSettings('No phalanx data found in Account Info');
            updateHtmlById("ptreEmpireMoonLastRefreshField", 'No phalanx data found in Account Info');
            return;
        }

        var newPhalanxList = [];
        Object.keys(moons).forEach(function(moonID) {
            var moon = moons[moonID];
            var coords = moon.galaxy + ':' + moon.system + ':' + moon.position;
            var buildings = moon.buildings || {};
            var phalanxLevel = parseInt(buildings['42'], 10);
            if (isNaN(phalanxLevel)) {
                consoleDebug('[EMPIRE] No phalanx (42) for moon ' + moonID);
                return;
            }
            consoleDebug('[EMPIRE] ' + coords + ' (' + moonID + ') → phalanx: ' + phalanxLevel);
            newPhalanxList.push({type: "phalanx", id: moonID, coords: coords, val: phalanxLevel});
        });

        if (newPhalanxList.length > 0) {
            var dataJSON = GM_getValue(ptreDataToSync, '');
            var dataList = [];
            if (dataJSON != '') {
                dataList = JSON.parse(dataJSON);
            }
            var dataListNew = dataList.filter(function(elem) { return elem.type !== "phalanx"; });
            newPhalanxList.forEach(function(entry) { dataListNew.push(entry); });
            GM_setValue(ptreDataToSync, JSON.stringify(dataListNew));

            var levels = newPhalanxList.map(function(e) { return e.val; });
            var levelMin = Math.min.apply(null, levels);
            var levelMax = Math.max.apply(null, levels);

            GM_setValue(ptreEmpireMoonLastRefresh, currentTime);
            updateHtmlById("ptreEmpireMoonLastRefreshField", getLastUpdateLabel(currentTime));

            addToLogs('[EMPIRE] Updated ' + newPhalanxList.length + ' phalanx (min: ' + levelMin + ' | max: ' + levelMax + ')');
            displayMessageInSettings('Phalanx updated: ' + newPhalanxList.length + ' moons (min: ' + levelMin + ' | max: ' + levelMax + ')');
        } else {
            addToLogs('[EMPIRE] No phalanx found in Account Info response');
            displayMessageInSettings('No phalanx data found in Account Info');
            updateHtmlById("ptreEmpireMoonLastRefreshField", 'No phalanx data found in Account Info');
        }
    })
    .catch(function(error) {
        console.error("[EasyPTRE] Can't fetch account info ", error);
        displayMessageInSettings('Failed to fetch Account Info');
        updateHtmlById("ptreEmpireMoonLastRefreshField", 'Failed to fetch Account Info');
    });
}

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
    if (!galaxyLoading) {
        consoleDebug("[GALAXY] #galaxyLoading not found (vacation mode? V13 change?). Skipping galaxy improvement.");
        return;
    }
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
    if (!galaxyLoading) {
        consoleDebug("[GALAXY] #galaxyLoading not found (vacation mode? V13 change?). Not watching for galaxy changes.");
        return;
    }
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
    var galaxy = document.getElementById('galaxy_input').value;
    var system = document.getElementById('system_input').value;
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
                    const versionMatch = result.responseText.match(/@version\s+(\S+)/);
                    if (!versionMatch) {
                        displayUpdateVersionMessage('<span class="ptreError">Cant read last version</span>');
                        consoleDebug('[OPENJS] Cant find @version in meta file');
                        return;
                    }
                    const availableVersion = versionMatch[1];
                    consoleDebug("[OPENJS] Current version: " + GM_info.script.version);
                    consoleDebug("[OPENJS] Last version: " + availableVersion);
                    GM_setValue(ptreLastAvailableVersion, availableVersion);
                    GM_setValue(ptreLastAvailableVersionRefresh, currentUnixTS);
                    if (isNewerVersion(availableVersion, GM_info.script.version)) {
                        displayUpdateVersionMessage('<span class="ptreError">New version '+ availableVersion + ' is available. You need to update <a href="https://openuserjs.org/scripts/GeGe_GM/EasyPTRE" target="_blank">EasyPTRE</a> version.</span>');
                        if (document.getElementById('ptreMenuName')) {
                            document.getElementById('ptreMenuName').innerHTML = 'CLICK ME';
                            document.getElementById('ptreMenuName').classList.add('ptreError');
                        }
                        displayPTREPopUpMessage("New EasyPTRE version available. Please update it.", 'warning');
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
    consoleDebug(`[GALAXY] Updated cache for ${galaxy}:${system}`);
    scheduleGalaxyStorageFlush(galaxy);
}

// Writing an entire galaxy to storage is heavy (up to ~550 KB)
// so writes are grouped: after an idle delay, and when leaving the page
function scheduleGalaxyStorageFlush(galaxy) {
    ptreGalaxyPendingWrites.add(String(galaxy));
    clearTimeout(ptreGalaxyFlushTimer);
    ptreGalaxyFlushTimer = setTimeout(flushGalaxyStorage, ptreGalaxyFlushDelayMiliSec);
}

function flushGalaxyStorage() {
    clearTimeout(ptreGalaxyFlushTimer);
    ptreGalaxyFlushTimer = null;
    if (ptreGalaxyPendingWrites.size === 0) {
        return;
    }
    ptreGalaxyPendingWrites.forEach(function(galaxy) {
        if (ptreGalaxyCache[galaxy]) {
            GM_setValue(ptreGalaxyData+galaxy, ptreGalaxyCache[galaxy]);
        }
    });
    consoleDebug('[GALAXY] Storage written for galaxies: ' + Array.from(ptreGalaxyPendingWrites).join(', '));
    ptreGalaxyPendingWrites.clear();
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
            ptreRequest(urlcheckForPTREUpdate, {params: {
                team_key: TKey,
                current_ts: GM_getValue(ptreCurrentBackendUpdateTS, 0),
                cooldown: GM_getValue(ptreCheckForUpdateCooldown, 0),
                galaxy_api_update_timestamp: GM_getValue(ptreGalaxyAPIUpdateIGTS, 0)
            }})
                .then(function(reponseDecode) {
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
                })
                .catch(function() {
                    // Already logged by ptreRequest, next check will retry
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
        // No check while tab is hidden (next check within 10 sec when tab is displayed again)
        if (!document.hidden && currentTime > (Math.floor(Number(GM_getValue(ptreLastUpdateCheck, 0)) + cooldown))) {
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

// ****************************************
// MINI FUNCTIONS
// ****************************************

// Check TeamKey format
function isValidTeamKey(tk) {
    return tk.replace(/-/g, "").length == 18 && tk.substr(0, 2) == "TM";
}

// Detects if AGR is enabled
function isAGREnabled() {
    if (document.getElementById('ago_panel_Player')) {
        return true;
    }
    return false;
}

function isOGLEnabled() {
    if (document.querySelector('body.oglight')) {
        return true;
    }
    return false;
}

function isOGIEnabled() {
    if (document.getElementsByClassName('ogl-harvestOptions').length != 0) {
        return true;
    }
    return false;
}

// Detects if OGL is enabled
function isOGLorOGIEnabled() {
    if (isOGLEnabled() || isOGIEnabled()) {
        return true;
    }
    return false;
}

// Convert planets activities to OGL - PTRE format
function convertActivityToOGLFormat(showActivity, idleTime) {
    if (showActivity == '15') {
        return '*';
    } else if (showActivity == '60') {
        return idleTime;
    } else if (!showActivity) {
        return '60';
    }
    return '60';
}

function buildPTRELinkToPlayer(playerID) {
    return 'https://ptre.chez.gg/?country=' + country + '&univers=' + universe + '&player_id=' + playerID;
}

function buildPTRELinkToAdvancedActivityTable(playerID) {
    return 'https://ptre.chez.gg/advanced_activity_table.php?country=' + country + '&univers=' + universe + '&player_id=' + playerID;
}

function buildLinkToGalaxy(galaxy, system, position) {
    return '<a href="https://s'+universe+'-'+country+'.ogame.gameforge.com/game/index.php?page=ingame&component=galaxy&galaxy='+galaxy+'&system='+system+'&position='+position+'">['+galaxy+':'+system+':'+position+']</a>';
}

function buildLinkToMoonBuilding(moonID) {
    return '<a href="https://s'+universe+'-'+country+'.ogame.gameforge.com/game/index.php?page=ingame&component=facilities&cp='+moonID+'">Visit another Moon buildings</a>';
}

function consoleDebug(message) {
    if (ptreEnableConsoleDebugValue === true) {
        console.log('[EasyPTRE] ' + message);
    }
}

function round(x, y) {
    return Number.parseFloat(x).toFixed(y);
}

function setNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function getLastUpdateLabel(ts) {
    var temp = "";
    const currentTime = getIGCurrentTS();

    if (ts == 0) {
        return '<span class="ptreError">never updated</span>';
    } else if (currentTime >= ts) {
        var nb_min = (currentTime - ts) / 60;
        if (nb_min <= 1) {
            temp = '<span class="ptreSuccess">updated now</span>';
        } else if (nb_min < 60) {
            temp = '<span class="ptreSuccess">updated ' + round(nb_min, 0) + ' mins ago</span>';
        } else if (nb_min < 24*60) {
            var nb_h = (currentTime - ts) / 3600;
            temp = '<span class="ptreWarning">updated ' + round(nb_h, 0) + ' hours ago</span>';
        } else {
            temp = '<span class="ptreError">updated ' + round(nb_min/(24*60), 1) + ' days ago</span>';
        }
        return temp;
    } else {
        let inSec = ts - currentTime;
        return "In " + inSec + " secs";
    }
    return temp;
}

function getUnixTSLabel(ts) {
    var temp = "";
    const currentUnixTS = getCurrentUnixTS();

    if (ts == 0) {
        return '<span class="ptreError">???</span>';
    } else if (currentUnixTS >= ts) {
        var nb_min = (currentUnixTS - ts) / 60;
        if (nb_min <= 1) {
            temp = '<span class="ptreSuccess">now</span>';
        } else if (nb_min < 60) {
            temp = '<span class="ptreSuccess">' + round(nb_min, 0) + ' mins ago</span>';
        } else if (nb_min < 24*60) {
            var nb_h = (currentUnixTS - ts) / 3600;
            temp = '<span class="ptreWarning">' + round(nb_h, 0) + ' hours ago</span>';
        } else {
            temp = '<span class="ptreError">' + round(nb_min/(24*60), 1) + ' days ago</span>';
        }
        return temp;
    } else {
        let inSec = ts - currentUnixTS;
        return "In " + inSec + " secs";
    }
    return temp;
}

// Decode a base64 string containing UTF-8 bytes (atob alone breaks non-ASCII chars)
function decodeBase64UTF8(base64) {
    return new TextDecoder().decode(Uint8Array.from(atob(base64), c => c.charCodeAt(0)));
}

// Returns true if version "candidate" is strictly newer than "current" (format: X.Y.Z)
function isNewerVersion(candidate, current) {
    const a = String(candidate).split('.').map(n => parseInt(n, 10) || 0);
    const b = String(current).split('.').map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const diff = (a[i] || 0) - (b[i] || 0);
        if (diff !== 0) {
            return diff > 0;
        }
    }
    return false;
}

function updateHtmlById(id, html) {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = html;
    }
}

// Calling serverTime.getTime() multtiple times is buggy.
// We call it one time at script start
// Then we manage current time via client time increase
function getIGCurrentTS() {
    const elapsed = Date.now() - ptrePageLoadClientMiliTS;
    return Math.floor((ptrePageLoadServerMiliTS + elapsed) / 1000);
}

function getIGCurrentMiliTS() {
    const elapsed = Date.now() - ptrePageLoadClientMiliTS;
    return ptrePageLoadServerMiliTS + elapsed;
}

function getCurrentUnixTS() {
    const elapsed = Date.now() - ptrePageLoadClientMiliTS;
    return Math.floor(ptrePageLoadUnixTS + elapsed / 1000);
}

function convertUnixTSToIGTS(unixTS) {
    return unixTS - ptreTimezoneDiffSec;
}

function convertIGTSToUnixTS(igTS) {
    return igTS + ptreTimezoneDiffSec;
}

// ****************************************
// NOTIFICATIONS FUNCTIONS
// ****************************************

// Displays a notification (toast) on the bottom-right corner
// type: 'info' (default) | 'success' | 'warning' | 'error'
// Each toast is removed after a delay (paused while hovered), or with its close button
function displayPTREPopUpMessage(message, type = 'info') {
    const icons = {info: '&#8505;', success: '&#10004;', warning: '&#9888;', error: '&#10006;'};
    if (!icons[type]) {
        type = 'info';
    }
    let container = document.getElementById('ptreToasts');
    if (!container) {
        container = document.createElement('div');
        container.id = 'ptreToasts';
        document.body.appendChild(container);
    }
    // Too many toasts: remove the oldest ones
    while (container.children.length >= ptreMaxToasts) {
        container.firstElementChild.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'ptreToast ptreToast-' + type;
    toast.innerHTML = '<span class="ptreToastIcon">' + icons[type] + '</span>'
        + '<div class="ptreToastBody"><span class="ptreNotificationTitle">PTRE: </span>' + message + '</div>'
        + '<span class="ptreToastClose" title="Close">&#10005;</span>';
    container.appendChild(toast);

    let timer = null;
    const removeToast = function() {
        clearTimeout(timer);
        toast.classList.add('ptreToastOut');
        setTimeout(function() {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 200);
    };
    const startTimer = function() {
        timer = setTimeout(removeToast, (type === 'error' || type === 'warning') ? ptreErrorMessageDisplayTime : ptreMessageDisplayTime);
    };
    toast.addEventListener('mouseenter', function() {
        clearTimeout(timer);
    });
    toast.addEventListener('mouseleave', startTimer);
    toast.querySelector('.ptreToastClose').addEventListener('click', removeToast);
    startTimer();
}

// Display message under galaxy view
function displayGalaxyMiniMessage(message) {
    if (document.getElementById("fleetstatusrow")) {
        document.getElementById("fleetstatusrow").innerHTML = '<div class="success">PTRE: ' + message + '</div>';
    } else {
        console.log("[EasyPTRE] Error. Cant display: " + message);
    }
}

function cleanGalaxyMiniMessage() {
    updateHtmlById("fleetstatusrow", '');
}

// ****************************************
// RUNNING ON WEBSITE
// ****************************************

// Convert IG API 2 JSON to Prefill format
// mode can be "prefill" or "tab"
function parsePlayerResearchs(json, mode) {
    const obj = JSON.parse(json);
    const characterClassId = obj.characterClassId;
    const allianceClassId = obj.allianceClassId;
    let out = {};

    if (mode == "tab") {
        // Character class label (mirrors PHP get_class_label)
        var charClassHTML = 'No class';
        if (characterClassId === 1) charClassHTML = '<img src="/img/ogame/collector.png" width="15px"> <span class="collector">Collector</span>';
        else if (characterClassId === 2) charClassHTML = '<img src="/img/ogame/general.png" width="15px"> <span class="general">General</span>';
        else if (characterClassId === 3) charClassHTML = '<img src="/img/ogame/discoverer.png" width="15px"> <span class="discoverer">Discoverer</span>';

        // Alliance class label (1 Warriors / 2 Traders / 3 Researchers)
        var allianceClassHTML = 'No alliance class';
        if (allianceClassId === 1) allianceClassHTML = '<img src="/img/ogame/warriors.png" width="15px"> <span class="warriors">Warriors</span>';
        else if (allianceClassId === 2) allianceClassHTML = '<img src="/img/ogame/traders.png" width="15px"> <span class="traders">Traders</span>';
        else if (allianceClassId === 3) allianceClassHTML = '<img src="/img/ogame/class-researchers.png" width="15px"> <span class="researchers">Researchers</span>';

        var str = '<h4>Class</h4>' + charClassHTML + ' &nbsp;|&nbsp; Alliance: ' + allianceClassHTML;

        // Basic researches (icon + level)
        str += '<h4>Researches</h4><div>';
        for (const rkey in obj.researches) {
            str += '<span style="display:inline-block; text-align:center; margin:3px 6px;">';
            str += '<img src="/img/ogame/mini/research_' + rkey + '.png"><br>';
            str += '<span class="ptreBold">' + obj.researches[rkey] + '</span>';
            str += '</span>';
        }
        str += '</div>';

        // Ship bonuses (from lifeform researches)
        str += '<h4>Ship bonuses</h4>';
        str += '<table width="60%" border="1"><tr><td style="padding: 5px" align="center">Ships</td>';
        str+='<td style="padding: 5px" align="center"><img src="/img/ogame/speed.png" width="30px"><br>Speed</td>';
        str+='<td style="padding: 5px" align="center"><img src="/img/ogame/armor.png" width="30px"><br>Armor</td>';
        str+='<td style="padding: 5px" align="center"><img src="/img/ogame/shield.png" width="30px"><br>Shield</td>';
        str+='<td style="padding: 5px" align="center"><img src="/img/ogame/weapon.png" width="30px"><br>Weapon</td>';
        str+='<td style="padding: 5px" align="center"><img src="/img/ogame/cargo.png" width="30px"><br>Cargo</td>';
        str+='<td style="padding: 5px" align="center"><br>Fuel</td></tr>';
    } else {
        out["0"] = {
            "class": characterClassId,
            "playerClass": characterClassId,
            "allianceClass": allianceClassId,
            "research": {},
            "lifeformBonuses": {
                "BaseStatsBooster": {},
                "CharacterClassBooster": {}
            }
        };
        for (const key in obj.researches) {
            out["0"]["research"][key] = JSON.parse('{"level":'+obj.researches[key]+'}');
        }
    }

    for (const key in obj.ships) {
        if (mode == "tab") {
            var type = 'ship';
            if (key > 400) {
                type = 'def';
            }
            str+= '<tr><td align="center"><img src="/img/ogame/mini/'+type+'_'+key+'.png"></td>';
            var temp = '-'; if (obj.ships[key].speed > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].speed*100, 2)+' %</span>'; }
            str+= '<td align="center">'+temp+'</td>';
            temp = '-'; if (obj.ships[key].armor > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].armor*100, 2)+' %</span>'; }
            str+= '<td align="center">'+temp+'</td>';
            temp = '-'; if (obj.ships[key].shield > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].shield*100, 2)+' %</span>'; }
            str+= '<td align="center">'+temp+'</td>';
            temp = '-'; if (obj.ships[key].weapon > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].weapon*100, 2)+' %</span>'; }
            str+= '<td align="center">'+temp+'</td>';
            temp = '-'; if (obj.ships[key].cargo > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].cargo*100, 2)+' %</span>'; }
            str+= '<td align="center">'+temp+'</td>';
            temp = '-'; if (obj.ships[key].fuel > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].fuel*100, 2)+' %</span>'; }
            str+= '<td align="center">'+temp+'</td></tr>';
        } else {
            out["0"]["lifeformBonuses"]["BaseStatsBooster"][key] = {
                "armor": obj.ships[key].armor,
                "shield": obj.ships[key].shield,
                "weapon": obj.ships[key].weapon,
                "cargo": obj.ships[key].cargo,
                "speed": obj.ships[key].speed,
                "fuel": obj.ships[key].fuel
            };
        }
    }

    if (mode == "tab") {
        str+= '</table>';
        return str;
    }

    out["0"]["lifeformBonuses"]["CharacterClassBooster"]["1"] = obj.bonuses.characterClassBooster["1"];
    out["0"]["lifeformBonuses"]["CharacterClassBooster"]["2"] = obj.bonuses.characterClassBooster["2"];
    out["0"]["lifeformBonuses"]["CharacterClassBooster"]["3"] = obj.bonuses.characterClassBooster["3"];

    // Hook for simulator
    let ARR_ATT = [];
    ARR_ATT.push(out["0"]);
    const jsonOut = JSON.stringify({ "0": ARR_ATT });

    return btoa(jsonOut);
}

// ****************************************
// MAINTENANCE
// ****************************************

function addToLogs(message) {
    const currentUnixTS = getCurrentUnixTS();
    console.log('[EasyPTRE] ' + message);
    var logsJSON = GM_getValue(ptreLogsList, '');
    var logsList = [];
    if (logsJSON != '') {
        logsList = JSON.parse(logsJSON);
    }
    var newLog = {ts: currentUnixTS, uni: country + "-" + universe, log: message};
    logsList.push(newLog);
    // Keep only the most recent logs
    if (logsList.length > ptreLogsMaxEntries) {
        logsList.splice(0, logsList.length - ptreLogsMaxEntries);
    }

    logsJSON = JSON.stringify(logsList);
    GM_setValue(ptreLogsList, logsJSON);
}

// Clean universe logs
function cleanCurrentUniverseLogs() {
    var logsJSON = GM_getValue(ptreLogsList, '');
    if (logsJSON != '') {
        var logsList = JSON.parse(logsJSON);
        logsList = logsList.filter(function(item) { return item.uni !== country + "-" + universe; });
        logsJSON = JSON.stringify(logsList);
        GM_setValue(ptreLogsList, logsJSON);
        addToLogs('[PURGE] Cleaned logs for ' + country + '-' + universe);
    }
}

// Garbage collection function
// Runs at most once a day per played universe (see ptreGarbageCollectionTimeout)
// In order to avoid storage being too large for nothing
function runGarbageCollection() {
    console.log("[EasyPTRE] [GC] Running Garbage Collector...");
    // GC reads galaxy storage: write pending changes first
    flushGalaxyStorage();
    const currentTime = getIGCurrentTS();
    const currentUnixTS = getCurrentUnixTS();

    // ----------------------------------------
    // Logs (all universes): remove logs older than retention
    // ----------------------------------------
    var logsJSON = GM_getValue(ptreLogsList, '');
    if (logsJSON != '') {
        var minTs = currentUnixTS - ptreLogsRetentionDuration;
        var logsList = [];
        logsList = JSON.parse(logsJSON);
        logsList.splice(0, logsList.length, ...logsList.filter(item => item.ts >= minTs));
        logsJSON = JSON.stringify(logsList);
        GM_setValue(ptreLogsList, logsJSON);
    }

    // ----------------------------------------
    // Timestamps (current universe): fix values set in the future
    // ----------------------------------------
    // Check ptreLastGlobalSync IG TS
    const lastGlobalSyncTemp = GM_getValue(ptreLastGlobalSync, 0);
    if (lastGlobalSyncTemp != 0) {
        if (lastGlobalSyncTemp > currentTime) {
            GM_setValue(ptreLastGlobalSync, currentTime);
            addToLogs("[GC] Fixed bad IG TS ptreLastGlobalSync (L:" + lastGlobalSyncTemp + ' / C:' + currentTime + ')');
        }
    }
    // Check ptreLastAvailableVersionRefresh (after migrating to UNIX TS)
    const lastAvailableVersionRefreshTemp = GM_getValue(ptreLastAvailableVersionRefresh, 0);
    if (lastAvailableVersionRefreshTemp != 0) {
        if (lastAvailableVersionRefreshTemp > currentUnixTS) {
            GM_setValue(ptreLastAvailableVersionRefresh, currentUnixTS);
            addToLogs("[GC] Fixed bad Unix TS ptreLastAvailableVersionRefresh (L:" + lastAvailableVersionRefreshTemp + ' / C:' + currentUnixTS + ')');
        }
    }

    // ----------------------------------------
    // Galaxy storage (current universe): delete positions older than retention
    // Will make more requests to PTRE when going to newly empty systems, but it's fine
    // ----------------------------------------
    if (GM_getValue(ptreGalaxyStorageVersion, 2) == 2) {
        const limitTS = currentTime - ptreGalaxyStorageRetention*24*60*60;
        var removedCount = 0;
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
        if (removedCount > 0) {
            addToLogs("[GC] Cleaned " + removedCount + " old positions");
        }
    }

    // ----------------------------------------
    // Other universes: EasyPTRE never runs on a universe that is not played anymore, so it is cleaned from here
    // Reference date = its LastGarbageCollection (real activity), or else its InactivitySince (activity unknown)
    // - no reference date: InactivitySince is created now, nothing is deleted
    // - inactive >= ptreGalaxyStorageRetention days: galaxy data is deleted (all positions are expired anyway)
    // - inactive >= ptreInactiveUniverseFullPurgeDays days: every key is deleted, except TK and both dates
    // Only Unix TS are compared here (IG TS of another universe are not usable)
    // ----------------------------------------
    const universes = {};
    GM_listValues().forEach(function(key) {
        const match = key.match(/^ptre-([a-z]+)-(\d+)-(.+)$/);
        if (!match || (match[1] === country && match[2] === String(universe))) {
            return;
        }
        const uniKey = match[1] + '-' + match[2];
        if (!universes[uniKey]) {
            universes[uniKey] = {prefix: 'ptre-' + uniKey + '-', keys: []};
        }
        universes[uniKey].keys.push(key);
    });
    Object.keys(universes).forEach(function(uniKey) {
        const uni = universes[uniKey];
        const lastGCKey = uni.prefix + ptreLastGarbageCollectionKeySuffix;
        const inactivitySinceKey = uni.prefix + ptreInactivitySinceKeySuffix;
        const referenceTS = Number(GM_getValue(lastGCKey, 0)) || Number(GM_getValue(inactivitySinceKey, 0));
        if (referenceTS <= 0) {
            GM_setValue(inactivitySinceKey, currentUnixTS);
            consoleDebug('[GC] ' + uniKey + ': activity unknown, tracked from now');
            return;
        }
        const inactiveDays = Math.floor((currentUnixTS - referenceTS) / (24*60*60));
        let keysToDelete = [];
        let label = '';
        if (inactiveDays >= ptreInactiveUniverseFullPurgeDays) {
            keysToDelete = uni.keys.filter(k => k !== uni.prefix + 'TK' && k !== lastGCKey && k !== inactivitySinceKey);
            label = 'keys (all except TK)';
        } else if (inactiveDays >= ptreGalaxyStorageRetention) {
            keysToDelete = uni.keys.filter(k => k.startsWith(uni.prefix + 'GalaxyDataG'));
            label = 'galaxy keys';
        }
        if (keysToDelete.length > 0) {
            keysToDelete.forEach(k => GM_deleteValue(k));
            addToLogs('[GC] ' + uniKey + ' inactive for ' + inactiveDays + ' days: removed ' + keysToDelete.length + ' ' + label);
        }
    });

    // ----------------------------------------
    // Current universe activity: real activity date is now known
    // ----------------------------------------
    GM_deleteValue(ptreInactivitySince);
    GM_setValue(ptreLastGarbageCollection, currentUnixTS);
}

function validatePurgeTamperMonkeyKeys(targetCountry, targetUniverse, keys) {
    setupMainBox('Delete keys for ' + targetCountry + '-' + targetUniverse + '?', 'TMKeys');
    const tkKey = 'ptre-' + targetCountry + '-' + targetUniverse + '-TK';
    // By default the Team Key is preserved, the checkbox allows to delete everything
    const getKeysToDelete = function() {
        if (document.getElementById('purgeUniKeysWithTK').checked) {
            return keys.slice();
        }
        return keys.filter(function(k) { return k !== tkKey; });
    };

    var content = ptreMessageBlock('error', '<span id="purgeUniKeysSummary"></span>');
    content += '<label><input type="checkbox" id="purgeUniKeysWithTK"> Also delete the Team Key (TK): every key of this universe will be deleted</label><br><br>';
    content += '<div class="ptreSectionActions">' + ptreButton('confirmPurgeUniKeys', 'PURGE, REALLY?') + ptreButton('cancelPurgeUniKeys', 'CANCEL') + '</div>';
    content += ptreSection('Keys to delete', '<ul id="purgeUniKeysList" class="ptreList"></ul>');

    document.getElementById('ptreMainContent').innerHTML = content;

    const refreshPurgeDetails = function() {
        const keysToDelete = getKeysToDelete();
        var summary = 'This will delete ' + keysToDelete.length + ' key(s) for universe ' + targetCountry + '-' + targetUniverse + '. ';
        summary += keysToDelete.includes(tkKey) ? 'The Team Key (TK) will be DELETED.' : 'The Team Key (TK) will be preserved.';
        document.getElementById('purgeUniKeysSummary').textContent = summary;
        document.getElementById('purgeUniKeysList').innerHTML = keysToDelete.map(k => '<li>' + k + '</li>').join('');
    };
    refreshPurgeDetails();
    document.getElementById('purgeUniKeysWithTK').addEventListener('change', refreshPurgeDetails);

    document.getElementById('confirmPurgeUniKeys').addEventListener('click', function() {
        const keysToDelete = getKeysToDelete();
        const isCurrentUniverse = (targetCountry === country && targetUniverse === universe);
        if (isCurrentUniverse) {
            // Write pending changes first, so nothing is written after the purge
            flushGalaxyStorage();
        }
        keysToDelete.forEach(function(k) {
            GM_deleteValue(k);
        });
        if (isCurrentUniverse) {
            ptreGalaxyCache = {}; // Clear in-memory cache after purge
        }
        // Purge logs for this universe
        var logsJSON = GM_getValue(ptreLogsList, '');
        if (logsJSON != '') {
            var logsList = JSON.parse(logsJSON);
            var targetUni = targetCountry + '-' + targetUniverse;
            logsList = logsList.filter(function(item) { return item.uni !== targetUni; });
            GM_setValue(ptreLogsList, JSON.stringify(logsList));
        }
        addToLogs('[PURGE] Purged ' + keysToDelete.length + ' keys for ' + targetCountry + '-' + targetUniverse);
        displayTamperMonkeyKeys();
    });

    document.getElementById('cancelPurgeUniKeys').addEventListener('click', function() {
        displayTamperMonkeyKeys();
    });
}

// ****************************************
// HTTP CLIENT (calls to PTRE)
// ****************************************

/*
    Single entry point for every call to PTRE backend.
    Uses GM_xmlhttpRequest (runs in extension context: no CORS, not visible to OGame page scripts).
    Calls to OGame itself (same origin) must keep using fetch().

    url: one of the urlPTRE* endpoints (may already contain query params)
    options:
        method: 'POST' (default) or 'GET'
        params: object of query params to add (values are URL-encoded)
        body:   string (sent as-is) or object (sent as JSON)
        form:   object sent as application/x-www-form-urlencoded (for endpoints reading $_POST)
        timeout: ms (default: ptreHttpTimeoutMiliSec)

    Returns a Promise resolved with the decoded JSON response.
    Rejected with an Error on network error, timeout, HTTP error or invalid JSON.
*/
function ptreRequest(url, options = {}) {
    const method = options.method || 'POST';
    const fullUrl = new URL(url);
    Object.entries(options.params || {}).forEach(([key, value]) => {
        fullUrl.searchParams.set(key, value);
    });

    const headers = {};
    let data;
    if (options.form) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        data = new URLSearchParams(options.form).toString();
    } else if (options.body !== undefined && options.body !== null) {
        if (typeof options.body === 'string') {
            headers['Content-Type'] = 'text/plain; charset=UTF-8';
            data = options.body;
        } else {
            headers['Content-Type'] = 'application/json; charset=UTF-8';
            data = JSON.stringify(options.body);
        }
    }

    const endpoint = fullUrl.pathname.split('/').pop();
    const startMiliTS = performance.now();

    return new Promise(function(resolve, reject) {
        const fail = function(reason) {
            const duration = Math.round(performance.now() - startMiliTS);
            consoleDebug('[HTTP] ' + method + ' ' + endpoint + ' failed after ' + duration + ' ms: ' + reason);
            addToLogs('[HTTP] ' + endpoint + ': ' + reason);
            reject(new Error(reason));
        };

        GM_xmlhttpRequest({
            method: method,
            url: fullUrl.toString(),
            headers: headers,
            data: data,
            timeout: options.timeout || ptreHttpTimeoutMiliSec,
            nocache: true,
            anonymous: true,
            onload: function(response) {
                const duration = Math.round(performance.now() - startMiliTS);
                if (response.status < 200 || response.status >= 300) {
                    fail('HTTP ' + response.status + (response.statusText ? ' (' + response.statusText + ')' : ''));
                    return;
                }
                let json;
                try {
                    json = JSON.parse(response.responseText);
                } catch (e) {
                    consoleDebug('[HTTP] ' + endpoint + ' invalid JSON sample: ' + response.responseText.slice(0, 300));
                    fail('Invalid JSON response (HTTP ' + response.status + ')');
                    return;
                }
                consoleDebug('[HTTP] ' + method + ' ' + endpoint + ' -> ' + response.status + ' in ' + duration + ' ms');
                resolve(json);
            },
            onerror: function() {
                fail('Unable to reach PTRE');
            },
            ontimeout: function() {
                fail('Timeout');
            }
        });
    });
}

// HTML label to display when a PTRE request failed
function getPTRERequestErrorLabel(error) {
    return '<span class="ptreError">PTRE request failed: ' + error.message + '</span>';
}
// ****************************************
// UI HELPERS
// Small HTML builders for EasyPTRE views (styles in 02-styles.js)
// Every content given to these helpers is HTML: escape untrusted text before
// ****************************************

// Cell: HTML string or {html, align: 'left'|'center'|'right', colspan, id, className}
function ptreCell(cell, tag = 'td') {
    if (cell === null || typeof cell !== 'object') {
        cell = {html: cell};
    }
    const classes = [];
    if (cell.align) {
        classes.push('ptreAlign-' + cell.align);
    }
    if (cell.className) {
        classes.push(cell.className);
    }
    let attrs = '';
    if (classes.length > 0) {
        attrs += ' class="' + classes.join(' ') + '"';
    }
    if (cell.colspan) {
        attrs += ' colspan="' + cell.colspan + '"';
    }
    if (cell.id) {
        attrs += ' id="' + cell.id + '"';
    }
    return '<' + tag + attrs + '>' + (cell.html === undefined || cell.html === null ? '' : cell.html) + '</' + tag + '>';
}

/*
    Data table with zebra rows
    rows: array of rows, a row is an array of cells or {cells: [...], id, className}
    options: {header: [cells], id, className, empty: HTML displayed when there is no row}
*/
function ptreTable(rows, options = {}) {
    let html = '<table' + (options.id ? ' id="' + options.id + '"' : '') + ' class="ptreTable' + (options.className ? ' ' + options.className : '') + '">';
    if (options.header) {
        html += '<thead><tr>' + options.header.map(c => ptreCell(c, 'th')).join('') + '</tr></thead>';
    }
    html += '<tbody>';
    if (rows.length === 0 && options.empty) {
        const colspan = options.header ? options.header.length : 1;
        html += '<tr>' + ptreCell({html: options.empty, colspan: colspan, align: 'center'}) + '</tr>';
    }
    rows.forEach(function(row) {
        const cells = Array.isArray(row) ? row : row.cells;
        let attrs = '';
        if (!Array.isArray(row) && row.id) {
            attrs += ' id="' + row.id + '"';
        }
        if (!Array.isArray(row) && row.className) {
            attrs += ' class="' + row.className + '"';
        }
        html += '<tr' + attrs + '>' + cells.map(c => ptreCell(c)).join('') + '</tr>';
    });
    return html + '</tbody></table>';
}

/*
    Label / value table (overview, settings...)
    rows: array of {label, description, value, id} (id is set on the value cell)
*/
function ptreInfoTable(rows) {
    return ptreTable(rows.map(function(row) {
        const label = row.label + (row.description ? '<div class="ptreSmall">' + row.description + '</div>' : '');
        return [label, {html: row.value, align: 'center', id: row.id}];
    }), {className: 'ptreInfoTable'});
}

// Titled block, with optional actions (buttons) on the right of the title
function ptreSection(title, contentHtml, actionsHtml = '') {
    return '<div class="ptreSection"><div class="ptreSectionHeader"><span class="ptreCategoryTitle">' + title + '</span>'
        + (actionsHtml ? '<span class="ptreSectionActions">' + actionsHtml + '</span>' : '') + '</div>'
        + contentHtml + '</div>';
}

// OGame style button (click handler has to be added after rendering)
function ptreButton(id, label, className = '') {
    return '<div id="' + id + '" class="button btn_blue ptreButton' + (className ? ' ' + className : '') + '">' + label + '</div>';
}

function ptreLoading(text = 'Loading...') {
    return '<div class="ptreLoading"><span class="ptreSpinner"></span>' + text + '</div>';
}

// Message block: type is 'success' | 'error' | 'warning' | 'info'
function ptreMessageBlock(type, html) {
    return '<div class="ptreMessageBlock ptreMessageBlock-' + type + '">' + html + '</div>';
}
