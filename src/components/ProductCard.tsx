import React, { useState } from 'react';
import { 
  Download, 
  ExternalLink, 
  Eye, 
  Star, 
  Share2, 
  Check, 
  Tag, 
  FileCode2, 
  Sparkles,
  Edit3,
  Trash2,
  HardDrive,
  TrendingUp,
  Clock,
  Building
} from 'lucide-react';
import { DigitalProduct } from '../types';

interface ProductCardProps {
  product: DigitalProduct;
  language: 'ku' | 'en';
  onViewDetails: (product: DigitalProduct) => void;
  onEdit: (product: DigitalProduct) => void;
  onDelete: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const isKu = language === 'ku';

  const title = isKu ? (product.titleKu || product.titleEn) : (product.titleEn || product.titleKu);
  const description = isKu ? (product.descriptionKu || product.descriptionEn) : (product.descriptionEn || product.descriptionKu);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/products/${product.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'city-management':
        return { label: isKu ? 'بەڕێوەبردنی شار و کۆمەڵگە' : 'City & Compound ERP', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'financial-systems':
        return { label: isKu ? 'سیستەمی دارایی و ژمێریاری' : 'Financial & Accounting', color: 'bg-teal-500/15 text-teal-300 border-teal-500/30' };
      case 'management-erp':
        return { label: isKu ? 'سیستەمی بەڕێوەبردن (ERP)' : 'Management System', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'mobile-apps':
        return { label: isKu ? 'ئەپی مۆبایل' : 'Mobile App', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
      case 'desktop-software':
        return { label: isKu ? 'بەرنامەی کۆمپیوتەر' : 'Desktop Software', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'websites':
        return { label: isKu ? 'ماڵپەڕ و پلاتفۆرم' : 'Web & Portal', color: 'bg-sky-500/15 text-sky-300 border-sky-500/30' };
      case 'software':
        return { label: isKu ? 'کۆد و سکریپت' : 'Software & Code', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'ebooks':
        return { label: isKu ? 'کتێبی ئەلیکترۆنی' : 'Ebooks', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'templates':
        return { label: isKu ? 'قاڵب و تێمپلێت' : 'Templates', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'design':
        return { label: isKu ? 'دیزاین و گرافیک' : 'UI & Graphics', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' };
      case 'ai-assets':
        return { label: isKu ? 'پەڕگەی AI و پرۆمپت' : 'AI Prompts & Data', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'audio':
        return { label: isKu ? 'دەنگ و مۆسیقا' : 'Audio & Music', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'courses':
        return { label: isKu ? 'کۆرس و فێرکاری' : 'Courses & Videos', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      default:
        return { label: isKu ? 'بەرهەمی دیجیتاڵی' : 'Digital Solution', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'live':
        return { label: isKu ? 'لەکاردا (Live)' : 'Live', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'completed':
        return { label: isKu ? 'تەواوکراو' : 'Completed', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'testing':
        return { label: isKu ? 'تاقیکردنەوە QA' : 'Testing', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'planning':
        return { label: isKu ? 'پلانداڕێژی' : 'Planning', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'delayed':
        return { label: isKu ? 'دواکەوتوو' : 'Delayed', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
      default:
        return { label: isKu ? 'لە جێبەجێکردندا' : 'In Progress', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
    }
  };

  const badge = getCategoryBadge(product.category);
  const statusBadge = getStatusBadge(product.projectStatus);

  // Infographic progress is shown if product explicitly has progressPercent,
  // or if it's a holding/management/city ERP type product or has targetDeadline/clientOrHoldingName
  const isManagementType = ['city-management', 'management-erp', 'financial-systems'].includes(product.category);
  const hasProgress = product.progressPercent !== undefined || isManagementType || Boolean(product.targetDeadline) || Boolean(product.clientOrHoldingName);
  const progressValue = product.progressPercent !== undefined 
    ? product.progressPercent 
    : (isManagementType ? 65 : 0);

  return (
    <div 
      id={`product-${product.id}`}
      className="group relative bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-indigo-950/40"
    >
      {/* Product Image Area */}
      <div 
        className="relative aspect-[16/10] overflow-hidden bg-slate-950 cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Badges on Top */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-md ${badge.color}`}>
            {badge.label}
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {product.isFree ? (
              <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-500 text-slate-950 shadow-md">
                {isKu ? 'بێ بەرامبەر (خۆڕایی)' : 'FREE'}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-600 text-white shadow-md">
                ${product.price?.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Quick format & size indicator */}
        <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center gap-1 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-800">
            <FileCode2 className="w-3 h-3 text-indigo-400" />
            <span className="truncate max-w-[130px]">{product.fileType || 'Digital Pack'}</span>
          </div>
          {product.fileSize && (
            <div className="flex items-center gap-1 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-800">
              <HardDrive className="w-3 h-3 text-slate-400" />
              <span>{product.fileSize}</span>
            </div>
          )}
        </div>
      </div>

      {/* Product Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & reviews */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-slate-200">{product.rating || 5.0}</span>
              <span className="text-slate-500">({product.reviewsCount || 1})</span>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleCopyLink}
                title={isKu ? 'کۆپیکردنی بەستەری بەرهەم' : 'Copy product link'}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
                <span>{copied ? (isKu ? 'کۆپیکرا' : 'Copied') : (isKu ? 'بەشکردن' : 'Share')}</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <h2 
            onClick={() => onViewDetails(product)}
            className="text-base sm:text-lg font-bold text-white hover:text-indigo-400 transition-colors line-clamp-2 cursor-pointer mb-2"
          >
            {title}
          </h2>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {product.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  #{tag}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="text-[10px] px-1 py-0.5 text-slate-500">
                  +{product.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Executive CEO & Holding Infographic Progress Field */}
          {hasProgress && (
            <div className="my-2.5 p-3 rounded-xl bg-slate-950/80 border border-indigo-500/25 shadow-inner space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[11px] font-semibold text-slate-300">
                    {isKu ? 'ڕادەی جێبەجێکردن (Executive KPI):' : 'Progress (CEO / Holding):'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-xs text-emerald-400">
                    {progressValue}%
                  </span>
                  {product.projectStatus && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar Infographic */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 p-[1px]">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
                  style={{ width: `${Math.min(100, Math.max(0, progressValue))}%` }}
                />
              </div>

              {/* Target Deadline & Holding or Milestones Details */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-0.5 gap-1">
                <div className="flex items-center gap-1 text-[10px]">
                  <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>
                    {isKu ? 'وادەی دانراو:' : 'Deadline:'}{' '}
                    <strong className="text-slate-300 font-medium">
                      {product.targetDeadline || (isKu ? 'بەپێی پلانی CEO' : 'On Schedule')}
                    </strong>
                  </span>
                </div>

                {product.clientOrHoldingName && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300 font-medium truncate max-w-[130px]">
                    🏢 {product.clientOrHoldingName}
                  </span>
                )}

                {product.milestonesTotal !== undefined && product.milestonesTotal > 0 && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    {product.milestonesCompleted || 0}/{product.milestonesTotal} {isKu ? 'قۆناغ' : 'steps'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
          
          {/* Prominent Action Button: If Website or Free => Open Platform directly, If Paid => Buy Now */}
          {product.category === 'websites' || product.isFree ? (
            <a
              href={product.demoUrl || product.purchaseUrl || product.downloadUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950 hover:scale-[1.02]"
              title={isKu ? 'سەردانیکردن و کردنەوەی پلاتفۆرمەکە' : 'Open / Visit Live Platform'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isKu ? 'کردنەوە و سەردانیکردن' : 'Open Platform'}</span>
            </a>
          ) : (
            <a
              href={product.purchaseUrl || `https://Sas-dijitalProducts.com/buy/${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 hover:scale-[1.02]"
              title={isKu ? 'کڕینی دەستبەجێ بەستەر' : 'Instant Buy Now'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isKu ? 'کڕینی ئێستا (Buy Now)' : 'Buy Now'}</span>
            </a>
          )}

          {/* Quick Download if available */}
          {product.downloadUrl && (
            <a
              href={product.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
              title={isKu ? 'داگرتنی فایل' : 'Download File'}
            >
              <Download className="w-4 h-4" />
            </a>
          )}

          {/* Details Modal Trigger */}
          <button
            onClick={() => onViewDetails(product)}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title={isKu ? 'بینینی هەموو زانیاری و بەستەرەکان' : 'View Full Details'}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(product)}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-indigo-400 border border-slate-700/60 transition-colors"
            title={isKu ? 'دەستکاریکردنی بەرهەم' : 'Edit Product'}
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(product.id)}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/60 transition-colors"
            title={isKu ? 'سڕینەوە' : 'Delete Product'}
          >
            <Trash2 className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
};
