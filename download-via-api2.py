import requests
import os
import time

# Use Wikimedia API to get the actual file URLs
def get_file_url(filename):
    """Get the direct file URL from Wikimedia API"""
    api_url = 'https://commons.wikimedia.org/w/api.php'
    params = {
        'action': 'query',
        'titles': f'File:{filename}',
        'prop': 'imageinfo',
        'iiprop': 'url',
        'format': 'json',
        'formatversion': '2',
    }
    response = requests.get(api_url, params=params, timeout=30)
    print(f"  Response status: {response.status_code}")
    print(f"  Response text: {response.text[:200]}")
    if response.status_code != 200:
        return None
    try:
        data = response.json()
        pages = data.get('query', {}).get('pages', [])
        for page in pages:
            if 'imageinfo' in page:
                return page['imageinfo'][0]['url']
    except Exception as e:
        print(f"  JSON error: {e}")
    return None

# Filenames as they appear on Wikimedia (without File: prefix)
filenames = {
    'peter-childhood.jpg': 'Peter_the_Great_as_a_child.jpg',
    'peter-emperor.jpg': 'Peter_I_of_Russia_by_Jean-Marc_Nattier.jpg',
    'peter-deathbed.jpg': 'Peter_the_Great_on_his_deathbed.jpg',
    'peter-preobrazhensky.jpg': 'Peter_I_preobrazhensky_regiment.jpg',
    'peter-holland.jpg': 'Peter_I_in_Holland.jpg',
    'peter-assembly.jpg': 'Peter_I_assembly.jpg',
    'battle-poltava.jpg': 'Battle_of_Poltava_by_Dennis_Martin_Berka.jpg',
    'battle-narva.jpg': 'Battle_of_Narva.jpg',
    'battle-erastfer.jpg': 'Battle_of_Erastfer.jpg',
    'battle-lesnaya.jpg': 'Battle_of_Lesnaya.jpg',
    'battle-gangut.jpg': 'Battle_of_Gangut.jpg',
    'battle-grengam.jpg': 'Battle_of_Grengam.jpg',
    'spb-founding.jpg': 'Peter_and_Paul_Fortress_founding.jpg',
    'sophia-regent.jpg': 'Sophia_Alekseyevna_of_Russia.jpg',
    'russian-empire-1725.png': 'Russian_Empire_1725.png',
    'senate-synod.jpg': 'Senate_and_Synod_building.jpg',
    'twelve-collegia.jpg': 'Twelve_Collegia_building.jpg',
    'table-of-ranks.jpg': 'Table_of_Ranks.jpg',
    'spiritual-regulation.jpg': 'Spiritual_Regulation.jpg',
    'demidov-factory.jpg': 'Demidov_factory.jpg',
    'navigation-school.jpg': 'Navigation_School_Moscow.jpg',
    'vedomosti.jpg': 'Vedomosti_newspaper.jpg',
    'kunstkamera.jpg': 'Kunstkamera_building.jpg',
    'academy-sciences.jpg': 'Academy_of_Sciences_St_Petersburg.jpg',
    'julian-calendar.jpg': 'Julian_calendar_reform.jpg',
}

dest_dir = r'C:\Users\Brevnocar\Desktop\Proekt3\petr-website\public\images'
os.makedirs(dest_dir, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://commons.wikimedia.org/',
}

session = requests.Session()
session.headers.update(headers)

print("Getting file URLs via API...")
file_urls = {}
for local_name, wiki_name in filenames.items():
    url = get_file_url(wiki_name)
    if url:
        file_urls[local_name] = url
        print(f"  {local_name}: {url}")
    else:
        print(f"  {local_name}: NOT FOUND")
    time.sleep(0.5)

print("\nDownloading files...")
for local_name, url in file_urls.items():
    dest_path = os.path.join(dest_dir, local_name)
    try:
        print(f"Downloading {local_name}...")
        response = session.get(url, timeout=60, stream=True)
        if response.status_code == 200:
            with open(dest_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            size = os.path.getsize(dest_path)
            print(f"  OK: {local_name} ({size} bytes)")
        else:
            print(f"  FAIL: HTTP {response.status_code}")
    except Exception as e:
        print(f"  ERROR: {e}")
    time.sleep(1)