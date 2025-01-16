#!/usr/bin/bash

params=( "$@" )
params[-1]=$(realpath ${params[-1]})

pushd $(dirname $0) > /dev/null
deno run --allow-all --unstable-ffi lang-edit.ts ${params[@]}
popd > /dev/null
