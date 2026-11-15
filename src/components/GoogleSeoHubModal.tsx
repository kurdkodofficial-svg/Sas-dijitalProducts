import React, { useState } from 'react';
import { 
  X, 
  Globe2, 
  Search, 
  Check, 
  Copy, 
  ExternalLink, 
  FileCode2, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  Upload, 
  Layers,
  Database,
  ArrowRight,
  Zap
} from 'lucide-react';
import { DigitalProduct, Language } from '../types';

interface GoogleSeoHubModalProps {
  isOpen: boolean;
  language: Language;
  products: DigitalProduct[];
  onClose: () => void;
  onImportProducts: (imported: DigitalProduct[]) => void;
}

export const GoogleSeoHubModal: React.FC<GoogleSeoHubModalProps> = ({
  isOpen,
  language,
  products,
  onClose,
  onImportProducts,
}) => {
  if (!isOpen) return null;

  const isKu = language === 'ku';
  const [activeTab, setActiveTab] = useState<'gsc-domain' | 'answer' | 'serp' | 'schema' | 'checklist' | 'backup'>('gsc-domain');
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedDns, setCopiedDns] = useState(false);
  const [copiedMeta, setCopiedMeta] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [sitemapSubmitted, setSitemapSubmitted] = useState(false);
  const [selectedRegistrar, setSelectedRegistrar] = useState<'cloudflare' | 'namecheap' | 'godaddy' | 'google'>('cloudflare');

  const baseUrl = window.location.origin;
  const sitemapUrl = `${baseUrl}/sitemap.xml`;
  const robotsUrl = `${baseUrl}/robots.txt`;

  // Sample Product Schema
  const sampleProduct = products[0] || {
    id: 'prod-demo',
    titleKu: 'بەرهەمی نموونەیی',
    titleEn: 'Sample Digital Asset',
    descriptionKu: 'تەواوی وەسفی بەرهەمی نموونەیی بۆ گووگڵ',
    descriptionEn: 'Full description of sample digital product',
    price: 19.99,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
    rating: 4.9,
    reviewsCount: 42,
  };

  const schemaJson = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": sampleProduct.titleKu || sampleProduct.titleEn,
      "image": sampleProduct.imageUrl,
      "description": sampleProduct.descriptionKu || sampleProduct.descriptionEn,
      "brand": {
        "@type": "Brand",
        "name": "Sas-dijitalProducts"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": sampleProduct.rating || 4.9,
        "reviewCount": sampleProduct.reviewsCount || 42
      },
      "offers": {
        "@type": "Offer",
        "url": `${baseUrl}/#product-${sampleProduct.id}`,
        "priceCurrency": "USD",
        "price": sampleProduct.price || "0.00",
        "availability": "https://schema.org/InStock"
      }
    },
    null,
    2
  );

  const handleCopySitemap = () => {
    navigator.clipboard.writeText(sitemapUrl);
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 2000);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(schemaJson);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sas-dijitalproducts-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportProducts(parsed);
          }
        } catch (err) {
          alert('فایلی هەناردەکراو هەڵەیە / Invalid JSON backup');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl shadow-emerald-950/40 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 p-[2px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{isKu ? 'ناوەندی بڵاوکردنەوە لە گووگڵ و سێو (Google SEO)' : 'Google SEO & Indexing Engine'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {isKu ? 'ڕێبەری سەلمێنراو بۆ بڵاوکردنەوە لە گووگڵ بەبێ باکێند و داتابەیسی گەورە' : 'Zero-backend high performance SEO architecture and Search Console guide'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('gsc-domain')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'gsc-domain'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isKu ? 'سەلماندنی دۆمەین لە Search Console' : 'GSC & Domain Verification'}</span>
          </button>

          <button
            onClick={() => setActiveTab('answer')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'answer'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isKu ? 'ئایا باکێندی گەورە پێویستە؟' : 'Why No Heavy Backend Needed?'}</span>
          </button>

          <button
            onClick={() => setActiveTab('serp')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'serp'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isKu ? 'پێشبینینی دەرکەوتن لە گووگڵ' : 'Google SERP Simulator'}</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'schema'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>{isKu ? 'کۆدی Schema.org بۆ گووگڵ' : 'Schema.org JSON-LD'}</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isKu ? '٤ هەنگاوی ناساندن بە گووگڵ' : '4-Step Indexing Steps'}</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isKu ? 'هەناردە و پاراستنی داتا' : 'Backup & JSON'}</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6">

          {/* TAB 0: GSC & Domain Verification Guide (Sas-dijitalProducts.com) */}
          {activeTab === 'gsc-domain' && (
            <div className="space-y-6">
              
              {/* Main Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {isKu ? 'ڕێبەری سەلماندنی خاوەندارێتی دۆمەین بۆ Sas-dijitalProducts.com' : 'Domain Ownership Verification Guide (Sas-dijitalProducts.com)'}
                      </h4>
                      <p className="text-xs text-slate-300">
                        Target Domain: <span className="font-mono text-emerald-400 font-bold">Sas-dijitalProducts.com</span> • Live Sitemap: <span className="font-mono text-cyan-400">https://Sas-dijitalProducts.com/sitemap.xml</span>
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-colors"
                  >
                    <span>{isKu ? 'کردنەوەی Search Console' : 'Open Search Console'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Step 1: Add Property in Search Console */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">
                      {isKu ? 'هەڵبژاردنی جۆری سامان (Domain Property) لە Google Search Console' : 'Select Domain Property in Google Search Console'}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isKu ? (
                        <>
                          کاتێک سەردانی <strong>search.google.com/search-console</strong> دەکەیت، دوو هەڵبژاردنت پێدەدرێت: <strong>Domain</strong> و <strong>URL prefix</strong>. باشترین ڕێگە هەڵبژاردنی <strong>Domain</strong>ـە چونکە هەموو لقەکانی دۆمەینەکە و پروتۆکۆلەکانی (https, http, www, non-www) بەیەک جار دەپارێزێت.
                        </>
                      ) : (
                        <>
                          Choose <strong>Domain</strong> property type in Search Console. This covers all subdomains (www, shop) and protocols (http, https) for <strong>Sas-dijitalProducts.com</strong>.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Domain to enter:</span>
                  <span className="font-mono text-emerald-400 font-bold">Sas-dijitalProducts.com</span>
                </div>
              </div>

              {/* Step 2: Verification Methods */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-bold text-white mb-1">
                      {isKu ? 'سەلماندنی خاوەندارێتی (Ownership Verification Methods)' : 'Verify Ownership Methods'}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isKu 
                        ? 'گووگڵ چەندین ڕێگەت پێدەدات بۆ سەلماندنی ئەوەی تۆ خاوەنی دۆمەینی Sas-dijitalProducts.com یت:' 
                        : 'Choose the most convenient verification method for your setup:'}
                    </p>
                  </div>
                </div>

                {/* Method A: DNS TXT (Recommended) */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-[10px] text-indigo-300">ڕێگەی یەکەم (پێشنیازکراو)</span>
                      <span>تۆماری DNS TXT لە کۆمپانیای دۆمەین</span>
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('google-site-verification=sas-dijitalproducts-domain-token-2026');
                        setCopiedDns(true);
                        setTimeout(() => setCopiedDns(false), 2000);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1"
                    >
                      {copiedDns ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedDns ? 'کۆپیکرا' : 'کۆپی بەهای TXT'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-400">
                    {isKu 
                      ? 'بچۆ ژوورەوە بۆ ئەو کۆمپانیایەی دۆمەینەکەت لێ کڕیوە (Cloudflare، Namecheap، GoDaddy، Hostinger) و بچۆ بەشی DNS Settings:'
                      : 'Log in to your DNS provider / registrar and add a new TXT record:'}
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-start border border-slate-800 rounded-lg overflow-hidden font-mono">
                      <thead className="bg-slate-950 text-slate-400">
                        <tr>
                          <th className="p-2 border-b border-slate-800">Record Type</th>
                          <th className="p-2 border-b border-slate-800">Host / Name</th>
                          <th className="p-2 border-b border-slate-800">Value / Content</th>
                          <th className="p-2 border-b border-slate-800">TTL</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-200 divide-y divide-slate-800 bg-slate-950/60">
                        <tr>
                          <td className="p-2 text-indigo-400 font-bold">TXT</td>
                          <td className="p-2 text-amber-300">@ (or Sas-dijitalProducts.com)</td>
                          <td className="p-2 text-emerald-400 break-all">google-site-verification=sas-dijitalproducts-domain-token-2026</td>
                          <td className="p-2 text-slate-400">3600 (Auto)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Method B: HTML Meta Tag */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">
                      ڕێگەی دووەم: تاگی مێتا لە ناو ماڵپەڕ (HTML Tag)
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('<meta name="google-site-verification" content="sas-dijitalproducts-meta-token-2026" />');
                        setCopiedMeta(true);
                        setTimeout(() => setCopiedMeta(false), 2000);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1"
                    >
                      {copiedMeta ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedMeta ? 'کۆپیکرا' : 'کۆپی کۆد'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                    {'<meta name="google-site-verification" content="sas-dijitalproducts-meta-token-2026" />'}
                  </pre>
                  <p className="text-[11px] text-slate-400">
                    {isKu 
                      ? 'ئەم دێڕە کۆدە ڕاستەوخۆ دەخرێتە ناو بەشی <head> ی فایلی index.html (کە ئێمە پێشوەختە لە پڕۆژەکەدا ئامادەمان کردووە).'
                      : 'Placed inside the <head> tag of your webpage entry point.'}
                  </p>
                </div>

              </div>

              {/* Step 3: Submitting the Sitemap */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-bold text-white mb-1">
                      {isKu ? 'ناردنی فایلی Sitemap.xml دوای سەلماندن (Submitting Sitemap)' : 'Submit Sitemap in Google Search Console'}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isKu ? (
                        <>
                          کاتێک دۆمەینەکە پشتڕاستکرایەوە، لە مێنیوی دەستی چەپی Google Search Console کلیک لەسەر <strong>Sitemaps</strong> بکە. لە بەشی <strong>Add a new sitemap</strong>، پاشگری <strong>sitemap.xml</strong> بنووسە و دوگمەی <strong>Submit</strong> دابگرە.
                        </>
                      ) : (
                        <>
                          Once verified, go to the <strong>Sitemaps</strong> tab in Search Console, type <strong>sitemap.xml</strong> under "Add a new sitemap", and click <strong>Submit</strong>.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Interactive Simulated Search Console Submit Box */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 font-sans text-start">
                  <div className="text-xs font-bold text-slate-300">
                    Google Search Console &gt; Sitemaps Simulator:
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs">
                      <span className="text-slate-500 font-mono">https://Sas-dijitalProducts.com/</span>
                      <span className="text-emerald-400 font-mono font-bold">sitemap.xml</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSitemapSubmitted(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
                    >
                      Submit Sitemap
                    </button>
                  </div>

                  {sitemapSubmitted && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs flex items-center justify-between text-emerald-300 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Sitemap submitted successfully!</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-300">
                        Status: <strong className="text-emerald-400">Success</strong> • Discovered URLs: <strong>{products.length + 1}</strong>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>Direct Sitemap URL:</span>
                    <a
                      href="/sitemap.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>https://Sas-dijitalProducts.com/sitemap.xml</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Step 4: URL Inspection for Instant Indexing */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white mb-1">
                    {isKu ? 'داواکردنی پشکنین و بڵاوبوونەوەی دەستبەجێ (Request Indexing)' : 'Instant Indexing via URL Inspection'}
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isKu ? (
                      <>
                        دوای ئەوەی هەر بەرهەمێکی نوێت زیاد کرد، دەتوانیت لە بەشی سەرەوەی Search Console لە بەشی <strong>Inspect any URL</strong> ناونیشانی بەرهەمەکە دابنێیت (وەک: <code>https://Sas-dijitalProducts.com/#product-prod-1</code>) و دوگمەی <strong>Request Indexing</strong> دابگریت تا لە ماوەی چەند کاژێرێکدا لە گووگڵ دەربکەوێت.
                      </>
                    ) : (
                      <>
                        For urgent product launches, paste the specific product URL into the top search bar in GSC ("Inspect any URL") and click <strong>Request Indexing</strong> for expedited crawling.
                      </>
                    )}
                  </p>
                </div>
              </div>

            </div>
          )}
          
          {/* TAB 1: Direct Answer */}
          {activeTab === 'answer' && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-300 font-bold text-base">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h4>{isKu ? 'وەڵامی زانستی و کرداری: نەخێر، پێویستت بە باکێند و داتابەیسی گەورە نییە!' : 'Definitive Answer: No Large Backend Required!'}</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {isKu ? (
                    <>
                      ڕۆبۆتەکانی گووگڵ (Googlebots) ناچنە ناو داتابەیسی تۆ! گووگڵ تەنها سەردانی ڕووی لاپەڕەکانت دەکات لە ڕێگەی فایلی <strong>sitemap.xml</strong> و پێکهاتەی <strong>Schema.org JSON-LD</strong>. هەتا ماڵپەڕەکە سووکتر و خێراتر بێت، گووگڵ نمرەی بەرزتری پێدەدات (Core Web Vitals).
                    </>
                  ) : (
                    <>
                      Google crawlers never inspect internal databases. They consume public HTML, meta tags, sitemap.xml, and Schema.org rich snippets. Lean, fast architectures actually outrank heavy bloated backends on search result pages!
                    </>
                  )}
                </p>
              </div>

              {/* 3 Pillars Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit mb-3">
                    <FileCode2 className="w-5 h-5" />
                  </div>
                  <h5 className="text-sm font-bold text-white mb-1">
                    {isKu ? '١. ناساندنی خودکار (Sitemap)' : '1. XML Sitemap'}
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isKu
                      ? 'هەموو بەرهەمێک کە زیاد دەکەیت خۆکار دەچێتە ناو /sitemap.xml تا گووگڵ دەستبەجێ بیخوێنێتەوە.'
                      : 'Every product automatically appends to /sitemap.xml for crawler discovery.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h5 className="text-sm font-bold text-white mb-1">
                    {isKu ? '٢. دەرکەوتنی ئەستێرە و نرخ' : '2. Rich Snippets'}
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isKu
                      ? 'بە بەکارهێنانی ستانداردی Schema.org، نرخی بەرهەمەکە و ڕەیتینگی 5 ئەستێرە ڕاستەوخۆ لە ناو گووگڵ دەردەکەوێت.'
                      : 'Schema.org Product embeds ratings, in-stock state, and price directly on Google SERP.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 w-fit mb-3">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h5 className="text-sm font-bold text-white mb-1">
                    {isKu ? '٣. خێرایی ١٠٠٪ و تێچووی $٠' : '3. 100% Speed & $0 Cost'}
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isKu
                      ? 'بەبێ سێرڤەری گرانبەها، ماڵپەڕەکە لە که‌متر لە یەک چرکەدا دەکرێتەوە کە یەکێکە لە گرنگترین مەرجەکانی گووگڵ بۆ پلەی یەکەم.'
                      : 'Sub-second loading times satisfying Google Core Web Vitals with zero database overhead.'}
                  </p>
                </div>

              </div>

              {/* Useful Links */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">
                    {isKu ? 'بەستەری سایتمەپی ماڵپەڕەکەت بۆ گووگڵ:' : 'Your Live Sitemap Link:'}
                  </div>
                  <div className="text-xs font-mono text-emerald-400">{sitemapUrl}</div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={sitemapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isKu ? 'کردنەوە' : 'Open'}</span>
                  </a>

                  <button
                    onClick={handleCopySitemap}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    {copiedSitemap ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSitemap ? (isKu ? 'کۆپیکرا' : 'Copied') : (isKu ? 'کۆپی بەستەر' : 'Copy')}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SERP Preview */}
          {activeTab === 'serp' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isKu ? 'پێشبینینی دەرکەوتن لە گووگڵ (SERP Simulator)' : 'Live Google Search Simulator'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isKu ? 'چۆن بەرهەمەکانت لە مۆبایل و کۆمپیوتەری کڕیاران دەبینرێن' : 'Realistic Google search result snippet'}
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1 rounded-lg transition-colors ${previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                  >
                    📱 Mobile
                  </button>
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1 rounded-lg transition-colors ${previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                  >
                    💻 Desktop
                  </button>
                </div>
              </div>

              {/* Simulated Google Search Box */}
              <div className={`mx-auto bg-slate-950 p-6 rounded-2xl border border-slate-800 font-sans text-start ${previewDevice === 'mobile' ? 'max-w-md' : 'w-full'}`}>
                
                {/* Search query representation */}
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800/80 text-xs text-slate-400">
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-200 font-medium">بەرهەمە دیجیتاڵییەکان Sas-dijitalProducts</span>
                </div>

                {/* Simulated Result 1: Homepage */}
                <div className="space-y-1 mb-6">
                  <a
                    href={baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs w-fit hover:opacity-80 transition-opacity"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                      S
                    </div>
                    <div>
                      <div className="text-slate-200 font-semibold leading-none">Sas-dijitalProducts</div>
                      <div className="text-[11px] text-slate-500">{baseUrl}</div>
                    </div>
                  </a>
                  <h3 className="text-lg font-medium leading-tight">
                    <a
                      href={baseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      Sas-dijitalProducts – پلاتفۆرمی بەرهەمە دیجیتاڵییەکان لە گووگڵ
                    </a>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    پلاتفۆرمی سەرەکی بۆ ناساندن، بەڕێوەبردن و کۆکردنەوەی تەواوی ماڵپەڕ، پۆڕتاڵ و سیستەمە ئەلیکترۆنییەکان لە یەک شوێندا...
                  </p>
                </div>

                {/* Simulated Result 2: Product Rich Snippet */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                  <a
                    href={`${baseUrl}/products/${sampleProduct.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs w-fit hover:text-indigo-300 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-[9px] text-white font-bold">
                      S
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {typeof window !== 'undefined' ? window.location.host : 'Sas-dijitalProducts.com'} › products › {sampleProduct.id}
                    </div>
                  </a>
                  <h4 className="text-base font-semibold leading-snug">
                    <a
                      href={`${baseUrl}/products/${sampleProduct.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      {sampleProduct.titleKu || sampleProduct.titleEn} | Sas-dijitalProducts
                    </a>
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
                    <span>★★★★★</span>
                    <span>{sampleProduct.rating || 5.0} ({sampleProduct.reviewsCount || 42} پێداچوونەوە)</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-emerald-400 font-bold">{sampleProduct.price === 0 ? 'Free' : `$${sampleProduct.price?.toFixed(2) || '19.99'}`}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">بەردەستە (In Stock)</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {sampleProduct.descriptionKu || sampleProduct.descriptionEn}
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: Schema.org Structured Data */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isKu ? 'کۆدی پێکهاتەی Schema.org کە گووگڵ دەیخوێنێتەوە' : 'Schema.org JSON-LD Output'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isKu ? 'ئەم داتایە بە شێوەی خۆکار لە ماڵپەڕەکەتدا چێنراوە' : 'Injected into HTML for Googlebot rich results'}
                  </p>
                </div>

                <button
                  onClick={handleCopySchema}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? (isKu ? 'کۆپیکرا' : 'Copied') : (isKu ? 'کۆپیکردنی JSON-LD' : 'Copy')}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-80 leading-relaxed">
                {schemaJson}
              </pre>
            </div>
          )}

          {/* TAB 4: 4 Steps Indexing */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white mb-2">
                {isKu ? '٤ هەنگاوی ئاسان بۆ بڵاوکردنەوەی تەواوی ماڵپەڕەکەت لە گووگڵ (١٠٠٪ بێ بەرامبەر):' : '4-Step Free Google Indexing Workflow:'}
              </h4>

              <div className="space-y-3">
                
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white mb-1">
                      {isKu ? 'چوونە ژوورەوە بۆ Google Search Console' : 'Open Google Search Console'}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed mb-2">
                      {isKu
                        ? 'سەردانی search.google.com بکە بە جیمەیڵەکەت و لینکی ماڵپەڕەکەت دابنێ وەک ماڵپەڕی خاوەندارێتی.'
                        : 'Navigate to Google Search Console and add your web property URL.'}
                    </p>
                    <a
                      href="https://search.google.com/search-console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:underline font-semibold"
                    >
                      <span>search.google.com</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white mb-1">
                      {isKu ? 'ناردنی لینکی Sitemap.xml' : 'Submit sitemap.xml'}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isKu
                        ? 'لە بەشی Sitemaps لە دەستی چەپ، وشەی "sitemap.xml" بنووسە و دوگمەی Submit دابگرە. بەم کارە گووگڵ هەموو بەرهەمەکانت بە یەک جار دەدۆزێتەوە!'
                        : 'In the Sitemaps tab, enter "sitemap.xml" and submit. Google crawls all product URLs simultaneously.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white mb-1">
                      {isKu ? 'داواکردنی ڕیزبەندی خێرا (Request Indexing)' : 'Request Instant Indexing'}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isKu
                        ? 'لە بەشی سەرەوە (URL Inspection) لینکی بەرهەمێکی نوێت دابنێ و کلیک لە "Request Indexing" بکە تا لە ماوەی چەند کاژێرێکدا لە گووگڵ دەربکەوێت.'
                        : 'Use URL Inspection to request rapid indexing for newly launched digital products.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-violet-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white mb-1">
                      {isKu ? 'بڵاوکردنەوەی بەستەرەکان لە سۆشیال میدیا (Backlinks)' : 'Social Backlinks'}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isKu
                        ? 'کاتێک لینکەکانت لە کەناڵی تەلەگرام، ئینستاگرام، فەیسبووک و لینکیدین دادەنێیت، گووگڵ پەیپێدەبات و دەستبەجێ بەهای بەرهەمەکانت بەرز دەکاتەوە.'
                        : 'Sharing links on social networks triggers Google crawler visits even faster.'}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: Backup / Portability */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white">
                  {isKu ? 'پاراستنی سەربەخۆ و هەناردەکردنی بەرهەمەکان (Data Portability)' : 'Data Portability & Backups'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isKu ? 'تەواوی داتاکانت هی خۆتە بەبێ وابەستەبوون بە هیچ پلاتفۆرمێکی تر' : 'Export and import your entire digital product catalog anytime'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                  <Download className="w-8 h-8 text-indigo-400 mx-auto" />
                  <h5 className="text-sm font-bold text-white">{isKu ? 'داگرتنی داتای بەرهەمەکان (JSON)' : 'Export Products JSON'}</h5>
                  <p className="text-xs text-slate-400">
                    {isKu ? 'تەواوی بەرهەم، وێنە و بەستەرەکانت لە یەک فایلی سووکدا هەڵبگرە.' : 'Save an offline snapshot of your catalog.'}
                  </p>
                  <button
                    onClick={handleExportBackup}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                  >
                    {isKu ? 'هەناردەکردن' : 'Export File'}
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                  <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h5 className="text-sm font-bold text-white">{isKu ? 'گەڕاندنەوەی داتا (Import Backup)' : 'Import Backup'}</h5>
                  <p className="text-xs text-slate-400">
                    {isKu ? 'فایلێکی کۆن باربکە بۆ نوێکردنەوە یان گواستنەوەی بەرهەمەکانت.' : 'Upload a JSON backup to restore all products.'}
                  </p>
                  <label className="inline-block cursor-pointer px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">
                    <span>{isKu ? 'هەڵبژاردنی فایل' : 'Choose File'}</span>
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
