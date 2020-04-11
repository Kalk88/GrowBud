#!/usr/bin/env bash
set -eou

command -v npm >/dev/null 2>&1 || { echo >&2 "npm needs to be installed"; exit 1; }
command -v firebase >/dev/null 2>&1 || { echo >&2 "firebase needs to be installed"; exit 1; }


cd client/ && npm run build-dev && cd ..
cd server/notifications && npm run build && cd ../../
cd server/data-store && npm run tsc-build && cd ../../

firebase serve