#!/usr/bin/env bash
echo '[SCRIPT] installing dev dependencies'
set -x
npm install --save-dev cross-env
set +x
echo '[SCRIPT] running test'

set -x
npm test

echo '[SCRIPT] complete'