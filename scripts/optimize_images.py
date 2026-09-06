import os
import glob
from PIL import Image

def optimize_and_generate_variants(src_dir, dest_dir):
    os.makedirs(dest_dir, exist_ok=True)
    images = glob.glob(os.path.join(src_dir, '*.jpg')) + glob.glob(os.path.join(src_dir, '*.jpeg')) + glob.glob(os.path.join(src_dir, '*.png'))
    
    print(f"Processing {len(images)} images from {src_dir} to {dest_dir}...")
    
    for img_path in sorted(images):
        filename = os.path.basename(img_path)
        base_name, _ = os.path.splitext(filename)
        
        with Image.open(img_path) as img:
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                converted_img = img.convert('RGBA')
            else:
                converted_img = img.convert('RGB')
            
            orig_w, orig_h = converted_img.size
            
            # 1. Base WebP (Full size)
            base_out = os.path.join(dest_dir, f"{base_name}.webp")
            converted_img.save(base_out, 'WEBP', quality=88, method=6)
            
            # 2. Responsive widths: 400, 800, 1200
            for target_w in [400, 800, 1200]:
                if orig_w >= target_w:
                    target_h = int(orig_h * (target_w / orig_w))
                    resized = converted_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
                else:
                    resized = converted_img
                
                out_path = os.path.join(dest_dir, f"{base_name}-{target_w}.webp")
                if target_w == 400:
                    q = 82  # Target: 20-60 KB
                elif target_w == 800:
                    q = 85  # Target: 40-100 KB
                else:
                    q = 88  # Target: 80-180 KB
                    
                resized.save(out_path, 'WEBP', quality=q, method=6)
                
            print(f"? {base_name}: base={os.path.getsize(base_out)/1024:.1f}KB, 400w={os.path.getsize(os.path.join(dest_dir, f'{base_name}-400.webp'))/1024:.1f}KB, 800w={os.path.getsize(os.path.join(dest_dir, f'{base_name}-800.webp'))/1024:.1f}KB, 1200w={os.path.getsize(os.path.join(dest_dir, f'{base_name}-1200.webp'))/1024:.1f}KB")

if __name__ == '__main__':
    optimize_and_generate_variants('client/public/assets', 'client/public/assets')
    optimize_and_generate_variants('assets', 'assets')
