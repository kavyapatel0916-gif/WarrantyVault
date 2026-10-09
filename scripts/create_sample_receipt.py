import os
from PIL import Image, ImageDraw, ImageFont

def generate_sample_receipt(output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    width = 600
    height = 800
    image = Image.new('RGB', (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(image)

    # Use default font or basic load_default font
    font = ImageFont.load_default()

    lines = [
        "========================================",
        "      TECHNOVA ELECTRONICS RETAIL       ",
        "         Connaught Place, New Delhi     ",
        "           GSTIN: 07AAAAA0000A1Z5       ",
        "========================================",
        "",
        "TAX INVOICE / RETAIL CASH MEMO",
        "Invoice No: TNV-2024-8841",
        "Date: 2024-11-20",
        "Customer: Demo Student",
        "----------------------------------------",
        "ITEM DESCRIPTION                 PRICE  ",
        "----------------------------------------",
        "Dell Inspiron 15 3520 Laptop    44,000  ",
        "Model: INSP-3520-i5-16GB                ",
        "Serial No: SN-DELL-98241762             ",
        "Warranty Duration: 12 Months            ",
        "----------------------------------------",
        "Subtotal:                    INR 44,000 ",
        "GST @ 18%:                   INR  8,800 ",
        "Store Discount:             -INR  3,810 ",
        "----------------------------------------",
        "TOTAL AMOUNT PAID:           INR 48,990 ",
        "========================================",
        "",
        "Payment Mode: UPI / Card",
        "Thank you for shopping with TechNova!",
        "Keep this receipt for warranty claims.",
        "========================================"
    ]

    y = 40
    for line in lines:
        draw.text((40, y), line, fill=(0, 0, 0), font=font)
        y += 24

    image.save(output_path)
    print(f"Sample receipt saved to {output_path}")

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_file = os.path.join(script_dir, 'sample-receipt.png')
    generate_sample_receipt(out_file)
