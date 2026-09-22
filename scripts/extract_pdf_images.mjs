import fs from 'fs';
import path from 'path';

const pdfDir = 'C:\\Users\\Anbarasan Suruliraj\\.gemini\\antigravity-ide\\brain\\0d0d2026-50f0-4706-8c71-4584b7ac2b9b\\.user_uploaded';
const outputDir = 'd:\\project\\sum\\public\\images\\atl';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));

files.forEach((file, fIdx) => {
  const buf = fs.readFileSync(path.join(pdfDir, file));
  let imgCount = 0;
  let i = 0;
  while (i < buf.length - 3) {
    // Look for JPEG SOI: FF D8 FF
    if (buf[i] === 0xFF && buf[i + 1] === 0xD8 && buf[i + 2] === 0xFF) {
      const start = i;
      let end = -1;
      for (let j = start + 2; j < buf.length - 1; j++) {
        // Look for JPEG EOI: FF D9
        if (buf[j] === 0xFF && buf[j + 1] === 0xD9) {
          end = j + 2;
          break;
        }
      }
      if (end !== -1 && (end - start) > 10000) { // filter out thumbnails < 10KB
        imgCount++;
        const imgBuf = buf.subarray(start, end);
        const outName = `atl-doc${fIdx + 1}-img${imgCount}.jpg`;
        fs.writeFileSync(path.join(outputDir, outName), imgBuf);
        console.log(`Extracted: ${outName} (${Math.round(imgBuf.length / 1024)} KB)`);
        i = end;
        continue;
      }
    }
    i++;
  }
});
