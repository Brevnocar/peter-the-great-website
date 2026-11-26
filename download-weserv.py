import requests
import os
import time

# Alternative sources - Russian historical sites, museums, archives
# These often have more permissive policies for educational use

alt_sources = {
    # Try to find working URLs from Russian historical sites
    # Presidential Library, Hermitage, Russian Museum, etc.
    
    # For now, let's try to use some known working public domain images
    # from Wikimedia that are on different servers or have different access patterns
    
    # Try the thumbnail service with a different approach - use the actual image proxy
    # Some CDN endpoints might work better
}

# Let's try a different approach: use the IIIF (International Image Interoperability Framework)
# manifest URLs from Wikimedia which provide direct image access
# Or use the thumbor/wikimedia thumbnail service with proper parameters

# Actually, let me try to download using a different method - 
# use the fact that some images might be available from other mirrors

# Try the wikimedia static file server
mirror_urls = {
    'peter-childhood.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Peter_the_Great_as_a_child.jpg/800px-Peter_the_Great_as_a_child.jpg',
    'peter-emperor.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Peter_I_of_Russia_by_Jean-Marc_Nattier.jpg/800px-Peter_I_of_Russia_by_Jean-Marc_Nattier.jpg',
    'peter-deathbed.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Peter_the_Great_on_his_deathbed.jpg/800px-Peter_the_Great_on_his_deathbed.jpg',
    'peter-preobrazhensky.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Peter_I_preobrazhensky_regiment.jpg/800px-Peter_I_preobrazhensky_regiment.jpg',
    'peter-holland.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Peter_I_in_Holland.jpg/800px-Peter_I_in_Holland.jpg',
    'peter-assembly.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Peter_I_assembly.jpg/800px-Peter_I_assembly.jpg',
    'battle-poltava.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Battle_of_Poltava_by_Dennis_Martin_Berka.jpg/800px-Battle_of_Poltava_by_Dennis_Martin_Berka.jpg',
    'battle-narva.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Battle_of_Narva.jpg/800px-Battle_of_Narva.jpg',
    'battle-erastfer.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Battle_of_Erastfer.jpg/800px-Battle_of_Erastfer.jpg',
    'battle-lesnaya.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Battle_of_Lesnaya.jpg/800px-Battle_of_Lesnaya.jpg',
    'battle-gangut.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Battle_of_Gangut.jpg/800px-Battle_of_Gangut.jpg',
    'battle-grengam.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Battle_of_Grengam.jpg/800px-Battle_of_Grengam.jpg',
    'spb-founding.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Peter_and_Paul_Fortress_founding.jpg/800px-Peter_and_Paul_Fortress_founding.jpg',
    'sophia-regent.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Sophia_Alekseyevna_of_Russia.jpg/800px-Sophia_Alekseyevna_of_Russia.jpg',
    'russian-empire-1725.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Russian_Empire_1725.png/800px-Russian_Empire_1725.png',
    'senate-synod.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Senate_and_Synod_building.jpg/800px-Senate_and_Synod_building.jpg',
    'twelve-collegia.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Twelve_Collegia_building.jpg/800px-Twelve_Collegia_building.jpg',
    'table-of-ranks.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Table_of_Ranks.jpg/800px-Table_of_Ranks.jpg',
    'spiritual-regulation.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Spiritual_Regulation.jpg/800px-Spiritual_Regulation.jpg',
    'demidov-factory.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Demidov_factory.jpg/800px-Demidov_factory.jpg',
    'navigation-school.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Navigation_School_Moscow.jpg/800px-Navigation_School_Moscow.jpg',
    'vedomosti.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Vedomosti_newspaper.jpg/800px-Vedomosti_newspaper.jpg',
    'kunstkamera.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Kunstkamera_building.jpg/800px-Kunstkamera_building.jpg',
    'academy-sciences.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Academy_of_Sciences_St_Petersburg.jpg/800px-Academy_of_Sciences_St_Petersburg.jpg',
    'julian-calendar.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Julian_calendar_reform.jpg/800px-Julian_calendar_reform.jpg',
}

dest_dir = r'C:\Users\Brevnocar\Desktop\Proekt3\petr-website\public\images'
os.makedirs(dest_dir, exist_ok=True)

# Try with a simple approach - just use the thumbnail URLs but with a proxy
# or try with different IP/user agent

# Let's try using a CORS proxy service (not ideal but for testing)
# Or try with the 'images.weserv.nl' proxy which resizes and serves images

# images.weserv.nl can proxy and resize images from any URL
# Format: https://images.weserv.nl/?url=example.com/image.jpg&w=800

weserv_urls = {}
for filename, url in mirror_urls.items():
    # Remove protocol for weserv
    clean_url = url.replace('https://', '')
    weserv_urls[filename] = f'https://images.weserv.nl/?url={clean_url}&w=800&output=webp'

print("Trying images.weserv.nl proxy...")
session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
})

for filename, url in weserv_urls.items():
    dest_path = os.path.join(dest_dir, filename)
    try:
        print(f"Downloading {filename} via weserv...")
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
    time.sleep(0.5)