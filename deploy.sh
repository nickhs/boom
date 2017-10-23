#!/bin/bash

set -xe

npm_bin=$(npm bin)
$npm_bin/gulp prod-build
$npm_bin/gulp make-demo
nick-deploy.sh .
