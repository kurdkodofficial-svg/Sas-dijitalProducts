import React from 'react';
import { 
  Sparkles, 
  SearchCheck, 
  DatabaseZap, 
  ExternalLink, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

interface HeroProps {
  language: 'ku' | 'en';
  totalProducts: number;
  onOpenAddModal: () => void;
  onOpenImageStudio: () => void;
  onOpenSeoHub: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  totalProducts,
  onOpenAddModal,
  onOpenImageStudio,
  onOpenSeoHub,
}) => {
  const isKu = language === 'ku';

  return (
    <div className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-slate-900 bg-radial-[at_50%_0%] from-indigo-950/40 via-slate-950 to-slate-950">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Core Direct Answer Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 shadow-inner text-xs sm:text-sm text-slate-200">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <DatabaseZap className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-emerald-300">
              {isKu ? 'وەڵامی پرسیارەکەت:' : 'Direct Answer:'}
            </span>
            <span className="text-slate-300">
              {isKu ? 'پێویستت بە هیچ داتابەیس و باکێندێکی گەورە نییە بۆ گووگڵ!' : 'Zero bloated backend required to rank #1 on Google!'}
            </span>
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.25] sm:leading-[1.2]">
            {isKu ? (
              <>
                هەموو ماڵپەڕ و پلاتفۆرمەکانت لە{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400">
                  Sas-dijitalProducts
                </span>
                ، ئامادە بۆ ڕیزبەندی لە گووگڵ
              </>
            ) : (
              <>
                All Your Websites & Platforms in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400">
                  Sas-dijitalProducts
                </span>
                , Google Search Ready
              </>
            )}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isKu ? (
              <>
                کۆکراوەی سەرجەم ماڵپەڕ، پۆڕتاڵ و سیستەمە ئەلیکترۆنییەکانت بە شێوازێکی مۆدێرن و ڕێکخراو لە یەک شوێندا، بە تەواوی ئامادەکراو بۆ ناساندن و دەرکەوتن لە گووگڵ.
              </>
            ) : (
              <>
                Centralized showcase for all your websites, portals, and management platforms in one streamlined hub, fully optimized for Google search and discovery.
              </>
            )}
          </p>

          {/* Call to actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            
            <button
              onClick={onOpenAddModal}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>{isKu ? 'زیادکردنی ماڵپەڕ یان پڕۆژە' : 'Add a Website / Platform'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenImageStudio}
              className="px-5 py-3 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-indigo-500/60 shadow-lg transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isKu ? 'دروستکردنی وێنەی بەرهەم (1K/2K/4K)' : 'AI Image Studio (1K/2K/4K)'}</span>
            </button>

            <button
              onClick={onOpenSeoHub}
              className="px-5 py-3 rounded-xl font-bold text-sm bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-950"
            >
              <SearchCheck className="w-4 h-4 text-emerald-400" />
              <span>{isKu ? 'ڕێبەری Search Console و دۆمەین' : 'GSC & Domain Setup Guide'}</span>
            </button>

          </div>

        </div>

        {/* Feature Highlights Grid addressing User's exact concerns */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <SearchCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {isKu ? 'گووگڵ چۆن دەیدۆزێتەوە؟' : 'How Google Indexes It'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isKu
                ? 'گووگڵ لە ڕێگەی کلیلەکانی Schema.org Product و sitemap.xml لاپەڕەکانت هەڵدەگرێت، نەک داتابەیس. هەمووی ئامادەیە!'
                : 'Google crawls HTML and Schema.org metadata, not your backend. Everything is pre-configured!'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {isKu ? 'وێنەی پیشەیی 1K / 2K / 4K' : 'Studio AI Images (1K-4K)'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isKu
                ? 'دروستکردنی کاڤەر و مۆکئاپ بە Gemini 3 Pro بە 8 جۆر ئەسپێکت ڕەیشۆ (1:1، 16:9، 9:16، 21:9 و زیاتر).'
                : 'Studio-grade product mockups with Gemini 3 Pro Image Preview & Nano Banana across 8 aspect ratios.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {isKu ? 'کۆکردنەوەی هەموو لینکەکان' : 'Unified Direct Links'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isKu
                ? 'بەستەری ڕاستەوخۆ بۆ Google Drive، Telegram، Gumroad، BuyMeACoffee، و فایلی ناوخۆیی بەبێ کۆتوبەند.'
                : 'Direct links to Drive, Telegram, Gumroad, Stripe, or instant file downloads in one place.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-violet-500/40 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                <DatabaseZap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {isKu ? 'تێچووی $0 بۆ باکێند' : '$0 Backend Cost'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isKu
                ? 'پێویستت بە کرێی مانگانەی سێرڤەری گران نییە؛ داتاکانت بە سەلامەتی پارێزراون لەگەڵ هەناردەکردنی JSON.'
                : 'Zero ongoing database fees; instant JSON persistence and 100% data portability.'}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
