#!/bin/sh

gulp build
rsync -rltvhz --progress --delete build nickhs:/srv/boomjs/
rsync -rltvhz --progress --delete demo* nickhs:/srv/boomjs/
rsync -rltvhz --progress --delete emoji_icons nickhs:/srv/boomjs/
