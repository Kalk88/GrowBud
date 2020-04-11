#!/usr/bin/env bash
set -eou

command -v npm >/dev/null 2>&1 || { echo >&2 "npm needs to be installed"; exit 1; }
command -v firebase >/dev/null 2>&1 || { echo >&2 "firebase needs to be installed"; exit 1; }

npm --prefix client/ run build-dev
npm --prefix server/notifications run build
npm --prefix server/data-store run tsc-build

firebase serve