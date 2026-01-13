#!/bin/bash

OUTPUT=$(pwd)"/dist/easyptre.js"
echo $OUTPUT

cd src

cat 00-headers.js > $OUTPUT

echo "// ****************************************" >> $OUTPUT
echo "// Build date: $(date)" >> $OUTPUT
echo "// ****************************************" >> $OUTPUT
echo "" >> $OUTPUT

cat \
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
>> $OUTPUT

echo "Build complete: $OUTPUT"
