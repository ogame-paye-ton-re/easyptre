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

