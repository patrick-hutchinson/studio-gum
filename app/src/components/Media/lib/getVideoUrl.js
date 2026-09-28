const STREAMING_DURATION_THRESHOLD = 60;
const STATIC_RENDITION_PRIORITY = [
  "highest.mp4",
  "2160p.mp4",
  "1440p.mp4",
  "1080p.mp4",
  "720p.mp4",
  "540p.mp4",
  "480p.mp4",
  "360p.mp4",
  "270p.mp4",
  "capped-1080p.mp4",
];

function getHlsSource(playbackId) {
  return {
    type: "hls",
    url: `https://stream.mux.com/${playbackId}.m3u8`,
  };
}

function getReadyStaticRenditions(medium) {
  return (medium?.staticRenditions || []).filter((rendition) => {
    return rendition?.status === "ready" && rendition?.ext === "mp4" && rendition?.name;
  });
}

function getPreferredStaticRendition(medium) {
  const readyRenditions = getReadyStaticRenditions(medium);
  if (!readyRenditions.length) return null;

  return (
    STATIC_RENDITION_PRIORITY.map((name) => readyRenditions.find((rendition) => rendition.name === name)).find(Boolean) ||
    readyRenditions[0]
  );
}

export function getVideoSource(medium) {
  if (!medium?.playbackId) return null;

  const hlsSource = getHlsSource(medium.playbackId);
  const duration = Number(medium.duration);
  const shouldStream = Number.isFinite(duration) && duration > STREAMING_DURATION_THRESHOLD;

  if (shouldStream) return hlsSource;

  const staticRendition = getPreferredStaticRendition(medium);
  if (!staticRendition) return hlsSource;

  return {
    type: "static",
    url: `https://stream.mux.com/${medium.playbackId}/${staticRendition.name}`,
  };
}

export function getVideoUrl(medium) {
  return getVideoSource(medium)?.url || null;
}
