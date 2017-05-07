#!/bin/bash

mkdir workspace
git clone https://github.com/bzflag-dev/bzflag.org workspace/bzflag.org/

mkdir _events/
cp -a workspace/bzflag.org/_documentation/developer/bzfs_api_events/. _events/

rm -rf workspace/