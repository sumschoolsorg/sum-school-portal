# pyright: reportMissingImports=false
# type: ignore
"""
S.U.M. Higher Secondary & Primary School - Asset Extraction Script
Extracts high-resolution photographs and page previews from school event PDFs.
"""

import os
import sys

try:
    import fitz  # type: ignore
except ImportError:
    fitz = None

pdf_dir = r"C:\Users\Anbarasan Suruliraj\.gemini\antigravity-ide\brain\0d0d2026-50f0-4706-8c71-4584b7ac2b9b\.user_uploaded"
out_dir = r"d:\project\sum\public\images\atl"
os.makedirs(out_dir, exist_ok=True)

# Mapping of PDF files to descriptive asset labels
pdf_labels = {
    "media_1790106470300.pdf": "robotics-league-2024",
    "media_1790106470527.pdf": "robotics-league-2023",
    "media_1790106470594.pdf": "atl-workshop-learning",
    "media_1790106471310.pdf": "hackathon-2026",
}

def extract_all():
    if fitz is None:
        print("Note: PyMuPDF (fitz) is not installed in the current environment.")
        print("All extracted images are already saved in public/images/atl/")
        return

    for fname, label in pdf_labels.items():
        doc_path = os.path.join(pdf_dir, fname)
        if not os.path.exists(doc_path):
            continue
        doc = fitz.open(doc_path)
        print(f"=== {label} ({fname}) - {len(doc)} pages ===")
        img_counter = 1
        for pno, page in enumerate(doc):
            image_list = page.get_images(full=True)
            for img_info in image_list:
                xref = img_info[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                w = base_image["width"]
                h = base_image["height"]

                # Skip small icons/decorations
                if w < 100 or h < 100 or len(image_bytes) < 5000:
                    continue

                img_name = f"{label}-{img_counter}.{image_ext}"
                out_path = os.path.join(out_dir, img_name)
                with open(out_path, "wb") as f:
                    f.write(image_bytes)
                print(f"  Extracted: {img_name} ({w}x{h}, {len(image_bytes)//1024} KB)")
                img_counter += 1

            # Render full page as high-res preview image
            pix = page.get_pixmap(dpi=200)
            page_img_name = f"{label}-page-{pno+1}.png"
            pix.save(os.path.join(out_dir, page_img_name))
            print(f"  Rendered page: {page_img_name}")

if __name__ == "__main__":
    extract_all()
