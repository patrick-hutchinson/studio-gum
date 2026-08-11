const ALLOWED_HOSTNAME = "cdn.sanity.io";
const ALLOWED_PATH_PREFIX = "/images/";

export default async function handler(req, res) {
  const source = Array.isArray(req.query.url) ? req.query.url[0] : req.query.url;

  if (!source) {
    res.status(400).json({ error: "Missing image URL" });
    return;
  }

  let sourceUrl;

  try {
    sourceUrl = new URL(source);
  } catch {
    res.status(400).json({ error: "Invalid image URL" });
    return;
  }

  const isAllowedImage =
    sourceUrl.protocol === "https:" &&
    sourceUrl.hostname === ALLOWED_HOSTNAME &&
    sourceUrl.pathname.startsWith(ALLOWED_PATH_PREFIX);

  if (!isAllowedImage) {
    res.status(400).json({ error: "Unsupported image URL" });
    return;
  }

  const response = await fetch(sourceUrl);

  if (!response.ok) {
    res.status(response.status).json({ error: "Could not fetch image" });
    return;
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";

  if (!contentType.startsWith("image/")) {
    res.status(400).json({ error: "URL did not return an image" });
    return;
  }

  const imageBuffer = Buffer.from(await response.arrayBuffer());

  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.send(imageBuffer);
}
