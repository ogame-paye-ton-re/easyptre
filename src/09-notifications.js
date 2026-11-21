// ****************************************
// NOTIFICATIONS FUNCTIONS
// ****************************************

// Displays PTRE responses messages
// Responses from server
// Displayed on the rigth-bottom corner, each message is removed after ptreMessageDisplayTime
function displayPTREPopUpMessage(message) {
    const bottom = document.getElementById('bottom');
    if (!bottom) {
        return;
    }
    let box = document.getElementById('boxPTREMessage');
    if (!box) {
        box = document.createElement('div');
        box.id = 'boxPTREMessage';
        box.innerHTML = '<span class="ptreNotificationTitle">PTRE:</span>';
        bottom.appendChild(box);
    }
    const line = document.createElement('div');
    line.className = 'ptreNotificationLine';
    line.innerHTML = message;
    box.appendChild(line);
    setTimeout(function() {
        line.remove();
        if (box.getElementsByClassName('ptreNotificationLine').length === 0) {
            box.remove();
        }
    }, ptreMessageDisplayTime);
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

