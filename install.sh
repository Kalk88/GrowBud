#!/usr/bin/env bash
set -eou

command -v npm >/dev/null 2>&1 || { echo >&2 "npm needs to be installed"; exit 1; }

cd client/ && npm install && cd ..
cd server/functions && npm install && cd ../../
cd server/data-store && npm install && cd ../../
