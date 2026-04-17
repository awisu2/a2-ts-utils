#!/bin/bash
set -eu -o pipefail

help() {
    cat <<EOF
Usage: $0 <command> [args]
Commands:
  init
EOF
}

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$DIR/.." && pwd)"

PNPM_WORKSPACE_FILE="pnpm-workspace.yaml"

PACKAGE_BASE="packages"
PACKAGES=("common" "browser" "node")

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
  *)
    help
    exit 1
  ;;
esac