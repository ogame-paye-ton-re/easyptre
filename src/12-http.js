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
