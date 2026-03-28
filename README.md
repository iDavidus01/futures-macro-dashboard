# Futures Macro Dashboard
**Live at:** [dashboard.nqdavid.me](https://dashboard.nqdavid.me)

An advanced, AI-powered macroeconomic dashboard built for futures traders (ES/NQ). This project aggregates financial news, extracts real-time market context, and provides intelligent analysis using AI to give traders a comprehensive multidimensional view of the market state.

## 🚀 Key Features

### 🧠 Market Analyst Engine
Our core analytical suite provides deep, context-aware insights into the current market structure:
- **Sector Heatmaps:** Visualizes institutional money flow and relative sector rotation, allowing traders to see which areas of the market are leading or lagging.
- **Seasonality Profiling:** Leverages historical seasonal trends tailored to the current month to forecast probable ES/NQ price actions.
- **AI-Driven Market Sentiment:** Summarizes the current market environment (bullish, bearish, or neutral) using advanced LLM integration to digest complex fundamental data.
- **Intelligent Volatility Prediction:** Batches and analyzes upcoming economic news using AI to determine potential volatility impact and probable market reactions.
- **Macro News Scraping:** Automated aggregation of high-impact economic events from public macro data sources.

### ✨ Premium UI/UX
- Built with a stunning dark-mode glassmorphism aesthetic.
- Features liquid background textures, vibrant dynamic gradients, and animated components powered by Framer Motion.
- **Real-Time NY Session Clock:** Keeps traders synchronized strictly with the New York trading session time, an essential feature for index futures trading.

## ⚠️ System Status
**The AI engine is currently offline.** 
When the AI processing is temporarily unavailable, the dashboard will display an offline warning banner natively on the UI and will fall back to displaying raw macro news and data feeds without requiring API requests.

## 🛠️ Tech Stack
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Radix UI Primitives + Framer Motion
- **AI Integration:** Anthropic AI SDK
- **Data Gathering:** Cheerio (Web Scraping)

## 📜 License
This project is licensed under the MIT License.
