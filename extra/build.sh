#! /bin/sh
#
# build.sh
# Copyright (C) 2016 tristan <tristan@tristan-VirtualBox>
#
# Distributed under terms of the MIT license.
#


export ANDROID_TOOLCHAIN=/home/tristan/workspace/v8/v8_toolchain/arm

cd v8 && make android_arm.clean && make android_arm.release -j4 i18nsupport=off
