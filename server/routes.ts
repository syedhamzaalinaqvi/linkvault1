import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWhatsappGroupSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all WhatsApp groups
  app.get("/api/groups", async (req, res) => {
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
  });

  // Get single WhatsApp group
  app.get("/api/groups/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const group = await storage.getWhatsappGroup(id);
      
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch group" });
    }
  });

  // Create new WhatsApp group
  app.post("/api/groups", async (req, res) => {
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
  });

  // Increment view count
  app.post("/api/groups/:id/view", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementViewCount(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to increment view count" });
    }
  });

  // Extract metadata from WhatsApp link
  app.post("/api/extract-metadata", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url || !url.includes('chat.whatsapp.com')) {
        return res.status(400).json({ message: "Invalid WhatsApp link" });
      }

      try {
        // Try to extract metadata from WhatsApp link
        const fetch = await import('node-fetch').then(mod => mod.default);
        const cheerio = await import('cheerio');
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch page');
        }
        
        const html = await response.text();
        const $ = cheerio.load(html);
        
        // Extract title from meta tags or title element
        let title = $('meta[property="og:title"]').attr('content') || 
                   $('meta[name="twitter:title"]').attr('content') || 
                   $('title').text() || 
                   'WhatsApp Group';
        
        // Extract image from meta tags
        let imageUrl = $('meta[property="og:image"]').attr('content') || 
                      $('meta[name="twitter:image"]').attr('content') || 
                      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200';
        
        // Clean up title
        title = title.replace(/WhatsApp/gi, '').trim() || 'Group Chat';
        
        res.json({ title, imageUrl });
      } catch (scrapeError: any) {
        // Fallback to smart extraction from URL pattern
        console.log('Scraping failed, using fallback:', scrapeError?.message || 'Unknown error');
        
        // Generate a reasonable title based on URL patterns
        const urlParts = url.split('/');
        const groupCode = urlParts[urlParts.length - 1];
        
        // Generate different group names and images based on group code patterns
        const groupNames = [
          'Study Group',
          'Friends Chat',
          'Business Network',
          'Community Hub',
          'Discussion Group',
          'Tech Talks',
          'Local Community',
          'Interest Group'
        ];
        
        const images = [
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
          'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200'
        ];
        
        // Use simple hash of group code to pick consistent name/image
        const hash = groupCode.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
        const nameIndex = hash % groupNames.length;
        const imageIndex = hash % images.length;
        
        res.json({
          title: groupNames[nameIndex],
          imageUrl: images[imageIndex]
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to extract metadata" });
    }
  });

  // Get stats
  app.get("/api/stats", async (req, res) => {
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
  });

  const httpServer = createServer(app);
  return httpServer;
}
