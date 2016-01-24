#! /bin/bash
#
# buildToolchain.sh
# Copyright (C) 2016 tristan <tristan@tristan-VirtualBox>
#
# Distributed under terms of the MIT license.
#


NDK_HOME="$ANDROID_NDK_HOME"
BASE_TOOLCHAIN_DIR='./v8_toolchain'
PLATFORM='android-21'
ARCH='arm'
SYSTEM='linux-x86_64'
TOOLCHAIN='arm-linux-androideabi-clang3.6'

echo ${NDK_HOME}
echo ${BASE_TOOLCHAIN_DIR}
echo ${PLATFORM}
echo ${ARCH}
echo ${SYSTEM}  
echo ${TOOLCHAIN}

export ANDROID_NDK_ROOT=${NDK_HOME}
TOOLCHAIN_DIR=${BASE_TOOLCHAIN_DIR}/${ARCH}
mkdir -p ${TOOLCHAIN_DIR}

${NDK_HOME}/build/tools/make-standalone-toolchain.sh \
    --platform=${PLATFORM} \
    --install-dir=${TOOLCHAIN_DIR} \
    --arch=${ARCH} \
    --system=${SYSTEM} \
    --toolchain=${TOOLCHAIN}
