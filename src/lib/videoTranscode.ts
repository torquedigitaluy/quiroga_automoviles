import type { FFmpeg } from "@ffmpeg/ffmpeg";

// iPhones record video in HEVC (H.265) by default, which Chrome on Android often
// can't decode reliably (shows up as corrupted/glitchy playback on many devices).
// Every video picked in the admin panel is re-encoded to H.264 + AAC in the
// browser before upload, so the public site never serves an incompatible file.

const CORE_VERSION = "0.12.10";
const CORE_BASE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

let ffmpegPromise: Promise<FFmpeg> | null = null;

async function getFFmpeg(): Promise<FFmpeg> {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      console.log("[transcode] importing @ffmpeg/ffmpeg…");
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      console.log("[transcode] importing @ffmpeg/util…");
      const { toBlobURL } = await import("@ffmpeg/util");
      const ffmpeg = new FFmpeg();
      console.log("[transcode] fetching core JS…");
      const coreURL = await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.js`, "text/javascript");
      console.log("[transcode] fetching core WASM…");
      const wasmURL = await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.wasm`, "application/wasm");
      console.log("[transcode] loading ffmpeg core…");
      await ffmpeg.load({ coreURL, wasmURL });
      console.log("[transcode] ffmpeg core loaded");
      return ffmpeg;
    })();
  }
  return ffmpegPromise;
}

/**
 * Re-encodes a video file to H.264 (video) + AAC (audio) in an MP4 container —
 * the combination with the broadest browser/device compatibility. Falls back
 * to the original file if transcoding fails for any reason.
 */
export async function transcodeToH264(
  file: File,
  onProgress?: (pct: number) => void
): Promise<File> {
  try {
    const { fetchFile } = await import("@ffmpeg/util");
    const ffmpeg = await getFFmpeg();

    const inputExt = file.name.match(/\.[^.]+$/)?.[0] ?? ".mov";
    const inputName = `input${inputExt}`;
    const outputName = "output.mp4";

    const handleProgress = ({ progress }: { progress: number }) => {
      onProgress?.(Math.min(99, Math.max(0, Math.round(progress * 100))));
    };
    ffmpeg.on("progress", handleProgress);

    try {
      console.log("[transcode] writing input file…");
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      console.log("[transcode] running ffmpeg exec…");
      await ffmpeg.exec([
        "-i", inputName,
        "-c:v", "libx264",
        "-profile:v", "main",
        "-pix_fmt", "yuv420p",
        "-vf", "scale='min(1280,iw)':'min(1280,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
        "-crf", "23",
        "-preset", "veryfast",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        outputName,
      ]);
      console.log("[transcode] exec done, reading output…");
      const data = await ffmpeg.readFile(outputName);
      console.log("[transcode] output read, size:", (data as Uint8Array).length);
      const blob = new Blob([data as Uint8Array], { type: "video/mp4" });
      const baseName = file.name.replace(/\.[^.]+$/, "");
      onProgress?.(100);
      return new File([blob], `${baseName}.mp4`, { type: "video/mp4" });
    } finally {
      ffmpeg.off("progress", handleProgress);
      try { await ffmpeg.deleteFile(inputName); } catch { /* already gone */ }
      try { await ffmpeg.deleteFile(outputName); } catch { /* already gone */ }
    }
  } catch (err) {
    console.error("Video transcoding failed, uploading original file instead:", err);
    return file;
  }
}
