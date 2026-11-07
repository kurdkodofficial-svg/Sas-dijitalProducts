import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Default initial products demonstrating Sas-dijitalProducts catalogue
// Store starts clean with 0 fake products, ready for user's real digital products
const DEFAULT_PRODUCTS: unknown[] = [];

// Helper to ensure data directory and products file exist
function getProducts() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PRODUCTS_FILE)) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(DEFAULT_PRODUCTS, null, 2), 'utf-8');
      return DEFAULT_PRODUCTS;
    }
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products file, returning default:', error);
    return DEFAULT_PRODUCTS;
  }
}

function saveProducts(products: unknown[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving products file:', error);
  }
}

// ---------------- API ROUTES ----------------

// 1. Get all products
app.get('/api/products', (req, res) => {
  const products = getProducts();
  res.json({ success: true, products });
});

// 2. Create new product
app.post('/api/products', (req, res) => {
  try {
    const products = getProducts();
    const newProduct = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewsCount: 1,
      ...req.body,
    };
    products.unshift(newProduct);
    saveProducts(products);
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

// 3. Update product
app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const products = getProducts();
    const index = products.findIndex((p: { id: string }) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    products[index] = {
      ...products[index],
      ...req.body,
      id, // keep original id
      updatedAt: new Date().toISOString(),
    };
    saveProducts(products);
    res.json({ success: true, product: products[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

// 4. Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    let products = getProducts();
    products = products.filter((p: { id: string }) => p.id !== id);
    saveProducts(products);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

// 4b. Export all products as JSON offline backup
app.get('/api/export/json', (req, res) => {
  try {
    const products = getProducts();
    const dateStr = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="sas-dijitalproducts-backup-${dateStr}.json"`);
    res.send(JSON.stringify(products, null, 2));
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to export JSON' });
  }
});

// 4c. Export all products as CSV (Excel compatible with UTF-8 BOM)
app.get('/api/export/csv', (req, res) => {
  try {
    const products = getProducts();
    const dateStr = new Date().toISOString().split('T')[0];
    const headers = [
      'ID', 'Title_KU', 'Title_EN', 'Category', 'Price_USD', 'Is_Free',
      'FileType', 'FileSize', 'Progress_Percent', 'Target_Deadline',
      'Project_Status', 'Holding_Client', 'Milestones_Completed', 'Milestones_Total',
      'Download_URL', 'Purchase_URL', 'Demo_URL', 'Rating', 'Reviews_Count',
      'Tags', 'Features', 'Created_At'
    ];
    const escapeCSV = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = products.map((p: any) => [
      escapeCSV(p.id),
      escapeCSV(p.titleKu),
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
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="sas-dijitalproducts-export-${dateStr}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to export CSV' });
  }
});

// 5. Generate High-Quality AI Image using Gemini Models
// Supported models: gemini-3-pro-image-preview and gemini-nano-banana-2.1
// Supported aspect ratios: 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9
// Supported image sizes: 1K, 2K, 4K
app.post('/api/generate-image', async (req, res) => {
  try {
    const {
      prompt,
      model = 'gemini-3-pro-image-preview',
      aspectRatio = '1:1',
      imageSize = '1K',
      referenceImageBase64,
      referenceMimeType = 'image/jpeg',
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'تکایە وەسف (Prompt) ی وێنەکە دیاری بکە / Please provide an image prompt',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        success: false,
        error: 'GEMINI_API_KEY دانەنراوە. تکایە لە بەشی Settings > Secrets کلیلی API دانێ.',
      });
    }

    // Supported aspect ratios mapping
    const validAspectRatios = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];
    const chosenAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    // Supported image sizes
    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';

    // Model selection validation (gemini-3-pro-image-preview or gemini-nano-banana-2.1)
    let selectedModel = model;
    if (selectedModel !== 'gemini-3-pro-image-preview' && selectedModel !== 'gemini-nano-banana-2.1') {
      selectedModel = 'gemini-3-pro-image-preview';
    }

    // Prepare contents
    const parts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];

    // Optional reference image for editing / style guidance
    if (referenceImageBase64) {
      const cleanBase64 = referenceImageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: referenceMimeType,
        },
      });
    }

    parts.push({
      text: prompt,
    });

    const config: {
      imageConfig: {
        aspectRatio: string;
        imageSize: string;
      };
    } = {
      imageConfig: {
        aspectRatio: chosenAspectRatio,
        imageSize: chosenSize,
      },
    };

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: {
        parts: parts as any,
      },
      config: config as any,
    });

    let generatedImageUrl = '';
    let textFeedback = '';

    const candidateParts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of candidateParts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      } else if (part.text) {
        textFeedback += part.text;
      }
    }

    if (!generatedImageUrl) {
      return res.status(500).json({
        success: false,
        error: textFeedback || 'وێنەکە لە لایەن مۆدێلەکەوە دروست نەکرا. تکایە پرۆمپتێکی تر تاقیبکەرەوە.',
      });
    }

    res.json({
      success: true,
      imageUrl: generatedImageUrl,
      model: selectedModel,
      aspectRatio: chosenAspectRatio,
      imageSize: chosenSize,
      notes: textFeedback,
    });
  } catch (error: any) {
    console.error('Image generation error:', error);
    const errorMessage = error?.message || 'هەڵەیەک ڕوویدا لە کاتی دروستکردنی وێنە';
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: error?.status || error?.code,
    });
  }
});

// 6. Generate AI Product Titles, Persian/Kurdish Descriptions and SEO Meta Tags
app.post('/api/generate-product-content', async (req, res) => {
  try {
    const { productName, category, roughNotes, language = 'ku' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        success: false,
        error: 'کلیل پێویستە لە Settings > Secrets',
      });
    }

    const systemPrompt = `You are a world-class digital product copywriter and SEO specialist for "Sas-dijitalProducts".
You create high-converting, professional, appealing digital product copy tailored for Kurdish and international creators.
Generate a valid JSON object matching this schema:
{
  "titleKu": "A catchy, professional title in Kurdish (Sorani)",
  "titleEn": "A clean, high-converting English title",
  "descriptionKu": "Engaging 2-3 paragraph product description in Kurdish explaining what it is, who it is for, and why they should buy it",
  "descriptionEn": "Engaging 2-3 paragraph product description in English",
  "features": ["Feature 1 in Kurdish", "Feature 2 in Kurdish", "Feature 3 in Kurdish", "Feature 4 in Kurdish"],
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"],
  "seoTitle": "SEO title under 60 characters with branding | Sas-dijitalProducts",
  "seoDescription": "SEO meta description under 155 characters focused on search click-through rate",
  "suggestedPrice": 19.99
}
Return ONLY pure JSON.`;

    const userPrompt = `Product Idea / Name: ${productName || 'Modern Digital Tool'}
Category: ${category || 'General Digital'}
Key Features or Notes: ${roughNotes || 'High quality digital files, instant download, commercial license'}
Language Preference: ${language}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Copywriting error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'هەڵەیەک ڕوویدا لە نووسینی دەقی هۆشمەند',
    });
  }
});

// 7. Dynamic Google Sitemap XML endpoint (/sitemap.xml)
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.APP_URL || `http://${req.headers.host || 'localhost:3000'}`;
  const products = getProducts();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // Homepage
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/</loc>\n`;
  xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // Each product clean URL
  products.forEach((prod: any) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/products/${prod.id}</loc>\n`;
    xml += `    <lastmod>${(prod.updatedAt || prod.createdAt || new Date().toISOString()).split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    if (prod.imageUrl) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${prod.imageUrl}</image:loc>\n`;
      xml += `      <image:title>${(prod.titleKu || prod.titleEn || '').replace(/&/g, '&amp;')}</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// 8. Robots.txt endpoint (/robots.txt)
app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.APP_URL || `http://${req.headers.host || 'localhost:3000'}`;
  const robots = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

// ---------------- VITE MIDDLEWARE / STATIC FILES ----------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Sas-dijitalProducts server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
