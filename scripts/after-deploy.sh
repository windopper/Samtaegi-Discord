#!/bin/bash
REPOSITORY=/home/ubuntu/samtaegi

cd $REPOSITORY

sudo npm uninstall discord-music-player
sudo npm i
sudo pm2 start ecosystem.config.js