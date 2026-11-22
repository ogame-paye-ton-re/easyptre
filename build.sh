#!/bin/bash

OUTPUT=$(pwd)"/dist/easyptre.js"

echo "Building $OUTPUT"
cd src

echo "Running syntax check..."
for f in *.js; do
    node --check "$f" 2>&1
    if [ $? -ne 0 ]; then
        echo "ERROR: Syntax check failed in $f"
        exit 1
    fi
done
echo "Syntax check passed."

cat 00-headers.js > $OUTPUT
echo "// ****************************************" >> $OUTPUT
echo "// Build date: $(date)" >> $OUTPUT
echo "// ****************************************" >> $OUTPUT
echo "" >> $OUTPUT

echo "Generating ingame changelog from CHANGELOG.md..."
node ../scripts/changelog-to-html.js ../CHANGELOG.md >> $OUTPUT || { echo "ERROR: Changelog generation failed"; exit 1; }

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
    12-http.js \
    13-ui.js \
>> $OUTPUT

node --check "$OUTPUT" || { echo "ERROR: Syntax check failed in $OUTPUT"; exit 1; }
echo "Build successful: $OUTPUT"
