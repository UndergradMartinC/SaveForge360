#!/bin/zsh
set -eu

cd "$(dirname "$0")"

if ! curl --silent --fail http://127.0.0.1:4173/ >/dev/null 2>&1; then
  npm start >"${TMPDIR:-/tmp}/saveforge360.log" 2>&1 &
fi

open http://127.0.0.1:4173/
