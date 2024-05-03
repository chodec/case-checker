import requests
from bs4 import BeautifulSoup
import os
import json

cases = ['Kilowatt%20Case', 'Dreams%20%26%20Nightmares%20Case', 'Fracture%20Case', 'Recoil%20Case', 'Revolution%20Case', 'Chroma%20Case', 'Chroma%202%20Case', 'Chroma%203%20Case', 'Clutch%20Case', 'CS%3AGO%20Weapon%20Case', 'CS%3AGO%20Weapon%20Case%202', 'CS%3AGO%20Weapon%20Case%203', 'CS20%20Case', 'Danger%20Zone%20Case', 'eSports%202013%20Case', 'eSports%202013%20Winter%20Case', 'eSports%202014%20Summer%20Case', 'Falchion%20Case','Gamma%20Case', 'Gamma%202%20Case', 'Glove%20Case', 'Horizon%20Case', 'Huntsman%20Weapon%20Case', 'Operation%20Bravo%20Case', 'Operation%20Breakout%20Weapon%20Case','Operation%20Broken%20Fang%20Case', 'Operation%20Hydra%20Case', 'Operation%20Phoenix%20Weapon%20Case', 'Operation%20Riptide%20Case', 'Operation%20Vanguard%20Weapon%20Case','Operation%20Wildfire%20Case', 'Prisma%20Case', 'Prisma%202%20Case', 'Revolver%20Case', 'Shadow%20Case', 'Shattered%20Web%20Case', 'Snakebite%20Case', 'Spectrum%20Case','Spectrum%202%20Case', 'Winter%20Offensive%20Weapon%20Case']

url = 'https://steamcommunity.com/market/listings/730/'
directory = r'C:\Users\DomLe\OneDrive\Plocha\case-checker\public\img\items\cases'

def download_image(x, url, directory):
    response = requests.get(url + x)
    page_content = response.text
    soup = BeautifulSoup(page_content, 'html.parser')
    div_with_image = soup.find('div', class_='market_listing_largeimage')
    
    if div_with_image:
        img_tag = div_with_image.find('img')
        image_url = img_tag.get('src')
        json_file_path = os.path.join(directory, 'data.json')
        data = {}
        if os.path.exists(json_file_path) and os.path.getsize(json_file_path) > 0:
            with open(json_file_path, 'r') as json_file:
                data = json.load(json_file)

        data[x] = {'case_name': x, 'image_url': image_url}
        with open(json_file_path, 'w') as json_file:
            json.dump(data, json_file)

        print(f'{x} appended to {json_file_path}.')
    else:
         print(f'{x} Redownload')
         download_image(x, url, directory)


json_file_path = os.path.join(directory, 'data.json')
with open(json_file_path, 'r') as json_file:
    data = json.load(json_file)

for x in cases:
    if x not in data:
        print(f'{x} not found in JSON. download_image on the way')
        download_image(x, url, directory)
    else:
        print(f'{x} found. Skip')
