#!/bin/bash

set -e

ARCH=$(dpkg --print-architecture)

VERSION=1.19.2

mkdir -p /usr/local
wget "https://go.dev/dl/go${VERSION}.linux-${ARCH}.tar.gz"
tar -C /usr/local -xzf "go${VERSION}.linux-${ARCH}.tar.gz"
rm "go${VERSION}.linux-${ARCH}.tar.gz"

export PATH=$PATH:/usr/local/go/bin