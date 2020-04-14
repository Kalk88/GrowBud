#!/usr/bin/env bash
set -eou

command -v npm >/dev/null 2>&1 || { echo >&2 "npm needs to be installed"; exit 1; }
command -v firebase >/dev/null 2>&1 || { echo >&2 "firebase needs to be installed"; exit 1; }

# Firebase functions needs to have all code reachable from the functions folder.
# I.e we can't use relavtive paths back up from that directory
# Clean up old server code
rm -rf server/functions/src/data-store
rm -rf server/functions/src/notifications

npm --prefix client/ run build-dev
npm --prefix server/notifications run build
npm --prefix server/data-store run tsc-build
# If all builds pass copy to functions src folder
cp -r server/notifications/lib server/functions/src/notifications
cp -r server/data-store/dist/src server/functions/src/data-store

firebase serve