#!/bin/sh
# Downloads the raw NBA.com files (not kept in git) into src/shotmaking/raw/.
# Source: github.com/shufinskiy/nba_data (shot details + play-by-play, 1996-97 to 2025-26).
# Shots: ~45 MB per season unpacked. Play-by-play: ~95 MB per season unpacked.
set -e
cd "$(dirname "$0")"; mkdir -p raw; cd raw
BASE=https://raw.githubusercontent.com/shufinskiy/nba_data/main/datasets
for y in $(seq 1996 2025); do
  for k in shotdetail shotdetail_po nbastatsv3; do
    [ -f ${k}_$y.csv ] && continue
    curl -sL -m 300 -o t.tar.xz $BASE/${k}_$y.tar.xz && tar -xJf t.tar.xz && rm t.tar.xz
  done
  echo "got $y"
done
