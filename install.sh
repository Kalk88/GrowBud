#!/usr/bin/env bash
set -eou

command -v npm >/dev/null 2>&1 || { echo >&2 "npm needs to be installed"; exit 1; }

npm --prefix client/ install
npm --prefix server/notifications install
npm --prefix server/data-store install
npm --prefix server/notifications install