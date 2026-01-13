// ****************************************
// INIT
// ****************************************

// Check current website
var modeEasyPTRE = "ingame";
if (/ptre.chez.gg/.test(location.href)) {
    modeEasyPTRE = "ptre";
    console.log("[PTRE] EasyPTRE: Mode PTRE");
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
const logsRetentionDuration = 7*24*60*60;
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

var ptreGalaxyActivityCount = 0;
var ptreGalaxyEventCount = 0;
var galaxyInitMiliTS = 0;
var ptrePushActivities = true;
var ptreSendGalaEvents = true;
var ptreDisplayGalaPopup = false;//TODO: at false, during Beta

if (modeEasyPTRE == "ingame") {
    galaxyInitMiliTS = serverTime.getTime();
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
const ptreLastAvailableVersionRefresh = "ptre-LastAvailableVersionRefresh";
const ptreLogsList = "ptre-Logs";
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

// ****************************************
// MAIN EXEC
// OGame pages
// ****************************************

if (modeEasyPTRE == "ingame") {
    // Drop cache V1 (one time action)
    dropGalaxyCacheStorageV1();

    // Add EasyPTRE menu
    if (!/page=standalone&component=empire/.test(location.href)) {
        // Setup Menu Button
        var ptreMenuName = toolName;
        var lastAvailableVersion = GM_getValue(ptreLastAvailableVersion, -1);
        var updateClass = '';
        var ptreStoredTK = GM_getValue(ptreTeamKey, '');
        if ((lastAvailableVersion != -1 && lastAvailableVersion !== GM_info.script.version) || (ptreStoredTK == '')) {
            ptreMenuName = "CLICK ME";
            updateClass = " ptreError";
        }
        var aff_option = '<span class="menu_icon"><a id="iconeUpdate" href="https://ptre.chez.gg" target="blank_" ><img id="imgPTREmenu" class="mouseSwitch" src="' + imgPTRE + '" height="26" width="26"></a></span>';
        aff_option += '<a id="affOptionsPTRE" class="menubutton " href="#" accesskey="" target="_self"><span class="textlabel' + updateClass + '" id="ptreMenuName">' + ptreMenuName + '</span></a>';

        var tab = document.createElement("li");
        tab.innerHTML = aff_option;
        tab.id = 'optionPTRE';
        document.getElementById('menuTableTools').appendChild(tab);

        document.getElementById('affOptionsPTRE').addEventListener("click", function (event) {
            displayPTREMenu();
        }, true);
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

    // Global Sync
    if ((Math.floor(serverTime.getTime()) / 1000) > (Number(GM_getValue(ptreLastGlobalSync, 0)) + globalPTRESyncTimeout)) {
        setTimeout(globalPTRESync, 3000);
    }

    // Check for new version only (no need to run it if only browsing)
    setTimeout(updateLastAvailableVersion, 4000);

    // Prepare next Backend Check
    // This is not enabled by default (ptreCheckForUpdateCooldown <= 0)
    // It only check if update is needed, it does not do the update
    runAutoCheckForPTREUpdate();
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
            console.log("[PTRE] PTRE Lifeforms page detected: "+country+"-"+universe);
            const json = GM_getValue(ptreTechnosJSON, '');
            if (json != '') {
                tab = parsePlayerResearchs(json, "tab");
                document.getElementById("tech_from_easyptre").innerHTML = tab;
                console.log("[PTRE] Updating lifeforms page");
            } else {
                console.log("[PTRE] No lifeforms data saved");
            }
        }
    }

    // Update PTRE Spy Report Pages
    if (/ptre.chez.gg\/\?iid/.test(location.href)){
        console.log("[PTRE] PTRE Spy Report page detected: "+country+"-"+universe);
        const json = GM_getValue(ptreTechnosJSON, '');
        if (json != '') {
            const linkElement = document.getElementById("simulate_link");
            let hrefValue = linkElement.getAttribute("href");
            var prefill = parsePlayerResearchs(json, "prefill");
            hrefValue = hrefValue.replace("replaceme", prefill);
            linkElement.setAttribute("href", hrefValue);
            document.getElementById("simulator_comment").innerHTML = "This link contains your LF techs";
            console.log("[PTRE] Updating simulator link");
        } else {
            console.log("[PTRE] No lifeforms data saved");
        }
    }
}

