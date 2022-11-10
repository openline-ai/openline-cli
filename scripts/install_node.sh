#!/bin/bash

set -e

VERSION=18.12.1

sudo mkdir -p /usr/local/lib/node
wget "https://nodejs.org/dist/v${VERSION}/node-v${VERSION}-linux-x64.tar.xz"
sudo tar -xJvf "node-v${VERSION}-linux-x64.tar.xz"
rm "node-v${VERSION}-linux-x64.tar.xz"
cd node-v${VERSION}-linux-x64
sudo cp -r ./{lib,share,include,bin} /usr

export PATH=/usr/bin:$PATH

. ~/.bash_profile