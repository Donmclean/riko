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

#Make sure ruby is installed
echoGreen "checking for ruby. ruby must be installed..."
ruby -v || exit 1

#Install Brew
echoGreen "checking for Homebrew. Homebrew must be installed..."
brew -v || exit 1

#Accept xcode license
echoGreen "Accept xcode license"
sudo xcodebuild -license

#install cask
echoGreen "Install Homebrew Cask"
brew tap caskroom/cask

#Install required Casks
echoGreen "Install required Casks"
brew cask install java xquartz

#Install wine
echoGreen "Install Wine"
brew install wine

