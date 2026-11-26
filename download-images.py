import requests
import os
import time

images = {
    'peter-childhood.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Peter_the_Great_as_a_child.jpg/800px-Peter_the_Great_as_a_child.jpg',
    'sophia-regent.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Sophia_Alekseyevna_of_Russia.jpg/800px-Sophia_Alekseyevna_of_Russia.jpg',
    'peter-holland.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Peter_I_in_Holland.jpg/800px-Peter_I_in_Holland.jpg',
    'battle-poltava.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Battle_of_Poltava_by_Dennis_Martin_Berka.jpg/800px-Battle_of_Poltava_by_Dennis_Martin_Berka.jpg',
    'spb-founding.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Peter_and_Paul_Fortress_founding.jpg/800px-Peter_and_Paul_Fortress_founding.jpg',
    'peter-emperor.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Peter_I_of_Russia_by_Jean-Marc_Nattier.jpg/800px-Peter_I_of_Russia_by_Jean-Marc_Nattier.jpg',
    'peter-deathbed.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Peter_the_Great_on_his_deathbed.jpg/800px-Peter_the_Great_on_his_deathbed.jpg',
    'peter-preobrazhensky.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Peter_I_preobrazhensky_regiment.jpg/800px-Peter_I_preobrazhensky_regiment.jpg',
    'russian-empire-1725.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Russian_Empire_1725.png/800px-Russian_Empire_1725.png',
    'senate-synod.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Senate_and_Synod_building.jpg/800px-Senate_and_Synod_building.jpg',
    'twelve-collegia.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Twelve_Collegia_building.jpg/800px-Twelve_Collegia_building.jpg',
    'table-of-ranks.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Table_of_Ranks.jpg/800px-Table_of_Ranks.jpg',
    'spiritual-regulation.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Spiritual_Regulation.jpg/800px-Spiritual_Regulation.jpg',
    'battle-narva.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Battle_of_Narva.jpg/800px-Battle_of_Narva.jpg',
    'battle-erastfer.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Battle_of_Erastfer.jpg/800px-Battle_of_Erastfer.jpg',
    'battle-lesnaya.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Battle_of_Lesnaya.jpg/800px-Battle_of_Lesnaya.jpg',
    'battle-gangut.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Battle_of_Gangut.jpg/800px-Battle_of_Gangut.jpg',
    'battle-grengam.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Battle_of_Grengam.jpg/800px-Battle_of_Grengam.jpg',
    'demidov-factory.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Demidov_factory.jpg/800px-Demidov_factory.jpg',
    'navigation-school.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Navigation_School_Moscow.jpg/800px-Navigation_School_Moscow.jpg',
    'vedomosti.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Vedomosti_newspaper.jpg/800px-Vedomosti_newspaper.jpg',
    'kunstkamera.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Kunstkamera_building.jpg/800px-Kunstkamera_building.jpg',
    'academy-sciences.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Academy_of_Sciences_St_Petersburg.jpg/800px-Academy_of_Sciences_St_Petersburg.jpg',
    'julian-calendar.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Julian_calendar_reform.jpg/800px-Julian_calendar_reform.jpg',
    'peter-assembly.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Peter_I_assembly.jpg/800px-Peter_I_assembly.jpg',
}

dest_dir = r'C:\Users\Brevnocar\Desktop\Proekt3\petr-website\public\images'
os.makedirs(dest_dir, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://commons.wikimedia.org/',
}

session = requests.Session()
session.headers.update(headers)

for filename, url in images.items():
    dest_path = os.path.join(dest_dir, filename)
    try:
        response = session.get(url, timeout=30, stream=True)
        if response.status_code == 200:
            with open(dest_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            size = os.path.getsize(dest_path)
            print(f"OK: {filename} ({size} bytes)")
        else:
            print(f"FAIL: {filename} - HTTP {response.status_code}")
    except Exception as e:
        print(f"FAIL: {filename} - {e}")
    time.sleep(0.5)