import React from 'react';
import { 
  Sparkles, 
  PlusCircle, 
  Globe2, 
  Search, 
  Package, 
  ExternalLink,
  ShieldCheck,
  Languages
} from 'lucide-react';

interface NavbarProps {
  language: 'ku' | 'en';
  setLanguage: (lang: 'ku' | 'en') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenAddModal: () => void;
  onOpenImageStudio: () => void;
  onOpenSeoHub: () => void;
  productCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onOpenImageStudio,
  onOpenSeoHub,
  productCount,
}) => {
  const isKu = language === 'ku';

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Package className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Sas<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">-dijitalProducts</span>
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  SEO Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {isKu ? 'کۆگا و بڵاوکەرەوەی بەرهەمە دیجیتاڵییەکان لە گووگڵ' : 'Digital Products Showcase & Google Indexing Engine'}
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isKu ? 'گەڕان لە بەرهەمەکان، تاگەکان، فایلەکان...' : 'Search products, formats, tags...'}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 ps-10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <Search className={`w-4 h-4 text-slate-400 absolute top-3 ${isKu ? 'right-3' : 'left-3'}`} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-2.5 text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded ${isKu ? 'left-3' : 'right-3'}`}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Google SEO Hub Button */}
            <button
              onClick={onOpenSeoHub}
              title={isKu ? 'پشکنینی گووگڵ و ڕیزبەندی بەبێ باکێند' : 'Google SEO & Indexing Hub'}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all shadow-sm shadow-emerald-950"
            >
              <Globe2 className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span className="hidden sm:inline">
                {isKu ? 'بڵاوکردنەوە لە گووگڵ' : 'Google SEO'}
              </span>
            </button>

            {/* AI Image Studio Button (gemini-3-pro-image-preview & gemini-nano-banana-2.1 with 1K, 2K, 4K) */}
            <button
              onClick={onOpenImageStudio}
              title={isKu ? 'دروستکەری وێنەی باڵا بە ژیری دەستکرد (1K/2K/4K)' : 'AI Image Studio (1K, 2K, 4K)'}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-violet-600/30 to-indigo-600/30 hover:from-violet-600/50 hover:to-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="hidden md:inline">
                {isKu ? 'ستۆدیۆی وێنەی AI' : 'AI Studio'}
              </span>
              <span className="text-[10px] bg-indigo-500/40 text-indigo-200 px-1.5 py-0.5 rounded-full font-mono">
                1K-4K
              </span>
            </button>

            {/* Add Product Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isKu ? 'زیادکردنی بەرهەم' : 'Add Product'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(isKu ? 'en' : 'ku')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="تۆگڵی زمان / Toggle Language"
            >
              <Languages className="w-4 h-4 text-slate-400" />
              <span>{isKu ? 'EN' : 'کوردی'}</span>
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isKu ? 'گەڕان لە بەرهەمە دیجیتاڵییەکان...' : 'Search digital products...'}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 ps-10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Search className={`w-4 h-4 text-slate-400 absolute top-2.5 ${isKu ? 'right-3' : 'left-3'}`} />
          </div>
        </div>

      </div>
    </header>
  );
};
