#!/bin/zsh
# Build the public copy in docs/ (GitHub Pages serves that folder) and push it.
set -e
setopt null_glob
cd "$(dirname "$0")"
mkdir -p docs
{ echo '<!doctype html>'
  echo '<html lang="en"><head><meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">'
  echo '<meta name="robots" content="noindex, nofollow">'
  grep -v '^<meta charset="utf-8">$' index.html
  echo '</html>'; } > docs/index.html
cp art.js story.js lines.js engine.js docs/
rm -rf docs/voices
for f in *.mp3 *.jpg *.jpeg *.png; do [ -e "$f" ] && cp "$f" docs/; done
git add -A && git commit -qm "update" && git push -q && echo "pushed"
