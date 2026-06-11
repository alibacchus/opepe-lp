// 巨大PNGを表示サイズ相当にダウンスケール（LCP対策）。node標準zlibのみ。
// sips/ImageMagickがサンドボックスで使えないため自作。box-samplingで縮小。
import { readFileSync, writeFileSync } from "node:fs";
import zlib from "node:zlib";

function decodePNG(buf) {
  let p = 8, width = 0, height = 0, bitDepth = 0, colorType = 0;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p); p += 4;
    const type = buf.toString("ascii", p, p + 4); p += 4;
    const data = buf.subarray(p, p + len); p += len + 4;
    if (type === "IHDR") { width = data.readUInt32BE(0); height = data.readUInt32BE(4); bitDepth = data[8]; colorType = data[9]; }
    else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
  }
  if (bitDepth !== 8) throw new Error("bitDepth " + bitDepth);
  const ch = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 0 ? 1 : null;
  if (!ch) throw new Error("colorType " + colorType);
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * ch, out = Buffer.alloc(width * height * 4), prev = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = Buffer.from(raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride));
    for (let i = 0; i < stride; i++) {
      const a = i >= ch ? line[i - ch] : 0, b = prev[i], c = i >= ch ? prev[i - ch] : 0; let v = line[i];
      if (filter === 1) v = (v + a) & 255; else if (filter === 2) v = (v + b) & 255;
      else if (filter === 3) v = (v + ((a + b) >> 1)) & 255;
      else if (filter === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255; }
      line[i] = v;
    }
    line.copy(prev);
    for (let x = 0; x < width; x++) {
      const si = x * ch, di = (y * width + x) * 4;
      if (ch === 1) { out[di] = out[di+1] = out[di+2] = line[si]; out[di+3] = 255; }
      else { out[di] = line[si]; out[di+1] = line[si+1]; out[di+2] = line[si+2]; out[di+3] = ch === 4 ? line[si+3] : 255; }
    }
  }
  return { width, height, data: out };
}
const CRC = (() => { const t = new Int32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; } return t; })();
function crc32(b) { let c = ~0; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return ~c; }
function encodePNG(width, height, rgba) {
  const stride = width * 4, raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  const idat = zlib.deflateSync(raw, { level: 9 });
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const body = Buffer.concat([Buffer.from(t), d]); const cr = Buffer.alloc(4); cr.writeUInt32BE(crc32(body) >>> 0); return Buffer.concat([l, body, cr]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(width, 0); ih.writeUInt32BE(height, 4); ih[8] = 8; ih[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ih), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}
// box-sampling 縮小
function downscale(img, tw) {
  const scale = tw / img.width, th = Math.round(img.height * scale);
  const out = Buffer.alloc(tw * th * 4);
  const sx = img.width / tw, sy = img.height / th;
  for (let y = 0; y < th; y++) {
    for (let x = 0; x < tw; x++) {
      const x0 = Math.floor(x * sx), x1 = Math.min(img.width, Math.ceil((x + 1) * sx));
      const y0 = Math.floor(y * sy), y1 = Math.min(img.height, Math.ceil((y + 1) * sy));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) {
        const si = (yy * img.width + xx) * 4;
        r += img.data[si]; g += img.data[si + 1]; b += img.data[si + 2]; a += img.data[si + 3]; n++;
      }
      const di = (y * tw + x) * 4;
      out[di] = (r / n) | 0; out[di + 1] = (g / n) | 0; out[di + 2] = (b / n) | 0; out[di + 3] = (a / n) | 0;
    }
  }
  return { width: tw, height: th, data: out };
}

const jobs = [
  ["action-photo.png", 1600],  // CTA背景（フルブリード）→ 1600幅
  ["problem-photo.png", 1600], // Problem背景（フルブリード）→ 1600幅
];
const dir = decodeURIComponent(new URL("../public/assets/", import.meta.url).pathname);
for (const [file, tw] of jobs) {
  const img = decodePNG(readFileSync(dir + file));
  if (img.width <= tw) { console.log(file + " はすでに小さい（skip）"); continue; }
  const small = downscale(img, tw);
  const before = readFileSync(dir + file).length;
  writeFileSync(dir + file, encodePNG(small.width, small.height, small.data));
  const after = readFileSync(dir + file).length;
  console.log(`${file}: ${img.width}x${img.height}(${Math.round(before/1024)}KB) -> ${small.width}x${small.height}(${Math.round(after/1024)}KB)`);
}
