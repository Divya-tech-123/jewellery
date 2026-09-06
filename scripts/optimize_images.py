import os
import sys
from PIL import Image

"""
Lumière Fine Jewellery Image Optimization Pipeline
Generates high-fidelity WebP variants with optimal compression parameters:
- 320px  (~15–35 KB)  -> category avatars, small thumbnails
- 400px  (~20–45 KB)  -> legacy support
- 640px  (~40–80 KB)  -> 2-column mobile, product cards
- 800px  (~60–100 KB) -> tablet cards, legacy support
- 960px  (~80–130 KB) -> large product cards, editorial panels
- 1200px (~110–180 KB)-> hero banners, product zoom, high-res details
- Base WebP (default alias, ~90–150 KB)
"""

TARGET_DIRS = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets')),
    os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'client', 'public', 'assets')),
]

VARIANTS = [
    (320, 80),   # width, quality
    (400, 82),
    (640, 83),
    (800, 84),
    (960, 84),
    (1200, 85),
]

BASE_QUALITY = 84

def optimize_directory(directory_path):
    if not os.path.exists(directory_path):
        print(f"Directory not found: {directory_path}")
        return

    print(f"\n========================================================")
    print(f"Optimizing assets in: {directory_path}")
    print(f"========================================================")

    # Find all source JPGs
    jpg_files = [f for f in os.listdir(directory_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    if not jpg_files:
        print(f"No JPG/PNG source files found in {directory_path}")
        return

    for filename in sorted(jpg_files):
        source_path = os.path.join(directory_path, filename)
        orig_size = os.path.getsize(source_path)
        base_name = os.path.splitext(filename)[0]

        try:
            with Image.open(source_path) as img:
                # Convert RGBA / P to RGB if needed
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                
                orig_w, orig_h = img.size
                aspect = orig_h / orig_w

                # 1. Generate base WebP
                base_webp_path = os.path.join(directory_path, f"{base_name}.webp")
                if orig_w > 1200:
                    base_img = img.resize((1200, int(1200 * aspect)), Image.Resampling.LANCZOS)
                else:
                    base_img = img.copy()
                
                base_img.save(base_webp_path, 'WEBP', quality=BASE_QUALITY, method=6)
                base_size = os.path.getsize(base_webp_path)

                print(f"-> {base_name}:")
                print(f"   Original {filename}: {orig_size / 1024:.1f} KB ({orig_w}x{orig_h})")
                print(f"   Base .webp: {base_size / 1024:.1f} KB")

                # 2. Generate variant sizes (320, 400, 640, 800, 960, 1200)
                for width, quality in VARIANTS:
                    variant_path = os.path.join(directory_path, f"{base_name}-{width}.webp")
                    new_h = int(width * aspect)
                    resized = img.resize((width, new_h), Image.Resampling.LANCZOS)
                    resized.save(variant_path, 'WEBP', quality=quality, method=6)
                    v_size = os.path.getsize(variant_path)
                    print(f"     [{width}px WebP]: {v_size / 1024:.1f} KB")

        except Exception as e:
            print(f"   ERROR processing {filename}: {e}")

    print(f"\nOptimization complete for {directory_path}!")

def main():
    for d in TARGET_DIRS:
        optimize_directory(d)

if __name__ == '__main__':
    main()
