import yfinance as yf
import feedparser
import uuid
import re
import httpx
import asyncio
from bs4 import BeautifulSoup
from typing import List
from .schemas import NewsItem

class NewsService:
    def _clean_html(self, raw_html: str) -> str:
        if not raw_html:
            return ""
        cleanr = re.compile('<.*?>')
        cleantext = re.sub(cleanr, '', raw_html)
        return cleantext.strip()

    def get_yfinance_news(self, ticker: str, limit: int = 10) -> List[NewsItem]:
        """Fetch news for a specific ticker using yfinance."""
        try:
            t = yf.Ticker(ticker)
            news = t.get_news(count=limit, tab='news')

            results = []
            for item in news:
                content = item.get('content', {})
                if not content:
                    continue

                thumbnail_url = None
                thumbnail_data = content.get('thumbnail', {})
                if thumbnail_data and 'resolutions' in thumbnail_data:
                    resolutions = thumbnail_data['resolutions']
                    if resolutions:
                        thumbnail_url = resolutions[0]['url']

                description = content.get('summary') or content.get('description', '')
                published_at = content.get('pubDate', '')
                
                click_url_data = content.get('clickThroughUrl', {})
                link = click_url_data.get('url', '')

                provider_data = content.get('provider', {})
                publisher = provider_data.get('displayName', 'yfinance')

                results.append(NewsItem(
                    id=content.get('id', str(uuid.uuid4())),
                    title=content.get('title', ''),
                    description=self._clean_html(description),
                    publisher=publisher,
                    link=link,
                    published_at=published_at,
                    thumbnail_url=thumbnail_url
                ))
            return results

        except Exception as e:
            print(f"Error fetching yfinance news for {ticker}: {e}")
            return []

    async def _fetch_article_metadata(self, url: str) -> dict:
        metadata = {'thumbnail_url': None, 'description': None}
        try:
            async with httpx.AsyncClient(timeout=3.0, follow_redirects=True) as client:
                headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
                response = await client.get(url, headers=headers)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    og_img = soup.find('meta', property='og:image')
                    if og_img and og_img.get('content'):
                        metadata['thumbnail_url'] = og_img['content']
                        
                    og_desc = soup.find('meta', property='og:description')
                    if not og_desc:
                        og_desc = soup.find('meta', attrs={'name': 'description'})
                    
                    if og_desc and og_desc.get('content'):
                        desc_text = og_desc['content']
                        # Google News redirect pages have a hardcoded generic description.
                        if "Comprehensive, up-to-date news coverage" not in desc_text:
                            metadata['description'] = desc_text
        except Exception:
            pass
        return metadata

    async def get_google_news(self, query: str, limit: int = 10) -> List[NewsItem]:
        """Fetch news from Google News RSS based on a query."""
        import urllib.parse
        try:
            encoded_query = urllib.parse.quote(query)
            url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"
            feed = feedparser.parse(url)
            
            entries = feed.entries[:limit]
            
            # Concurrently fetch metadata
            tasks = [self._fetch_article_metadata(entry.get('link', '')) for entry in entries]
            metadata_list = await asyncio.gather(*tasks)

            results = []
            for i, entry in enumerate(entries):
                title = entry.get('title', '')
                publisher = "Google News"
                if " - " in title:
                    parts = title.rsplit(" - ", 1)
                    title = parts[0]
                    if len(parts) > 1:
                        publisher = parts[1]
                        
                raw_summary = entry.get('summary', '')
                
                meta = metadata_list[i]
                
                thumbnail_url = meta.get('thumbnail_url')
                if not thumbnail_url:
                    img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', raw_summary, re.IGNORECASE)
                    if img_match:
                        thumbnail_url = img_match.group(1)
                    elif 'media_content' in entry and len(entry.media_content) > 0:
                        thumbnail_url = entry.media_content[0].get('url')

                description = meta.get('description')
                if not description:
                    # Fallback to the cleaned raw summary
                    description = self._clean_html(raw_summary)
                    
                # Clean up description if it still exactly matches the title (Google News fallback behavior)
                if description and description.startswith(title):
                    description = "Full article details available at the source. Click 'Read full article' to learn more."
                
                results.append(NewsItem(
                    id=entry.get('id', str(uuid.uuid4())),
                    title=title,
                    description=description,
                    publisher=publisher,
                    link=entry.get('link', ''),
                    published_at=entry.get('published', ''),
                    thumbnail_url=thumbnail_url
                ))
            return results
        except Exception as e:
            print(f"Error fetching google news for {query}: {e}")
            return []
