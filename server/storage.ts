import { type User, type InsertUser, type WhatsappGroup, type InsertWhatsappGroup } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getWhatsappGroups(): Promise<WhatsappGroup[]>;
  getWhatsappGroup(id: string): Promise<WhatsappGroup | undefined>;
  createWhatsappGroup(group: InsertWhatsappGroup): Promise<WhatsappGroup>;
  incrementViewCount(id: string): Promise<void>;
  getGroupsByCategory(category: string): Promise<WhatsappGroup[]>;
  getGroupsByCountry(country: string): Promise<WhatsappGroup[]>;
  searchGroups(query: string): Promise<WhatsappGroup[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private whatsappGroups: Map<string, WhatsappGroup>;

  constructor() {
    this.users = new Map();
    this.whatsappGroups = new Map();

    // Initialize with some sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    const sampleGroups: InsertWhatsappGroup[] = [
      {
        title: "Tech Innovators Hub",
        description: "Connect with tech enthusiasts, share innovations, and discuss the latest in technology and startups.",
        whatsappLink: "https://chat.whatsapp.com/tech-innovators",
        category: "technology",
        country: "US",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      },
      {
        title: "Entrepreneurs Network",
        description: "Join successful entrepreneurs, share business ideas, and find potential partners for your next venture.",
        whatsappLink: "https://chat.whatsapp.com/entrepreneurs-network",
        category: "business",
        country: "IN",
        imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      },
      {
        title: "Medical Students Unite",
        description: "Connect with medical students worldwide, share study materials, and support each other through the journey.",
        whatsappLink: "https://chat.whatsapp.com/medical-students",
        category: "education",
        country: "UK",
        imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      },
      {
        title: "Pro Gamers League",
        description: "Join competitive gamers, discuss strategies, find teammates, and stay updated with the latest gaming trends.",
        whatsappLink: "https://chat.whatsapp.com/pro-gamers",
        category: "gaming",
        country: "CA",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      }
    ];

    for (const group of sampleGroups) {
      await this.createWhatsappGroup(group);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getWhatsappGroups(): Promise<WhatsappGroup[]> {
    return Array.from(this.whatsappGroups.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getWhatsappGroup(id: string): Promise<WhatsappGroup | undefined> {
    return this.whatsappGroups.get(id);
  }

  async createWhatsappGroup(insertGroup: InsertWhatsappGroup): Promise<WhatsappGroup> {
    const id = randomUUID();
    const group: WhatsappGroup = {
      ...insertGroup,
      id,
      viewCount: 0,
      createdAt: new Date(),
      imageUrl: insertGroup.imageUrl || null,
    };
    this.whatsappGroups.set(id, group);
    return group;
  }

  async incrementViewCount(id: string): Promise<void> {
    const group = this.whatsappGroups.get(id);
    if (group) {
      group.viewCount = (group.viewCount || 0) + 1;
      this.whatsappGroups.set(id, group);
    }
  }

  async getGroupsByCategory(category: string): Promise<WhatsappGroup[]> {
    return Array.from(this.whatsappGroups.values())
      .filter(group => group.category === category)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getGroupsByCountry(country: string): Promise<WhatsappGroup[]> {
    return Array.from(this.whatsappGroups.values())
      .filter(group => group.country === country)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async searchGroups(query: string): Promise<WhatsappGroup[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.whatsappGroups.values())
      .filter(group => 
        group.title.toLowerCase().includes(lowercaseQuery) ||
        group.description.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }
}

export const storage = new MemStorage();
