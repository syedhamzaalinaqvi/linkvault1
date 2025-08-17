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

      // Mock metadata extraction (in real implementation, use web scraping)
      const metadata = {
        title: "Auto-extracted Group Name",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      };

      res.json(metadata);
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
