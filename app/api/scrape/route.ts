
import { NextResponse } from 'next/server';
import { scrapeMacroData } from '@/lib/scraper';
import { analyzeNews } from '@/lib/ai';

export const revalidate = 900; // 15 minutes

export async function GET() {
    try {
        const rawNews = await scrapeMacroData();

        // In a real scenario, we'd limit this to meaningful news
        // For MVP demonstration, limit to top 5 most relevant to avoid too much "AI work"
        const relevantNews = rawNews.slice(0, 8);

        const enhancedNews = await Promise.all(
            relevantNews.map(async (item) => {
                return await analyzeNews(item);
            })
        );

        return NextResponse.json(enhancedNews);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
