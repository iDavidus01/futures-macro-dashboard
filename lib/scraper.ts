
import * as cheerio from 'cheerio';
import { UsdFuturesNews, Impact } from './types';
import { getMockNewsData } from './mock-data';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const XML_URL = 'https://nfs.faireconomy.media/ff_calendar_thisweek.xml';
const CACHE_FILE = join(process.cwd(), 'data', 'news-cache.json');

function ensureDataDir() {
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
        mkdirSync(dataDir);
    }
}

function readFromCache(): Partial<UsdFuturesNews>[] {
    try {
        if (!existsSync(CACHE_FILE)) return getMockNewsData();
        const cacheData = readFileSync(CACHE_FILE, 'utf-8');
        const parsed = JSON.parse(cacheData);
        console.log(`✅ Loaded ${parsed.news.length} news items from cache`);
        return parsed.news;
    } catch (error) {
        console.warn('⚠️ Failed to read cache file, using mock data:', error);
        return getMockNewsData();
    }
}

function saveToCache(news: Partial<UsdFuturesNews>[]) {
    try {
        ensureDataDir();
        const cacheData = {
            lastUpdated: new Date().toISOString(),
            news: news
        };
        writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
        console.log('💾 News saved to cache.');
    } catch (error) {
        console.error('❌ Failed to save to cache:', error);
    }
}

export async function scrapeMacroData(): Promise<Partial<UsdFuturesNews>[]> {
    console.log('🌐 Fetching live news from XML...');

    try {
        const response = await fetch(XML_URL, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Macro data returned status: ${response.status}`);
        }

        const xmlText = await response.text();
        const $ = cheerio.load(xmlText, { xmlMode: true });
        const newsItems: Partial<UsdFuturesNews>[] = [];

        $('event').each((_, element) => {
            const el = $(element);
            const country = el.find('country').text();

            if (country !== 'USD') return;

            const impactStr = el.find('impact').text().toLowerCase();
            let impact: Impact | null = null;

            if (impactStr.includes('high')) impact = 'high';
            else if (impactStr.includes('medium')) impact = 'medium';

            if (!impact) return;

            const title = el.find('title').text();
            const dateStr = el.find('date').text();
            const timeStr = el.find('time').text();

            let eventTimeUTC = '';
            if (dateStr) {
                try {
                    const [m, d, y] = dateStr.split('-').map(Number);
                    const eventDate = new Date(y, m - 1, d);

                    if (timeStr && !timeStr.toLowerCase().includes('day')) {
                        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})(am|pm)/i);
                        if (timeMatch) {
                            let hours = parseInt(timeMatch[1]);
                            const minutes = parseInt(timeMatch[2]);
                            const isPM = timeMatch[3].toLowerCase() === 'pm';

                            if (isPM && hours !== 12) hours += 12;
                            if (!isPM && hours === 12) hours = 0;

                            eventDate.setHours(hours, minutes, 0, 0);

                            const pad = (n: number) => n.toString().padStart(2, '0');
                            const utcDateStr = `${y}-${pad(m)}-${pad(d)}T${pad(hours)}:${pad(minutes)}:00Z`;
                            eventTimeUTC = new Date(utcDateStr).toISOString();
                        } else {
                            const pad = (n: number) => n.toString().padStart(2, '0');
                            eventTimeUTC = new Date(`${y}-${pad(m)}-${pad(d)}T00:00:00Z`).toISOString();
                        }
                    } else {
                        const pad = (n: number) => n.toString().padStart(2, '0');
                        eventTimeUTC = new Date(`${y}-${pad(m)}-${pad(d)}T00:00:00Z`).toISOString();
                    }
                } catch (e) {
                    console.warn(`Failed to parse date/time for ${title}`);
                }
            }

            newsItems.push({
                id: `macro-${title.replace(/\s+/g, '-').toLowerCase()}-${dateStr}`.substring(0, 80),
                title,
                impact,
                eventTimeUTC,
                forecast: el.find('forecast').text() || undefined,
                previous: el.find('previous').text() || undefined
            });
        });

        if (newsItems.length > 0) {
            console.log(`✅ Scraped ${newsItems.length} live news items.`);
            saveToCache(newsItems);
            return newsItems;
        }

        console.warn('ℹ️ No USD news found in XML, using cache/mock.');
        return readFromCache();

    } catch (error) {
        console.error('❌ XML Scraping failed:', error);
        return readFromCache();
    }
}
