import requests
import os
import time

# Use known direct file URLs from Wikimedia Commons (not thumbnails)
# These are the actual file paths
file_urls = {
    # Peter portraits - using known filenames
    'peter-childhood.jpg': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Peter_the_Great_as_a_child.jpg',
    'peter-emperor.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Peter_I_of_Russia_by_Jean-Marc_Nattier.jpg',
    'peter-deathbed.jpg': 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Peter_the_Great_on_his_deathbed.jpg',
    'peter-preobrazhensky.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Peter_I_preobrazhensky_regiment.jpg',
    'peter-holland.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Peter_I_in_Holland.jpg',
    'peter-assembly.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Peter_I_assembly.jpg',
    
    # Historical scenes
    'battle-poltava.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Battle_of_Poltava_by_Dennis_Martin_Berka.jpg',
    'battle-narva.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Battle_of_Narva.jpg',
    'battle-erastfer.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Battle_of_Erastfer.jpg',
    'battle-lesnaya.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Battle_of_Lesnaya.jpg',
    'battle-gangut.jpg': 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Battle_of_Gangut.jpg',
    'battle-grengam.jpg': 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Battle_of_Grengam.jpg',
    'spb-founding.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Peter_and_Paul_Fortress_founding.jpg',
    
    # Other
    'sophia-regent.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/33/Sophia_Alekseyevna_of_Russia.jpg',
    'russian-empire-1725.png': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Russian_Empire_1725.png',
    'senate-synod.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Senate_and_Synod_building.jpg',
    'twelve-collegia.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Twelve_Collegia_building.jpg',
    'table-of-ranks.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Table_of_Ranks.jpg',
    'spiritual-regulation.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Spiritual_Regulation.jpg',
    'demidov-factory.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Demidov_factory.jpg',
    'navigation-school.jpg': 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Navigation_School_Moscow.jpg',
    'vedomosti.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Vedomosti_newspaper.jpg',
    'kunstkamera.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Kunstkamera_building.jpg',
    'academy-sciences.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Academy_of_Sciences_St_Petersburg.jpg',
    'julian-calendar.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Julian_calendar_reform.jpg',
}

dest_dir = r'C:\Users\Brevnocar\Desktop\Proekt3\petr-website\public\images'
os.makedirs(dest_dir, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://commons.wikimedia.org/',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
}

session = requests.Session()
session.headers.update(headers)

# First, let's test a few to see which ones work
test_urls = {
    'peter-childhood.jpg': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Peter_the_Great_as_a_child.jpg',
    'battle-poltava.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Battle_of_Poltava_by_Dennis_Martin_Berka.jpg',
    'peter-emperor.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Peter_I_of_Russia_by_Jean-Marc_Nattier.jpg',
}

print("Testing direct URLs...")
for filename, url in test_urls.items():
    dest_path = os.path.join(dest_dir, filename)
    try:
        print(f"Trying {filename}...")
        response = session.get(url, timeout=30, stream=True)
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            with open(dest_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            size = os.path.getsize(dest_path)
            print(f"  OK: {filename} ({size} bytes)")
        else:
            print(f"  FAIL: HTTP {response.status_code}")
    except Exception as e:
        print(f"  ERROR: {e}")
    time.sleep(1)