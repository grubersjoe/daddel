#!/bin/zsh
setopt +o nomatch

QUALITY=85

mkdir -p out/
rm -f out/*

cd src/
for i in *; do;
  filename=${i%%.*}
  echo "Generating $filename.webp"
  cwebp $i -resize 824 464 -q $QUALITY -o ../out/$filename.webp -quiet
done;
