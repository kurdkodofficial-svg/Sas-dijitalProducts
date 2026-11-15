import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2, 
  FileCode2, 
  DollarSign, 
  Link, 
  Image as ImageIcon,
  Save,
  Loader2,
  Wand2,
  TrendingUp,
  Clock,
  Building,
  Calendar
} from 'lucide-react';
import { DigitalProduct, Language } from '../types';

interface ProductEditorModalProps {
  product: DigitalProduct | null;
  isOpen: boolean;
  language: Language;
  initialCategory?: DigitalProduct['category'];
  onClose: () => void;
  onSave: (productData: Partial<DigitalProduct>) => Promise<void>;
  onOpenImageStudioWithPrompt: (initialPrompt: string) => void;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  isOpen,
  language,
  initialCategory,
  onClose,
  onSave,
  onOpenImageStudioWithPrompt,
}) => {
  if (!isOpen) return null;

  const isKu = language === 'ku';
  const isAr = language === 'ar';
  const isEn = language === 'en';

  const [titleKu, setTitleKu] = useState(product?.titleKu || '');
  const [titleAr, setTitleAr] = useState(product?.titleAr || '');
  const [titleEn, setTitleEn] = useState(product?.titleEn || '');
  const [descriptionKu, setDescriptionKu] = useState(product?.descriptionKu || '');
  const [descriptionAr, setDescriptionAr] = useState(product?.descriptionAr || '');
  const [descriptionEn, setDescriptionEn] = useState(product?.descriptionEn || '');
  const [category, setCategory] = useState<DigitalProduct['category']>(product?.category || initialCategory || 'city-management');
  const [price, setPrice] = useState(product?.price !== undefined ? product.price.toString() : '');
  const [isFree, setIsFree] = useState(product?.isFree || false);
  const [fileType, setFileType] = useState(product?.fileType || '');
  const [fileSize, setFileSize] = useState(product?.fileSize || '');
  const [downloadUrl, setDownloadUrl] = useState(product?.downloadUrl || '');
  const [purchaseUrl, setPurchaseUrl] = useState(product?.purchaseUrl || '');
  const [demoUrl, setDemoUrl] = useState(product?.demoUrl || '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [tagsInput, setTagsInput] = useState(product?.tags?.join(', ') || '');
  const [features, setFeatures] = useState<string[]>(product?.features || []);
  const [newFeatureText, setNewFeatureText] = useState('');

  // Executive CEO & Holding Infographic Progress state
  const [progressPercent, setProgressPercent] = useState<number>(
    product?.progressPercent !== undefined ? product.progressPercent : 0
  );
  const [targetDeadline, setTargetDeadline] = useState(product?.targetDeadline || '');
  const [projectStatus, setProjectStatus] = useState<
    'planning' | 'in-progress' | 'testing' | 'completed' | 'live' | 'delayed'
  >(product?.projectStatus || 'in-progress');
  const [milestonesTotal, setMilestonesTotal] = useState<number>(
    product?.milestonesTotal !== undefined ? product.milestonesTotal : 10
  );
  const [milestonesCompleted, setMilestonesCompleted] = useState<number>(
    product?.milestonesCompleted !== undefined ? product.milestonesCompleted : 0
  );
  const [clientOrHoldingName, setClientOrHoldingName] = useState(
    product?.clientOrHoldingName || ''
  );
  const [showProgressSection, setShowProgressSection] = useState(
    Boolean(
      product?.progressPercent !== undefined ||
      product?.targetDeadline ||
      product?.clientOrHoldingName ||
      ['city-management', 'management-erp', 'financial-systems'].includes(category)
    )
  );
  
  const [saving, setSaving] = useState(false);
  const [generatingAiCopy, setGeneratingAiCopy] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    if (product) {
      setTitleKu(product.titleKu || '');
      setTitleEn(product.titleEn || '');
      setDescriptionKu(product.descriptionKu || '');
      setDescriptionEn(product.descriptionEn || '');
      setCategory(product.category || initialCategory || 'city-management');
      setPrice(product.price !== undefined ? product.price.toString() : '');
      setIsFree(product.isFree || false);
      setFileType(product.fileType || '');
      setFileSize(product.fileSize || '');
      setDownloadUrl(product.downloadUrl || '');
      setPurchaseUrl(product.purchaseUrl || '');
      setDemoUrl(product.demoUrl || '');
      setImageUrl(product.imageUrl || '');
      setTagsInput(product.tags?.join(', ') || '');
      setFeatures(product.features || []);
      setProgressPercent(product.progressPercent !== undefined ? product.progressPercent : 0);
      setTargetDeadline(product.targetDeadline || '');
      setProjectStatus(product.projectStatus || 'in-progress');
      setMilestonesTotal(product.milestonesTotal !== undefined ? product.milestonesTotal : 10);
      setMilestonesCompleted(product.milestonesCompleted !== undefined ? product.milestonesCompleted : 0);
      setClientOrHoldingName(product.clientOrHoldingName || '');
      setShowProgressSection(
        product.progressPercent !== undefined ||
        Boolean(product.targetDeadline) ||
        Boolean(product.clientOrHoldingName) ||
        ['city-management', 'management-erp', 'financial-systems'].includes(product.category)
      );
    } else {
      // Clean blank defaults ready for real product input
      setTitleKu('');
      setTitleEn('');
      setDescriptionKu('');
      setDescriptionEn('');
      setCategory(initialCategory || 'city-management');
      setPrice('');
      setIsFree(false);
      setFileType('');
      setFileSize('');
      setDownloadUrl('');
      setPurchaseUrl('');
      setDemoUrl('');
      setImageUrl('');
      setTagsInput('');
      setFeatures([]);
      setProgressPercent(0);
      setTargetDeadline('');
      setProjectStatus('in-progress');
      setMilestonesTotal(10);
      setMilestonesCompleted(0);
      setClientOrHoldingName('');
      setShowProgressSection(
        ['city-management', 'management-erp', 'financial-systems'].includes(initialCategory || '')
      );
    }
  }, [product, initialCategory, isOpen]);

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures([...features, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleGenerateAiCopy = async () => {
    setGeneratingAiCopy(true);
    setAiError('');
    try {
      const res = await fetch('/api/generate-product-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: titleKu || titleEn || 'بەرهەمی دیجیتاڵی',
          category,
          roughNotes: `${descriptionKu || ''} ${fileType} ${features.join(', ')}`,
          language: isKu ? 'ku' : 'en',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.titleKu && !titleKu) setTitleKu(json.data.titleKu);
        if (json.data.titleEn && !titleEn) setTitleEn(json.data.titleEn);
        if (json.data.descriptionKu) setDescriptionKu(json.data.descriptionKu);
        if (json.data.descriptionEn) setDescriptionEn(json.data.descriptionEn);
        if (json.data.features && json.data.features.length) setFeatures(json.data.features);
        if (json.data.tags && json.data.tags.length) setTagsInput(json.data.tags.join(', '));
        if (json.data.suggestedPrice && !isFree) setPrice(json.data.suggestedPrice.toString());
      } else {
        setAiError(json.error || 'نەتوانرا دەقی هۆشمەند دروستبکرێت');
      }
    } catch (e: any) {
      setAiError(e.message || 'هەڵە لە پەیوەندی کردن بە سێرڤەر');
    } finally {
      setGeneratingAiCopy(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await onSave({
        titleKu: titleKu.trim(),
        titleAr: titleAr.trim() || undefined,
        titleEn: titleEn.trim(),
        descriptionKu: descriptionKu.trim(),
        descriptionAr: descriptionAr.trim() || undefined,
        descriptionEn: descriptionEn.trim(),
        category,
        price: isFree ? 0 : parseFloat(price) || 0,
        currency: 'USD',
        isFree,
        fileType: fileType.trim(),
        fileSize: fileSize.trim(),
        downloadUrl: downloadUrl.trim(),
        purchaseUrl: purchaseUrl.trim(),
        demoUrl: demoUrl.trim(),
        imageUrl: imageUrl.trim(),
        tags,
        features,
        progressPercent: showProgressSection ? Number(progressPercent) : undefined,
        targetDeadline: showProgressSection && targetDeadline.trim() ? targetDeadline.trim() : undefined,
        projectStatus: showProgressSection ? projectStatus : undefined,
        milestonesTotal: showProgressSection ? Number(milestonesTotal) : undefined,
        milestonesCompleted: showProgressSection ? Number(milestonesCompleted) : undefined,
        clientOrHoldingName: showProgressSection && clientOrHoldingName.trim() ? clientOrHoldingName.trim() : undefined,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl shadow-indigo-950/50 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/50">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>{product ? (isKu ? 'دەستکاریکردنی بەرهەم' : 'Edit Digital Product') : (isKu ? 'زیادکردنی بەرهەمی نوێ' : 'Add New Digital Product')}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isKu ? 'بەرهەمەکە ڕاستەوخۆ بەستەرەکانی گووگڵ و پەڕگەکانی چالاک دەبێت' : 'Instantly published to Sas-dijitalProducts with Google metadata'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* AI Content Generator Assistant Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-violet-950/60 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-indigo-400" />
                {isKu ? 'یارمەتیدەری هۆشمەند بۆ نووسینی وەسف و ناونیشان' : 'AI Copywriter & SEO Assistant'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {isKu ? 'ناوی کورت بنووسە و کلیك بکە تاوەکو وەسفێکی فرۆشیاری و تاگەکانت بۆ بنووسێت' : 'Generates optimized Kurdish & English product copy using Gemini 3.8 Flash'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateAiCopy}
              disabled={generatingAiCopy}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {generatingAiCopy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>{isKu ? 'نووسینی وردەکاری بە AI' : 'Generate with AI'}</span>
            </button>
          </div>

          {/* Quick preset triggers for projects created with AI */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400">
              {isKu ? 'پڕۆژە بەناوبانگەکانی کە لەگەڵ AI دروست دەکرێن (داگرتنی خێرا):' : 'Common AI-assisted creations (click to autofill template):'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setTitleKu('کۆدی سەرچاوەی ئەپی وێب و پلاتفۆرم (React + Vite)');
                  setTitleEn('Full-Stack Web App Source Code (React & Node.js)');
                  setCategory('software');
                  setFileType('Full GitHub Source Code (.zip)');
                  setPrice('29.00');
                  setTagsInput('React, TypeScript, WebApp, SourceCode, Tailwind');
                  setFeatures(['کۆدی تەواو کراو و ڕێکخراو', 'ئامادە بۆ بڵاوکردنەوە لەسەر Vercel / Cloud Run', 'تەوەرەی تاریک و ڕووناک', 'ڕێبەری دابەزاندن']);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 transition-colors"
              >
                💻 {isKu ? 'ئەپ و کۆدی وێب' : 'Web App Code'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTitleKu('بۆتی ئۆتۆماتیکی تەلەگرام بۆ فرۆشتنی فایل');
                  setTitleEn('Telegram Automated Goods & License Bot');
                  setCategory('software');
                  setFileType('Node.js Bot Source Code');
                  setPrice('39.00');
                  setTagsInput('TelegramBot, Automation, Nodejs, DigitalStore');
                  setFeatures(['کارکردنی خۆکار بەبێ پێویستی بە تۆ', 'پەیوەست بە دەروازەی پارەدان', 'داگرتنی ئاسان بۆ سێرڤەر']);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition-colors"
              >
                🤖 {isKu ? 'بۆتی ئۆتۆمەیشن' : 'Automation Bot'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTitleKu('قاڵبی پیشەیی بەڕێوەبردنی کارەکان و نۆشن');
                  setTitleEn('All-in-One Notion Workflow & Client OS');
                  setCategory('templates');
                  setFileType('Notion Template Link');
                  setPrice('15.00');
                  setTagsInput('Notion, Template, Productivity, CRM');
                  setFeatures(['سیستەمی بەڕێوەبردنی کارەکان', 'خشتەی پڕۆژە و کڕیاران', 'داشبۆردی دارایی']);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-colors"
              >
                📋 {isKu ? 'قاڵبی Notion / Canva' : 'Templates'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTitleKu('کتێبی ئەلیکترۆنی و ڕێبەری تەواوی داهاتی دیجیتاڵی');
                  setTitleEn('Complete Digital Products & AI Income Playbook');
                  setCategory('ebooks');
                  setFileType('PDF + ePub + Notion Vault');
                  setPrice('12.00');
                  setTagsInput('Ebook, Guide, PassiveIncome, AI, PDF');
                  setFeatures(['ڕێبەری هەنگاو بە هەنگاو', 'خشتەی پشکنینی پڕۆژەکان', 'مۆڵەتی بەکارهێنان']);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 transition-colors"
              >
                📚 {isKu ? 'کتێب و نامیلکەی PDF' : 'E-Book / PDF'}
              </button>
            </div>
          </div>

          {aiError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-300">
              {aiError}
            </div>
          )}

          {/* Titles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isKu ? 'ناونیشانی بەرهەم بە کوردی *' : isAr ? 'عنوان المنتج بالكردية *' : 'Kurdish Title *'}
              </label>
              <input
                type="text"
                required
                value={titleKu}
                onChange={(e) => setTitleKu(e.target.value)}
                placeholder="نموونە: سیستەمی بەڕێوەبردنی شار و دارایی"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isKu ? 'ناونیشان بە عەرەبی (Arabic Title)' : isAr ? 'عنوان المنتج بالعربية' : 'Arabic Title'}
              </label>
              <input
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: نظام إدارة المجمعات والأنظمة المالية"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isKu ? 'ناونیشان بە ئینگلیزی (بۆ گووگڵ)' : isAr ? 'العنوان بالإنجليزية (لجوجل)' : 'English Title (For Google)'}
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Modern UI Kit & Management ERP"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Category & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isKu ? 'پۆلێن (Category)' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="city-management">{isKu ? 'سیستەمی بەڕێوەبردنی شار و کۆمەڵگە (شاری ئەندازیاران / گوندی ئیتاڵی)' : 'City & Compound ERP (Engineers City / Italian Village)'}</option>
                <option value="financial-systems">{isKu ? 'سیستەمی دارایی و ژمێریاری' : 'Financial & Accounting ERP'}</option>
                <option value="management-erp">{isKu ? 'سیستەمی بەڕێوەبردن و کارگێڕی' : 'Management & Staff ERP'}</option>
                <option value="mobile-apps">{isKu ? 'ئەپی مۆبایل (iOS / Android)' : 'Mobile Applications'}</option>
                <option value="desktop-software">{isKu ? 'بەرنامەی کۆمپیوتەر (Windows / Mac)' : 'Desktop Software & POS'}</option>
                <option value="websites">{isKu ? 'ماڵپەڕ و پلاتفۆرمی وێب' : 'Websites & Web Portals'}</option>
                <option value="software">{isKu ? 'کۆد و نەرمەکاڵا (Software)' : 'Code & Scripts'}</option>
                <option value="ebooks">{isKu ? 'کتێبی ئەلیکترۆنی (Ebooks)' : 'E-books & Guides'}</option>
                <option value="templates">{isKu ? 'قاڵب و تێمپلێت (Templates)' : 'Templates & Workspaces'}</option>
                <option value="design">{isKu ? 'دیزاین و گرافیک' : 'UI & Graphics'}</option>
                <option value="ai-assets">{isKu ? 'پەڕگەی AI و پرۆمپت' : 'AI Prompts & Models'}</option>
                <option value="other">{isKu ? 'هی تر' : 'Other Assets'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isKu ? 'نرخ بە دۆلار ($)' : 'Price ($ USD)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  disabled={isFree}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 disabled:opacity-40 focus:outline-none focus:border-indigo-500"
                />
                <DollarSign className="w-4 h-4 text-slate-500 absolute top-3 end-3" />
              </div>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-0"
                />
                <span className="text-xs font-bold text-emerald-400">
                  {isKu ? 'بەخۆڕاییە (Free Download)' : 'Free Product'}
                </span>
              </label>
            </div>
          </div>

          {/* File format & Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isKu ? 'جۆری فایل (Format)' : 'File Format'}
              </label>
              <input
                type="text"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                placeholder="Figma / ZIP / PDF / MP3 / Node.js"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isKu ? 'قەبارەی فایل (Size)' : 'File Size'}
              </label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="e.g. 45 MB / 1.2 GB"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Executive CEO & Holding Infographic Progress Tracking Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>{isKu ? 'ئنفۆگرافیکی کاری پڕۆژە (تایبەت بە CEO و خاوەن هۆڵدینگ)' : 'Executive Infographic Progress (CEO & Holding)'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                      {isKu ? 'KPI Tracker' : 'KPI Tracker'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isKu
                      ? 'دیاریکردنی ڕادەی جێبەجێکردن (0-100%)، ماوە و وادەی دانراو (Deadline)، و ناوی هۆڵدینگ/کۆمپانیا'
                      : 'Track project completion status (0-100%), target deadline, and supervising holding/client'}
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showProgressSection}
                  onChange={(e) => setShowProgressSection(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {showProgressSection && (
              <div className="space-y-4 pt-3 border-t border-slate-800/80">
                {/* Progress % Slider & Quick Presets */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <span>{isKu ? 'ڕادەی جێبەجێکردن (Completion Percentage):' : 'Execution Progress (%):'}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black font-mono text-emerald-400">
                        {progressPercent}%
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {progressPercent === 100
                          ? (isKu ? 'تەواوکراو' : 'Completed')
                          : progressPercent >= 70
                          ? (isKu ? 'نزیک لە تەواوبوون' : 'Near completion')
                          : progressPercent >= 30
                          ? (isKu ? 'لە جێبەجێکردندا' : 'In progress')
                          : (isKu ? 'قۆناغی سەرەتایی' : 'Early stage')}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Range Slider */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={progressPercent}
                    onChange={(e) => setProgressPercent(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />

                  {/* Progress Bar Preview */}
                  <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden mt-2 p-[2px]">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-emerald-500/40"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Quick preset buttons */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[0, 25, 50, 75, 90, 100].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setProgressPercent(val)}
                        className={`text-[11px] px-2.5 py-0.5 rounded-lg border font-mono transition-colors ${
                          progressPercent === val
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                        }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Holding / Client Name & Target Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isKu ? 'ناوی هۆڵدینگ یان کۆمپانیا (Client / Holding):' : 'Holding or Client Company Name:'}
                    </label>
                    <input
                      type="text"
                      value={clientOrHoldingName}
                      onChange={(e) => setClientOrHoldingName(e.target.value)}
                      placeholder={isKu ? 'وەک: هۆڵدینگی فارووق، کۆمەڵگەی ئەندازیاران' : 'e.g. Faruk Holding, Italian Village Compound'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isKu ? 'ماوە و وادەی دانراو / Target Deadline:' : 'Target Deadline:'}
                    </label>
                    <input
                      type="text"
                      value={targetDeadline}
                      onChange={(e) => setTargetDeadline(e.target.value)}
                      placeholder={isKu ? 'وەک: 2026-12-31 یان قۆناغی سێیەمی ٢٠٢٦' : 'e.g. 2026-12-31 or Q3 2026'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Project Stage & Milestones */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isKu ? 'دۆخی پڕۆژە (Status):' : 'Project Status:'}
                    </label>
                    <select
                      value={projectStatus}
                      onChange={(e) => setProjectStatus(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="planning">{isKu ? 'قۆناغی پلانداڕێژی (Planning)' : 'Planning Stage'}</option>
                      <option value="in-progress">{isKu ? 'لە جێبەجێکردندایە (In Progress)' : 'In Progress'}</option>
                      <option value="testing">{isKu ? 'تاقیکردنەوە و QA (Testing)' : 'Testing & QA'}</option>
                      <option value="live">{isKu ? 'لەکاردا و جێبەجێکراو (Live)' : 'Live in Production'}</option>
                      <option value="completed">{isKu ? 'تەواوکراو (Completed)' : 'Completed'}</option>
                      <option value="delayed">{isKu ? 'دواکەوتوو (Delayed)' : 'Delayed'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isKu ? 'قۆناغی تەواوکراو (Milestones Done):' : 'Milestones Completed:'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={milestonesTotal}
                      value={milestonesCompleted}
                      onChange={(e) => setMilestonesCompleted(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isKu ? 'سەرجەمی قۆناغەکان (Total Milestones):' : 'Total Milestones:'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={milestonesTotal}
                      onChange={(e) => setMilestonesTotal(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    {isKu
                      ? 'تێبینی: تەواوی نەخشەی ڕێگا (Timeline Roadmap) لە مۆداڵی بەرهەمەکە بەپێی ئەم وادەی دانراوە و ژمارەی قۆناغەکان بە شێوازی گرافیکی دەردەکەوێت.'
                      : 'Note: The interactive visual Timeline roadmap in the product modal dynamically parses this target deadline and milestone count.'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Direct Links Section */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
              <Link className="w-4 h-4" />
              {isKu ? 'بەستەرە سەرەکییەکان (هەر لینکێکت هەیە لێرە دایبنێ):' : 'All Product Links & Endpoints:'}
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isKu ? 'لینکی داگرتنی ڕاستەوخۆ (Google Drive، Telegram، Mega یان Dropbox):' : 'Direct Download / Cloud Link:'}
              </label>
              <input
                type="url"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isKu ? 'لینکی کڕین لە دەرەوە (Gumroad، BuyMeACoffee، تەلەگرام یان واتسئاپ):' : 'External Store / Checkout Link:'}
              </label>
              <input
                type="url"
                value={purchaseUrl}
                onChange={(e) => setPurchaseUrl(e.target.value)}
                placeholder="https://gumroad.com/l/... or https://buymeacoffee.com/..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isKu ? 'لینکی دیمۆ یان پێشبینین (Demo / Documentation):' : 'Live Demo / Documentation Link:'}
              </label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://preview.example.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Product Image URL & Gemini Image Studio Trigger */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>{isKu ? 'بەستەری وێنەی بەرهەم (Image URL):' : 'Product Image Cover URL:'}</span>
              </label>

              <button
                type="button"
                onClick={() => onOpenImageStudioWithPrompt(`High-end professional 3D isometric product mockup of ${titleEn || titleKu || 'digital software assets'}, sleek dark mode, glowing lighting, premium showcase`)}
                className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{isKu ? 'دروستکردن بە AI (1K/2K/4K)' : 'Generate with AI'}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
              {imageUrl && (
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                  <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isKu ? 'وەسفی بەرهەم بە کوردی:' : isAr ? 'وصف المنتج بالكردية:' : 'Kurdish Description:'}
            </label>
            <textarea
              rows={3}
              value={descriptionKu}
              onChange={(e) => setDescriptionKu(e.target.value)}
              placeholder="دەربارەی بەرهەمەکە بنووسە: بۆ کێیە؟ چ سوودێکی هەیە؟ چی لەخۆدەگرێت؟"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isKu ? 'وەسفی بەرهەم بە عەرەبی (Arabic Description):' : isAr ? 'وصف المنتج بالعربية:' : 'Arabic Description:'}
            </label>
            <textarea
              rows={3}
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder="اكتب وصفاً مفصلاً للمنتج والمنظومة الرقمية باللغة العربية..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isKu ? 'وەسفی بەرهەم بە ئینگلیزی (بۆ گووگڵ و بەکارهێنەرانی جیهانی):' : isAr ? 'الوصف بالإنجليزية (لمحركات البحث):' : 'English Description:'}
            </label>
            <textarea
              rows={3}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="English description for international search crawlers and customers..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Features Management */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isKu ? 'خاڵ و تایبەتمەندییە سەرەکییەکان (Features Checklist):' : 'Key Features Checklist:'}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder={isKu ? 'خاڵێکی نوێ بنووسە و Enter بکە...' : 'Add a feature and press Enter...'}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="hover:text-red-400 ms-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isKu ? 'تاگەکانی گەڕان و سێو (بە فاریزە جیاکراوە):' : 'SEO Keywords & Tags (comma separated):'}
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Figma, UI, React, Kurdish, Software"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {isKu ? 'پاشگەزبوونەوە' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isKu ? 'پاشەکەوتکردنی بەرهەم' : 'Save Product'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
