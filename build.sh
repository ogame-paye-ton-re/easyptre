#!/bin/bash

OUTPUT=$(pwd)"/easyptre.js"
echo $OUTPUT

cd src
cat \
    00-headers.js \
    01-init.js \
    02-styles.js \
    03-improve-view.js \
    04-lists.js \
    05-menu.js \
    06-ptre.js \
    07-core.js \
    08-tools.js \
    09-notifications.js \
    10-web.js \
    11-maintenance.js \
> $OUTPUT

echo "Build complete: $OUTPUT"
