#!/bin/bash

if [[ $(helm version) == *"version.BuildInfo"* ]];
    then
        echo "  👍 Helm already installed"
    else
        echo "Installing Helm..."
        brew install helm

        echo "  ✅ Helm install completed."
fi


