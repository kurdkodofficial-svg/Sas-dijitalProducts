import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Hourglass, 
  Flag, 
  Milestone, 
  ChevronRight, 
  Layers,
  Sparkles,
  Timer,
  Check,
  Building
} from 'lucide-react';
import { DigitalProduct, Language } from '../types';

interface ProjectTimelineProps {
  product: DigitalProduct;
  language: Language;
}

interface ParsedMilestone {
  index: number;
  id: string;
  titleKu: string;
  titleAr?: string;
  titleEn: string;
  descriptionKu: string;
  descriptionAr?: string;
  descriptionEn: string;
  dateStr: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  categoryLabelKu: string;
  categoryLabelAr?: string;
  categoryLabelEn: string;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ product, language }) => {
  const isKu = language === 'ku';
  const isAr = language === 'ar';
  const isEn = language === 'en';
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  // Parse start date from product creation
  const startDate = useMemo(() => {
    try {
      const parsed = new Date(product.createdAt);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    } catch {
      return new Date();
    }
  }, [product.createdAt]);

  // Parse target deadline date
  const deadlineInfo = useMemo(() => {
    const rawDeadline = product.targetDeadline || '';
    let parsedDate: Date | null = null;
    let isExplicitDate = false;

    if (rawDeadline) {
      const timestamp = Date.parse(rawDeadline);
      if (!isNaN(timestamp)) {
        parsedDate = new Date(timestamp);
        isExplicitDate = true;
      }
    }

    // Default to 60 days after start if no deadline specified
    if (!parsedDate) {
      parsedDate = new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000);
    }

    const now = new Date();
    const diffTime = parsedDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      date: parsedDate,
      isExplicitDate,
      rawDeadline,
      diffDays,
      isOverdue: diffDays < 0 && product.projectStatus !== 'completed' && product.projectStatus !== 'live',
      isCompleted: product.projectStatus === 'completed' || product.projectStatus === 'live' || (product.progressPercent || 0) >= 100
    };
  }, [product.targetDeadline, product.projectStatus, product.progressPercent, startDate]);

  // Format date cleanly in Kurdish, Arabic, or English
  const formatDate = (date: Date) => {
    if (isAr) {
      const arabicMonths = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];
      return `${date.getDate()} ${arabicMonths[date.getMonth()]} ${date.getFullYear()}`;
    }
    if (isKu) {
      const kurdishMonths = [
        'کانوونی دووەم',
        'شوبات',
        'ئازار',
        'نیسان',
        'ئایار',
        'حوزەیران',
        'تەمووز',
        'ئاب',
        'ئەیلوول',
        'تشرینی یەکەم',
        'تشرینی دووەم',
        'کانوونی یەکەم'
      ];
      return `${date.getDate()}ی ${kurdishMonths[date.getMonth()]}ی ${date.getFullYear()}`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Generate or parse chronological milestones
  const milestones: ParsedMilestone[] = useMemo(() => {
    const total = Math.max(3, Math.min(12, product.milestonesTotal || 5));
    const completedCount = Math.min(total, product.milestonesCompleted !== undefined ? product.milestonesCompleted : Math.round(((product.progressPercent || 0) / 100) * total));

    const totalTimeSpan = Math.max(7 * 24 * 60 * 60 * 1000, deadlineInfo.date.getTime() - startDate.getTime());

    // Domain-tailored template phases based on category
    const getMilestoneTemplates = (cat: string) => {
      switch (cat) {
        case 'city-management':
          return [
            {
              titleKu: 'دەستپێک و ڕووپێوی سەرەتایی کۆمەڵگە و یەکەکان',
              titleEn: 'Inception & Initial Compound Unit Survey',
              descKu: 'تۆمارکردنی نەخشەی ئەندازیاری، یەکەکانی نیشتەجێبوون و ڕێکارە سەرەتاییەکان.',
              descEn: 'Architectural blueprints, residential unit registry and compliance protocols.',
              catKu: 'ئامادەکاری',
              catEn: 'Setup'
            },
            {
              titleKu: 'ژێرخانی ژمێریاری، سکیوریتی و ئابوونەی مانگانە',
              titleEn: 'Utilities, Security & Monthly Subscriptions Core',
              descKu: 'دروستکردنی پێکهاتەی دارایی بۆ پارەی خزمەتگوزاری، پاسەوانی و کارەبا/ئاو.',
              descEn: 'Billing infrastructure for utilities, security gates, and maintenance dues.',
              catKu: 'دارایی و سکیوریتی',
              catEn: 'Core Engine'
            },
            {
              titleKu: 'پۆڕتاڵی تایبەتی دانیشتووان و ئەپی کۆنترۆڵ',
              titleEn: 'Resident Portal & Mobile Access Control',
              descKu: 'دەستڕاگەیشتنی دانیشتووان بۆ داواکاری خزمەتگوزاری و بینینی پسووڵەکان.',
              descEn: 'Resident service portal, gate barcode credentials, and payment history.',
              catKu: 'ئەپ و بەکارهێنەر',
              catEn: 'Resident App'
            },
            {
              titleKu: 'داشبۆردی سەرپەرشتیاری دەستەی کارگێڕی و CEO',
              titleEn: 'Executive Management & Board Dashboard',
              descKu: 'ڕاپۆرتی دارایی، ئامارەکانی کۆکردنەوەی داهات و چاودێری ڕاستەوخۆ.',
              descEn: 'Consolidated revenue tracking, incident reporting, and board analytics.',
              catKu: 'کارگێڕی هۆڵدینگ',
              catEn: 'Executive ERP'
            },
            {
              titleKu: 'پشکنینی کۆتایی، تاقیکردنەوەی مەیدانی و خستنەگەڕ',
              titleEn: 'On-site Pilot Testing, Handover & Launch',
              descKu: 'تاقیکردنەوە لەناو شارەکە، ڕاهێنانی ستافی ئیداری و چالاککردنی تەواو.',
              descEn: 'Full field pilot, administrative team training, and production commissioning.',
              catKu: 'خستنەگەڕ',
              catEn: 'Deployment'
            }
          ];
        case 'financial-systems':
          return [
            {
              titleKu: 'شیکاری ڕێساکانی ژمێریاری و دارایی هۆڵدینگ',
              titleEn: 'Accounting Framework & Audit Requirements',
              descKu: 'پۆلێنکردنی دراوەکان (USD, IQD)، ژمێرەی سەرەکی و بنەما یاساییەکان.',
              descEn: 'Chart of accounts, multi-currency ledger rules, and audit trail specs.',
              catKu: 'پلانڕێژی',
              catEn: 'Architecture'
            },
            {
              titleKu: 'مۆدیوولی دەستکەوت، خەرجی و پسوولەی ئەلیکترۆنی',
              titleEn: 'Revenue, Expense & Automated Invoicing Core',
              descKu: 'پڕۆسێسی ئۆتۆماتیکی دارایی بە بێ هەڵەی مرۆیی لەگەڵ باجی دیجیتاڵی.',
              descEn: 'Automated expense tracking, point-of-sale integration, and tax reporting.',
              catKu: 'مۆدیوولی ژمێریاری',
              catEn: 'Ledger Engine'
            },
            {
              titleKu: 'سیستەمی مووچە، پاداشت و چاودێری بانک',
              titleEn: 'Payroll, Commission & Bank Reconciliation',
              descKu: 'بەستنەوە بە سیستەمە بانکییەکان بۆ دابەشکردنی مووچەی کارمەندان.',
              descEn: 'Direct payroll calculation, bonus tiers, and banking API reconciliation.',
              catKu: 'مووچە و بانک',
              catEn: 'Banking Sync'
            },
            {
              titleKu: 'تەواوکاری ئاسایش، وردبینی دارایی و ڕاپۆرتی CEO',
              titleEn: 'Financial Audit, Security Verification & Reports',
              descKu: 'پشکنینی هاوسەنگی مانگانە و نیشاندانی قازانج و زەرەر بۆ بەڕێوەبەران.',
              descEn: 'Multi-layer transaction encryption, P&L reports, and board forecasts.',
              catKu: 'ئاسایش و ڕاپۆرت',
              catEn: 'Compliance'
            },
            {
              titleKu: 'خستنەگەڕی سیستەمی دارایی لە سەرجەم لقەکان',
              titleEn: 'Full Multi-Branch Financial Rollout',
              descKu: 'دەستپێکردنی کار لەسەر داتابەیسی سەرەکی بە بێ وەستان.',
              descEn: 'Live zero-downtime ledger migration across all corporate branches.',
              catKu: 'جێبەجێکردن',
              catEn: 'Live Launch'
            }
          ];
        default:
          return [
            {
              titleKu: 'داڕشتنی پڕۆژە و دیاریکردنی ئامانجەکانی هۆڵدینگ',
              titleEn: 'Project Architecture & Stakeholder Alignment',
              descKu: 'کۆکردنەوەی پێداویستییە سەرەکییەکان و دیاریکردنی ئاراستەی تەکنیکی.',
              descEn: 'Core requirement breakdown, tech stack selection, and milestone roadmap.',
              catKu: 'قۆناغی سەرەتا',
              catEn: 'Inception'
            },
            {
              titleKu: 'پەرەپێدانی ژێرخانی سەرەکی و کۆدی داتابەیس',
              titleEn: 'Database Engine & API Architecture',
              descKu: 'دروستکردنی ژێرخانێکی پارێزراو بۆ خێرایی و توانای گەشەکردن.',
              descEn: 'High-availability schema, REST endpoints, and authentication layer.',
              catKu: 'ژێرخان',
              catEn: 'Infrastructure'
            },
            {
              titleKu: 'دروستکردنی بەشە سەرەکییەکان و سیستەمی بەڕێوەبردن',
              titleEn: 'Business Logic & Management Workflow Modules',
              descKu: 'جێبەجێکردنی پەیوەندییە کارگێڕییەکان و مۆدیوولەکانی بەرهەمهێنان.',
              descEn: 'Core operational pipelines, workflow automation, and status tracking.',
              catKu: 'پەرەپێدان',
              catEn: 'Core System'
            },
            {
              titleKu: 'تاقیکردنەوەی دڵنیایی جۆری (QA) و پشکنینی ئاسایش',
              titleEn: 'Quality Assurance, Security & Stress Testing',
              descKu: 'پشکنینی بەکارهێنان لە ژێر فشاری بەرزدا و پەسەندکردنی سکیوریتی.',
              descEn: 'Automated test suite, vulnerability scanning, and performance audit.',
              catKu: 'پشکنین و QA',
              catEn: 'Testing'
            },
            {
              titleKu: 'خستنەگەڕی فەرمی و ڕادەستکردنی کۆتایی',
              titleEn: 'Production Launch & Target Handover',
              descKu: 'دەستبەکاربوونی ڕاستەوخۆ بەپێی وادەی دیاریکراو و بەردەستبوونی پلاتفۆرم.',
              descEn: 'Production deployment, live monitoring setup, and executive sign-off.',
              catKu: 'خستنەگەڕ',
              catEn: 'Production'
            }
          ];
      }
    };

    const templates = getMilestoneTemplates(product.category);

    return Array.from({ length: total }, (_, i) => {
      const template = templates[i % templates.length];
      const milestoneTime = startDate.getTime() + (totalTimeSpan * (i / Math.max(1, total - 1)));
      const stepDate = new Date(milestoneTime);

      let status: 'completed' | 'in-progress' | 'upcoming';
      if (deadlineInfo.isCompleted || i < completedCount) {
        status = 'completed';
      } else if (i === completedCount) {
        status = 'in-progress';
      } else {
        status = 'upcoming';
      }

      // Add custom title numbering
      const orderLabelKu = `قۆناغی ${i + 1}`;
      const orderLabelEn = `Phase ${i + 1}`;

      return {
        index: i + 1,
        id: `milestone-${i + 1}`,
        titleKu: `${orderLabelKu}: ${template.titleKu}`,
        titleEn: `${orderLabelEn}: ${template.titleEn}`,
        descriptionKu: template.descKu,
        descriptionEn: template.descEn,
        dateStr: formatDate(stepDate),
        status,
        categoryLabelKu: template.catKu,
        categoryLabelEn: template.catEn
      };
    });
  }, [product, startDate, deadlineInfo, isKu]);

  // Filtered milestones list
  const filteredMilestones = useMemo(() => {
    if (filter === 'completed') {
      return milestones.filter((m) => m.status === 'completed');
    }
    if (filter === 'pending') {
      return milestones.filter((m) => m.status === 'in-progress' || m.status === 'upcoming');
    }
    return milestones;
  }, [milestones, filter]);

  // Overall milestone progress counts
  const completedSteps = milestones.filter((m) => m.status === 'completed').length;
  const inProgressSteps = milestones.filter((m) => m.status === 'in-progress').length;
  const totalSteps = milestones.length;

  return (
    <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 sm:p-6 space-y-6">
      
      {/* Top Header: Roadmap Title, Category & Deadline Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Milestone className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>{isKu ? 'نەخشەی ڕێگا و خشتەی قۆناغەکانی پڕۆژە' : 'Project Roadmap & Chronological Timeline'}</span>
              </h4>
              <p className="text-xs text-slate-400">
                {isKu 
                  ? 'چاودێری هەنگاوەکان، کاتەکانی بەڕێوەچوون و وادەی کۆتایی بەپێی ئامانجەکان' 
                  : 'Chronological progression, deadline pacing, and milestone governance'}
              </p>
            </div>
          </div>
        </div>

        {/* Target Deadline Badge & Pacing */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {product.clientOrHoldingName && (
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-medium">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              <span>{product.clientOrHoldingName}</span>
            </span>
          )}

          <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">{isKu ? 'وادەی دانراو:' : 'Deadline:'}</span>
            <span className="font-bold text-white font-mono">
              {deadlineInfo.rawDeadline || formatDate(deadlineInfo.date)}
            </span>
          </div>

          <div className={`text-xs px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 ${
            deadlineInfo.isCompleted
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : deadlineInfo.isOverdue
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
          }`}>
            <Timer className="w-3.5 h-3.5" />
            <span>
              {deadlineInfo.isCompleted
                ? (isKu ? 'تەواوکراو لە وادەی دیاریکراو' : 'Completed on Schedule')
                : deadlineInfo.isOverdue
                ? (isKu ? `دواکەوتووە بە ${Math.abs(deadlineInfo.diffDays)} ڕۆژ` : `${Math.abs(deadlineInfo.diffDays)}d Overdue`)
                : (isKu ? `${deadlineInfo.diffDays} ڕۆژ ماوە` : `${deadlineInfo.diffDays} days remaining`)}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Roadmap Stepper Strip (Horizontal Overview) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isKu ? 'ڕێڕەوی قۆناغە بەدەستهاتووەکان:' : 'Milestone Progression Track:'}</span>
          </span>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono font-bold text-emerald-400">
              {completedSteps} / {totalSteps} {isKu ? 'تەواوکراوە' : 'completed'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="font-mono font-bold text-indigo-400">
              {product.progressPercent !== undefined ? product.progressPercent : Math.round((completedSteps / totalSteps) * 100)}%
            </span>
          </div>
        </div>

        {/* Horizontal Visual Timeline Track */}
        <div className="relative pt-2 pb-3 overflow-x-auto scrollbar-none">
          <div className="min-w-[540px] flex items-center justify-between relative px-4">
            
            {/* Background connecting line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-800 rounded-full z-0" />
            
            {/* Active connecting line up to current progress */}
            <div 
              className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 rounded-full z-0 transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(0, ((completedSteps + (inProgressSteps > 0 ? 0.5 : 0)) / totalSteps) * 100))}%`
              }}
            />

            {/* Step Checkpoints */}
            {milestones.map((step) => {
              const isSelected = selectedMilestoneId === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setSelectedMilestoneId(isSelected ? null : step.id)}
                  className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                  title={`${step.titleKu} - ${step.dateStr}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border-2 ${
                    step.status === 'completed'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                      : step.status === 'in-progress'
                      ? 'bg-slate-950 text-indigo-400 border-indigo-400 ring-4 ring-indigo-500/20 shadow-md shadow-indigo-500/40'
                      : 'bg-slate-950 text-slate-600 border-slate-800 hover:border-slate-700'
                  } ${isSelected ? 'scale-115 ring-2 ring-white/50' : ''}`}>
                    {step.status === 'completed' ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : step.status === 'in-progress' ? (
                      <Hourglass className="w-3.5 h-3.5 animate-spin-slow text-indigo-400" />
                    ) : (
                      <span className="font-mono text-[11px] font-bold">{step.index}</span>
                    )}
                  </div>

                  <span className={`text-[11px] font-mono mt-1.5 whitespace-nowrap transition-colors ${
                    step.status === 'completed'
                      ? 'text-emerald-400 font-semibold'
                      : step.status === 'in-progress'
                      ? 'text-indigo-300 font-bold'
                      : 'text-slate-500'
                  }`}>
                    {step.status === 'completed' 
                      ? (isKu ? 'تەواو' : 'Done')
                      : step.status === 'in-progress'
                      ? (isKu ? 'لەکاردا' : 'Active')
                      : (isKu ? `ق ${step.index}` : `P${step.index}`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Roadmap Detail Breakdown Section */}
      <div className="space-y-4 pt-2 border-t border-slate-800/80">
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{isKu ? 'سەرجەم قۆناغەکان' : 'All Milestones'}</span>
              <span className="ms-1.5 text-[10px] opacity-75 font-mono">({milestones.length})</span>
            </button>

            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'pending'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{isKu ? 'لەکاردا و داهاتوو' : 'Pending & Active'}</span>
              <span className="ms-1.5 text-[10px] opacity-75 font-mono">({milestones.length - completedSteps})</span>
            </button>

            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{isKu ? 'تەواوکراوەکان' : 'Completed'}</span>
              <span className="ms-1.5 text-[10px] opacity-75 font-mono">({completedSteps})</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {isKu ? 'دەستپێک:' : 'Kickoff:'}{' '}
              <span className="font-mono text-slate-300 font-semibold">{formatDate(startDate)}</span>
            </span>
            <span>·</span>
            <span>
              {isKu ? 'کۆتایی:' : 'Target:'}{' '}
              <span className="font-mono text-cyan-300 font-semibold">{formatDate(deadlineInfo.date)}</span>
            </span>
          </div>
        </div>

        {/* Chronological Milestone List */}
        <div className="space-y-3">
          {filteredMilestones.map((milestone) => {
            const isSelected = selectedMilestoneId === milestone.id;

            return (
              <div
                key={milestone.id}
                onClick={() => setSelectedMilestoneId(isSelected ? null : milestone.id)}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                  milestone.status === 'completed'
                    ? 'bg-slate-900/50 border-slate-800 hover:border-emerald-500/40'
                    : milestone.status === 'in-progress'
                    ? 'bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border-indigo-500/40 ring-1 ring-indigo-500/20'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  
                  {/* Left: Status Icon, Title & Category */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {milestone.status === 'completed' ? (
                        <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                      ) : milestone.status === 'in-progress' ? (
                        <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <Hourglass className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                        </div>
                      ) : (
                        <div className="p-1 rounded-lg bg-slate-900 text-slate-500 border border-slate-800">
                          <Circle className="w-4 h-4 text-slate-500" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h5 className={`text-sm font-bold ${
                          milestone.status === 'completed'
                            ? 'text-slate-200'
                            : milestone.status === 'in-progress'
                            ? 'text-white'
                            : 'text-slate-400'
                        }`}>
                          {isKu ? milestone.titleKu : milestone.titleEn}
                        </h5>

                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400 font-medium">
                          {isKu ? milestone.categoryLabelKu : milestone.categoryLabelEn}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isKu ? milestone.descriptionKu : milestone.descriptionEn}
                      </p>
                    </div>
                  </div>

                  {/* Right: Milestone Target Date & Status Indicator */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{milestone.dateStr}</span>
                      </div>
                      <div className="text-[11px]">
                        {milestone.status === 'completed' ? (
                          <span className="text-emerald-400 font-semibold">
                            {isKu ? 'تەواوکراو' : 'Completed'}
                          </span>
                        ) : milestone.status === 'in-progress' ? (
                          <span className="text-indigo-400 font-semibold">
                            {isKu ? 'لە قۆناغی کاردایە' : 'In Progress'}
                          </span>
                        ) : (
                          <span className="text-slate-500">
                            {isKu ? 'قۆناغی داهاتوو' : 'Upcoming Stage'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* CEO / Board Action Footer Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Flag className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            {isKu
              ? 'ئەم نەخشە ڕێگایە ڕاستەوخۆ بەپێی گۆڕانکارییەکانی بەڕێوەبەرایەتی نوێ دەبێتەوە.'
              : 'Roadmap synchronizes dynamically with executive milestones and deadline updates.'}
          </span>
        </div>

        <div className="font-mono text-slate-400">
          {isKu 
            ? `وادەی کۆتایی: ${deadlineInfo.rawDeadline || formatDate(deadlineInfo.date)}` 
            : `Target: ${deadlineInfo.rawDeadline || formatDate(deadlineInfo.date)}`}
        </div>
      </div>

    </div>
  );
};
