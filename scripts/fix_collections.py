import os

col_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'client', 'src', 'pages', 'Collections.jsx'))

with open(col_path, 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

text = text.replace('title="The LumiA"re Collections"', 'title="The Lumière Collections"')
text = text.replace("Explore Collection +'", "Explore Collection →")
text = text.replace("The LumiA\"re Collections", "The Lumière Collections")
text = text.replace("The Lumi\ufffdre Collections", "The Lumière Collections")

with open(col_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Collections.jsx updated successfully!")
