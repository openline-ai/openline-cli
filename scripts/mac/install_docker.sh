#!/bin/bash

if [[ $(docker --version) == *"Docker version"* ]];
    then
        echo "  👍 Docker already installed"
    else
        echo "Installing Docker..."
        softwareupdate --install-rosetta
        
        if [[ $(arch) == 'arm54' ]]; 
            then
                curl -L https://desktop.docker.com/mac/main/arm64/Docker.dmg --output Docker.dmg
            else
                curl -L https://desktop.docker.com/mac/main/amd64/Docker.dmg --output Docker.dmg
        fi

        sudo hdiutil attach Docker.dmg
        sudo /Volumes/Docker/Docker.app/Contents/MacOS/install
        sudo hdiutil detach /Volumes/Docker

        echo "  ✅ Docker install completed."
        echo "  ❗️Please open Docker desktop via the GUI to initialize the application before proceeding."
fi






