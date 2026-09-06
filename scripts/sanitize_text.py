import os

src_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'client', 'src'))

replacements = [
    ('LumiA"re', 'Lumière'),
    ('LumiA”re', 'Lumière'),
    ('LUMIA^RE', 'LUMIÈRE'),
    ('LUMIÃˆRE', 'LUMIÈRE'),
    ('LumiÃ¨re', 'Lumière'),
    ('Lumi\ufffdre', 'Lumière'),
    ('LUMI\ufffdRE', 'LUMIÈRE'),
    ('PavAc', 'Pavé'),
    ('Pav\ufffd', 'Pavé'),
    ('₹150,000', '₹50,000'),
]

fixed = []
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith(('.jsx', '.js', '.css', '.html')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='replace') as fh:
                content = fh.read()
            original = content
            for old, new in replacements:
                content = content.replace(old, new)
            if content != original:
                with open(p, 'w', encoding='utf-8') as fh:
                    fh.write(content)
                fixed.append(os.path.relpath(p, src_dir))

print(f"Sanitized {len(fixed)} files: {fixed}")
