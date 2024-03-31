import requests
import os
from dotenv import load_dotenv

load_dotenv()

steam_login_secure = os.getenv('STEAM_LOGIN_SECURE')

cookie = {'steamLoginSecure': steam_login_secure}
data = requests.get('http://steamcommunity.com/market/pricehistory/?country=PT&currency=3&appid=730&market_hash_name=Falchion%20Case', cookies=cookie)
print(data.text)

