import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { insertWhatsappGroupSchema } from '../../shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const { category, country, search, sort } = req.query;
      let groups;

      if (search && typeof search === 'string') {
        groups = await storage.searchGroups(search);
      } else if (category && typeof category === 'string') {
        groups = await storage.getGroupsByCategory(category);
      } else if (country && typeof country === 'string') {
        groups = await storage.getGroupsByCountry(country);
      } else {
        groups = await storage.getWhatsappGroups();
      }

      // Apply sorting
      if (sort === 'popular') {
        groups.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      } else if (sort === 'alphabetical') {
        groups.sort((a, b) => a.title.localeCompare(b.title));
      }

      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  } else if (req.method === 'POST') {
    try {
      const validation = insertWhatsappGroupSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid group data", 
          errors: validation.error.errors 
        });
      }

      // Validate WhatsApp link format
      if (!validation.data.whatsappLink.includes('chat.whatsapp.com')) {
        return res.status(400).json({ 
          message: "Invalid WhatsApp link format" 
        });
      }

      const group = await storage.createWhatsappGroup(validation.data);
      res.status(201).json(group);
    } catch (error) {
      res.status(500).json({ message: "Failed to create group" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}