#!/usr/bin/env bash

sudo pm2 delete backend

sudo rm -rf ../lib

npm run build

sudo pm2 start lib/index.js --name backend


