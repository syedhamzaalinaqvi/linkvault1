import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { id } = req.query;
      if (typeof id === 'string') {
        await storage.incrementViewCount(id);
        res.json({ success: true });
      } else {
        res.status(400).json({ message: "Invalid group ID" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to increment view count" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}