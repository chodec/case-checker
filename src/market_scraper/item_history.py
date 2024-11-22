import requests
import os
import time
from dotenv import load_dotenv

load_dotenv()

steam_login_secure = os.getenv('STEAM_LOGIN_SECURE')

cases = ['Kilowatt%20Case', 'Dreams%20%26%20Nightmares%20Case', 'Fracture%20Case', 'Recoil%20Case', 'Revolution%20Case', 'Chroma%20Case', 'Chroma%202%20Case', 'Chroma%203%20Case', 'Clutch%20Case', 'CS%3AGO%20Weapon%20Case', 'CS%3AGO%20Weapon%20Case%202', 'CS%3AGO%20Weapon%20Case%203', 'CS20%20Case', 'Danger%20Zone%20Case', 'eSports%202013%20Case', 'eSports%202013%20Winter%20Case', 'eSports%202014%20Summer%20Case', 'Falchion%20Case','Gamma%20Case', 'Gamma%202%20Case', 'Glove%20Case', 'Horizon%20Case', 'Huntsman%20Weapon%20Case', 'Operation%20Bravo%20Case', 'Operation%20Breakout%20Weapon%20Case','Operation%20Broken%20Fang%20Case', 'Operation%20Hydra%20Case', 'Operation%20Phoenix%20Weapon%20Case', 'Operation%20Riptide%20Case', 'Operation%20Vanguard%20Weapon%20Case','Operation%20Wildfire%20Case', 'Prisma%20Case', 'Prisma%202%20Case', 'Revolver%20Case', 'Shadow%20Case', 'Shattered%20Web%20Case', 'Snakebite%20Case', 'Spectrum%20Case','Spectrum%202%20Case', 'Winter%20Offensive%20Weapon%20Case']
url = 'http://steamcommunity.com/market/pricehistory/?country=PT&currency=3&appid=730&market_hash_name='

cookie = {'steamLoginSecure': steam_login_secure}
directory = r'C:\Users\DomLe\OneDrive\Plocha\case-checker\src\db\json'

limit = 0

def download_data(x, url, directory):
   data = requests.get(url + x, cookies=cookie)
   print(data.request.url)
   print(data.request.body)
   if (data.request.body == None):
      time.sleep(4)
      limit += 1
      download_data(x, url, directory)
      if (limit == 4):
         print('Limit attemp reached.')
         next
   file_path = os.path.join(directory, x + '.json')

   with open(file_path, 'w+') as f:
      f.write(data.text)

for x in cases:
   download_data(x, url, directory)
