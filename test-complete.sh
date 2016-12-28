#!/usr/bin/env bash

BLACK=$(tput setaf 0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
LIME_YELLOW=$(tput setaf 190)
POWDER_BLUE=$(tput setaf 153)
BLUE=$(tput setaf 4)
MAGENTA=$(tput setaf 5)
CYAN=$(tput setaf 6)
WHITE=$(tput setaf 7)
BRIGHT=$(tput bold)
NORMAL=$(tput sgr0)
BLINK=$(tput blink)
REVERSE=$(tput smso)
UNDERLINE=$(tput smul)
RESET=`tput sgr0`

getTime(){
    : ${TIME=[`date "+%H:%M:%S"`]:}
}

echoRed() {
    getTime
    echo ${YELLOW}${TIME} ${RED}$1${RESET}
}

echoBlue() {
    getTime
    echo ${YELLOW}${TIME} ${BLUE}$1${RESET}
}
echoGreen() {
    getTime
    echo ${YELLOW}${TIME} ${GREEN}$1${RESET}
}

removeSrcDir(){
    echoBlue "removing src directory..."
    rm -rf ./src
    echoGreen "src directory removed successfully!"
}

echoBlue "setting up js project tests..."
yarn run setup-js

echoBlue "running prod build for js project..."
yarn run prod

echoBlue "running tests for js project build..."
yarn test

removeSrcDir


echoBlue "setting up web project tests..."
yarn run setup

echoBlue "running prod build for web project..."
yarn run prod

echoBlue "running tests for web project build..."
yarn test

removeSrcDir


echoBlue "setting up electron project tests..."
yarn run setup-electron

echoBlue "running tests for electron project build..."
yarn test

echoGreen "All test successfully completed!"