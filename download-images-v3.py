import requests
import os
import time
import re

# File description page URLs (not thumbnail URLs)
file_pages = {
    'peter-childhood.jpg': 'https://commons.wikimedia.org/wiki/File:Peter_the_Great_as_a_child.jpg',
    'sophia-regent.jpg': 'https://commons.wikimedia.org/wiki/File:Sophia_Alekseyevna_of_Russia.jpg',
    'peter-holland.jpg': 'https://commons.wikimedia.org/wiki/File:Peter_I_in_Holland.jpg',
    'battle-poltava.jpg': 'https://commons.wikimedia.org/wiki/File:Battle_of_Poltava_by_Dennis_Martin_Berka.jpg',
    'spb-founding.jpg': 'https://commons.wikimedia.org/wiki/File:Peter_and_Paul_Fortress_founding.jpg',
    'peter-emperor.jpg': 'https://commons.wikimedia.org/wiki/File:Peter_I_of_Russia_by_Jean-Marc_Nattier.jpg',
    'peter-deathbed.jpg': 'https://commons.wikimedia.org/wiki/File:Peter_the_Great_on_his_deathbed.jpg',
    'peter-preobrazhensky.jpg': 'https://commons.wikimedia.org/wiki/File:Peter_I_preobrazhensky_regiment.jpg',
    'russian-empire-1725.png': 'https://commons.wikimedia.org/wiki/File:Russian_Empire_1725.png',
    'senate-synod.jpg': 'https://commons.wikimedia.org/wiki/File:Senate_and_Synod_building.jpg',
    'twelve-collegia.jpg': 'https://commons.wikimedia.org/wiki/File:Twelve_Collegia_building.jpg',
    'table-of-ranks.jpg': 'https://commons.wikimedia.org/wiki/File:Table_of_Ranks.jpg',
    'spiritual-regulation.jpg': 'https://commons.wikimedia.org/wiki/File:Spiritual_Regulation.jpg',
    'battle-narva.jpg': 'https://commons.wikimedia.org/wiki/File:Battle_of_Narva.jpg',
    'battle-erastfer.jpg': 'https://commons.wikimedia.org/wiki/File:Battle_of_Erastfer.jpg',
    'battle-lesnaya.jpg': 'https://commons.wikimedia.org/wiki/File:Battle_of_Lesnaya.jpg',
    'battle-gangut.jpg': 'https://commons.wikimedia.org/wiki/File:Battle_of_Gangut.jpg',
    'battle-grengam.jpg': 'https://commons.wikimedia.org/wiki/File:Battle_of_Grengam.jpg',
    'demidov-factory.jpg': 'https://commons.wikimedia.org/wiki/File:Demidov_factory.jpg',
    'navigation-school.jpg': 'https://commons.wikimedia.org/wiki/File:Navigation_School_Moscow.jpg',
    'vedomosti.jpg': 'https://commons.wikimedia.org/wiki/File:Vedomosti_newspaper.jpg',
    'kunstkamera.jpg': 'https://commons.wikimedia.org/wiki/File:Kunstkamera_building.jpg',
    'academy-sciences.jpg': 'https://commons.wikimedia.org/wiki/File:Academy_of_Sciences_St_Petersburg.jpg',
    'julian-calendar.jpg': 'https://commons.wikimedia.org/wiki/File:Julian_calendar_reform.jpg',
    'peter-assembly.jpg': 'https://commons.wikimedia.org/wiki/File:Peter_I_assembly.jpg',
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

def extract_file_url(html, filename):
    """Extract the direct file URL from the file description page"""
    # Look for the full resolution file link
    patterns = [
        r'href="(//upload\.wikimedia\.org/wikipedia/commons/[^"]*' + re.escape(filename.split('.')[0]) + r'[^"]*)"',
        r'href="(/wiki/Special:Redirect/file/[^"]*)"',
        r'href="(https://upload\.wikimedia\.org/wikipedia/commons/[^"]*)"',
    ]
    for pattern in patterns:
        matches = re.findall(pattern, html)
        if matches:
            url = matches[0]
            if url.startswith('//'):
                return 'https:' + url
            elif url.startswith('/'):
                return 'https://commons.wikimedia.org' + url
            else:
                return url
    return None

for filename, page_url in file_pages.items():
    dest_path = os.path.join(dest_dir, filename)
    try:
        # First get the file description page
        print(f"Fetching page for {filename}...")
        page_response = session.get(page_url, timeout=30)
        if page_response.status_code != 200:
            print(f"  FAIL page: HTTP {page_response.status_code}")
            continue
        
        # Extract direct file URL
        file_url = extract_file_url(page_response.text, filename)
        if not file_url:
            # Try the full resolution link pattern
            full_res_pattern = r'href="(/wiki/Special:Redirect/file/[^"]*)"'
            matches = re.findall(full_res_pattern, page_response.text)
            if matches:
                file_url = 'https://commons.wikimedia.org' + matches[0]
        
        if not file_url:
            print(f"  Could not extract file URL")
            continue
        
        print(f"  Downloading from: {file_url}")
        # Download the actual file
        file_response = session.get(file_url, timeout=60, stream=True, allow_redirects=True)
        if file_response.status_code == 200:
            with open(dest_path, 'wb') as f:
                for chunk in file_response.iter_content(chunk_size=8192):
                    f.write(chunk)
            size = os.path.getsize(dest_path)
            print(f"  OK: {filename} ({size} bytes)")
        else:
            print(f"  FAIL file: HTTP {file_response.status_code}")
    except Exception as e:
        print(f"  FAIL: {filename} - {e}")
    time.sleep(2)  # Longer delay to avoid rate limiting