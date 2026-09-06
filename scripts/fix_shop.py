import os
import re

shop_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'client', 'src', 'pages', 'Shop.jsx'))

with open(shop_path, 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

# Fix stoneOptions and priceOptions
old_stone_pattern = r"const stoneOptions = \[.*?\];"
new_stone = "const stoneOptions = ['', 'Solitaire Diamond', 'Pavé Diamonds', 'Natural Polki', 'Sapphire & Emerald'];"
text = re.sub(old_stone_pattern, new_stone, text, flags=re.DOTALL)

old_price_pattern = r"const priceOptions = \[.*?\];"
new_price = """const priceOptions = [
    { label: 'All Price Tiers', value: '' },
    { label: 'Under ₹50,000', value: '0-50000' },
    { label: '₹50,000 – ₹1,50,000', value: '50000-150000' },
    { label: '₹1,50,000 – ₹3,00,000', value: '150000-300000' },
    { label: 'Above ₹3,00,000', value: '300000-9999999' },
  ];"""
text = re.sub(old_price_pattern, new_price, text, flags=re.DOTALL)

with open(shop_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated Shop.jsx priceOptions and stoneOptions successfully!")
