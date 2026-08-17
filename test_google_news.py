import asyncio
import httpx
import feedparser
from bs4 import BeautifulSoup

async def main():
    url = "https://news.google.com/rss/search?q=indian+tax&hl=en-IN&gl=IN&ceid=IN:en"
    feed = feedparser.parse(url)
    link = feed.entries[0].link
    print(f"Testing link: {link}")
    
    async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        response = await client.get(link, headers=headers)
        print(f"Status: {response.status_code}")
        soup = BeautifulSoup(response.text, 'html.parser')
        og_img = soup.find('meta', property='og:image')
        if og_img:
            print(f"Found og:image: {og_img.get('content')}")
        else:
            print("No og:image found.")
            print("HTML snippet:", response.text[:500])

asyncio.run(main())
