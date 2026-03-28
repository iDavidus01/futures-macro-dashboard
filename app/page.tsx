
import { Suspense } from 'react';
import Image from 'next/image';
import { getMarketContext } from '@/lib/ai';
import { scrapeForexFactory } from '@/lib/scraper';
import { UsdFuturesNews } from '@/lib/types';
import { DashboardClient } from '@/components/dashboard-client';
import { NYClock } from '@/components/ny-clock';
import { Navbar } from '@/components/navbar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function Dashboard() {
  let context: { text: string; bias: 'neutral' | 'bullish' | 'bearish' } = {
    text: 'Loading market context...',
    bias: 'neutral'
  };
  let news: UsdFuturesNews[] = [];


  try {
    context = {
      text: 'AI Engine is currently OFFLINE. Live market sentiment analysis and context generation are unavailable.',
      bias: 'neutral'
    };

    const rawNews = await scrapeForexFactory();

    news = rawNews.slice(0, 12).map((item) => ({
      ...item,
      impactStr: 'N/A (Offline)',
      volatility: 'neutral'
    })) as unknown as UsdFuturesNews[];
  } catch (error) {
    console.error('Dashboard data loading failed:', error);
  }

  return (
    <div className="relative min-h-screen text-zinc-100 font-sans selection:bg-primary/20">
      <div className="fixed inset-0 z-0 bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 liquid-bg opacity-30 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 space-y-16">
        <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-105">
                <Image
                  src="/logo.svg"
                  alt="Futures Macro Logo"
                  width={32}
                  height={32}
                  className="drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                />
              </div>
              <h1 className="text-5xl font-black tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400">Futures</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 to-zinc-500 ml-3">Macro</span>
              </h1>
            </div>
            <div className="pt-2">
              <Navbar />
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex gap-2">
              {['ES', 'NQ'].map(ticker => (
                <div key={ticker} className="glass px-3 py-1 rounded text-xs font-mono font-bold text-zinc-300 border-white/5 hover:border-primary/30 transition-colors cursor-default">
                  {ticker}
                </div>
              ))}
            </div>
            <NYClock />
          </div>
        </header>

        {/* AI Offline Banner */}
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 flex items-center justify-center font-mono text-sm tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse mr-3 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          SYSTEM STATUS: AI ENGINE OFFLINE
        </div>

        <DashboardClient context={context} news={news} />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-500 font-mono">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="tracking-[0.2em] text-xs">SYNCING MARKET DATA...</span>
        </div>
      </div>
    }>
      <Dashboard />
    </Suspense>
  )
}
