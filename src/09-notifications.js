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
        console.log("[PTRE] Error. Cant display: " + message);
    }
}

function cleanGalaxyMiniMessage() {
    if (document.getElementById("fleetstatusrow")) {
        document.getElementById("fleetstatusrow").innerHTML = '';
    }
}

// Display message content on galaxy page
function displayGalaxyMessageContent(message) {
    if (document.getElementById("ptreGalaxyMessageBoxContent")) {
        document.getElementById("ptreGalaxyMessageBoxContent").innerHTML = message;
    } else {
        console.log("[PTRE] Error. Cant display: " + message);
    }
}

