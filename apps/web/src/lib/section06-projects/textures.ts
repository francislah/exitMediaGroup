import * as THREE from "three";
import type { ProjectItem } from "./types";

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

export function createNoiseTexture(
  size: number,
  base: number,
  variation: number,
  repeatX: number,
  repeatY: number,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const noiseCanvas = document.createElement("canvas");
  noiseCanvas.width = size;
  noiseCanvas.height = size;
  const ctx = noiseCanvas.getContext("2d");
  if (!ctx) {
    const fallback = new THREE.CanvasTexture(noiseCanvas);
    fallback.colorSpace = THREE.NoColorSpace;
    return fallback;
  }

  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = Math.min(
      255,
      Math.max(0, Math.round(base + (Math.random() * 2 - 1) * variation)),
    );
    data[i] = n;
    data[i + 1] = n;
    data[i + 2] = n;
    data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(noiseCanvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

export function createCardTexture(
  project: ProjectItem,
  index: number,
  side: "front" | "back",
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const width = 1024;
  const height = 1600;
  const canvasEl = document.createElement("canvas");
  canvasEl.width = width;
  canvasEl.height = height;
  const ctx = canvasEl.getContext("2d");
  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvasEl);
    fallback.colorSpace = THREE.SRGBColorSpace;
    return fallback;
  }

  const baseGradient = ctx.createLinearGradient(0, 0, width, height);
  if (side === "front") {
    baseGradient.addColorStop(0, "#4b43a6");
    baseGradient.addColorStop(0.58, "#513a8d");
    baseGradient.addColorStop(1, "#5b356f");
  } else {
    baseGradient.addColorStop(0, "#2b315f");
    baseGradient.addColorStop(1, "#1b1f44");
  }
  ctx.fillStyle = baseGradient;
  ctx.fillRect(0, 0, width, height);

  drawRoundedRect(ctx, 14, 14, width - 28, height - 28, 64);
  ctx.save();
  ctx.clip();

  const sheen = ctx.createLinearGradient(0, 0, width, height);
  sheen.addColorStop(0, "rgba(255,255,255,0.12)");
  sheen.addColorStop(0.32, "rgba(255,255,255,0.02)");
  sheen.addColorStop(1, "rgba(0,0,0,0.16)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, width, height);

  const hotspot = ctx.createRadialGradient(
    width * 0.18,
    height * 0.1,
    20,
    width * 0.18,
    height * 0.1,
    width * 0.92,
  );
  hotspot.addColorStop(0, "rgba(255,255,255,0.13)");
  hotspot.addColorStop(0.34, "rgba(255,255,255,0.025)");
  hotspot.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = hotspot;
  ctx.fillRect(0, 0, width, height);

  const vignette = ctx.createRadialGradient(
    width * 0.5,
    height * 0.52,
    width * 0.2,
    width * 0.5,
    height * 0.52,
    width * 0.95,
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.24)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 4200; i += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const alpha = Math.random() * 0.09;
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
    ctx.fillRect(x, y, 1, 1);
  }

  ctx.restore();

  ctx.strokeStyle =
    side === "front"
      ? "rgba(247, 178, 98, 0.62)"
      : "rgba(214, 219, 255, 0.34)";
  ctx.lineWidth = 6;
  drawRoundedRect(ctx, 17, 17, width - 34, height - 34, 58);
  ctx.stroke();

  if (side === "front") {
    ctx.fillStyle = "rgba(220, 224, 255, 0.93)";
    ctx.strokeStyle = "rgba(220, 224, 255, 0.58)";
    ctx.lineWidth = 4;
    const chipX = 90;
    const chipY = 100;
    const chipW = 132;
    const chipH = 76;
    const chipR = 38;
    drawRoundedRect(ctx, chipX, chipY, chipW, chipH, chipR);
    ctx.stroke();

    ctx.font = '600 42px "Avenir Next", "Segoe UI", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      String(index + 1).padStart(2, "0"),
      chipX + chipW / 2,
      chipY + chipH / 2 + 2,
    );

    ctx.textAlign = "left";
    ctx.fillStyle = "#f0f2ff";
    ctx.shadowColor = "rgba(6, 8, 23, 0.62)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;

    const titleMax = width - 160;
    const taglineMax = width - 170;

    const writeWrapped = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number,
      maxLines: number,
    ) => {
      const words = String(text || "").split(/\s+/);
      const lines: string[] = [];
      let line = "";

      words.forEach((word) => {
        const trial = line ? `${line} ${word}` : word;
        if (ctx.measureText(trial).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = trial;
        }
      });

      if (line) lines.push(line);

      lines.slice(0, maxLines).forEach((entry, i) => {
        ctx.fillText(entry, x, y + i * lineHeight);
      });
    };

    ctx.font = '600 84px "Avenir Next", "Segoe UI", sans-serif';
    writeWrapped(project.name, 90, 314, titleMax, 98, 4);

    ctx.font = '500 58px "Avenir Next", "Segoe UI", sans-serif';
    ctx.fillStyle = "rgba(230, 234, 255, 0.9)";
    writeWrapped(project.tagline, 90, 820, taglineMax, 78, 4);
  } else {
    ctx.fillStyle = "rgba(227, 231, 255, 0.45)";
    ctx.strokeStyle = "rgba(227, 231, 255, 0.26)";
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, width * 0.24, height * 0.44, width * 0.52, 82, 41);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = '600 44px "Avenir Next", "Segoe UI", sans-serif';
    ctx.fillText("EXIT", width * 0.5, height * 0.44 + 42);
  }

  const texture = new THREE.CanvasTexture(canvasEl);
  texture.anisotropy = maxAnisotropy;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
