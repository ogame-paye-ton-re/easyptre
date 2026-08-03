# EasyPTRE Interoperability Guide

This document describes how to communicate with **EasyPTRE** via the `window.postMessage` API. 

The communication relies on an asynchronous request system based on promises (`Promise`) identified by a unique `requestId`.

## Contracts

### 1. API Contract: `EASYPTRE_FETCH_PLAYER_INFOS`
Allows fetching player information from EasyPTRE.

### Request Structure

Sent by the caller via `window.postMessage` with the type `EASYPTRE_REQUEST`.

```json
{
  "type": "EASYPTRE_REQUEST",
  "requestId": "req_abc1234",
  "action": "EASYPTRE_FETCH_PLAYER_INFOS",
  "payload": {
    "playerId": 106637,
    "pseudo": "Boubou-",
    "withActivities": true
  }
}
```

* **`playerId`** (`number` / `string`, **Required**): Unique identifier of the player. An error is thrown if missing or empty.
* **`pseudo`** (`string`, Optional): Pseudonym associated with the player.
* **`withActivities`** (`boolean`, Optional): Indicates whether activity data should be included.

### Response Structure
Returned by EasyPTRE via `window.postMessage` with the type `EASYPTRE_RESPONSE`.

* **Success (`success: true`)**:
  ```json
  {
    "type": "EASYPTRE_RESPONSE",
    "requestId": "req_abc1234",
    "success": true,
    "data": {
      // Player information object
    }
  }
  ```

* **Error (`success: false`)**:
  ```json
  {
    "type": "EASYPTRE_RESPONSE",
    "requestId": "req_abc1234",
    "success": false,
    "message": "Missing Player ID"
  }
  ```

---

#### Sample Client :

```javascript
export class EasyPTREClient {
  /**
   * Generic method to send a request to EasyPTRE and receive a response.
   */
  call(action, payload = {}) {
    return new Promise((resolve, reject) => {
      const requestId = 'req_' + Math.random().toString(36).substring(2, 9);

      const timer = setTimeout(() => {
        window.removeEventListener('message', listener);
        reject(new Error("Timeout EasyPTRE"));
      }, 5000);

      const listener = (event) => {
        const message = event.data;
        if (!message || message.type !== 'EASYPTRE_RESPONSE' || message.requestId !== requestId) {
          return;
        }

        clearTimeout(timer);
        window.removeEventListener('message', listener);

        if (message.success) {
          resolve(message.data);
        } else {
          reject(new Error(message.message || "Erreur EasyPTRE"));
        }
      };

      window.addEventListener('message', listener);

      window.postMessage({
        type: 'EASYPTRE_REQUEST',
        requestId,
        action,
        payload
      }, '*');
    });
  }

  /**
   * Fetch player information from EasyPTRE.
   */
  fetchPlayerInfos(playerId, pseudo, withActivities) {
    return this.call('EASYPTRE_FETCH_PLAYER_INFOS', { playerId, pseudo, withActivities });
  }
}
```

```
const ptre = new EasyPTREClient();
ptre.fetchPlayerInfos(123456, "PlayerName", true)
  .then(data => console.log("Player info:", data))
  .catch(err => console.error("EasyPTREClient Error:", err.message));
```