// ==UserScript==
// @name         EasyPTRE
// @namespace    https://openuserjs.org/users/GeGe_GM
// @version      0.15.0
// @description  Plugin to use PTRE's features with AGR / OGL / OGI. Check https://ptre.chez.gg/
// @author       GeGe_GM
// @license      MIT
// @copyright    2022, GeGe_GM
// @match        https://*.ogame.gameforge.com/game/*
// @match        https://ptre.chez.gg/*
// @updateURL    https://openuserjs.org/meta/GeGe_GM/EasyPTRE.meta.js
// @downloadURL  https://openuserjs.org/install/GeGe_GM/EasyPTRE.user.js
// @require      https://code.jquery.com/jquery-3.4.1.min.js
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
// Build date: mer. 01 avril 2026 08:55:01 CEST
// ****************************************

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
const menuImageDisplayTime = 3*1000;
const ptrePushDelayMiliSec = 500;
const versionCheckTimeout = 6*60*60;
const technosCheckTimeout = 15*60;
const dataSharingDelay = 200;
const improvePageDelay = 200;
const ptreTargetListMaxSize = 300;
const deepSpacePlayerId = 99999;
const logsRetentionDuration = 15*24*60*60;
const globalPTRESyncTimeout = 24*60*60;
const ptreGalaxyStorageRetention = 15; // nb of days we keep planets infos
const ptreBorderStyleHotList = "3px solid green"; // For player with recent Spy Report
const ptreBorderStyleGalaxyEvent = "3px solid orange"; // For galaxy position recently updated
const ptreBorderStyleDnpList = "3px solid red"; // For player part of the Do Not Probe list
// TODO: [LOW] Set ptreAGRTargetListMaxSize

// Consts
const toolName = 'EasyPTRE';
const ptreID = "ptre-id";
const ptreMissingTKMessage = "NO PTRE TEAM KEY: Add a Team Key via EasyPTRE settings";

// Variables
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
var ptrePushActivities = true;
var ptreSendGalaEvents = true;
var ptreDisplayGalaPopup = true;
var ptreEnableConsoleDebugValue = false;

var ptrePageLoadClientMiliTS = 0; // Client timestamp (en ms)
var ptrePageLoadServerMiliTS = 0; // Server clock (en ms et TZ dependant)
var ptrePageLoadUnixTS = 0;

if (modeEasyPTRE == "ingame") {
    // Only get serverTime one time
    // this is NOT a UNIX timestamp
    ptrePageLoadServerMiliTS = serverTime.getTime();
    ptrePageLoadClientMiliTS = Date.now();
    ptrePageLoadUnixTS = Number(document.getElementsByName('ogame-timestamp')[0].content); // Unix Timestamp
    console.log("[EasyPTRE] UNIX TS: " + ptrePageLoadUnixTS + " | Server time: " + new Date(ptrePageLoadServerMiliTS).toLocaleString() + " (timestamp: " + ptrePageLoadServerMiliTS/1000 + ")");
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

// GM keys
const ptrePerUniKeysPrefix = "ptre-" + country + "-" + universe + "-";// Do not change!
const ptreLastAvailableVersion = "ptre-LastAvailableVersion";
const ptreLastAvailableVersionRefresh = "ptre-LastAvailableVersionRefresh";// Unix TS
const ptreLogsList = "ptre-Logs";// Unix TS
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
const ptrePlayerID = ptrePerUniKeysPrefix + "PlayerID";
const ptreDataToSync = ptrePerUniKeysPrefix + "DataToSync";
const ptreEmpireMoonLastRefresh = ptrePerUniKeysPrefix + "EmpireMoonLastRefresh";
const ptreGalaxyData = ptrePerUniKeysPrefix + "GalaxyDataG"; // Object
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
var ptreCommonUrlParams = '?tool=' + toolName + '&country=' + country + '&univers=' + universe;
var ptreEasyPTREUrlParams = ptreCommonUrlParams + '&version=' + GM_info.script.version + '&current_player_id=' + currentPlayerID + '&ptre_id=' + GM_getValue(ptreID, '');
// Common endpoints (with OGL / OGI / EasyPTRE)
var urlPTREImportSR = 'https://ptre.chez.gg/scripts/oglight_import.php?tool=' + toolName;
var urlPTREPushActivity = 'https://ptre.chez.gg/scripts/oglight_import_player_activity.php' + ptreCommonUrlParams;
var urlPTRESyncTargets = 'https://ptre.chez.gg/scripts/api_sync_target_list.php' + ptreCommonUrlParams;
var urlPTREGetPlayerInfos = 'https://ptre.chez.gg/scripts/oglight_get_player_infos.php' + ptreCommonUrlParams;
var urlPTREPushGalaUpdate = 'https://ptre.chez.gg/scripts/api_galaxy_import_infos.php' + ptreCommonUrlParams;
var urlPTREGetRanks = 'https://ptre.chez.gg/scripts/api_get_ranks.php' + ptreCommonUrlParams;
// EasyPTRE specific endpoints
var urlPTRESyncData = 'https://ptre.chez.gg/scripts/api_sync_data.php' + ptreEasyPTREUrlParams;
var urlPTREGetPhalanxInfos = 'https://ptre.chez.gg/scripts/api_get_phalanx_infos.php' + ptreEasyPTREUrlParams;
var urlPTREGetGEEInfos = 'https://ptre.chez.gg/scripts/api_get_gee_infos.php' + ptreEasyPTREUrlParams;
var urlcheckForPTREUpdate = 'https://ptre.chez.gg/scripts/api_check_updates.php' + ptreEasyPTREUrlParams;
var urlPTREIngameAction = 'https://ptre.chez.gg/scripts/api_ingame_action.php' + ptreEasyPTREUrlParams;
var urlPTREIngamePopUp = 'https://ptre.chez.gg/scripts/api_ingame_popup.php' + ptreEasyPTREUrlParams;

// Load debug value once
if (GM_getValue(ptreEnableConsoleDebug, 'false') == 'true') {
    ptreEnableConsoleDebugValue = true;
}

// ****************************************
// MAIN EXEC
// OGame pages
// ****************************************

if (modeEasyPTRE == "ingame") {
    // Add EasyPTRE menu
    if (!/page=standalone&component=empire/.test(location.href)) {
        // Setup Menu Button
        var ptreMenuName = toolName;
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
    }

    // Run on all pages
    if (!/page=standalone&component=empire/.test(location.href)) {
        consoleDebug("Any page detected");
        setTimeout(improvePageAny, improvePageDelay);
    }

    // Toogle events on Overview page
    if (/component=overview/.test(location.href)) {
        if (GM_getValue(ptreToogleEventsOverview, 'false') == 'true') {
            toggleEvents();
        }
    }

    // Galaxy page: Set routines
    if (/component=galaxy/.test(location.href)) {
        consoleDebug("Galaxy page detected");
        setTimeout(improvePageGalaxy, improvePageDelay);
        setTimeout(checkForPTREUpdate, 200);
    }

    // Message page: Add PTRE send SR button
    if (/component=messages/.test(location.href)) {
        consoleDebug("Message page detected");
        setTimeout(improvePageMessages, improvePageDelay);
    }

    // Save fleeters techs in order to send it to simulator from PTRE pages
    // Huge QOL to not add them manually
    if (/page=ingame&component=fleetdispatch/.test(location.href)) {
        consoleDebug("Fleet page detected");
        setTimeout(improvePageFleet, improvePageDelay);
    }

    // Capture Phalanx level
    if (/page=ingame&component=facilities/.test(location.href)) {
        consoleDebug("Facilities page detected");
        setTimeout(improvePageFacilities, improvePageDelay);
    }

    // Buddies Page
    if (/page=ingame&component=buddies/.test(location.href)) {
        consoleDebug("Buddies page detected");
        setTimeout(improvePageBuddies, improvePageDelay);
    }

    // Dont run background tasks on Empire page
    if (!/page=standalone&component=empire/.test(location.href)) {
        // Global Sync
        if (getIGCurrentTS() > (Number(GM_getValue(ptreLastGlobalSync, 0)) + globalPTRESyncTimeout)) {
            setTimeout(globalPTRESync, 3000);
        }

        // Check for new version only (no need to run it if only browsing)
        setTimeout(updateLastAvailableVersion, 4000);

        // Prepare next Backend Check
        // This is not enabled by default (ptreCheckForUpdateCooldown <= 0)
        // It only check if update is needed, it does not do the update
        runAutoCheckForPTREUpdate();
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
            console.log("[EasyPTRE] PTRE Lifeforms page detected: "+country+"-"+universe);
            const json = GM_getValue(ptreTechnosJSON, '');
            if (json != '') {
                tab = parsePlayerResearchs(json, "tab");
                document.getElementById("tech_from_easyptre").innerHTML = tab;
                console.log("[EasyPTRE] Updating lifeforms page");
            } else {
                console.log("[EasyPTRE] No lifeforms data saved");
            }
        }
    }

    // Update PTRE Spy Report Pages
    if (/ptre.chez.gg\/\?iid/.test(location.href)){
        console.log("[EasyPTRE] PTRE Spy Report page detected: "+country+"-"+universe);
        const json = GM_getValue(ptreTechnosJSON, '');
        if (json != '') {
            const linkElement = document.getElementById("simulate_link");
            let hrefValue = linkElement.getAttribute("href");
            var prefill = parsePlayerResearchs(json, "prefill");
            hrefValue = hrefValue.replace("replaceme", prefill);
            linkElement.setAttribute("href", hrefValue);
            document.getElementById("simulator_comment").innerHTML = "This link contains your LF techs";
            console.log("[EasyPTRE] Updating simulator link");
        } else {
            console.log("[EasyPTRE] No lifeforms data saved");
        }
    }
}

// ****************************************
// Add PTRE styles
// Ugly style... yes!
// ****************************************
GM_addStyle(`
.ptreSuccess {
    color: #99CC00;
}
.ptreError {
    color: #D43635;
}
.ptreWarning {
    color: #D29D00;
}
.ptreBold {
    font-weight: bold;
}
.ptreSmall {
    font-size: 8pt;
    font-weight: normal;
}
.ptreBoxTitle {
    color: #6f9fc8;
    font-weight: bold;
    text-decoration: underline;
    margin: 5px;
}
.ptreCategoryTitle {
    color: #6f9fc8;
    font-weight: bold;
    margin: 10px;
}
.ptreSubTitle {
    color: #6f9fc8;
    margin: 10px;
}
.td_cell {
    padding: 3px;
}
.tr_cell_radius {
    background-color: transparent;
}
.td_cell_radius_0 {
    background-color: #12171C;
    padding: 3px;
    border-radius: 6px;
    border: 1px solid black;
}
.td_cell_radius_1 {
    background-color: #0d1014;
    padding: 3px;
    border-radius: 6px;
    border: 1px solid black;
}
.td_cell_radius_2 {
    background-color: #1031a0;
    padding: 3px;
    border-radius: 6px;
    border: 1px solid black;
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
.td_ship {
    padding: 3px;
}
.button {
    padding: 0px;
}
#ptreMainWrapper {
    position: fixed;
    top: 30px;
    right: 10px;
    z-index: 10000;
    font-size: 10pt;
}
#ptreMainBox {
    width: 720px;
    background-color: #171d22;
    border: 2px solid black;
}
#ptreMainHeader {
    display: flex;
    flex-direction: column;
    padding: 5px 10px;
    border-bottom: 1px solid #2a3540;
    background-color: #101518;
}
#ptreMainHeaderTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
#ptreMainTitle {
    color: #6f9fc8;
    font-weight: bold;
    font-size: 11pt;
    text-decoration: underline;
}
#ptreMainHeaderButtons {
    display: flex;
    gap: 4px;
}
#messageDivInPanel {
    min-height: 0;
    padding: 4px 10px 2px 10px;
    font-size: 9pt;
    text-align: center;
}
#ptreMainBody {
    display: flex;
}
#ptreMainContent {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    max-height: 600px;
    min-width: 0;
}
#ptreMainNav {
    width: 100px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 6px;
    border-left: 1px solid #2a3540;
    background-color: #101518;
}
.ptreNavBtn {
    display: block;
    text-align: center;
    cursor: pointer;
    padding: 4px 2px;
}
.ptreNavBtn.ptreNavActive {
    outline: 2px solid #299f9b;
}
#ptreMainFooter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 10px;
    border-top: 1px solid #2a3540;
    background-color: #101518;
    font-size: 9pt;
}
#ptreMainFooterMsg {
    padding: 2px 10px 4px 10px;
    background-color: #101518;
    font-size: 9pt;
    text-align: center;
    min-height: 16px;
}
#boxPTREMessage {
    position: fixed;
    bottom: 30px;
    right: 10px;
    z-index: 11000;
    padding:10px;
    border: solid black 2px;
    background-color: #171d22;
}
#btnSaveOptPTRE {
    cursor:pointer;
}
#ptreGalaxyToolBar {
    background-color: #171d22;
    font-weight: revert;
    padding: 5px;
}
#ptreGalaxyMessageBoxContent {
    padding-left: 10px;
    padding-top: 3px;
    text-align: left;
    display: block;
    line-height: 1.3em;
}
#ptreGalaxyPopUp {
    width-min: 250px;
    position: absolute;
    border: solid black 2px;
    background-color: #171d22;
    z-index: 10001;
    padding: 5px;
}
#optionPTRE {
    position: relative;
}
#ptreTopRightMenuButton {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 12000;
    padding: 3px 0;
    cursor: pointer;
}
#ptreMissingTKBadge {
    position: absolute;
    top: 2px;
    right: 2px;
    background-color: #D43635;
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
    const galaxyPopupMode = GM_getValue(ptreEnableGalaxyPopup, 'false');
    const betaMode = GM_getValue(ptreEnableBetaMode, 'false');
    const ptreStoredTK = GM_getValue(ptreTeamKey, '');
    let tkComment = "";
    let toolComment = "Detected tool: ";

    if (ptreStoredTK == '') {
        tkComment = '<span class="ptreError">Missing Team Key</span> - ';
    }
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
    if (galaxyPopupMode == 'true' && minerMode == 'false') {
        ptreDisplayGalaPopup = true;
    }

    // Prepare galaxy check and update
    waitForGalaxyToBeLoaded();

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
        tempContent+= '</span>';
        tempContent+= '</td></tr><tr><td valign="top" colspan="3"><hr></td></tr>';
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
    if (currentTime > GM_getValue(ptreLastTechnosRefresh, 0) + technosCheckTimeout) {
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
                console.log("[EasyPTRE] Cant find Techs!");
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
            consoleDebug("[Phalanx] " + coords + ': Found Phalanx level '+phalanxLevel);
            refreshPhalanxStorage(moonID, coords, phalanxLevel);
        }
    } else {
        consoleDebug("[Phalanx] Cant find technologies element");
    }
}

// Parse Buddies page
function improvePageBuddies() {
    console.log("[EasyPTRE] Improving Buddies Page");
    const currentTime = getIGCurrentTS();
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
                    consoleDebug("Adding " + playerId + " to DNP list");
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
        setTimeout(syncDataWithPTRE, dataSharingDelay);
    }
}
*/

function refreshPhalanxStorage(moonIdNew, coordsNew, phalanxLevelNew, syncToPTRE = true) {
    phalanxLevelNew = Number(phalanxLevelNew);
    consoleDebug("[Phalanx] Checking Phalanx update for " + moonIdNew + " at " + coordsNew + " (level " + phalanxLevelNew + ")");

    var dataJSON = GM_getValue(ptreDataToSync, '');
    var dataList = dataJSON != '' ? JSON.parse(dataJSON) : [];

    var found = false;
    var needToSave = false;

    dataList.forEach(function(elem) {
        if (elem.type == "phalanx" && elem.id == moonIdNew) {
            found = true;
            if (elem.coords == coordsNew && elem.val == phalanxLevelNew) {
                consoleDebug("[Phalanx] Already up to date, no change");
            } else {
                consoleDebug("[Phalanx] Updated: coords " + elem.coords + " -> " + coordsNew + ", level " + elem.val + " -> " + phalanxLevelNew);
                elem.coords = coordsNew;
                elem.val = phalanxLevelNew;
                needToSave = true;
            }
        }
    });

    if (!found) {
        consoleDebug("[Phalanx] New entry, inserting");
        dataList.push({type: "phalanx", id: moonIdNew, coords: coordsNew, val: phalanxLevelNew});
        needToSave = true;
    }

    if (needToSave) {
        GM_setValue(ptreDataToSync, JSON.stringify(dataList));
        displayPTREPopUpMessage("Phalanx updated");
        if (syncToPTRE === true) {
            setTimeout(syncDataWithPTRE, dataSharingDelay);
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
            consoleDebug('Player ' + playerPseudo + ' has been added to ' + type + ' list');
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
            consoleDebug("Deleting private player (" + idASup + "): " + playerId);
        }
    }
    if (idASup == -1) {
        var player = {id: playerId};
        targetList.push(player);
        status = 'private';
        consoleDebug("Adding private player " + playerId);
    }
    // Save new list
    targetJSON = JSON.stringify(targetList);
    GM_setValue(ptreAGRPrivatePlayerListJSON, targetJSON);

    return status;
}

function isTargetPrivate(playerId) {
    var targetJSON = '';
    var targetList = [];
    targetJSON = GM_getValue(ptreAGRPrivatePlayerListJSON , '');

    var found = 0;
    if (targetJSON != '') {
        targetList = JSON.parse(targetJSON);

        targetList.forEach(function(PlayerCheck) {
            if (PlayerCheck.id == playerId) {
                found = 1;
            }
        });
        if (found == 1) {
            return true;
        }
    }
    return false;
}

function debugListContent() {

    var targetJSON = '';

    targetJSON = GM_getValue(ptreAGRPlayerListJSON, '');
    var targetList = JSON.parse(targetJSON);
    console.log("[EasyPTRE] AGR list: ");
    console.log(targetList);

    targetJSON = GM_getValue(ptrePTREPlayerListJSON, '');
    targetList = JSON.parse(targetJSON);
    console.log("[EasyPTRE] PTRE list: ");
    console.log(targetList);
}

// Check is player is in list
function isPlayerInLists(playerId) {
    if (isPlayerInTheList(playerId, 'AGR') || isPlayerInTheList(playerId, 'PTRE')) {
        return true;
    }
    return false;
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
        displayPTREPopUpMessage(count + ' targets added to AGR list');
    }
}

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
        var agrEnabled = false;
        if (isAGREnabled()) {
            agrEnabled = true;
        }
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

    migrateDataAndCleanStorage();

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
        const minerModeOnLabel = '<br><span class="ptreSmall ptreWarning">Disable Miner if you want to enable it.</span>';

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

        // Check last script version
        updateLastAvailableVersion(false);

    // Sync targets
    if (currentTime > (GM_getValue(ptreLastTargetsSync, 0) + 15*60)) {
        setTimeout(syncTargets, 1000);
    }
    // Sync Data
    if (currentTime > (GM_getValue(ptreLastDataSync, 0) + 15*60)) {
        setTimeout(syncDataWithPTRE, 2000);
    }
}

// Displays overview (team data, targets, galaxy, lifeforms)
function displayOverview() {
    const currentTime = getIGCurrentTS();
    ptreCurrentView = displayOverview;
    setupMainBox('EasyPTRE Overview', 'Overview');

    // Shared data
    var dataJSON = '';
    dataJSON = GM_getValue(ptreDataToSync, '');
    var phalanxCountTotal = 0;
    var dnpCount = 0;
    var hotCount = 0;
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
    divOV += '<tr><td class="td_cell"><div class="ptreCategoryTitle"></div></td><td class="td_cell" align="right"><div id="synctDataWithPTRE" class="button btn_blue">&#8635; SYNC DATA</div> <div id="displaySharedData" class="button btn_blue">DETAILS</div></td></tr>';
    divOV += '<tr><td class="td_cell" colspan="2">';
    divOV += '<table border="1" width="100%">';
    divOV += '<tr><td class="td_cell_radius_0">Team Name:<br><a href="https://ptre.chez.gg/" target="_blank">Manage Team on ptre.chez.gg</a></td><td class="td_cell_radius_0" align="center"><span class="ptreSuccess">' + GM_getValue(ptreTeamName, '???') + '</span></td></tr>';
    divOV += '<tr><td class="td_cell_radius_1">Phalanx:<br><span class="ptreSmall">Last Update: </span><span id="ptreEmpireMoonLastRefreshField">'+getLastUpdateLabel(GM_getValue(ptreEmpireMoonLastRefresh, 0))+'</span></td><td class="td_cell_radius_1" align="center"><span class="ptreSuccess">' + phalanxCountTotal + '</span></td></tr>';
    divOV += '<tr><td class="td_cell_radius_0">Hot Targets list:<br><span class="ptreSmall">Recent spy reports</span></td><td class="td_cell_radius_0" align="center"><span class="ptreSuccess">' + hotCount + '</span></td></tr>';
    divOV += '<tr><td class="td_cell_radius_1">Galaxy Events:<br><span class="ptreSmall">Changes non-listed in public API but detected by your Team</span></td><td class="td_cell_radius_1" align="center"><span class="ptreSuccess">' + galaEventsCount + '</span></td></tr>';
    divOV += '<tr><td class="td_cell_radius_0">Do Not Probe list:<br><span class="ptreSmall">Added via galaxy</span></td><td class="td_cell_radius_0" align="center"><span class="ptreSuccess">' + dnpCount + '</span></td></tr>';

    divOV += '<tr><td class="td_cell_radius_1">Last Global Sync:<br><span class="ptreSmall">All data synchronized</span></td><td class="td_cell_radius_1" align="center"><span id="ptreLastGlobalSyncField">' + getLastUpdateLabel(GM_getValue(ptreLastGlobalSync, 0)) + '</span></td></tr>';
    divOV += '<tr><td class="td_cell_radius_0">Last Data Sync:<br><span class="ptreSmall">Phalanx, Hot targets, Do Not Probe list, Galaxy events<br><span id="ptreLastDataSyncMessageField" class="ptreWarning"></span></span></td><td class="td_cell_radius_0" align="center"><span id="ptreLastDataSyncField">' + getLastUpdateLabel(GM_getValue(ptreLastDataSync, 0)) + '</span></td></tr>';
    divOV += '<tr><td class="td_cell_radius_1">Last Targets Sync:<br><span class="ptreSmall">Targets list<br><span id="ptreLastTargetsSyncMessageField" class="ptreWarning"></span></span></td><td class="td_cell_radius_1" align="center"><span id="ptreLastTargetsSyncField">' + getLastUpdateLabel(GM_getValue(ptreLastTargetsSync, 0)) + '</span></td></tr>';
    divOV += '</table></td></tr>';
    divOV += '<tr><td class="td_cell" align="center" colspan="2"><hr /></td></tr>';

    // Features disabled when OGL/OGI detected
    if (!isOGLorOGIEnabled()) {
        divOV += '<tr><td class="td_cell"><div class="ptreCategoryTitle">Targets list</div></td><td class="td_cell" align="right"><div id="displayTargetsList" class="button btn_blue">OPEN LIST</div></td></tr>';
        divOV += '<tr><td class="td_cell" align="center" colspan="2"><a href="https://ptre.chez.gg/?country='+country+'&univers='+universe+'&page=players_list" target="_blank">Manage PTRE targets via website.</a></td></tr>';
        divOV += '<tr><td class="td_cell" align="center" colspan="2"><hr /></td></tr>';
    }

    // Galaxy Data
    divOV += '<tr><td class="td_cell"><div class="ptreCategoryTitle">Galaxy data (V' + GM_getValue(ptreGalaxyStorageVersion, 2) + ')</div></td><td class="td_cell" align="right"><div id="displayGalaxyTracking" class="button btn_blue">DETAILS</div></td></tr>';
    divOV += '<tr><td class="td_cell" colspan="2" align="center">'+displayTotalSystemsSaved()+'</td></tr>';
    if (isOGLorOGIEnabled()) {
        divOV += '<tr><td colspan="2" class="td_cell" align="center"><span class="ptreSuccess ptreSmall">OGL/OGI enabled: some EasyPTRE features are disabled.</span> <div id="btnOGLOGIDetails" type="button" class="button btn_blue">DETAILS</div></td></tr>';
    }
    divOV += '<tr><td class="td_cell" align="center" colspan="2"><hr /></td></tr>';

    // Lifeforms Menu
    divOV += '<tr><td class="td_cell" colspan="2"><div class="ptreCategoryTitle">Lifeforms researchs (<span id="ptreLastTechnosRefreshField">' + getLastUpdateLabel(GM_getValue(ptreLastTechnosRefresh, 0)) + '</span>)</div></td></tr>';
    divOV += '<tr><td class="td_cell" align="center" colspan="2"><a href="/game/index.php?page=ingame&component=fleetdispatch">Fleet menu to update</a> - <a href="https://ptre.chez.gg/?page=lifeforms_researchs" target="_blank">Check it out on PTRE</a></td></tr>';

    divOV += '</table>';

    // Update version message in footer
    var lastAvailableVersion = GM_getValue(ptreLastAvailableVersion, -1);
    if (lastAvailableVersion != -1 && lastAvailableVersion !== GM_info.script.version) {
        var updateMessageShort = '<span class="ptreError">New version '+ lastAvailableVersion + ' is available. Update <a href="https://openuserjs.org/scripts/GeGe_GM/EasyPTRE" target="_blank">EasyPTRE</a>.</span>';
        displayUpdateVersionMessage(updateMessageShort);
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
    console.log('Popup mode: ' + galaxyPopupMode);
    console.log('Miner mode: ' + minerMode);

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
    addToLogs('Saving settings (Miner mode: ' + minerMode + ' | Beta mode: ' + document.getElementById('PTREToogleBetaMode').checked + ')');
    // Update menu image and remove it after few sec
    document.getElementById('ptreMenuImg').src = imgPTRESaveOK;
    setTimeout(function() {document.getElementById('ptreMenuImg').src = imgPTRE;}, menuImageDisplayTime);
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
    content+= '<div class="ptreSubTitle">0.15.0 (mar 2026)</div>- [Polish] Refacto menus and design<br>- [Feature] Add Ingame notes menu<br>- [Feature] Improve Phalanx update (all at once)<br>- [Feature] Move galaxy pop-up feature from Beta to release<br>- [Feature] Add a setting to disable galaxy pop-up<br>- [Feature] Add TamperMonkey Keys management menu';
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

function displayUpdateBox(updateMessageShort) {
    setupMainBox('EasyPTRE Updates', 'Updates');
    var content = updateMessageShort;
    content += '<div class="ptreCategoryTitle">Check for updates</div>Last check: ' + getUnixTSLabel(GM_getValue(ptreLastAvailableVersionRefresh, 0)) + '<br><br><div id="forceCheckVersionButton" type="button" class="button btn_blue">CHECK VERSION NOW</div><br>';
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
    var content = 'Internal logs only (errors, migrations, etc) for debug purposes if you share it with developer.<br><br><div id="purgeLogs" type="button" class="button btn_blue">PURGE LOGS</div><br><br>';
    content+= '<table id="logTable"><tr><td class="td_cell_radius_0" align="center">Date</td><td class="td_cell_radius_0" align="center">Universe</td><td class="td_cell_radius_0" align="center">Log</td></tr>';

    var logsJSON = GM_getValue(ptreLogsList, '');
    var logsList = [];
    if (logsJSON != '') {
        logsList = JSON.parse(logsJSON);
    }
    logsList.sort((a, b) => b.ts - a.ts);
    logsList.forEach(function(elem) {
        if (elem.uni == country + "-" + universe) {
            content+= '<tr><td class="td_cell_radius_1" align="center">' + getUnixTSLabel(elem.ts) + '</td><td class="td_cell_radius_1" align="center">' + elem.uni + '</td><td class="td_cell_radius_1">' + elem.log + '</td></tr>';
        }
    });
    content+= '</table>';

    document.getElementById('ptreMainContent').innerHTML = content;
    document.getElementById('purgeLogs').addEventListener("click", function (event) {
        GM_deleteValue(ptreLogsList);
        addToLogs("Logs cleaned");
        displayLogs();
    });
}

function displayGalaxyTracking() {
    ptreCurrentView = displayGalaxyTracking;
    setupMainBox('Galaxy', 'Galaxy');

    var content = '<div class="ptreCategoryTitle">Galaxy details</div>';
    content+='Storage Version: ' + GM_getValue(ptreGalaxyStorageVersion, 2) + ' | Retention: ' + ptreGalaxyStorageRetention + ' days<br><br>';

    const allGalaxyKeys = GM_listValues().filter(key => key.includes(ptreGalaxyData)).sort();

    content+='<table><tr>';
    content+='<td class="td_cell_radius_0" align="center">Galaxy key</td>';
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
        content+='<td class="td_cell_radius_1" align="center">' + key + '</td>';
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
        dataList.forEach(function(elem) {
            if (elem.type == "phalanx") {
                let val = elem.val;
                if (val == -1) {
                    missingPhalanx++;
                    val = '<span class="ptreWarning">???</span>';
                }
                content += '<tr class="tr_cell_radius"><td class="td_cell_radius_1" align="center">' + elem.coords + 'L</td><td class="td_cell_radius_1" align="center">' + val + '</td></tr>';
                phalanxCount++;
            }
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
        const nextGlobalSync = Math.round((lastGlobalSync + globalPTRESyncTimeout - currentTime) / 3600);
        const syncTimeout = globalPTRESyncTimeout / 3600;
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
        addToLogs("Purged Galaxy data");
    });
}

function displayTotalSystemsSaved() {
    var countGala = 0;
    var countSsystem = 0;

    if (GM_getValue(ptreGalaxyStorageVersion, 2) == 2) {
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
                addToLogs(reponseDecode.message);
            }
        })
        .catch(function(e) {
            updateHtmlById('ptreMainContent', '<span class="ptreError">Request failed</span>');
            addToLogs('displayAllSharedNotes: ' + e);
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

    var content = '<div class="ptreCategoryTitle">Tampermonkey Keys per Universe</div>';
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
            content += '<tr><td class="td_cell_radius_1" align="center">' + getUnixTSLabel(elem.ts) + '</td><td class="td_cell_radius_1" align="center">' + elem.uni + '</td><td class="td_cell_radius_1">' + elem.log + '</td></tr>';
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
    if (document.getElementById('messageDivInPanel')) {
        document.getElementById('messageDivInPanel').innerHTML = message;
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

// ****************************************
// CALLS TO PTRE
// ****************************************

// Generate an empty system structure (all 15 positions with no player)
function generateEmptySystem() {
    const system = {};
    for (let pos = 1; pos <= 15; pos++) {
        system[pos] = { playerId: -1, planetId: -1, moonId: -1, ts: -1 };
    }
    return system;
}

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
        consoleDebug("[GALAXY] [" + galaxy + ":" + system + ":" + pos + "] Player "+previousSystem[pos].playerId+"=>"+newSystemInfos[pos].playerId+" | Planet: "+previousSystem[pos].planetId+"=>"+newSystemInfos[pos].planetId+" | Moon: "+previousSystem[pos].moonId+"=>"+newSystemInfos[pos].moonId+" ("+additionnalSSInfos[pos].playerName + " - "+additionnalSSInfos[pos].playerRank+")");
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
        const jsonSystemObj = {};
        newSystemToPush.forEach(function(jsonPos) {
            jsonSystemObj[jsonPos.coords] = jsonPos;
        });
        const jsonSystem = JSON.stringify(jsonSystemObj);
        // Send to PTRE
        $.ajax({
            url : urlPTREPushGalaUpdate,
            type : 'POST',
            data: jsonSystem,
            cache: false,
            success : function(reponse){
                let reponseDecode = JSON.parse(reponse);
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
            var reponseDecode = JSON.parse(reponse);
            console.log("[EasyPTRE] [GALAXY] [FROM PTRE] " + reponseDecode.message);
            displayGalaxyMiniMessage(reponseDecode.message);
            if (reponseDecode.code == 1) {
                ptreGalaxyActivityCount = ptreGalaxyActivityCount + reponseDecode.activity_count;
                updateHtmlById('ptreGalaxyActivityCount', ptreGalaxyActivityCount);
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
        setupMainBox("Player " + pseudo, null);
        var content = '<center>';
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
                document.getElementById('ptreMainContent').innerHTML = content;
            }
        });
    } else {
        displayPTREPopUpMessage(ptreMissingTKMessage);
        document.getElementById('ptreMainContent').innerHTML = ptreMissingTKMessage;
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
                    var reponseDecode = JSON.parse(reponse);
                    consoleDebug("[FROM PTRE] " + reponseDecode.message);
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
                    var reponseDecode = JSON.parse(reponse);
                    consoleDebug("[FROM PTRE] " + reponseDecode.message);
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
        updateHtmlById("ptreGalaxyPlayerRanksPopUp", "Loading ranks...");
        $.ajax({
            url : urlPTREGetRanks + "&team_key=" + TKey + "&player_id=" + playerId,
            type : 'POST',
            cache: false,
            success : function(reponse){
                var reponseDecode = JSON.parse(reponse);
                consoleDebug("[FROM PTRE] " + reponseDecode.message);
                displayGalaxyMiniMessage(reponseDecode.message);
                if (reponseDecode.code == 1) {
                    if (document.getElementById("ptreGalaxyPlayerRanksPopUp")) {
                        document.getElementById("ptreGalaxyPlayerRanksPopUp").innerHTML = "Processing ranks...";
                        var content = '<table><tr><td class="td_cell_radius_0" align="center">Date</td><td class="td_cell_radius_0" align="center">Points</td><td class="td_cell_radius_0" align="center">Points diff</td><td class="td_cell_radius_0" align="center">Global rank</td></tr>';
                        reponseDecode.ranks_array.forEach(function(rank, i) {
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
                    updateHtmlById("ptreGalaxyPlayerRanksPopUp", reponseDecode.message);
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
    const currentTime = getIGCurrentTS();
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
            var reponseDecode = JSON.parse(reponse);
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
            var reponseDecode = JSON.parse(reponse);
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
    const currentTime = getIGCurrentTS();
    console.log("[EasyPTRE] Syncing data "+currentTime);
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
            var reponseDecode = JSON.parse(reponse);
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

                consoleDebug('[FROM PTRE] ' + reponseDecode.message);

                // Update info in menu
                updateHtmlById("ptreLastDataSyncField", getLastUpdateLabel(currentTime));
            } else {
                addToLogs(reponseDecode.message_debug);
            }
            if (mode == 'manual') {
                displayMessageInSettings(reponseDecode.message_debug);
                updateHtmlById("ptreLastDataSyncMessageField", reponseDecode.message_debug);
            }
        }
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
            var reponseDecode = JSON.parse(reponse);
            if (reponseDecode.code == 1) {
                // Reset local list, as we update the entire list
                GM_setValue(ptrePTREPlayerListJSON, '');
                var count = 0;
                var newTargetList = JSON.parse(JSON.stringify(reponseDecode.targets_array));
                newTargetList.forEach(function(incomingPlayer) {
                    if (!isPlayerInLists(incomingPlayer.player_id)) {
                        addPlayerToList(incomingPlayer.player_id, incomingPlayer.pseudo, 'PTRE');
                        count++;
                    }
                });
                if (mode == "manual") {
                    displayMessageInSettings(nb_private + ' private targets ignored. ' + reponseDecode.message + ' ' + count + ' new targets added.');
                }
                GM_setValue(ptreLastTargetsSync, currentTime);
                updateHtmlById("ptreLastTargetsSyncField", getLastUpdateLabel(currentTime));
                updateHtmlById("ptreLastTargetsSyncMessageField", reponseDecode.message);
                // Refresh targets list if displayed
                if (document.getElementById('targetsListDiv')) {
                    displayPTRETargetsList();
                }
            } else {
                displayMessageInSettings(reponseDecode.message);
                addToLogs(reponseDecode.message);
                updateHtmlById("ptreLastTargetsSyncMessageField", reponseDecode.message);
            }
        }
    });
}

// Get Empire page as JSON
// Update Phalanx
function updateDataFromEmpireMoonPage() {
    consoleDebug("[EasyPTRE] Fetching Empire Moon Page");
    const currentTime = getIGCurrentTS();
    return fetch('https://' + window.location.host + '/game/index.php?page=ajax&component=empire&ajax=1&planetType=1&asJson=1', {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(function(response) { return response.json(); })
    .then(function(result) {
        var data = JSON.parse(result.mergedArray);
        var planets = data.planets;
        if (!planets || planets.length === 0) {
            addToLogs('[EMPIRE] No planets found in JSON response');
            displayMessageInSettings('No phalanx data found in Empire Moon page');
            return;
        }

        var newPhalanxList = [];
        planets.forEach(function(planet) {
            var moonID = String(planet.id);
            // on récupère "[1:2:3]"
            var coordRaw = planet.coordinates;
            var match = coordRaw.match(/\[(\d+):(\d+):(\d+)\]/);
            if (!match) {
                consoleDebug('[EMPIRE] Cant parse coords for moon ' + moonID + ': ' + coordRaw);
                return;
            }
            var coords = match[1] + ':' + match[2] + ':' + match[3];
            var phalanxLevel = parseInt(planet['42'], 10);
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

            //setTimeout(syncDataWithPTRE, dataSharingDelay);

            var levels = newPhalanxList.map(function(e) { return e.val; });
            var levelMin = Math.min.apply(null, levels);
            var levelMax = Math.max.apply(null, levels);

            GM_setValue(ptreEmpireMoonLastRefresh, currentTime);
            updateHtmlById("ptreEmpireMoonLastRefreshField", getLastUpdateLabel(currentTime));

            addToLogs('Updated ' + newPhalanxList.length + ' phalanx (min: ' + levelMin + ' | max: ' + levelMax + ')');
            displayMessageInSettings('Phalanx updated: ' + newPhalanxList.length + ' moons (min: ' + levelMin + ' | max: ' + levelMax + ')');
        } else {
            addToLogs('[EMPIRE] No phalanx found in JSON response');
            displayMessageInSettings('No phalanx data found in Empire Moon page');
        }
    })
    .catch(function(error) {
        console.error("[EasyPTRE] Can't fetch empire data ", error);
        displayMessageInSettings('Failed to fetch Empire Moon page');
    });
}

// ****************************************
// CORE FUNCTIONS
// ****************************************

/*
    Watches the loading element on the galaxy page
    Once gone, we can start improving galaxy table
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

// Check if EasyPTRE needs to be updated
function updateLastAvailableVersion(force = false) {
    // Only check once a while

    var lastCheckTime = GM_getValue(ptreLastAvailableVersionRefresh, 0);
    var currentUnixTS = getCurrentUnixTS();

    if (force === true || currentUnixTS > lastCheckTime + versionCheckTimeout) {
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
                    GM_setValue(ptreLastAvailableVersionRefresh, currentUnixTS);
                    if (availableVersion !== GM_info.script.version) {
                        displayUpdateVersionMessage('<span class="ptreError">New version '+ availableVersion + ' is available. You need to update <a href="https://openuserjs.org/scripts/GeGe_GM/EasyPTRE" target="_blank">EasyPTRE</a> version.</span>');
                        if (document.getElementById('ptreMenuName')) {
                            document.getElementById('ptreMenuName').innerHTML = 'CLICK ME';
                            document.getElementById('ptreMenuName').classList.add('ptreError');
                        }
                        displayPTREPopUpMessage("New EasyPTRE version available. Please update it.");
                        consoleDebug('Version ' + availableVersion + ' is available');
                    } else {
                        displayUpdateVersionMessage('<span class="ptreSuccess">EasyPTRE is up to date</span>');
                    }
                } else {
                    displayUpdateVersionMessage('<span class="ptreError">Error ' + result.status + ' (' + result.statusText + ')</span>');
                }
            }
        });
    } else {
        var temp = lastCheckTime + versionCheckTimeout - currentUnixTS;
        //consoleDebug("Skipping automatic EasyPTRE version check. Next check in " + round(temp, 0) + " seconds (at least)");
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
            consoleDebug("Checking for Updates...");
            $.ajax({
                url : urlcheckForPTREUpdate + '&team_key=' + TKey + '&current_ts=' + GM_getValue(ptreCurrentBackendUpdateTS, 0) + '&cooldown=' + GM_getValue(ptreCheckForUpdateCooldown, 0),
                type : 'POST',
                cache: false,
                success : function(reponse){
                    var reponseDecode = JSON.parse(reponse);
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
            consoleDebug("Need to Check For Updates");
            checkForPTREUpdate();
        }
        if (!_autoCheckScheduled) {
            _autoCheckScheduled = true;
            setTimeout(runAutoCheckForPTREUpdate, 10*1000);
        }
    } else {
        consoleDebug("Auto-Check For Updates is DISABLED: nothing to do.");
    }
}

// Sync all data once a day
async function globalPTRESync(mode = "auto") {
    const miliTS = Date.now();
    const currentTime = getIGCurrentTS();
    const lastGlobalSyncTemp = Number(GM_getValue(ptreLastGlobalSync, 0));

    if (currentTime < lastGlobalSyncTemp + 60) {
        consoleDebug("[SYNC] globalPTRESync skipped (60-sec cooldown)");
        updateHtmlById("ptreLastDataSyncMessageField", "Global sync skipped (60-sec cooldown)");
        updateHtmlById("ptreLastTargetsSyncMessageField", "Global sync skipped (60-sec cooldown)");
        return;
    }

    updateHtmlById("ptreLastDataSyncMessageField", "Loading...");
    updateHtmlById("ptreLastTargetsSyncMessageField", "Loading...");

    migrateDataAndCleanStorage();

    garbageCollectGalaxyDataV2(ptreGalaxyStorageRetention);

    await updateDataFromEmpireMoonPage();

    syncTargets();

    syncDataWithPTRE(mode);

    GM_setValue(ptreLastGlobalSync, currentTime);
    updateHtmlById("ptreLastGlobalSyncField", getLastUpdateLabel(currentTime));
    var tempDuration = Date.now() - miliTS;
    addToLogs("Global Clean & Sync (Mode: " + mode + ". Duration: " + round(tempDuration) + " ms)");
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
        return '<span class="ptreError ptreSmall">never updated</span>';
    } else if (currentTime >= ts) {
        var nb_min = (currentTime - ts) / 60;
        if (nb_min <= 1) {
            temp = '<span class="ptreSuccess ptreSmall">updated now</span>';
        } else if (nb_min < 60) {
            temp = '<span class="ptreSuccess ptreSmall">updated ' + round(nb_min, 0) + ' mins ago</span>';
        } else if (nb_min < 24*60) {
            var nb_h = (currentTime - ts) / 3600;
            temp = '<span class="ptreWarning ptreSmall">updated ' + round(nb_h, 0) + ' hours ago</span>';
        } else {
            temp = '<span class="ptreError ptreSmall">updated ' + round(nb_min/(24*60), 1) + ' days ago</span>';
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
        return '<span class="ptreError ptreSmall">???</span>';
    } else if (currentUnixTS >= ts) {
        var nb_min = (currentUnixTS - ts) / 60;
        if (nb_min <= 1) {
            temp = '<span class="ptreSuccess ptreSmall">now</span>';
        } else if (nb_min < 60) {
            temp = '<span class="ptreSuccess ptreSmall">' + round(nb_min, 0) + ' mins ago</span>';
        } else if (nb_min < 24*60) {
            var nb_h = (currentUnixTS - ts) / 3600;
            temp = '<span class="ptreWarning ptreSmall">' + round(nb_h, 0) + ' hours ago</span>';
        } else {
            temp = '<span class="ptreError ptreSmall">' + round(nb_min/(24*60), 1) + ' days ago</span>';
        }
        return temp;
    } else {
        let inSec = ts - currentUnixTS;
        return "In " + inSec + " secs";
    }
    return temp;
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

// ****************************************
// NOTIFICATIONS FUNCTIONS
// ****************************************

// Displays PTRE responses messages
// Responses from server
// Displayed on the rigth-bottom corner
function displayPTREPopUpMessage(message) {
    var previousContent = '';
    if (document.getElementById('boxPTREMessage') && document.getElementById("ptreMessage")) {
        // Get previous content and remove box
        previousContent = document.getElementById("ptreMessage").innerHTML;
        document.getElementById('boxPTREMessage').remove();
    }

    // Recreate box
    var divPTREMessage = '<div id="boxPTREMessage">PTRE:<span id="ptreMessage">' + previousContent + '<span id="fisrtPtreMessage"><br>' + message + '</span></span></div>';
    var boxPTREMessage = document.createElement("div");
    boxPTREMessage.innerHTML = divPTREMessage;
    boxPTREMessage.id = 'boxPTREMessage';

    if (document.getElementById('bottom')) {
        document.getElementById('bottom').appendChild(boxPTREMessage);
        setTimeout(function() {cleanFirstPTREPopUpMessage();}, ptreMessageDisplayTime);
    }
}

// Remove first message in list and remove entire message box if empty
function cleanFirstPTREPopUpMessage() {
    if (document.getElementById('fisrtPtreMessage')) {
        document.getElementById('fisrtPtreMessage').remove();
        if (document.getElementById("ptreMessage").innerHTML == '') {
            document.getElementById('boxPTREMessage').remove();
        }
    }
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

// Display message content on galaxy page
function displayGalaxyMessageContent(message) {
    if (document.getElementById("ptreGalaxyMessageBoxContent")) {
        document.getElementById("ptreGalaxyMessageBoxContent").innerHTML = message;
    } else {
        console.log("[EasyPTRE] Error. Cant display: " + message);
    }
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
        var str = '<table width="60%" border="1"><tr><td style="padding: 5px" align="center">Ships</td>';
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
            var temp = '-'; if (obj.ships[key].speed > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].speed*100, 2)+' %<span>'; }
            str+= '<td align="center">'+temp+'</td>';
            temp = '-'; if (obj.ships[key].armor > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].armor*100, 2)+' %<span>'; }
            str+= '<td align="center">'+temp+'</td>';
            temp = '-'; if (obj.ships[key].shield > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].shield*100, 2)+' %<span>'; }
            str+= '<td align="center">'+temp+'</td>';
            temp = '-'; if (obj.ships[key].weapon > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].weapon*100, 2)+' %<span>'; }
            str+= '<td align="center">'+temp+'</td>';
            temp = '-'; if (obj.ships[key].cargo > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].cargo*100, 2)+' %<span>'; }
            str+= '<td align="center">'+temp+'</td>';
            temp = '-'; if (obj.ships[key].fuel > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].fuel*100, 2)+' %<span>'; }
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

// Temp function to clean old version data
function migrateDataAndCleanStorage() {
    console.log("[EasyPTRE] Migrate Data and clean storage");
    const currentTime = getIGCurrentTS();

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

    // Check TS
    const lastGlobalSyncTemp = GM_getValue(ptreLastGlobalSync, 0);
    if (lastGlobalSyncTemp != 0) {
        if (lastGlobalSyncTemp > currentTime) {
            GM_setValue(ptreLastGlobalSync, currentTime);
            addToLogs("Fixed bad TS ptreLastGlobalSync (L:" + lastGlobalSyncTemp + ' / C:' + currentTime + ')');
        }
    }
}

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

    logsJSON = JSON.stringify(logsList);
    GM_setValue(ptreLogsList, logsJSON);
}

// Delete old positions
// In order to avoid storage behind too fat for nothing
// Will make more request to PTRE when goind to newly empty system, but its fine
function garbageCollectGalaxyDataV2(days) {
    var removedCount = 0;
    if (GM_getValue(ptreGalaxyStorageVersion, 2) == 2) {
        const currentTime = getIGCurrentTS();
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
                ptreGalaxyCache[gala] = galaxyData; // Keep in-memory cache in sync after GC
            }
        }
    }
    if (removedCount > 0) {
        addToLogs("[GC] Cleaned " + removedCount + " old positions");
    }
}

function validatePurgeTamperMonkeyKeys(targetCountry, targetUniverse, keys) {
    setupMainBox('Delete keys for ' + targetCountry + '-' + targetUniverse + '?', 'TMKeys');
    const tkKey = 'ptre-' + targetCountry + '-' + targetUniverse + '-TK';
    const keysToDelete = keys.filter(function(k) { return k !== tkKey; });

    var content = '<span class="ptreError">This will delete ' + keysToDelete.length + ' key(s) for universe ' + targetCountry + '-' + targetUniverse + '.</span><br><br>';
    content += 'The Team Key (TK) will be preserved.<br><br>';
    content += '<div id="confirmPurgeUniKeys" class="button btn_blue">PURGE, REALLY?</div>';
    content += ' <div id="cancelPurgeUniKeys" class="button btn_blue">CANCEL</div>';
    content += '<br><br>Keys to delete:<br><ul>';
    keysToDelete.forEach(function(k) {
        content += '<li>' + k + '</li>';
    });
    content += '</ul>';

    document.getElementById('ptreMainContent').innerHTML = content;

    document.getElementById('confirmPurgeUniKeys').addEventListener('click', function() {
        keysToDelete.forEach(function(k) {
            GM_deleteValue(k);
        });
        // Purge logs for this universe
        var logsJSON = GM_getValue(ptreLogsList, '');
        if (logsJSON != '') {
            var logsList = JSON.parse(logsJSON);
            var targetUni = targetCountry + '-' + targetUniverse;
            logsList = logsList.filter(function(item) { return item.uni !== targetUni; });
            GM_setValue(ptreLogsList, JSON.stringify(logsList));
        }
        addToLogs('Purged ' + keysToDelete.length + ' keys for ' + targetCountry + '-' + targetUniverse);
        displayTamperMonkeyKeys();
    });

    document.getElementById('cancelPurgeUniKeys').addEventListener('click', function() {
        displayTamperMonkeyKeys();
    });
}

