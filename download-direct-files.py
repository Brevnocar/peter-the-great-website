import requests
import os
import time

# Correct direct file URLs (not thumbnails) based on MD5 hash paths
file_urls = {
    'peter-childhood.jpg': 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Peter_the_Great_as_a_child.jpg',
    'peter-emperor.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Peter_I_of_Russia_by_Jean-Marc_Nattier.jpg',
    'peter-deathbed.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/69/Peter_the_Great_on_his_deathbed.jpg',
    'peter-preobrazhensky.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Peter_I_preobrazhensky_regiment.jpg',
    'peter-holland.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/48/Peter_I_in_Holland.jpg',
    'peter-assembly.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Peter_I_assembly.jpg',
    'battle-poltava.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Battle_of_Poltava_by_Dennis_Martin_Berka.jpg',
    'battle-narva.jpg': 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Battle_of_Narva.jpg',
    'battle-erastfer.jpg': 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Battle_of_Erastfer.jpg',
    'battle-lesnaya.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Battle_of_Lesnaya.jpg',
    'battle-gangut.jpg': 'https://upload.wikimedia.org/wikipedia/commons/1/16/Battle_of_Gangut.jpg',
    'battle-grengam.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Battle_of_Grengam.jpg',
    'spb-founding.jpg': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Peter_and_Paul_Fortress_founding.jpg',
    'sophia-regent.jpg': 'https://upload.wikimedia.org/wikipedia/commons/0/04/Sophia_Alekseyevna_of_Russia.jpg',
    'russian-empire-1725.png': 'https://upload.wikimedia.org/wikipedia/commons/2/21/Russian_Empire_1725.png',
    'senate-synod.jpg': 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Senate_and_Synod_building.jpg',
    'twelve-collegia.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Twelve_Collegia_building.jpg',
    'table-of-ranks.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Table_of_Ranks.jpg',
    'spiritual-regulation.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/43/Spiritual_Regulation.jpg',
    'demidov-factory.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Demidov_factory.jpg',
    'navigation-school.jpg': 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Navigation_School_Moscow.jpg',
    'vedomosti.jpg': 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Vedomosti_newspaper.jpg',
    'kunstkamera.jpg': 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Kunstkamera_building.jpg',
    'academy-sciences.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/85/Academy_of_Sciences_St_Petersburg.jpg',
    'julian-calendar.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Julian_calendar_reform.jpg',
}

dest_dir = r'C:\Users\Brevnocar\Desktop\Proekt3\petr-website\public\images'
os.makedirs(dest_dir, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Referer': 'https://commons.wikimedia.org/',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
}

session = requests.Session()
session.headers.update(headers)

print("Downloading direct file URLs...")
for filename, url in file_urls.items():
    dest_path = os.path.join(dest_dir, filename)
    try:
        print(f"Downloading {filename}...")
        response = session.get(url, timeout=60, stream=True)
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