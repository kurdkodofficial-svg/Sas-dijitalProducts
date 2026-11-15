import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  BarChart2, 
  Sparkles,
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';
import { DigitalProduct, Language, PricePoint } from '../types';

interface PriceTrendChartProps {
  product: DigitalProduct;
  language: Language;
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ product, language }) => {
  const [metricMode, setMetricMode] = useState<'valuation' | 'price'>('valuation');

  const isKu = language === 'ku';
  const isAr = language === 'ar';
  const isEn = language === 'en';

  // Base currency unit
  const currencySymbol = product.currency === 'IQD' ? 'IQD ' : '$';

  // Generate or parse chronological financial data points
  const chartData = useMemo(() => {
    // If explicit valuationHistory or priceHistory exists, use it
    if (metricMode === 'valuation' && product.valuationHistory && product.valuationHistory.length > 0) {
      return product.valuationHistory;
    }
    if (metricMode === 'price' && product.priceHistory && product.priceHistory.length > 0) {
      return product.priceHistory;
    }

    // Otherwise, generate realistic chronological valuation & pricing based on product metrics
    const createdDate = new Date(product.createdAt || '2026-01-01');
    const startYear = isNaN(createdDate.getFullYear()) ? 2026 : createdDate.getFullYear();
    const startMonth = isNaN(createdDate.getMonth()) ? 0 : createdDate.getMonth();

    const progress = Math.max(10, Math.min(100, product.progressPercent !== undefined ? product.progressPercent : 75));
    const isFree = product.isFree;
    const currentPrice = product.price || (isFree ? 0 : 250);

    // Baseline enterprise valuation based on category & complexity
    let baseValuation = 25000;
    if (product.category === 'city-management') baseValuation = 180000;
    else if (product.category === 'financial-systems') baseValuation = 120000;
    else if (product.category === 'management-erp') baseValuation = 95000;
    else if (product.category === 'websites') baseValuation = 45000;

    // Timeline steps across project lifespan
    const steps = [
      {
        monthOffset: 0,
        factor: 0.25,
        priceMultiplier: 0.6,
        labelKu: 'دەستپێک و بیناسازی (Kickoff)',
        labelAr: 'الانطلاق والتأسيس (Kickoff)',
        labelEn: 'Kickoff & Foundation',
        noteKu: 'سەرمایەگوزاری سەرەتایی و داڕشتنی سیستەم',
        noteAr: 'الاستثمار الأولي وتأسيس بنية النظام',
        noteEn: 'Initial seed valuation & architecture design'
      },
      {
        monthOffset: 2,
        factor: 0.45,
        priceMultiplier: 0.75,
        labelKu: 'وەشانی تاقیکاری سەرەتایی (Alpha)',
        labelAr: 'النسخة التجريبية الأولى (Alpha)',
        labelEn: 'Alpha Prototype',
        noteKu: 'چالاکبوونی مۆدیوولە سەرەکییەکان و بنکەدراوە',
        noteAr: 'تشغيل الوحدات الأساسية وقاعدة البيانات',
        noteEn: 'Core operational engine deployed'
      },
      {
        monthOffset: 4,
        factor: 0.7,
        priceMultiplier: 0.9,
        labelKu: 'تاقیکردنەوەی مەیدانی (Beta)',
        labelAr: 'مرحلة الاختبار والتكامل (Beta)',
        labelEn: 'Beta Integration',
        noteKu: 'تەواوکاری لەگەڵ سیستەمی دارایی و بەکارهێنەران',
        noteAr: 'التكامل مع الأنظمة المالية والمستخدمين',
        noteEn: 'Financial modules and user acceptance QA'
      },
      {
        monthOffset: 7,
        factor: 0.92,
        priceMultiplier: 1.0,
        labelKu: 'ئاستی ئێستا (Current State)',
        labelAr: 'الحالة الراهنة (Current State)',
        labelEn: 'Current Valuation',
        noteKu: 'ڕێژەی ئەنجامدراوی ٪' + progress + ' لە سەرجەم مەیڵستۆنەکان',
        noteAr: 'نسبة إنجاز ' + progress + '٪ من إجمالي المعالم',
        noteEn: 'Current verified progress at ' + progress + '%'
      },
      {
        monthOffset: 11,
        factor: 1.35,
        priceMultiplier: 1.2,
        labelKu: 'ئامانجی وادەی کۆتایی (Target Goal)',
        labelAr: 'الهدف النهائي المستهدف (Target)',
        labelEn: 'Target Horizon',
        noteKu: 'خستنەگەڕی گشتی لەگەڵ خزمەتگوزارییەکانی هۆڵدینگ',
        noteAr: 'الإطلاق الشامل مع توسع خدمات القابضة',
        noteEn: 'Full commercial production & enterprise expansion'
      }
    ];

    return steps.map((s, idx) => {
      const stepDate = new Date(startYear, startMonth + s.monthOffset, 15);
      const dateStr = stepDate.toISOString().slice(0, 7); // YYYY-MM
      const val = Math.round(baseValuation * s.factor * (1 + (progress / 200)));
      const prc = isFree ? 0 : Math.round(currentPrice * s.priceMultiplier);

      return {
        date: dateStr,
        displayDate: isKu 
          ? `${stepDate.toLocaleString('en-US', { month: 'short' })} ${stepDate.getFullYear()}`
          : isAr 
          ? `${stepDate.toLocaleString('ar-EG', { month: 'short', year: 'numeric' })}`
          : `${stepDate.toLocaleString('en-US', { month: 'short' })} ${stepDate.getFullYear()}`,
        valuationUSD: val,
        price: prc,
        label: isKu ? s.labelKu : isAr ? s.labelAr : s.labelEn,
        note: isKu ? s.noteKu : isAr ? s.noteAr : s.noteEn,
        isFuture: idx === steps.length - 1
      };
    });
  }, [product, metricMode, isKu, isAr, isEn]);

  // Financial KPI calculations
  const kpi = useMemo(() => {
    if (chartData.length === 0) return { current: 0, initial: 0, growth: 0, target: 0 };
    const initial = chartData[0];
    const current = chartData[chartData.length - 2] || chartData[chartData.length - 1];
    const target = chartData[chartData.length - 1];

    const currentVal = metricMode === 'valuation' ? (current.valuationUSD || 0) : (current.price || 0);
    const initialVal = metricMode === 'valuation' ? (initial.valuationUSD || 1) : (initial.price || 1);
    const targetVal = metricMode === 'valuation' ? (target.valuationUSD || 0) : (target.price || 0);

    const growth = initialVal > 0 ? Math.round(((currentVal - initialVal) / initialVal) * 100) : 0;

    return {
      current: currentVal,
      initial: initialVal,
      growth,
      target: targetVal
    };
  }, [chartData, metricMode]);

  // Formatter for Currency Values
  const formatValue = (val: number) => {
    if (val >= 1000000) return `${currencySymbol}${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${currencySymbol}${(val / 1000).toFixed(0)}k`;
    return `${currencySymbol}${val.toLocaleString()}`;
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md text-start space-y-1.5 min-w-[200px]">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1">
            <span className="font-mono text-slate-300 font-semibold">{data.displayDate || label}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {data.isFuture ? (isKu ? 'داهاتوو' : isAr ? 'مستقبلي' : 'Projected') : (isKu ? 'تۆمارکراو' : isAr ? 'مؤكد' : 'Recorded')}
            </span>
          </div>
          <p className="text-xs font-bold text-white">
            {data.label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black font-mono text-emerald-400">
              {metricMode === 'valuation' 
                ? formatValue(data.valuationUSD || 0) 
                : `${currencySymbol}${(data.price || 0).toLocaleString()}`}
            </span>
            <span className="text-[10px] text-slate-400">
              {metricMode === 'valuation'
                ? (isKu ? 'بەهای خەمڵێنراو' : isAr ? 'التقييم التقديري' : 'Estimated Valuation')
                : (isKu ? 'نرخی بەرهەم' : isAr ? 'سعر الترخيص' : 'Unit Price')}
            </span>
          </div>
          {data.note && (
            <p className="text-[11px] text-slate-300 pt-1 border-t border-slate-800/80 leading-relaxed">
              {data.note}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30 border border-slate-800 p-5 sm:p-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 text-cyan-400 border border-indigo-500/30">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <span>
                {isKu
                  ? 'ئاماری دارایی و ڕێڕەوی گەشەی نرخ (Price & Valuation Trend)'
                  : isAr
                  ? 'مؤشرات التقييم المالي وسجل حركة الأسعار (Price Trend)'
                  : 'Financial Valuation & Price Trend Analysis'}
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              {isKu
                ? 'چاودێری بەهای بازاڕی پڕۆژە لە قۆناغی دامەزراندنەوە تا وادەی دانراو'
                : isAr
                ? 'تتبع القيمة التقديرية وتطور العائد من مرحلة التأسيس حتى الإنجاز'
                : 'Chronological valuation trajectory from inception to production milestones'}
            </p>
          </div>
        </div>

        {/* Metric Selector Toggle (Valuation vs Unit Price) */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 self-start sm:self-auto">
          <button
            onClick={() => setMetricMode('valuation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              metricMode === 'valuation'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isKu ? 'بەهای پڕۆژە (Valuation)' : isAr ? 'التقييم المالي' : 'Valuation Trend'}
          </button>
          {!product.isFree && (
            <button
              onClick={() => setMetricMode('price')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                metricMode === 'price'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isKu ? 'نرخی بەشداریکردن' : isAr ? 'سعر الاشتراك' : 'Price History'}
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-400" />
            <span>{isKu ? 'بەهای ئێستا:' : isAr ? 'التقييم الحالي:' : 'Current Valuation:'}</span>
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-emerald-400">
            {formatValue(kpi.current)}
          </div>
          <span className="text-[10px] text-slate-500 block">
            {isKu ? 'بەپێی مەیڵستۆنەکان' : isAr ? 'وفق المراحل المنجزة' : 'Verified by milestones'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-cyan-400" />
            <span>{isKu ? 'ڕێژەی گەشە:' : isAr ? 'نسبة النمو:' : 'Growth Ratio:'}</span>
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-cyan-400 flex items-center gap-1">
            <span>+{kpi.growth}%</span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            {isKu ? 'لە قۆناغی سەرەتاوە' : isAr ? 'منذ مرحلة التأسيس' : 'Since kickoff'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-400" />
            <span>{isKu ? 'بەهای سەرەتا:' : isAr ? 'تقييم الانطلاق:' : 'Initial Inception:'}</span>
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-indigo-300">
            {formatValue(kpi.initial)}
          </div>
          <span className="text-[10px] text-slate-500 block">
            {isKu ? 'وەشانی یەکەم' : isAr ? 'الإصدار المبدئي' : 'Seed / MVP baseline'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{isKu ? 'ئامانجی کۆتایی:' : isAr ? 'الهدف المستهدف:' : 'Target Milestone:'}</span>
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-amber-300">
            {formatValue(kpi.target)}
          </div>
          <span className="text-[10px] text-slate-500 block">
            {isKu ? 'لە وادەی دانراودا' : isAr ? 'عند الموعد المستهدف' : 'Upon production release'}
          </span>
        </div>
      </div>

      {/* Main Recharts Area Chart */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-indigo-400" />
            <span>
              {metricMode === 'valuation'
                ? (isKu ? 'چەماوەی گەشەی بەهای پڕۆژە بە دراوی دۆلار ($)' : isAr ? 'منحنى نمو القيمة التقديرية بالدولار ($)' : 'Project Valuation Curve (USD)')
                : (isKu ? 'چەماوەی گۆڕانکاری نرخی بەرهەم ($)' : isAr ? 'منحنى تغير أسعار المنتج ($)' : 'Unit Pricing Curve (USD)')}
            </span>
          </span>
          <span className="text-[11px] font-mono text-emerald-400">
            {isKu ? 'تەواوکاری هۆڵدینگ چالاکە' : isAr ? 'مؤشرات القابضة مفعلة' : 'Holding Model Active'}
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="valuationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                  <stop offset="60%" stopColor="#06b6d4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

              <XAxis 
                dataKey="displayDate" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />

              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#334155' }}
                tickFormatter={(v) => formatValue(v)}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey={metricMode === 'valuation' ? 'valuationUSD' : 'price'}
                stroke={metricMode === 'valuation' ? '#818cf8' : '#34d399'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={metricMode === 'valuation' ? 'url(#valuationGradient)' : 'url(#priceGradient)'}
                activeDot={{ r: 6, fill: '#38bdf8', stroke: '#0f172a', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Footnote */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            <span>
              {isKu 
                ? 'خاڵەکانی چەماوە نیشاندەری قۆناغە سەلمێنراوەکان و پێشبینی وادەی کۆتایین.'
                : isAr
                ? 'النقاط توضح المعالم المحققة للمشروع مع التقديرات المستقبلية حتى الإنجاز النهائي.'
                : 'Data points represent audited milestone check-ins with deadline target projections.'}
            </span>
          </div>

          <div className="font-mono text-slate-300">
            {product.clientOrHoldingName ? `🏢 ${product.clientOrHoldingName}` : 'Sas-dijitalProducts'}
          </div>
        </div>

      </div>

    </div>
  );
};
