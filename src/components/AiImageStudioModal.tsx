import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Wand2, 
  Download, 
  Check, 
  Layers, 
  Ratio, 
  Maximize2, 
  Loader2, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sliders,
  Upload
} from 'lucide-react';
import { SupportedImageModel, AspectRatioType, ImageSizeType, Language } from '../types';

interface AiImageStudioModalProps {
  isOpen: boolean;
  initialPrompt?: string;
  language: Language;
  onClose: () => void;
  onApplyImageToProduct?: (imageUrl: string) => void;
}

export const AiImageStudioModal: React.FC<AiImageStudioModalProps> = ({
  isOpen,
  initialPrompt = '',
  language,
  onClose,
  onApplyImageToProduct,
}) => {
  if (!isOpen) return null;

  const isKu = language === 'ku';

  const [prompt, setPrompt] = useState(
    initialPrompt || 
    'A high-end 3D isometric digital product mockup of modern software tools, glowing neon accents, floating glassy UI components, dark obsidian background, 8k resolution studio lighting'
  );
  const [model, setModel] = useState<SupportedImageModel>('gemini-3-pro-image-preview');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('16:9');
  const [imageSize, setImageSize] = useState<ImageSizeType>('2K');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Aspect Ratios list as explicitly requested: 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9
  const aspectRatios: Array<{ ratio: AspectRatioType; labelKu: string; labelEn: string; iconClass: string }> = [
    { ratio: '1:1', labelKu: 'چوارگۆشە (1:1)', labelEn: 'Square (1:1)', iconClass: 'w-5 h-5 border-2 border-current rounded-sm' },
    { ratio: '16:9', labelKu: 'پانۆراما (16:9)', labelEn: 'Landscape (16:9)', iconClass: 'w-7 h-4 border-2 border-current rounded-sm' },
    { ratio: '9:16', labelKu: 'ستۆری / ڕیلز (9:16)', labelEn: 'Story/Vertical (9:16)', iconClass: 'w-4 h-7 border-2 border-current rounded-sm' },
    { ratio: '4:3', labelKu: 'نمایشی ستاندارد (4:3)', labelEn: 'Standard (4:3)', iconClass: 'w-6 h-4.5 border-2 border-current rounded-sm' },
    { ratio: '3:4', labelKu: 'کاڤەری کتێب (3:4)', labelEn: 'Book Cover (3:4)', iconClass: 'w-4.5 h-6 border-2 border-current rounded-sm' },
    { ratio: '3:2', labelKu: 'فۆتۆگرافی کلاسیک (3:2)', labelEn: 'Photo (3:2)', iconClass: 'w-6 h-4 border-2 border-current rounded-sm' },
    { ratio: '2:3', labelKu: 'پۆستەری مۆبایل (2:3)', labelEn: 'Poster (2:3)', iconClass: 'w-4 h-6 border-2 border-current rounded-sm' },
    { ratio: '21:9', labelKu: 'سینەمایی پان (21:9)', labelEn: 'Ultrawide (21:9)', iconClass: 'w-8 h-3.5 border-2 border-current rounded-sm' },
  ];

  // Image Sizes list as explicitly requested: 1K, 2K, 4K
  const imageSizes: Array<{ size: ImageSizeType; labelKu: string; desc: string }> = [
    { size: '1K', labelKu: '1K (ستاندارد HD)', desc: '1024px • Fast' },
    { size: '2K', labelKu: '2K (کوالیتی بەرز QHD)', desc: '2048px • Crisp' },
    { size: '4K', labelKu: '4K (کوالیتی ستۆدیۆی باڵا)', desc: '4096px • Ultra Pro' },
  ];

  // Curated prompt presets
  const presets = [
    {
      titleKu: 'مۆکئاپ 3D ی نەرمەکاڵا',
      titleEn: '3D SaaS Glass Mockup',
      prompt: 'A sleek 3D isometric mockup of modern digital software app, translucent dark glass cards floating, glowing neon violet and cyan accents, black obsidian podium, cinematic lighting'
    },
    {
      titleKu: 'کاڤەری کتێبی ئەلیکترۆنی',
      titleEn: 'Minimalist E-Book Cover',
      prompt: 'An elegant hardback e-book cover design resting on minimalist concrete, modern typography, gold foil embossing, soft natural ray lighting, studio quality'
    },
    {
      titleKu: 'پاکێجی پرۆمپت و پەڕگەی AI',
      titleEn: 'AI Prompts Vault Asset',
      prompt: 'Futuristic glowing cybernetic memory crystal floating in dark space, holographic particles, intricate neural circuits, ultra-detailed 8k render'
    },
    {
      titleKu: 'داشبۆردی بەرهەمهێنان و کۆد',
      titleEn: 'Developer Code Suite',
      prompt: 'High-tech developer coding workstation mockup with sleek dark syntax cards, floating terminal widgets, radiant emerald and violet lighting, premium aesthetic'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setGenerating(true);
    setErrorMessage(null);
    setApplied(false);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model,
          aspectRatio,
          imageSize,
          referenceImageBase64: referenceImage || undefined,
        }),
      });

      const data = await res.json();

      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else {
        setErrorMessage(data.error || 'نەتوانرا وێنەکە دروستبکرێت');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'هەڵە لە پەیوەندی کردن بە سێرڤەر');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `sas-dijital-${model}-${imageSize}-${aspectRatio}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleApply = () => {
    if (generatedImage && onApplyImageToProduct) {
      onApplyImageToProduct(generatedImage);
      setApplied(true);
      setTimeout(() => setApplied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl shadow-indigo-950/60 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-violet-600 to-indigo-600 p-[2px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">
                  {isKu ? 'ستۆدیۆی وێنەی باڵا بە ژیری دەستکرد' : 'Studio AI Image Generator'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {model}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isKu ? 'دروستکردنی کاڤەر، مۆکئاپ و بەرهەمی بینراو بە کوالیتی 1K, 2K, 4K و 8 جۆر ئەسپێکت ڕەیشۆ' : 'Studio-grade generative imaging with configurable 1K/2K/4K resolution & 8 aspect ratios'}
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

        {/* Studio Workspace */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[80vh] overflow-y-auto">
          
          {/* Controls Column (Left) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. Model Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {isKu ? '١. مۆدێلی دروستکردن (Model Selection):' : '1. Generative AI Model:'}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setModel('gemini-3-pro-image-preview')}
                  className={`p-3 rounded-2xl border text-start transition-all ${
                    model === 'gemini-3-pro-image-preview'
                      ? 'bg-gradient-to-br from-indigo-950/80 to-violet-950/80 border-indigo-500 text-white shadow-lg shadow-indigo-950'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-indigo-300">gemini-3-pro-image-preview</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">PRO STUDIO</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {isKu ? 'کوالیتی ستۆدیۆی بێ هاوتا بۆ وێنەی بەرهەم و فۆتۆریالیزم' : 'Studio quality with ultra fine textures & lighting'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setModel('gemini-nano-banana-2.1')}
                  className={`p-3 rounded-2xl border text-start transition-all ${
                    model === 'gemini-nano-banana-2.1'
                      ? 'bg-gradient-to-br from-cyan-950/80 to-indigo-950/80 border-cyan-500 text-white shadow-lg shadow-cyan-950'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-cyan-300">gemini-nano-banana-2.1</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">FAST & SMART</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {isKu ? 'خێرا و فرەچەشن بۆ بیرۆکەی سەرەتایی و مۆکئاپ' : 'High versatility and rapid generation'}
                  </p>
                </button>
              </div>
            </div>

            {/* 2. Image Size Affordance (1K, 2K, 4K) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{isKu ? '٢. قەبارەی ڕوونی وێنە (Image Size / Resolution):' : '2. Image Resolution (Size):'}</span>
                <span className="text-[11px] font-mono text-indigo-400">{imageSize} Resolution</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {imageSizes.map((s) => (
                  <button
                    key={s.size}
                    type="button"
                    onClick={() => setImageSize(s.size)}
                    className={`py-3 px-3 rounded-xl border text-center transition-all ${
                      imageSize === s.size
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-base font-black text-indigo-300">{s.size}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Aspect Ratio Affordance (1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{isKu ? '٣. ڕێژەی ڕووبەر (Aspect Ratio):' : '3. Aspect Ratio:'}</span>
                <span className="text-[11px] font-mono text-cyan-400">{aspectRatio}</span>
              </label>

              <div className="grid grid-cols-4 gap-2">
                {aspectRatios.map((item) => (
                  <button
                    key={item.ratio}
                    type="button"
                    onClick={() => setAspectRatio(item.ratio)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      aspectRatio === item.ratio
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={item.iconClass} />
                    <span className="text-xs font-bold">{item.ratio}</span>
                    <span className="text-[9px] text-slate-400 truncate max-w-full">
                      {isKu ? item.labelKu.split(' ')[0] : item.labelEn.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Prompt Input & Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {isKu ? '٤. وەسفی بینراو (Image Prompt):' : '4. Visual Prompt:'}
                </label>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(preset.prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                  >
                    ✨ {isKu ? preset.titleKu : preset.titleEn}
                  </button>
                ))}
              </div>

              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your digital product mockup, e-book cover, or software asset in detail..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              />
            </div>

            {/* Reference Image (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                {isKu ? 'وێنەی پێشینە / بەڵگە بۆ ستایل (ئارەزوومەندانە):' : 'Optional Reference / Style Image:'}
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isKu ? 'هەڵبژاردنی وێنە' : 'Choose File'}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                {referenceImage && (
                  <div className="flex items-center gap-2">
                    <img src={referenceImage} alt="ref" className="w-8 h-8 rounded-lg object-cover border border-slate-700" />
                    <button
                      type="button"
                      onClick={() => setReferenceImage(null)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      {isKu ? 'سڕینەوە' : 'Remove'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500 hover:from-amber-400 hover:via-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 hover:scale-[1.01]"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isKu ? `دروستکردنی وێنەی ${imageSize} بە ${model}...` : `Rendering ${imageSize} with ${model}...`}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>{isKu ? `دروستکردنی وێنەی ستۆدیۆ (${imageSize} • ${aspectRatio})` : `Generate Studio Image (${imageSize} • ${aspectRatio})`}</span>
                </>
              )}
            </button>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

          </div>

          {/* Visual Canvas Result Column (Right) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col justify-center items-center relative overflow-hidden min-h-[350px]">
              
              {generating ? (
                <div className="text-center space-y-4 p-6">
                  <div className="relative mx-auto w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-4 border-amber-500/20 border-b-amber-500 animate-spin-reverse" />
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-amber-400 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">
                      {isKu ? 'سیستەمی ستۆدیۆ سەرقاڵی وێنەکێشانە...' : 'Gemini Studio Renderer Active...'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Model: <span className="text-indigo-400 font-mono">{model}</span> | Res: <span className="text-amber-400 font-mono">{imageSize}</span> | Ratio: <span className="text-cyan-400 font-mono">{aspectRatio}</span>
                    </p>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="relative max-h-[460px] w-full flex items-center justify-center overflow-hidden rounded-xl border border-slate-800">
                    <img
                      src={generatedImage}
                      alt="Generated digital asset"
                      className="max-h-[440px] max-w-full object-contain rounded-lg shadow-2xl"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-500">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-300">
                    {isKu ? 'وێنەی دروستکراو لێرە دەردەکەوێت' : 'Generated Image Canvas'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    {isKu
                      ? 'مۆدێلی Gemini 3 Pro بە 4K و ئەسپێکت ڕەیشۆی دڵخواز هەڵبژێرە و لەسەر دوگمەی دروستکردن دابگرە.'
                      : 'Configure model, 1K/2K/4K resolution and aspect ratio on the left to render.'}
                  </p>
                </div>
              )}

            </div>

            {/* Result Actions */}
            {generatedImage && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  <span className="text-emerald-400 font-bold">✓ Render Ready</span> • {imageSize} • {aspectRatio}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isKu ? 'داگرتن' : 'Download'}</span>
                  </button>

                  {onApplyImageToProduct && (
                    <button
                      onClick={handleApply}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-colors"
                    >
                      {applied ? <Check className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{applied ? (isKu ? 'دانرا!' : 'Applied!') : (isKu ? 'دانان وەک وێنەی بەرهەم' : 'Use as Cover')}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
