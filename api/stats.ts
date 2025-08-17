import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const groups = await storage.getWhatsappGroups();
      const categories = new Set(groups.map(g => g.category));
      const countries = new Set(groups.map(g => g.country));

      res.json({
        totalGroups: groups.length,
        totalCategories: categories.size,
        totalCountries: countries.size
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}