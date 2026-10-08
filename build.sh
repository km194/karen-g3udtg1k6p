#!/bin/zsh
# Build the public copy in docs/ (GitHub Pages serves that folder) and push it.
set -e
cd "$(dirname "$0")"
mkdir -p docs
{ echo '<!doctype html>'
  echo '<html lang="en"><head><meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
  echo '<meta name="robots" content="noindex, nofollow">'
  grep -v '^<meta charset="utf-8">$' index.html
  echo '</html>'; } > docs/index.html
cp art.js story.js engine.js docs/
for f in *.mp3 *.jpg *.jpeg *.png; do [ -e "$f" ] && cp "$f" docs/; done 2>/dev/null || true
git add -A && git commit -qm "update" && git push -q && echo "pushed"
