#!/usr/bin/env bash
set -e

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

echoBlue "setting up react-native project"

if ! [ -x "$(command -v brew)" ]; then
    # Install Homebrew
    echoBlue "installing homebrew"
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
    echoBlue "homebrew already installed"
    brew -v
fi

echoBlue "validating watchman..."
brew install watchman

if ! [ -x "$(command -v react-native)" ]; then
    # Install react-native-cli
    echoBlue "installing react-native-cli globally"
    sudo npm install -g react-native-cli
else
    echoBlue "react-native already installed"
fi

echoBlue "initializing react-native application"
react-native init $1
echoGreen "react-native initialized!"

echoBlue "adding missing local.properties file to android project..."
echo sdk.dir= $HOME/Library/Android/sdk > $1/android/local.properties
echoGreen "local.properties added!"

echoBlue "adding android emulator launcher..."

AVD="$(~/Library/Android/sdk/tools/emulator -list-avds | head -1)"

printf "#!/usr/bin/env bash\nset -e\n~/Library/Android/sdk/tools/emulator -avd ${AVD}" > $1/launch-android-Emulator.sh

echoGreen "android emulator launcher added!"

echoGreen "Setup successfully completed!"

exit 0;