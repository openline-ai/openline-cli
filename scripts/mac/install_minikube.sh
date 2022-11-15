#!/bin/bash

if [[ $(minikube version) == *"minikube version"* ]];
    then
        echo "  👍 Minikube already installed"
    else
        echo "Installing Minikube..."
        brew install minikube

        echo "  ✅ Minikube install completed."
fi

