#!/bin/bash
set -euo pipefail

help() {
  cat <<EOF
Usage $0 <command>
Commands:
  download
EOF
}

DIR=`dirname "$0"`
ROOT=`dirname "$DIR"`
OUT_DIR="./dist"
# --format=iife で、ブラウザで動かすための形式に変換 (export, importを使用しない形式)
CONV_OPTS="--target=es2022 --format=iife"
CONV_OPTS="${CONV_OPTS} --bundle" # importがある場合そちらも含める
CONV_OPTS="${CONV_OPTS} --minify" # minify化

[ $# -gt 0 ] && { COMMAND="$1"; shift; }

case "${COMMAND:-}" in
  download)
    echo "Converting download.ts..."
    cd $ROOT
    FILE="download/download"
    # Note: --global-name を指定することで Donload.fn() というように呼び出せるようになる
    pnpm dlx esbuild ./src/$FILE.ts $CONV_OPTS  --global-name=Download --outfile=$OUT_DIR/$FILE.js
  ;;
  -h|--help) help; exit 0 ;;
  *) echo "${COMMAND:-}"; help; exit 1 ;;
esac
