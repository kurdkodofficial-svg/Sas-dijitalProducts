import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  PlusCircle, 
  Globe2, 
  Layers, 
  Package, 
  ShieldCheck, 
  ExternalLink,
  Code,
  Palette,
  BookOpen,
  Bot,
  SlidersHorizontal,
  ArrowUpDown,
  Building2,
  Landmark,
  Briefcase,
  Smartphone,
  Monitor,
  Globe,
  Plus,
  LayoutGrid,
  ListFilter,
  Download,
  FileSpreadsheet,
  FileJson,
  Check
} from 'lucide-react';
import { DigitalProduct, CategoryKey, CategoryInfo, SortOption, Language } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { ProductEditorModal } from './components/ProductEditorModal';
import { AiImageStudioModal } from './components/AiImageStudioModal';
import { GoogleSeoHubModal } from './components/GoogleSeoHubModal';
import bundledProducts from '../data/products.json';

const LOCAL_STORAGE_KEY = 'sas_dijital_products_v1';
const INITIAL_BASE_URL =
  typeof window !== 'undefined'
    ? new URL('./', window.location.href).href
    : '';

const resolveAssetUrls = (list: DigitalProduct[]): DigitalProduct[] =>
  list.map((p) => {
    if (
      p.imageUrl &&
      (p.imageUrl.startsWith('./images/') || p.imageUrl.startsWith('/images/')) &&
      INITIAL_BASE_URL
    ) {
      const cleanRel = p.imageUrl.replace(/^\.?\//, '');
      return { ...p, imageUrl: new URL(cleanRel, INITIAL_BASE_URL).href };
    }
    return p;
  });

export default function App() {
  const [language, setLanguage] = useState<Language>('ku');
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'sections' | 'grid'>('sections');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addCategory, setAddCategory] = useState<DigitalProduct['category']>('city-management');
  const [isImageStudioOpen, setIsImageStudioOpen] = useState(false);
  const [imageStudioInitialPrompt, setImageStudioInitialPrompt] = useState('');
  const [isSeoHubOpen, setIsSeoHubOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [exporting, setExporting] = useState<'csv' | 'json' | null>(null);

  const isKu = language === 'ku';
  const isAr = language === 'ar';
  const isEn = language === 'en';

  // Primary categories requested by the user:
  // City management (Shari Andazyaran / Italian Village 1 & 2), Financial systems, Management ERP,
  // Mobile apps, Desktop software, Websites, Templates, Ebooks, Software/Code
  const categories: CategoryInfo[] = [
    { 
      id: 'all', 
      labelKu: 'هەموو بەشەکان', 
      labelEn: 'All Sections', 
      icon: 'Layers',
      descriptionKu: 'کۆکراوەی سەرجەم بەش و پڕۆژە دیجیتاڵییەکان',
      descriptionEn: 'All product categories and software solutions'
    },
    { 
      id: 'city-management', 
      labelKu: 'سیستەمی بەڕێوەبردنی شار و کۆمەڵگە', 
      labelEn: 'City & Compound ERP', 
      icon: 'Building2',
      descriptionKu: 'وەک شاری ئەندازیاران، گوندی ئیتاڵی ١ و ٢، یان هاوشێوەکانیان (بەڕێوەبردنی یەکە، ئابوونەی مانگانە و سکیوریتی)',
      descriptionEn: 'Residential compound management: unit registry, monthly utilities, resident subscriptions & security'
    },
    { 
      id: 'financial-systems', 
      labelKu: 'سیستەمی دارایی و ژمێریاری', 
      labelEn: 'Financial & Accounting Systems', 
      icon: 'Landmark',
      descriptionKu: 'حساباتی گشتی، قازانج و زیان، پسوولە، قەرز و باڵانسی کڕیاران و دابینکەران',
      descriptionEn: 'Invoicing, balance sheets, profit & loss statements, customer & supplier debts ledger'
    },
    { 
      id: 'management-erp', 
      labelKu: 'سیستەمی بەڕێوەبردن و کارگێڕی (ERP)', 
      labelEn: 'Management & Operations ERP', 
      icon: 'Briefcase',
      descriptionKu: 'بەڕێوەبردنی کارمەندان، مووچە، کڕیاران (CRM)، ئەرکەکانی ڕۆژانە و بەڕێوەبردنی کۆمپانیا',
      descriptionEn: 'Staff management, HR, CRM, client workflows, daily tasks and operational dashboards'
    },
    { 
      id: 'mobile-apps', 
      labelKu: 'ئەپی مۆبایل (iOS و Android)', 
      labelEn: 'Mobile Apps (iOS & Android)', 
      icon: 'Smartphone',
      descriptionKu: 'ئەپڵیکەیشنی تایبەت بە مۆبایل بۆ iOS و ئەندرۆید لەگەڵ کۆدی سەرچاوە و بەستەری داگرتن',
      descriptionEn: 'Mobile applications for iOS and Android with source code and download links'
    },
    { 
      id: 'desktop-software', 
      labelKu: 'بەرنامەی کۆمپیوتەر و دێسکتۆپ (Windows)', 
      labelEn: 'Desktop Software & Windows POS', 
      icon: 'Monitor',
      descriptionKu: 'بەرنامەی خێرای سەر ویندۆز بۆ کاشێر، کۆگا، خاڵی فرۆشتن (POS) بەبێ پێویستی بە ئینتەرنێت',
      descriptionEn: 'High-speed desktop software for points of sale, offline supermarket POS and inventory'
    },
    { 
      id: 'websites', 
      labelKu: 'ماڵپەڕ و پلاتفۆرمی وێب', 
      labelEn: 'Websites & Web Platforms', 
      icon: 'Globe',
      descriptionKu: 'ماڵپەڕی بازرگانی، ناساندنی پڕۆژەکان، کۆگای ئۆنلاین و پۆڕتاڵی تایبەت بە کارکردنی خێرا',
      descriptionEn: 'Corporate sites, e-commerce stores, custom business landing pages and web apps'
    },
    { 
      id: 'templates', 
      labelKu: 'قاڵب و تێمپلێت (Templates)', 
      labelEn: 'Templates & Workspaces', 
      icon: 'Layers',
      descriptionKu: 'قاڵبی ئامادەکراوی کاری نۆشن (Notion)، کانڤا (Canva)، ئێکسڵ و دیزاین بۆ بەکارهێنانی خێرا',
      descriptionEn: 'Notion workspaces, Canva templates, spreadsheets and ready-to-use workflows'
    },
    { 
      id: 'ebooks', 
      labelKu: 'کتێبی ئەلیکترۆنی و ڕێبەر (Ebooks & PDF)', 
      labelEn: 'Ebooks & Digital Guides', 
      icon: 'BookOpen',
      descriptionKu: 'کتێب، نامیلکە و فێرکاری بە شێوازی PDF و فایلی چاپکراو بە کوالیتی بەرز',
      descriptionEn: 'E-books, blueprints, guides, study materials and downloadable PDFs'
    },
    { 
      id: 'software', 
      labelKu: 'کۆد و نەرمەکاڵا (Software & Scripts)', 
      labelEn: 'Code, Scripts & Automation', 
      icon: 'Code',
      descriptionKu: 'کۆدی سەرچاوە، بۆتی تلگرام، ئۆتۆمەیشن و ئامرازی پرۆگرامینگ',
      descriptionEn: 'Source code repositories, automation bots, Telegram bots and dev tools'
    },
  ];

  // Specific content sections (excluding 'all') for the structured section view
  const sectionCategories = categories.filter((c) => c.id !== 'all');

  // Sync document language and direction
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
  }, [language]);

  // Load products from Node server, with automatic fallback for GitHub Pages / static hosts
  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error('Static host detected (no Node API)');
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setIsBackendAvailable(true);
        setProducts(resolveAssetUrls(data.products));
        return;
      }
      throw new Error('Invalid API payload');
    } catch {
      setIsBackendAvailable(false);
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(resolveAssetUrls(parsed));
            return;
          }
        }
      } catch {
        // ignore storage errors
      }
      setProducts(resolveAssetUrls(bundledProducts as DigitalProduct[]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Helper to extract product ID from current URL (supports /products/:id, ?product=:id, and #product-:id)
  const getProductIdFromUrl = (): string | null => {
    if (typeof window === 'undefined') return null;

    // 1. Path match: /products/:id or /product/:id
    const path = window.location.pathname;
    const match = path.match(/^\/(?:products|product)\/([^/?#]+)/i);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }

    // 2. Query param: ?product=:id or ?id=:id
    const searchParams = new URLSearchParams(window.location.search);
    const qProduct = searchParams.get('product') || searchParams.get('id');
    if (qProduct) return decodeURIComponent(qProduct);

    // 3. Hash: #product-:id or #:id
    const hash = window.location.hash.replace(/^#/, '');
    if (hash.startsWith('product-')) {
      return decodeURIComponent(hash.replace('product-', ''));
    }
    if (hash && !hash.startsWith('section-') && !hash.startsWith('/')) {
      return decodeURIComponent(hash);
    }

    return null;
  };

  // Open product modal and push clean URL (uses ?product=:id on GitHub Pages/static subpaths)
  const handleOpenProduct = (product: DigitalProduct) => {
    setSelectedProduct(product);
    try {
      if (!isBackendAvailable || window.location.hostname.endsWith('github.io')) {
        const url = new URL(window.location.href);
        url.searchParams.set('product', product.id);
        window.history.pushState({ productId: product.id }, '', url.toString());
      } else {
        window.history.pushState({ productId: product.id }, '', `/products/${product.id}`);
      }
    } catch {
      // ignore state error
    }
  };

  // Close product modal and restore home URL
  const handleCloseProduct = () => {
    setSelectedProduct(null);
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('product')) {
        url.searchParams.delete('product');
        window.history.pushState(null, '', url.toString());
      } else if (
        window.location.pathname.startsWith('/products/') ||
        window.location.pathname.startsWith('/product/')
      ) {
        window.history.pushState(null, '', '/');
      }
    } catch {
      // ignore state error
    }
  };

  // Synchronize modal with URL on load, back/forward buttons, or hash change
  useEffect(() => {
    if (products.length === 0) return;

    const syncProductFromUrl = () => {
      const targetId = getProductIdFromUrl();
      if (targetId) {
        const found = products.find(
          (p) =>
            p.id.toLowerCase() === targetId.toLowerCase() ||
            p.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') === targetId.toLowerCase()
        );
        if (found) {
          setSelectedProduct(found);
          setTimeout(() => {
            const el = document.getElementById(`product-${found.id}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        }
      }
    };

    syncProductFromUrl();

    window.addEventListener('popstate', syncProductFromUrl);
    window.addEventListener('hashchange', syncProductFromUrl);

    return () => {
      window.removeEventListener('popstate', syncProductFromUrl);
      window.removeEventListener('hashchange', syncProductFromUrl);
    };
  }, [products]);

  // Helper to open Add Product modal with pre-selected category
  const openAddForCategory = (catId?: DigitalProduct['category']) => {
    setAddCategory(catId || 'city-management');
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  // Sort helper function
  const sortProductList = (list: DigitalProduct[]) => {
    return [...list].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'rating') {
        return (b.rating || 5) - (a.rating || 5);
      }
      return 0;
    });
  };

  // Filter products by search query
  const matchesSearch = (p: DigitalProduct) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = 
      (p.titleKu && p.titleKu.toLowerCase().includes(query)) ||
      (p.titleEn && p.titleEn.toLowerCase().includes(query));
    const descMatch =
      (p.descriptionKu && p.descriptionKu.toLowerCase().includes(query)) ||
      (p.descriptionEn && p.descriptionEn.toLowerCase().includes(query));
    const tagMatch = p.tags && p.tags.some((t) => t.toLowerCase().includes(query));
    const fileMatch = p.fileType && p.fileType.toLowerCase().includes(query);
    return titleMatch || descMatch || tagMatch || fileMatch;
  };

  // Filtered and sorted products for single category view or full grid view
  const filteredProducts = products.filter((p) => {
    const categoryMatch = activeCategory === 'all' || p.category === activeCategory;
    return categoryMatch && matchesSearch(p);
  });
  const sortedProducts = sortProductList(filteredProducts);

  // Save Product (Add or Edit) — uses API on Node host or localStorage on static hosts
  const handleSaveProduct = async (productData: Partial<DigitalProduct>) => {
    const saveLocally = () => {
      let updatedList: DigitalProduct[];
      if (editingProduct) {
        updatedList = products.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...productData, updatedAt: new Date().toISOString() }
            : p
        );
      } else {
        const created: DigitalProduct = {
          id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          titleKu: '',
          titleEn: '',
          descriptionKu: '',
          descriptionEn: '',
          category: 'websites',
          price: 0,
          currency: 'USD',
          isFree: true,
          fileType: '',
          fileSize: '',
          rating: 5,
          reviewsCount: 1,
          downloadUrl: '',
          purchaseUrl: '',
          imageUrl: '',
          tags: [],
          features: [],
          createdAt: new Date().toISOString(),
          ...productData,
        };
        updatedList = [created, ...products];
      }
      setProducts(updatedList);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
      } catch {
        // ignore storage quota errors
      }
    };

    try {
      if (isBackendAvailable) {
        if (editingProduct) {
          const res = await fetch(`/api/products/${editingProduct.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
          });
          const data = await res.json();
          if (data.success) {
            setProducts((prev) =>
              prev.map((p) => (p.id === editingProduct.id ? data.product : p))
            );
          } else {
            saveLocally();
          }
        } else {
          const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
          });
          const data = await res.json();
          if (data.success) {
            setProducts((prev) => [data.product, ...prev]);
          } else {
            saveLocally();
          }
        }
      } else {
        saveLocally();
      }
      setEditingProduct(null);
      setIsAddModalOpen(false);
    } catch {
      saveLocally();
      setEditingProduct(null);
      setIsAddModalOpen(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    const confirmMsg = isKu
      ? 'دڵنیایت لە سڕینەوەی ئەم بەرهەمە دیجیتاڵییە؟'
      : isAr
      ? 'هل أنت متأكد من حذف هذا المنتج الرقمي؟'
      : 'Are you sure you want to delete this digital product?';
    if (!window.confirm(confirmMsg)) return;

    const deleteLocally = () => {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    };

    try {
      if (isBackendAvailable) {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        } else {
          deleteLocally();
        }
      } else {
        deleteLocally();
      }
    } catch {
      deleteLocally();
    }
  };

  // Trigger AI Image Studio with prefilled prompt
  const handleOpenImageStudioWithPrompt = (prompt: string) => {
    setImageStudioInitialPrompt(prompt);
    setIsImageStudioOpen(true);
  };

  // Apply AI Generated image directly
  const handleApplyImageToProduct = (imageUrl: string) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        imageUrl,
      });
    }
    navigator.clipboard.writeText(imageUrl);
  };

  // Export products to CSV or JSON offline backup (works on both Node server & GitHub Pages)
  const handleExport = (format: 'csv' | 'json') => {
    setExporting(format);
    const dateStr = new Date().toISOString().split('T')[0];

    if (isBackendAvailable) {
      try {
        const link = document.createElement('a');
        link.href = `/api/export/${format}`;
        link.setAttribute('download', `sas-dijitalproducts-${format === 'csv' ? 'export' : 'backup'}-${dateStr}.${format}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
          setExporting(null);
          setIsExportMenuOpen(false);
        }, 500);
        return;
      } catch {
        // fall through to client-side download
      }
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sas-dijitalproducts-backup-${dateStr}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = [
        'ID', 'Title_KU', 'Title_AR', 'Title_EN', 'Category', 'Price_USD', 'Is_Free',
        'FileType', 'FileSize', 'Progress_Percent', 'Target_Deadline',
        'Project_Status', 'Holding_Client', 'Milestones_Completed', 'Milestones_Total',
        'Download_URL', 'Purchase_URL', 'Demo_URL', 'Rating', 'Reviews_Count',
        'Tags', 'Features', 'Created_At'
      ];
      const escapeCSV = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const rows = products.map((p) => [
        escapeCSV(p.id),
        escapeCSV(p.titleKu),
        escapeCSV(p.titleAr ?? ''),
        escapeCSV(p.titleEn),
        escapeCSV(p.category),
        escapeCSV(p.price),
        escapeCSV(p.isFree ? 'Yes' : 'No'),
        escapeCSV(p.fileType),
        escapeCSV(p.fileSize),
        escapeCSV(p.progressPercent ?? ''),
        escapeCSV(p.targetDeadline ?? ''),
        escapeCSV(p.projectStatus ?? ''),
        escapeCSV(p.clientOrHoldingName ?? ''),
        escapeCSV(p.milestonesCompleted ?? ''),
        escapeCSV(p.milestonesTotal ?? ''),
        escapeCSV(p.downloadUrl),
        escapeCSV(p.purchaseUrl),
        escapeCSV(p.demoUrl ?? ''),
        escapeCSV(p.rating),
        escapeCSV(p.reviewsCount),
        escapeCSV(Array.isArray(p.tags) ? p.tags.join('; ') : ''),
        escapeCSV(Array.isArray(p.features) ? p.features.join('; ') : ''),
        escapeCSV(p.createdAt)
      ].join(','));
      const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sas-dijitalproducts-export-${dateStr}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setExporting(null);
    setIsExportMenuOpen(false);
  };

  // Icon renderer helper
  const renderCategoryIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'Building2': return <Building2 className={className} />;
      case 'Landmark': return <Landmark className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'Smartphone': return <Smartphone className={className} />;
      case 'Monitor': return <Monitor className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Code': return <Code className={className} />;
      case 'Palette': return <Palette className={className} />;
      case 'Bot': return <Bot className={className} />;
      default: return <Package className={className} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Dynamic Schema.org structured data in body for Google Crawler */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Sas-dijitalProducts Catalog",
            "itemListElement": products.map((p, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Product",
                "name": p.titleKu || p.titleEn,
                "description": p.descriptionKu || p.descriptionEn,
                "image": p.imageUrl,
                "offers": {
                  "@type": "Offer",
                  "price": p.price || "0.00",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock",
                  "url": `${typeof window !== 'undefined' ? window.location.origin : ''}/products/${p.id}`
                }
              }
            }))
          })
        }}
      />

      {/* Top Navbar */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAddModal={() => openAddForCategory()}
        onOpenImageStudio={() => {
          setImageStudioInitialPrompt('');
          setIsImageStudioOpen(true);
        }}
        onOpenSeoHub={() => setIsSeoHubOpen(true)}
        productCount={products.length}
      />

      {/* Hero Section */}
      <Hero
        language={language}
        totalProducts={products.length}
        onOpenAddModal={() => openAddForCategory()}
        onOpenImageStudio={() => {
          setImageStudioInitialPrompt('');
          setIsImageStudioOpen(true);
        }}
        onOpenSeoHub={() => setIsSeoHubOpen(true)}
      />

      {/* Main Products Grid & Section Hub */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Section Navigation & Filter Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Filter & Sorting Controls Bar */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              
              {/* Category Dropdown Filter */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  {isKu ? 'بەش:' : 'Category:'}
                </span>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value as CategoryKey)}
                  className="bg-slate-950 border border-slate-700/80 hover:border-indigo-500 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-slate-950 text-slate-100">
                      {isKu ? cat.labelKu : isAr ? (cat.labelAr || cat.labelKu) : cat.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sorting Dropdown (Newest, Price High to Low, Price Low to High, Rating) */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-cyan-400" />
                <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  {isKu ? 'ڕیزبەندی:' : isAr ? 'الترتيب:' : 'Sort By:'}
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-slate-950 border border-slate-700/80 hover:border-cyan-500 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all cursor-pointer"
                >
                  <option value="newest">{isKu ? 'نوێترین (Newest)' : isAr ? 'الأحدث (Newest)' : 'Newest'}</option>
                  <option value="price-desc">{isKu ? 'نرخ: لە بەرزەوە بۆ نزم (High to Low)' : isAr ? 'السعر: من الأعلى إلى الأقل' : 'Price (High to Low)'}</option>
                  <option value="price-asc">{isKu ? 'نرخ: لە نزمەوە بۆ بەرز (Low to High)' : isAr ? 'السعر: من الأقل إلى الأعلى' : 'Price (Low to High)'}</option>
                  <option value="rating">{isKu ? 'بەرزترین هەڵسەنگاندن' : isAr ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
                </select>
              </div>

              {/* View Layout Toggle */}
              {activeCategory === 'all' && !searchQuery && (
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5">
                  <button
                    onClick={() => setViewMode('sections')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'sections'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ListFilter className="w-3.5 h-3.5" />
                    <span>{isKu ? 'بەش بە بەش' : isAr ? 'حسب الأقسام' : 'By Sections'}</span>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'grid'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>{isKu ? 'تۆڕی گشتی' : isAr ? 'شبكة الكل' : 'Grid'}</span>
                  </button>
                </div>
              )}

            </div>

            {/* Action Bar: Export Data & Quick Status Count */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Export Data Button & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsExportMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 hover:border-emerald-500 hover:bg-slate-900 text-slate-100 hover:text-white text-xs sm:text-sm font-semibold transition-all shadow-sm group cursor-pointer"
                  title={isKu ? 'هەناردەکردنی سەرجەم داتاکان بە شێوازی CSV یان JSON بۆ ئۆفلاین' : 'Export all data as CSV or JSON for offline backup'}
                  aria-expanded={isExportMenuOpen}
                >
                  <Download className={`w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform ${exporting ? 'animate-bounce' : ''}`} />
                  <span>{isKu ? 'هەناردەکردنی داتا' : 'Export Data'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    CSV / JSON
                  </span>
                </button>

                {isExportMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsExportMenuOpen(false)} 
                    />
                    <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-slate-800 mb-1.5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white">
                            {isKu ? 'باکئەپ و هەناردەکردنی داتا' : 'Backup & Export Data'}
                          </p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {products.length} {isKu ? 'بەرهەم' : 'items'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isKu ? 'داگرتنی داتای بەرهەمەکان بۆ بەکارهێنانی ئۆفلاین' : 'Save all product data locally for offline backup'}
                        </p>
                      </div>

                      <button
                        onClick={() => handleExport('csv')}
                        disabled={exporting !== null}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/30 text-left transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
                            <FileSpreadsheet className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">
                              {isKu ? 'خشتەی ئێکسڵ (CSV / Excel)' : 'Excel Spreadsheet (CSV)'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {isKu ? 'پشتیوانی تەواوی پیتی کوردی بە UTF-8' : 'Compatible with MS Excel & Kurdish text'}
                            </p>
                          </div>
                        </div>
                        {exporting === 'csv' ? (
                          <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                        )}
                      </button>

                      <button
                        onClick={() => handleExport('json')}
                        disabled={exporting !== null}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-950/40 border border-transparent hover:border-indigo-500/30 text-left transition-all group mt-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-all">
                            <FileJson className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">
                              {isKu ? 'باکئەپی تەواوی داتابەیس (JSON)' : 'Raw JSON Backup'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {isKu ? 'بۆ گەڕاندنەوە یان کۆپیی ئۆفلاین' : 'Complete schema for database restore'}
                            </p>
                          </div>
                        </div>
                        {exporting === 'json' ? (
                          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Quick Status Count & Search hint */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                  {isKu
                    ? `${sortedProducts.length} بەرهەمی ڕاستەقینە`
                    : `${sortedProducts.length} real products`}
                </span>
                {activeCategory !== 'all' && (
                  <button
                    onClick={() => setActiveCategory('all')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline font-semibold"
                  >
                    {isKu ? 'نیشاندانی هەمووی (Reset)' : 'Reset filter'}
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Category Filter Buttons Set */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800/80 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = cat.id === 'all' 
                ? products.length 
                : products.filter((p) => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                      : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {renderCategoryIcon(cat.icon, 'w-3.5 h-3.5')}
                  <span>{isKu ? cat.labelKu : cat.labelEn}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-indigo-950 text-indigo-200' : 'bg-slate-900 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-slate-900/60 rounded-2xl h-80 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : activeCategory === 'all' && !searchQuery && viewMode === 'sections' ? (
          /* SECTION-BY-SECTION STRUCTURED VIEW */
          <div className="space-y-12">
            {sectionCategories.map((sec) => {
              const secProducts = sortProductList(
                products.filter((p) => p.category === sec.id)
              );

              return (
                <section
                  key={sec.id}
                  id={`section-${sec.id}`}
                  className="p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-slate-800/90 shadow-xl space-y-6"
                >
                  {/* Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {renderCategoryIcon(sec.icon, 'w-5 h-5')}
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                            <span>{isKu ? sec.labelKu : sec.labelEn}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-slate-950 border border-slate-800 text-indigo-400">
                              {isKu ? `${secProducts.length} بەرهەم` : `${secProducts.length} items`}
                            </span>
                          </h2>
                          <div className="text-xs text-slate-400">
                            {isKu ? sec.descriptionKu : sec.descriptionEn}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dedicated Add Product button for this exact section */}
                    <button
                      onClick={() => openAddForCategory(sec.id as DigitalProduct['category'])}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-md hover:shadow-indigo-600/30 transition-all shrink-0 self-start sm:self-center"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {isKu
                          ? `+ زیادکردنی بەرهەمی ڕاستەقینە`
                          : `+ Add Real Product`}
                      </span>
                    </button>
                  </div>

                  {/* Section Products or Pristine Empty State */}
                  {secProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {secProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          language={language}
                          onViewDetails={(p) => handleOpenProduct(p)}
                          onEdit={(p) => {
                            setEditingProduct(p);
                            setIsAddModalOpen(true);
                          }}
                          onDelete={handleDeleteProduct}
                        />
                      ))}
                    </div>
                  ) : (
                    /* Clean Section Placeholder Box - Zero fake data, ready for real products */
                    <div className="rounded-2xl border-2 border-dashed border-slate-800/90 bg-slate-950/40 p-8 sm:p-10 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                        {renderCategoryIcon(sec.icon, 'w-6 h-6')}
                      </div>
                      <h4 className="text-sm font-bold text-slate-300">
                        {isKu ? 'هیچ بەرهەمێکی فەیک لێرە نییە' : 'No fake products here'}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                        {isKu
                          ? `ئەم بەشە تایبەتە بە "${sec.labelKu}". دەتوانیت ڕاستەوخۆ بەرهەم، فایل یان لینکی پڕۆژە ڕاستەقینەکەت لێرە دابنێیت.`
                          : `This section is reserved for "${sec.labelEn}". Click below to add your genuine product, project link or file.`}
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => openAddForCategory(sec.id as DigitalProduct['category'])}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-indigo-500/50 transition-colors inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5 text-indigo-400" />
                          <span>
                            {isKu ? 'زیادکردنی یەکەم بەرهەمی ئەم بەشە' : 'Add First Product to this Section'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        ) : sortedProducts.length > 0 ? (
          /* SINGLE CATEGORY OR GRID / SEARCH RESULTS VIEW */
          <div className="space-y-6">
            {activeCategory !== 'all' && (
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-white">
                    {isKu
                      ? categories.find((c) => c.id === activeCategory)?.labelKu
                      : categories.find((c) => c.id === activeCategory)?.labelEn}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isKu
                      ? categories.find((c) => c.id === activeCategory)?.descriptionKu
                      : categories.find((c) => c.id === activeCategory)?.descriptionEn}
                  </p>
                </div>
                <button
                  onClick={() => openAddForCategory(activeCategory as DigitalProduct['category'])}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isKu ? '+ زیادکردنی بەرهەم' : '+ Add Product'}</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  language={language}
                  onViewDetails={(p) => handleOpenProduct(p)}
                  onEdit={(p) => {
                    setEditingProduct(p);
                    setIsAddModalOpen(true);
                  }}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          </div>
        ) : (
          /* EMPTY STATE FOR FILTERED SEARCH OR EMPTY CATEGORY */
          <div className="py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                {isKu ? 'هیچ بەرهەمێک نەدۆزرایەوە' : 'No Products Found'}
              </h3>
              <p className="text-xs text-slate-400">
                {searchQuery
                  ? isKu
                    ? `هیچ ئەنجامێک بۆ گەڕانەکەت بەدەستنەهات ("${searchQuery}").`
                    : `No results match your search query ("${searchQuery}").`
                  : isKu
                  ? 'هێشتا هیچ بەرهەمێکی ڕاستەقینە لەم بەشەدا زیاد نەکراوە.'
                  : 'No genuine items in this category yet.'}
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  {isKu ? 'پاککردنەوەی گەڕان' : 'Clear Search'}
                </button>
              )}
              <button
                onClick={() => openAddForCategory(activeCategory !== 'all' ? (activeCategory as DigitalProduct['category']) : undefined)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                {isKu ? '+ زیادکردنی بەرهەمی ڕاستەقینە' : '+ Add Real Product'}
              </button>
            </div>
          </div>
        )}

        {/* Feature Explainer Banner: Google Ready without backend */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isKu ? 'ئامادە بۆ ڕیزبەندی لە گووگڵ' : 'Google Search & SEO Ready'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isKu ? 'چۆن بەرهەمەکانت لە گووگڵ بڵاودەکەیتەوە؟' : 'Ready to Get Indexed on Google?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isKu ? (
                <>
                  بەستەری <strong>/sitemap.xml</strong> و پێکهاتەی <strong>Schema.org Product</strong> هەموو بەرهەمەکانتیان لەخۆگرتووە. بەبێ هیچ باکێندێک دەتوانیت لە ڕێگەی Google Search Console ـەوە هەموو بەرهەمەکانت بەخۆڕایی بناسێنیت.
                </>
              ) : (
                <>
                  Your dynamic <strong>/sitemap.xml</strong> and <strong>Schema.org</strong> structured data are generated automatically. Simply submit your URL into Google Search Console for zero-cost discovery.
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => setIsSeoHubOpen(true)}
              className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 flex items-center gap-2"
            >
              <Globe2 className="w-4 h-4" />
              <span>{isKu ? 'فێربوونی هەنگاوەکان' : 'Learn How to Index'}</span>
            </button>

            <button
              onClick={() => {
                setImageStudioInitialPrompt('');
                setIsImageStudioOpen(true);
              }}
              className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isKu ? 'دروستکردنی وێنەی 4K' : 'Studio 4K Generator'}</span>
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
              S
            </div>
            <div>
              <div className="font-bold text-slate-200">Sas-dijitalProducts</div>
              <div className="text-[11px] text-slate-500">
                {isKu ? 'مافی کۆپی پارێزراوە بۆ خاوەنی پڕۆژە' : 'All rights reserved © 2026'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <a 
              href="/sitemap.xml" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>sitemap.xml</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a 
              href="/robots.txt" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>robots.txt</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <button 
              onClick={() => setIsSeoHubOpen(true)}
              className="hover:text-indigo-400 transition-colors"
            >
              {isKu ? 'سێو و ڕیزبەندی گووگڵ' : 'Google SEO Hub'}
            </button>
            <span>•</span>
            <button 
              onClick={() => {
                setImageStudioInitialPrompt('');
                setIsImageStudioOpen(true);
              }}
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{isKu ? 'وێنەی Gemini 3 Pro (1K-4K)' : 'AI Image Studio'}</span>
            </button>
          </div>

        </div>
      </footer>

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        language={language}
        onClose={handleCloseProduct}
        onEdit={(p) => {
          setSelectedProduct(null);
          setEditingProduct(p);
          setIsAddModalOpen(true);
        }}
      />

      <ProductEditorModal
        product={editingProduct}
        isOpen={isAddModalOpen}
        initialCategory={addCategory}
        language={language}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        onOpenImageStudioWithPrompt={handleOpenImageStudioWithPrompt}
      />

      <AiImageStudioModal
        isOpen={isImageStudioOpen}
        initialPrompt={imageStudioInitialPrompt}
        language={language}
        onClose={() => setIsImageStudioOpen(false)}
        onApplyImageToProduct={handleApplyImageToProduct}
      />

      <GoogleSeoHubModal
        isOpen={isSeoHubOpen}
        language={language}
        products={products}
        onClose={() => setIsSeoHubOpen(false)}
        onImportProducts={(imported) => {
          setProducts(imported);
        }}
      />

    </div>
  );
}
