for d in ./* ; do
  ffmpeg -i ${d} ${d%.*}.webp
done