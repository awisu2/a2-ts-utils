#!/bin/bash
set -eu -o pipefail

help() {
    cat <<EOF
Usage: $0 <command> [args]
Commands:
  init
  build
  test
  clean
  pack
  publish [--force]
EOF
}

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$DIR/.." && pwd)"

PNPM_WORKSPACE_FILE="pnpm-workspace.yaml"

PACKAGE_BASE="packages"
PACKAGES=("common" "browser" "node")

# verdaccio registry url (local registry)
NPM_RESISTORY=`npm config get registry`

[ $# -ge 1 ] && { COMMAND="$1"; shift; }
case "${COMMAND:-}" in
  init)
    cd "$BASE_DIR"
    if [ ! -f "$PNPM_WORKSPACE_FILE" ]; then
      cat <<EOF > "$PNPM_WORKSPACE_FILE"
packages:
  - "$PACKAGE_BASE/*"
EOF
    fi
    
    for _PKG in "${PACKAGES[@]}"; do
      echo "setup package: $_PKG"
      mkdir -p "$BASE_DIR/$PACKAGE_BASE/$_PKG"
      cd "$BASE_DIR/$PACKAGE_BASE/$_PKG"
      if [ ! -f "package.json" ]; then
        pnpm init
      else
        echo "No pnpm init. already exists package.json"
      fi
    done
  ;;
  build)
    cd "$BASE_DIR"
    pnpm -r run build
  ;;
  test)
    cd "$BASE_DIR/test"
    node index.js
  ;;
  clean)
    cd "$BASE_DIR"
    rm -rf "node_modules" "dist" "packages/*/dist"
    if [ -f "pnpm-lock.yaml" ]; then
      rm "pnpm-lock.yaml"
    fi
    pnpm store prune
    
    echo "Cleaned node_modules, dist folders, and pnpm-lock.yaml"
    echo "Please run 'pnpm install' to reinstall dependencies."
  ;;
  pack)
    for _PKG in "${PACKAGES[@]}"; do
      echo "setup package: $_PKG"
      mkdir -p "$BASE_DIR/$PACKAGE_BASE/$_PKG"
      cd "$BASE_DIR/$PACKAGE_BASE/$_PKG"
      pnpm pack
    done
  ;;
  publish)
    echo "Publishing packages to registry: $NPM_RESISTORY (may using verdaccio)"
    
    PUBLISH_OPTS=""
    if [ $# -gt 0 ] && [ "$1" = "--force" ]; then
      shift
      
      echo "Setted --force flag. Unpublishing existing packages from registry before publishing."
      set +e
      for _PKG in "${PACKAGES[@]}"; do
        echo "Unpublishing package: $_PKG"
        cd "$BASE_DIR/$PACKAGE_BASE/$_PKG"
        npm unpublish --registry "$NPM_RESISTORY" --force
      done
      set -e
      
      PUBLISH_OPTS="--force"
    fi
    
    echo "Publishing packages..."
    cd "$BASE_DIR"
    pnpm -r publish --no-git-checks $PUBLISH_OPTS
  ;;
  list)
    echo "Current registry: $NPM_RESISTORY"
    echo "Seraching for packages with prefix '@a2-ts-utils' ====="
    npm search @a2-ts-utils
    
    echo "Viewing details ====="
    for _PKG in "${PACKAGES[@]}"; do
      echo "Pkg: @a2-ts-utils/$_PKG -----"
      npm view "@a2-ts-utils/$_PKG"
    done
  ;;
  *)
    help
    exit 1
  ;;
esac