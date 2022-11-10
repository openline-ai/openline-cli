#!/bin/bash

set -e

VERSION=18.12.1

mkdir -p /usr/local/lib/node
wget "https://nodejs.org/dist/v${VERSION}/node-v${VERSION}-linux-x64.tar.xz"
tar -C /usr/local -xzf "node-v${VERSION}-linux-x64.tar.xz"
rm "node-v${VERSION}-linux-x64.tar.xz"

export NODEJS_HOME=/usr/local/lib/node
export PATH=$NODEJS_HOME/bin:$PATH

. ~/.profile