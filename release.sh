#!/bin/bash

# Install node and npm
# Install oclif (npm i -g oclif)
# Install aws-cli (brew install awscli)
# Install 7zip (brew install p7zip)
# Bump the version in .../openline-cli/packages/cli/package.json

cd packages/cli
oclif pack tarballs

export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"

upload_out=$(oclif upload tarballs)
version=$(echo $upload_out | perl -pe 'if(($v)=/([0-9]+([.][0-9]+)+)/){print"$v\n";exit}$_=""')
sha=$(echo $upload_out | tr -d '\n' | rev | cut -d "-" -f1 | rev)

 
oclif promote --version "${version}" --sha "${sha}" --channel rc

oclif promote --version "${version}" --sha "${sha}" --channel stable --indexes

# Check the new version availability: 
openline update --available
aws s3 cp s3://openline.sh/channels/stable/openline-darwin-arm64.tar.gz .
shasum -a 256 openline-darwin-arm64.tar.gz
rm openline-darwin-arm64.tar.gz

echo "go the homebrew formula in github and update the sha256 value in line 12." 
echo "Link to homebrew formula:\n https://github.com/openline-ai/homebrew-cli/blob/otter/FORMULA/openline.rb"
