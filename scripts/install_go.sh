#!/bin/bash

set -e

VERSION=1.19.3

sudo mkdir -p /usr/local
wget "https://go.dev/dl/go${VERSION}.linux-amd64.tar.gz"
sudo tar -C /usr/local -xzf "go${VERSION}.linux-amd64.tar.gz"
sudo rm "go${VERSION}.linux-amd64.tar.gz"

echo PATH=$PATH:/usr/local/go/bin >> ~/.bash_profile

. ~/.bash_profile