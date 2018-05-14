#!/usr/bin/env bash
echo '[SCRIPT] installing dev dependencies'

npm install --save-dev cross-env

echo '[SCRIPT] running test'

npm test

echo '[SCRIPT] complete'