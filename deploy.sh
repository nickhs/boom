#!/bin/sh

gulp prod-build
gulp make-demo
nick-deploy.sh .
