#!/bin/bash

if [[ $(docker --version) == *"Docker version"* ]];
    then
        echo "  👍 Docker already installed"
    else
        echo "  Installing Docker..."
        echo " ❗️ This can take a while, please let the script do it's thing.  It will prompt when completed."
        softwareupdate --install-rosetta
        
        if [[ $(arch) == 'arm64' ]]; 
            then
                echo "  ARM64 detected"
                curl -L https://desktop.docker.com/mac/main/arm64/Docker.dmg --output Docker.dmg
            else
                echo "  AMD64 detected"
                curl -L https://desktop.docker.com/mac/main/amd64/Docker.dmg --output Docker.dmg
        fi

        sudo hdiutil attach Docker.dmg
        sudo /Volumes/Docker/Docker.app/Contents/MacOS/install
        sudo hdiutil detach /Volumes/Docker

        echo "  ✅ Docker install completed."
        echo "  ❗️Please open Docker desktop via the GUI to initialize the application before proceeding."
fi

open -a Docker.app
rm -r Docker.dmg





