
function initInterop() {
  consoleDebug('[INIT INTEROP] Initializing EasyPTRE interop...');
  window.addEventListener('message', async (event) => {
    const message = event.data;
    // Check if the message is valid and of the expected type
    if (!message || message.type !== 'EASYPTRE_REQUEST') return;

    consoleDebug('[INTEROP EVENT LISTENER] Received message:', event.data)

    const { requestId, action, payload } = message;
    if (!requestId) {
      consoleDebug('[INTEROP EVENT LISTENER] No requestId found in message, ignoring.');
      return;
    }

    try {
      let result;
      switch (action) {
        case 'EASYPTRE_FETCH_PLAYER_INFOS':
          result = await handleFetchPlayerInfos(payload);
          break;
        default:
          throw new Error(`Action inconnue: ${action}`);
      }

      consoleDebug('[INTEROP EVENT LISTENER] Sending response for requestId:', requestId, result);

      window.postMessage({
        type: 'EASYPTRE_RESPONSE',
        requestId,
        success: true,
        data: result
      }, '*');

    } catch (error) {
      window.postMessage({
        type: 'EASYPTRE_RESPONSE',
        requestId,
        success: false,
        message: error.message || "Erreur inconnue"
      }, '*');
    }
  });
  consoleDebug('[INIT INTEROP] EasyPTRE interop initialized.');
}

async function handleFetchPlayerInfos({ playerId, pseudo, withActivities }) {
  if (!playerId) throw new Error("Missing Player ID");
  try {
    return await fetchPlayerInfos(playerId, pseudo, withActivities);
  } catch (error) {
    console.log('[EasyPTRE] [INTEROP] Error fetching player infos:', error);
    let errorMsg = "Request failed";
    if (typeof error === 'string') errorMsg = error;
    else if (error && error.statusText) errorMsg = error.statusText;
    throw new Error(errorMsg);
  }
}