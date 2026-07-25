// ****************************************
// V12 COMPATIBILITY
// ****************************************
//
// Temporary legacy implementations for functions whose OGame API/DOM contract
// changed between V12 and V13. Kept only during the multi-server migration
// period where some universes still run V12.
//
// Convention:
//   - Every function here is a verbatim copy of the pre-migration V12 code,
//     suffixed with "V12".
//   - The main function in the regular src/ file dispatches to the V12 variant
//     when `isOGameV12 === true` (see copilot-instructions.md → "V12 / V13
//     Dual-Run").
//   - All call sites must be preceded by `//TODO: V12 compatibility`.
//
// Post-migration cleanup (when all servers run V13):
//   1. Delete this file.
//   2. Remove `isOGameV12` from src/01-init.js (declaration + assignment).
//   3. Grep `//TODO: V12 compatibility` and drop every dispatch branch.
//   4. Remove `99-v12-compatibility.js` from build.sh.
//
// ****************************************


// V12 legacy: fetched the Empire Moon page (planetType=1) via a wrapper that
// returned a `mergedArray` JSON string, then iterated `data.planets` as an
// array with `coordinates` = "[g:s:p]" and building levels keyed by string.
// V13 replacement: `accountInfo` endpoint (see updateDataFromEmpireMoonPage).
function updateDataFromEmpireMoonPageV12() {
    consoleDebug("[EMPIRE] [V12] Fetching Empire Moon Page");
    const currentTime = getIGCurrentTS();
    return fetch('https://' + window.location.host + '/game/index.php?page=ajax&component=empire&ajax=1&planetType=1&asJson=1', {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(function(response) { return response.json(); })
    .then(function(result) {
        var data = JSON.parse(result.mergedArray);
        var planets = data.planets;
        if (!planets || planets.length === 0) {
            addToLogs('[EMPIRE] No planets found in Empire');
            displayMessageInSettings('No phalanx data found in Empire Moon page');
            updateHtmlById("ptreEmpireMoonLastRefreshField", 'No phalanx data found in Empire Moon page');
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

            var levels = newPhalanxList.map(function(e) { return e.val; });
            var levelMin = Math.min.apply(null, levels);
            var levelMax = Math.max.apply(null, levels);

            GM_setValue(ptreEmpireMoonLastRefresh, currentTime);
            updateHtmlById("ptreEmpireMoonLastRefreshField", getLastUpdateLabel(currentTime));

            addToLogs('[EMPIRE] Updated ' + newPhalanxList.length + ' phalanx (min: ' + levelMin + ' | max: ' + levelMax + ')');
            displayMessageInSettings('Phalanx updated: ' + newPhalanxList.length + ' moons (min: ' + levelMin + ' | max: ' + levelMax + ')');
        } else {
            addToLogs('[EMPIRE] No phalanx found in JSON response');
            displayMessageInSettings('No phalanx data found in Empire Moon page');
            updateHtmlById("ptreEmpireMoonLastRefreshField", 'No phalanx data found in Empire Moon page');
        }
    })
    .catch(function(error) {
        console.error("[EasyPTRE] Can't fetch empire data ", error);
        displayMessageInSettings('Failed to fetch Empire Moon page');
        updateHtmlById("ptreEmpireMoonLastRefreshField", 'Failed to fetch Empire Moon page');
    });
}
