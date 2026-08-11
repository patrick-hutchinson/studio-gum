export function getVideoUrl(medium) {
  if (!medium?.playbackId) return null;

  return `https://stream.mux.com/${medium.playbackId}.m3u8`;
}
