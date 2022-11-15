#!/bin/bash

mkdir openline-setup

xcode-select -p
if [ $? -eq 0 ]; then
    echo "  👍 Xcode already installed"
else
    echo "Installing Xcode..."
    xcode-select --install
    echo "  ✅ Xcode install completed."
fi

