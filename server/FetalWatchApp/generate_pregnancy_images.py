from PIL import Image, ImageDraw, ImageFont
import os

base_path = r'c:\Users\LENOVO\Documents\GitHub\FetalWatch\FetalWatchApp\assets\pregnancy-stages'

for i in range(1, 41):
    # Create a new white image
    img = Image.new('RGB', (500, 500), color='white')
    
    # Create a drawing context
    d = ImageDraw.Draw(img)
    
    # Use a default font
    font = ImageFont.truetype("arial.ttf", 72)
    
    # Draw the week number
    d.text((50, 200), f'Week {i}', fill=(0,0,0), font=font)
    
    # Save the image
    img.save(os.path.join(base_path, f'week-{i}.png'))

print("Images generated successfully!")
