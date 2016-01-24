#!/bin/sh

gulp prod-build
gulp make-demo
rsync -rltvhz --progress --delete build nickhs:/srv/boomjs/
rsync -rltvhz --progress --delete build/demo* nickhs:/srv/boomjs/
rsync -rltvhz --progress --delete emoji_icons nickhs:/srv/boomjs/
