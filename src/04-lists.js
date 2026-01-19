// ****************************************
// PTRE/AGR LIST RELATED
// ****************************************

// Add data to sharable structure
// Element should be like: {type: string_type, id: ID, coords: coords, val: a_value};
function addDataToPTREData(newData, syncToPTRE = true) {
    var dataJSON = '';
    dataJSON = GM_getValue(ptreDataToSync, '');
    var dataList = [];
    if (dataJSON != '') {
        dataList = JSON.parse(dataJSON);
    }

    // Look for same entry
    var idASup = -1;
    $.each(dataList, function(i, elem) {
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

function initEmptyPhalanx(moonID, coords) {
    var dataJSON = '';
    dataJSON = GM_getValue(ptreDataToSync, '');
    var dataList = [];
    if (dataJSON != '') {
        dataList = JSON.parse(dataJSON);
    }
    var newData = {type: "phalanx", id: moonID, coords: coords, val: -1};

    // Look for same entry
    var doInsert = true;
    $.each(dataList, function(i, elem) {
        //console.log("[EasyPTRE] Checking elem " + elem.type + " / " + elem.id);
        if (elem.type == "phalanx" && elem.id == newData.id) {
            doInsert = false;
        }
    });
    if (doInsert === false) {
        consoleDebug("No Empty Phalanx creation. Found Phalanx " + newData.id + ": " + elem.val);
        return -1;
    }

    // Add the new entry
    consoleDebug("Creating empty Phalanx at " + newData.coords + " (" + newData.id + ")");
    dataList.push(newData);

    // Save list
    dataJSON = JSON.stringify(dataList);
    GM_setValue(ptreDataToSync, dataJSON);
}

function initPTREDataWithMoonSlots() {
    // rename to refresh
    debugSharableData();
    consoleDebug("Refresh Moons and Phalanx");
    var existingMoons = {};

    // Get current planet list
    const planetListFromDOM = document.getElementById('planetList');
    for (const child of planetListFromDOM.children) {
        let splitted = child.id.split('-');
        let planetId = Number(splitted[1]);
        let coords = "";
        let moonID = 0;
        //consoleDebug("Planet ID: " + planetId);
        const planetElem = child.querySelectorAll('.planet-koords');
        if (planetElem) {
            coords = planetElem[0].innerHTML;
            coords = coords.replace(/[\[\]]/g, "");
            //consoleDebug("Coords: " + coords);
        }
        const moonElem = child.querySelectorAll('.icon-moon');
        if (moonElem && moonElem[0]) {
            splitted = moonElem[0].id.split('_');
            moonID = Number(splitted[1]);
            //consoleDebug("moonId: " + moonID);
        }
        if (coords != "" && moonID != 0) {
            consoleDebug("Found current Moon " + moonID + " at " + coords);
            existingMoons[String(moonID)] = coords;
        }
    }

    var dataJSON = GM_getValue(ptreDataToSync, '');
    var dataList = [];
    var dataListNew = [];
    if (dataJSON != '') {
        dataList = JSON.parse(dataJSON);
    }
    dataList.forEach((elem, index) => {
        if (elem.type != "phalanx") {
            dataListNew.push(elem);
        } else {
            consoleDebug("Checking Moon " + elem.id + " at " + elem.coords);
            if (existingMoons[elem.id]) {
                if (elem.coords == existingMoons[elem.id]) {
                    consoleDebug("=> Keep: This moon exists and is at the same spot");
                    dataListNew.push(elem);
                } else {
                    consoleDebug("=> Update: This moon exists BUT has been moved from "+elem.coords+" to "+existingMoons[elem.id]);
                    let phalanx = {type: "phalanx", id: elem.id, coords: existingMoons[elem.id], val: elem.val};
                    dataListNew.push(phalanx);
                }
                // Mark this moon as listed
                existingMoons[elem.id] = -1;
            } else {
                consoleDebug("=> Drop: Cant find this moon " + elem.id);
            }

        }
    });
    /*consoleDebug("Moons after: ");
    console.log(existingMoons);
    console.log(dataListNew);*/

    Object.entries(existingMoons).forEach(([key, value]) => {
        console.log(key, value);
        if (value != -1) {
            consoleDebug("Moon " + key + " at " + value + " is missing from list: adding");
            let phalanx = {type: "phalanx", id: key, coords: value, val: -1};
            dataListNew.push(phalanx);
        }
    });

    console.log(dataListNew);




    debugSharableData();

}

function debugSharableData() {
    var dataJSON = '';
    dataJSON = GM_getValue(ptreDataToSync, '');

    var dataList = [];
    if (dataJSON != '') {
        dataList = JSON.parse(dataJSON);
        $.each(dataList, function(i, elem) {
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

        $.each(targetList, function(i, PlayerCheck) {
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

        $.each(targetList, function(i, PlayerCheck) {
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

        $.each(targetList, function(i, PlayerCheck) {
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

        $.each(targetList, function(i, PlayerCheck) {
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
        $.each(targetList, function(i, PlayerCheck) {
            if (!mergedTargetsList.includes(Number(PlayerCheck.id))) {
                mergedTargetsList.push(Number(PlayerCheck.id));
            }
        });
    }
    targetJSON = GM_getValue(ptreAGRPlayerListJSON, '');
    if (targetJSON != '') {
        var targetList = JSON.parse(targetJSON);
        $.each(targetList, function(i, PlayerCheck) {
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
        $.each(targetList, function(i, PlayerCheck) {
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
        $.each(tabAgo[1].children, function(i, ligneJoueurAGR) {
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

