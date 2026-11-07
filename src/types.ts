export interface DigitalProduct {
  id: string;
  titleKu: string;
  titleEn: string;
  descriptionKu: string;
  descriptionEn: string;
  category: 
    | 'city-management' 
    | 'financial-systems' 
    | 'management-erp' 
    | 'mobile-apps' 
    | 'websites' 
    | 'desktop-software' 
    | 'software' 
    | 'ebooks' 
    | 'templates' 
    | 'design' 
    | 'ai-assets' 
    | 'audio' 
    | 'courses' 
    | 'other';
  price: number;
  currency: 'USD' | 'IQD' | 'EUR';
  isFree: boolean;
  fileType: string; // e.g. 'ZIP', 'PDF', 'Figma', 'Node.js', 'MP3'
  fileSize: string; // e.g. '45 MB'
  rating: number;
  reviewsCount: number;
  downloadUrl: string; // direct download or cloud drive
  purchaseUrl: string; // external shop/gumroad/buymeacoffee or placeholder checkout
  demoUrl?: string; // live demo or documentation
  imageUrl: string;
  tags: string[];
  features: string[];
  seoKeywords?: string[];
  createdAt: string;
  updatedAt?: string;
  featured?: boolean;
  // CEO & Holding Executive Progress Infographic fields
  progressPercent?: number; // 0 to 100%
  targetDeadline?: string; // target completion date or deadline
  projectStatus?: 'planning' | 'in-progress' | 'testing' | 'completed' | 'live' | 'delayed';
  milestonesTotal?: number;
  milestonesCompleted?: number;
  clientOrHoldingName?: string; // Holding or company name
}

export type CategoryKey = 
  | 'all' 
  | 'city-management' 
  | 'financial-systems' 
  | 'management-erp' 
  | 'mobile-apps' 
  | 'websites' 
  | 'desktop-software' 
  | 'software' 
  | 'ebooks' 
  | 'templates' 
  | 'design' 
  | 'ai-assets';

export type SortOption = 'newest' | 'price-desc' | 'price-asc' | 'rating';

export interface CategoryInfo {
  id: CategoryKey;
  labelKu: string;
  labelEn: string;
  icon: string;
  descriptionKu?: string;
  descriptionEn?: string;
}

export type SupportedImageModel = 'gemini-3-pro-image-preview' | 'gemini-nano-banana-2.1';

export type AspectRatioType = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';

export type ImageSizeType = '1K' | '2K' | '4K';

export interface GenerateImagePayload {
  prompt: string;
  model: SupportedImageModel;
  aspectRatio: AspectRatioType;
  imageSize: ImageSizeType;
  referenceImageBase64?: string;
}
