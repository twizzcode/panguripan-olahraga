function getYouTubeVideoId(url: URL) {
  const hostname = url.hostname.replace(/^www\./, "");

  if (hostname === "youtu.be") {
    return url.pathname.split("/").filter(Boolean)[0] ?? null;
  }

  if (hostname === "youtube.com" || hostname === "m.youtube.com") {
    if (url.pathname === "/watch") {
      return url.searchParams.get("v");
    }

    if (url.pathname.startsWith("/embed/")) {
      return url.pathname.split("/").filter(Boolean)[1] ?? null;
    }

    if (url.pathname.startsWith("/shorts/")) {
      return url.pathname.split("/").filter(Boolean)[1] ?? null;
    }
  }

  return null;
}

export function normalizeVideoUrl(input: string) {
  try {
    const url = new URL(input);
    const videoId = getYouTubeVideoId(url);

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return input;
  } catch {
    return input;
  }
}
