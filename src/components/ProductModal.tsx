import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Check, 
  Star, 
  Share2, 
  HardDrive, 
  FileCode2, 
  ShieldCheck, 
  Search, 
  Copy,
  Edit3,
  Calendar,
  Globe2,
  TrendingUp,
  Clock,
  Building,
  CheckCircle2
} from 'lucide-react';
import { DigitalProduct, Language } from '../types';
import { ProjectTimeline } from './ProjectTimeline';
import { PriceTrendChart } from './PriceTrendChart';

interface ProductModalProps {
  product: DigitalProduct | null;
  language: Language;
  onClose: () => void;
  onEdit: (product: DigitalProduct) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  language,
  onClose,
  onEdit,
}) => {
  if (!product) return null;

  const [copiedLink, setCopiedLink] = useState(false);
  const isKu = language === 'ku';
  const isAr = language === 'ar';
  const isEn = language === 'en';

  const title = isAr
    ? (product.titleAr || product.titleKu || product.titleEn)
    : isKu
    ? (product.titleKu || product.titleEn)
    : (product.titleEn || product.titleKu);

  const description = isAr
    ? (product.descriptionAr || product.descriptionKu || product.descriptionEn)
    : isKu
    ? (product.descriptionKu || product.descriptionEn)
    : (product.descriptionEn || product.descriptionKu);

  const productUrl =
    typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')
      ? `${window.location.origin}${window.location.pathname}?product=${product.id}`
      : `${typeof window !== 'undefined' ? window.location.origin : ''}/products/${product.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl shadow-indigo-950/50 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {product.category.toUpperCase()}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isKu ? 'تەواوی بەستەرەکان پشتڕاستکراون' : isAr ? 'كافة الروابط موثوقة' : 'Verified Links'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
              title={isKu ? 'کۆپیکردنی لینکی بەرهەم' : isAr ? 'نسخ رابط المنتج' : 'Copy link'}
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? (isKu ? 'کۆپیکرا' : isAr ? 'تم النسخ!' : 'Copied!') : (isKu ? 'بەشکردن' : isAr ? 'مشاركة' : 'Share')}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-400 transition-colors"
              title={isKu ? 'دەستکاریکردن' : isAr ? 'تعديل' : 'Edit'}
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Main Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Visual Cover */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner group">
              <img
                src={product.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'}
                alt={title}
                className="w-full h-auto aspect-square sm:aspect-[4/3] object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 text-xs font-black text-indigo-400">
                {product.isFree ? (isKu ? 'خۆڕایی' : isAr ? 'مجاناً' : 'FREE') : `$${product.price?.toFixed(2)}`}
              </div>
            </div>

            {/* Core Details & Links */}
            <div className="flex flex-col justify-between space-y-5">
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-white text-sm">{product.rating || 5.0}</span>
                    <span className="text-slate-500">({product.reviewsCount || 1} {isKu ? 'پێداچوونەوە' : isAr ? 'تقييم' : 'reviews'})</span>
                  </div>
                  <span className="text-slate-600">•</span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {title}
                </h2>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/60">
                    <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isKu ? 'فۆرمات: ' : isAr ? 'الصيغة: ' : 'Format: '}{product.fileType || 'Digital Pack'}</span>
                  </span>
                  {product.fileSize && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/60">
                      <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isKu ? 'قەبارە: ' : isAr ? 'الحجم: ' : 'Size: '}{product.fileSize}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isKu ? 'بەستەرە سەرەکییەکان و دەستڕاگەیشتن:' : isAr ? 'روابط الوصول المباشر والمنصة:' : 'Direct Links & Access:'}
                </h4>

                <div className="flex flex-col gap-2.5">
                  {/* Primary Live Platform / Website Link */}
                  {(product.category === 'websites' || product.isFree) && (product.demoUrl || product.purchaseUrl) && (
                    <a
                      href={product.demoUrl || product.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                    >
                      <Globe2 className="w-4 h-4" />
                      <span>{isKu ? 'کردنەوە و سەردانیکردنی ڕاستەوخۆ (سەردانی پلاتفۆرم)' : isAr ? 'فتح وزيارة المنصة مباشرة' : 'Open & Visit Live Platform'}</span>
                    </a>
                  )}

                  {product.downloadUrl && (
                    <a
                      href={product.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isKu ? 'داگرتنی ڕاستەوخۆ (Google Drive / Telegram / File)' : isAr ? 'تحميل مباشر (Google Drive / Telegram / ملف)' : 'Direct Download / Drive Access'}</span>
                    </a>
                  )}

                  {!product.isFree && product.purchaseUrl && (
                    <a
                      href={product.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{isKu ? 'کڕین لە ماڵپەڕی فرۆش (Gumroad / BuyMeACoffee / Stripe)' : 'Buy on External Store'}</span>
                    </a>
                  )}

                  {!product.isFree && product.demoUrl && (
                    <a
                      href={product.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all"
                    >
                      <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isKu ? 'بینینی پێشوەختە / دیمۆ (Live Preview)' : 'Live Demo / Preview'}</span>
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Full Description & Features */}
          <div className="space-y-6 pt-4 border-t border-slate-800/80">
            {/* Executive CEO & Holding Infographic Progress Dashboard */}
            {(product.progressPercent !== undefined ||
              ['city-management', 'management-erp', 'financial-systems'].includes(product.category) ||
              product.targetDeadline ||
              product.clientOrHoldingName) && (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <TrendingUp className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <span>{isKu ? 'ئنفۆگرافیکی جێبەجێکردنی کار (تایبەت بە CEO و هۆڵدینگ)' : 'Executive Infographic Progress (CEO & Holding)'}</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        {isKu ? 'ڕادەی بەدەستهاتنی ئامانجەکان لەگەڵ ماوە و وادەی دانراو' : 'Milestone accomplishment & deadline tracking metrics'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {product.clientOrHoldingName && (
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-indigo-300 font-semibold flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{product.clientOrHoldingName}</span>
                      </span>
                    )}

                    <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                      {product.projectStatus === 'live'
                        ? (isKu ? 'لەکاردا (Live)' : 'Live')
                        : product.projectStatus === 'completed'
                        ? (isKu ? 'تەواوکراو' : 'Completed')
                        : product.projectStatus === 'testing'
                        ? (isKu ? 'تاقیکردنەوە QA' : 'Testing')
                        : product.projectStatus === 'planning'
                        ? (isKu ? 'پلانداڕێژی' : 'Planning')
                        : product.projectStatus === 'delayed'
                        ? (isKu ? 'دواکەوتوو' : 'Delayed')
                        : (isKu ? 'لە جێبەجێکردندا' : 'In Progress')}
                    </span>
                  </div>
                </div>

                {/* Progress Metric & Visual Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">
                      {isKu ? 'ڕێژەی ئەنجامدراو بەراورد بە تەواوی پڕۆژەکە:' : 'Overall Project Completion Rate:'}
                    </span>
                    <span className="font-mono font-black text-lg text-emerald-400">
                      {product.progressPercent !== undefined
                        ? product.progressPercent
                        : (['city-management', 'management-erp', 'financial-systems'].includes(product.category) ? 65 : 0)}%
                    </span>
                  </div>

                  {/* Gradient Progress Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-3.5 overflow-hidden border border-slate-800 p-[2px]">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm shadow-emerald-500/50"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            product.progressPercent !== undefined
                              ? product.progressPercent
                              : (['city-management', 'management-erp', 'financial-systems'].includes(product.category) ? 65 : 0)
                          )
                        )}%`
                      }}
                    />
                  </div>
                </div>

                {/* KPI Metrics Grid: Deadline, Milestones, Performance */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isKu ? 'وادەی دانراو (Deadline):' : 'Target Deadline:'}</span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {product.targetDeadline || (isKu ? 'بەپێی خشتەی سەرۆکایەتی' : 'On Schedule')}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isKu ? 'قۆناغە بەدەستهاتووەکان:' : 'Milestones Completed:'}</span>
                    </div>
                    <div className="text-sm font-bold text-emerald-400 font-mono">
                      {product.milestonesCompleted || 0} / {product.milestonesTotal || 10} {isKu ? 'قۆناغ' : 'steps'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{isKu ? 'دۆخی هەڵسەنگاندنی CEO:' : 'Executive Assessment:'}</span>
                    </div>
                    <div className="text-sm font-bold text-indigo-300">
                      {(product.progressPercent || 0) >= 90
                        ? (isKu ? 'ئامادە بۆ وەرگرتنی کۆتایی' : 'Ready for final sign-off')
                        : (product.progressPercent || 0) >= 50
                        ? (isKu ? 'بەرەوپێشچوونی خێرا' : 'High velocity progress')
                        : (isKu ? 'پابەند بە ڕێڕەوی کار' : 'On track with roadmap')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Visual Timeline Component - Chronological Project Roadmap for Management Products */}
            {(['city-management', 'management-erp', 'financial-systems'].includes(product.category) ||
              product.progressPercent !== undefined ||
              Boolean(product.targetDeadline) ||
              Boolean(product.milestonesTotal)) && (
              <ProjectTimeline product={product} language={language} />
            )}

            {/* Financial Valuation & Price Trend Chart (Recharts) */}
            {(['financial-systems', 'city-management', 'management-erp'].includes(product.category) ||
              product.valuationHistory ||
              product.priceHistory ||
              product.price > 0 ||
              product.progressPercent !== undefined) && (
              <PriceTrendChart product={product} language={language} />
            )}

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                {isKu ? 'دەربارەی بەرهەمەکە' : 'About this product'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Features Checklist */}
            {product.features && product.features.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-white mb-3">
                  {isKu ? 'تایبەتمەندی و ناوەڕۆکەکانی ئەم پاکێجە:' : "What's included in this pack:"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 mb-2">
                  {isKu ? 'تاگەکانی گەڕان:' : 'Search Keywords & Tags:'}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/50">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Google SERP Appearance Simulation Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1.5 font-bold text-indigo-300">
                  <Search className="w-3.5 h-3.5 text-indigo-400" />
                  {isKu ? 'نموونەی دەرکەوتنی ئەم بەرهەمە لە گووگڵ (Google SERP Snippet)' : 'Google Search Snippet Preview'}
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">Schema.org Product Active</span>
              </div>

              {/* Working Google Search Result Box */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 font-sans text-start space-y-1.5">
                {/* Real Clickable Host & Path Breadcrumb */}
                <a 
                  href={productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors w-fit"
                  title={isKu ? 'کردنەوەی ناونیشانی فەرمیی ئەم لاپەڕەیە' : 'Open canonical product page'}
                >
                  <span className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-[9px] text-white font-bold shrink-0">
                    S
                  </span>
                  <span className="text-slate-300 font-medium">
                    {typeof window !== 'undefined' ? window.location.host : 'Sas-dijitalProducts.com'}
                  </span>
                  <span className="text-slate-500">› products › {product.id}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 ms-1" />
                </a>

                {/* Real Clickable Blue Title - Opens Live Platform directly */}
                <h4 className="text-base sm:text-lg font-semibold leading-snug">
                  <a
                    href={product.demoUrl || product.purchaseUrl || product.downloadUrl || productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1.5"
                    title={isKu ? 'کلیک بکە بۆ کردنەوەی ڕاستەوخۆ' : 'Click to open live product'}
                  >
                    <span>{title} | Sas-dijitalProducts</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </h4>

                {/* Rating & Stock Rich Snippet Metadata */}
                <div className="flex items-center gap-2 text-xs text-amber-300 my-1">
                  <span>★★★★★</span>
                  <span>{product.rating || 5.0} ({product.reviewsCount || 1})</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-semibold">{product.isFree ? (isKu ? 'بێبەرامبەر (Free)' : 'Free') : `$${product.price?.toFixed(2)}`}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{isKu ? 'بەردەستە (In stock)' : 'In stock'}</span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Action Toolbar for Google snippet */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
                <a
                  href={product.demoUrl || product.purchaseUrl || product.downloadUrl || productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-950 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isKu ? 'کردنەوەی بەستەرەکە ئێستا' : 'Open Live Link'}</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? (isKu ? 'کۆپیکرا!' : 'Copied!') : (isKu ? 'کۆپی بەستەری گووگڵ' : 'Copy Google URL')}</span>
                </button>

                <a
                  href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(productUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 flex items-center gap-1.5 transition-colors"
                  title="Test Schema markup on Google Search Console"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isKu ? 'پشکنین لە Google Rich Results' : 'Test on Google Rich Results'}</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
