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
    echoBlue "removing $1 directory..."
    rm -rf ./$1
    echoGreen "$1 directory removed successfully!"
}

setupTest() {
    echoBlue "linting source files..."
    npm run gulp-lint

    echoBlue "setting up $1 project tests..."
    node index.js setup $1 $2

    echoBlue "installing dependencies..."
    cd $2
    yarn

    echoBlue "building..."
    node ../index.js run $3

    cd ..

    removeSrcDir $2
}

echoBlue "testing setup commands..."
setupTest react testWebProject react-prod

echoGreen "All test successfully completed!"