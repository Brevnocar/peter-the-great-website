import requests
import os
import time

# Alternative image sources - Russian historical sites, museums, archives
# These are more likely to allow direct access
alternative_sources = {
    # Peter I portraits - try Russian museum sites
    'peter-childhood.jpg': [
        'https://www.hermitagemuseum.org/wps/portal/hermitage/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8zijQxCnL0C7M09TRw9_A08jHz9jPwDnD09jLwMjQ1dDPULsh0VAZy9k4Q!!/dz/d5/L2dBISEvZ0FBIS9nQSEh/',
        # Use a known public domain image from a different source
    ],
    # Let's try some specific known working URLs from Russian historical sites
}

# Instead, let's try to use some known working public domain / CC0 image sources
# Wikimedia has a "commons.wikimedia.org" but let's try the "upload.wikimedia.org" with a different approach
# The issue is the thumbnail path structure. Let me try the actual file URLs with correct hash paths.

# Actually, let me try a completely different approach - use images from:
# 1. Russian Presidential Library (prlib.ru) - they have historical images
# 2. Russian State Historical Museum
# 3. Public domain collections

# For now, let's create a simple script that tries to find working URLs by checking
# a few known patterns for Wikimedia file paths.

# The hash path for Wikimedia files is based on MD5 of filename
# First 1 char / first 2 chars / filename
# e.g. Peter_the_Great_as_a_child.jpg -> MD5 = 7b... -> path = 7/7b/Peter_the_Great_as_a_child.jpg

import hashlib

def get_wikimedia_path(filename):
    """Generate the correct Wikimedia file path based on MD5 hash"""
    md5 = hashlib.md5(filename.encode('utf-8')).hexdigest()
    return f"{md5[0]}/{md5[:2]}/{filename}"

# Test with known filenames
test_files = [
    'Peter_the_Great_as_a_child.jpg',
    'Peter_I_of_Russia_by_Jean-Marc_Nattier.jpg',
    'Peter_the_Great_on_his_deathbed.jpg',
    'Peter_I_preobrazhensky_regiment.jpg',
    'Peter_I_in_Holland.jpg',
    'Peter_I_assembly.jpg',
    'Battle_of_Poltava_by_Dennis_Martin_Berka.jpg',
    'Battle_of_Narva.jpg',
    'Battle_of_Erastfer.jpg',
    'Battle_of_Lesnaya.jpg',
    'Battle_of_Gangut.jpg',
    'Battle_of_Grengam.jpg',
    'Peter_and_Paul_Fortress_founding.jpg',
    'Sophia_Alekseyevna_of_Russia.jpg',
    'Russian_Empire_1725.png',
    'Senate_and_Synod_building.jpg',
    'Twelve_Collegia_building.jpg',
    'Table_of_Ranks.jpg',
    'Spiritual_Regulation.jpg',
    'Demidov_factory.jpg',
    'Navigation_School_Moscow.jpg',
    'Vedomosti_newspaper.jpg',
    'Kunstkamera_building.jpg',
    'Academy_of_Sciences_St_Petersburg.jpg',
    'Julian_calendar_reform.jpg',
]

print("Wikimedia file paths:")
for f in test_files:
    path = get_wikimedia_path(f)
    print(f"https://upload.wikimedia.org/wikipedia/commons/{path}")