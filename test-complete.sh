#!/usr/bin/env bash

npm run setup-demo &&
npm run prod &&
npm test &&
rm -rf ./src &&
npm run setup &&
npm run prod &&
npm test &&
rm -rf ./src &&
npm run setup-electron &&
npm test