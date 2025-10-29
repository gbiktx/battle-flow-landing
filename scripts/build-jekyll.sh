#!/bin/bash
# Use the full path to bundle to avoid PATH issues
BUNDLE_PATH="${HOME}/.local/share/mise/installs/ruby/3.3.0/bin/bundle"

# Fall back to PATH if the specific version isn't found
if [ ! -f "$BUNDLE_PATH" ]; then
    BUNDLE_PATH="bundle"
fi

# Run Jekyll build
"$BUNDLE_PATH" exec jekyll build
