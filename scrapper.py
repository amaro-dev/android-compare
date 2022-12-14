
import requests
from bs4 import BeautifulSoup


class Screen:
    def __init__(self, width, height, density) -> None:
        self.width = width
        self.height = height
        self.density = density
    def __str__(self):
        return "%s;%s;%s" % (self.width, self.height, self.density)

class Device:
    def __init__(self, name, screens) -> None:
        self.name = name
        if isinstance(screens, list):
            self.screens = screens
        else:
            self.screens = [screens]
    def __str__(self):
        str = self.name 
        for s in self.screens:
            str += ";" + s.__str__()
        return str

headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
}

def request(link):
    link = link.removeprefix("index.php?").split('&')
    params = {
        x.split('=')[0]: x.split('=')[1] for x in link
    }

    response = requests.get('https://phonedb.net/index.php', params=params, headers=headers)
    return BeautifulSoup(response.text, 'html.parser')

def list_devices(soup):

    list = []
    for x in soup.find_all(attrs={"class": "content_block_title"}):
        device = extract_device(x.a['href'])
        if device != None:
            list.append(device)
            print(x.a.text)

    return list

def get_attr(soup, attr):
    attr = soup.find(id=attr)
    if attr != None:
        return attr.nextSibling.text
    return None

def extract_device(link) -> Device:
    soup = request(link)

    name = get_attr(soup, 'datasheet_item_id2')
    screen_size_1 = get_attr(soup, 'datasheet_item_id91')
    screen_density_1 = get_attr(soup, 'datasheet_item_id99')
    screen_size_2 = get_attr(soup, 'datasheet_item_id123')
    screen_density_2 = get_attr(soup, 'datasheet_item_id131')

    screens = []
    if screen_size_1 == None or screen_density_1 == None:
        return None
    screens.append(extract_screen(screen_size_1, screen_density_1))
    if screen_size_2 != None and screen_density_2 != None:
        screens.append(extract_screen(screen_size_2, screen_density_2))
    
    return Device(name, screens)

def extract_screen(size, density) -> Screen:
    [width, height] = size.split('x')
    density = density.removesuffix(" PPI")
    return Screen(width, height, density)

def save(devices):
    with open("sony.txt", "a", encoding = 'utf-8') as f:
        for d in devices:
            f.write(d.__str__())
            f.write('\n')

page = "index.php?m=device&s=list&first=sony"

devices = []
while page != None:
    soup = request(page)
    save(list_devices(soup))
    next = soup.find(attrs={"title": "Next page"})
    if next != None:
        page = next["href"][1:]
    else:
        page = None

