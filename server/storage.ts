// Storage interface and DatabaseStorage implementation
import { 
  users, 
  farmerProfiles,
  diseaseDetections,
  newsArticles,
  chatMessages,
  cropRecommendations,
  governmentSchemes,
  type User, 
  type InsertUser,
  type FarmerProfile,
  type InsertFarmerProfile,
  type DiseaseDetection,
  type InsertDiseaseDetection,
  type NewsArticle,
  type InsertNewsArticle,
  type ChatMessage,
  type InsertChatMessage,
  type CropRecommendation,
  type InsertCropRecommendation,
  type GovernmentScheme,
  type InsertGovernmentScheme,
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, and, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Farmer profile methods
  getFarmerProfile(userId: string): Promise<FarmerProfile | undefined>;
  createFarmerProfile(profile: InsertFarmerProfile): Promise<FarmerProfile>;

  // Disease detection methods
  createDiseaseDetection(detection: InsertDiseaseDetection): Promise<DiseaseDetection>;
  getDiseaseDetections(userId: string): Promise<DiseaseDetection[]>;

  // News methods
  getNews(state?: string, language?: string, category?: string): Promise<NewsArticle[]>;
  getNewsById(id: number): Promise<NewsArticle | undefined>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;

  // Chat methods
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(userId: string, limit?: number): Promise<ChatMessage[]>;

  // Crop recommendation methods
  createCropRecommendation(recommendation: InsertCropRecommendation): Promise<CropRecommendation>;
  getCropRecommendations(userId: string): Promise<CropRecommendation[]>;

  // Government schemes methods
  getGovernmentSchemes(state: string, language: string): Promise<GovernmentScheme[]>;
  createGovernmentScheme(scheme: InsertGovernmentScheme): Promise<GovernmentScheme>;

  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ pool, createTableIfMissing: true });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Farmer profile methods
  async getFarmerProfile(userId: string): Promise<FarmerProfile | undefined> {
    const [profile] = await db.select().from(farmerProfiles).where(eq(farmerProfiles.userId, userId));
    return profile || undefined;
  }

  async createFarmerProfile(profile: InsertFarmerProfile): Promise<FarmerProfile> {
    const [newProfile] = await db
      .insert(farmerProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  // Disease detection methods
  async createDiseaseDetection(detection: InsertDiseaseDetection): Promise<DiseaseDetection> {
    const [newDetection] = await db
      .insert(diseaseDetections)
      .values(detection)
      .returning();
    return newDetection;
  }

  async getDiseaseDetections(userId: string): Promise<DiseaseDetection[]> {
    return await db
      .select()
      .from(diseaseDetections)
      .where(eq(diseaseDetections.userId, userId))
      .orderBy(desc(diseaseDetections.createdAt));
  }

  // News methods
  async getNews(state?: string, language?: string, category?: string): Promise<NewsArticle[]> {
    let query = db.select().from(newsArticles);
    
    const conditions = [];
    if (state && state !== 'all') conditions.push(eq(newsArticles.state, state));
    if (language) conditions.push(eq(newsArticles.language, language));
    if (category && category !== 'all') conditions.push(eq(newsArticles.category, category));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return await query.orderBy(desc(newsArticles.createdAt)).limit(20);
  }

  async getNewsById(id: number): Promise<NewsArticle | undefined> {
    const [article] = await db.select().from(newsArticles).where(eq(newsArticles.id, id));
    return article || undefined;
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const [newArticle] = await db
      .insert(newsArticles)
      .values(article)
      .returning();
    return newArticle;
  }

  // Chat methods
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getChatHistory(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  // Crop recommendation methods
  async createCropRecommendation(recommendation: InsertCropRecommendation): Promise<CropRecommendation> {
    const [newRecommendation] = await db
      .insert(cropRecommendations)
      .values(recommendation)
      .returning();
    return newRecommendation;
  }

  async getCropRecommendations(userId: string): Promise<CropRecommendation[]> {
    return await db
      .select()
      .from(cropRecommendations)
      .where(eq(cropRecommendations.userId, userId))
      .orderBy(desc(cropRecommendations.createdAt));
  }

  // Government schemes methods
  async getGovernmentSchemes(state: string, language: string): Promise<GovernmentScheme[]> {
    return await db
      .select()
      .from(governmentSchemes)
      .where(and(eq(governmentSchemes.state, state), eq(governmentSchemes.language, language)))
      .orderBy(desc(governmentSchemes.createdAt));
  }

  async createGovernmentScheme(scheme: InsertGovernmentScheme): Promise<GovernmentScheme> {
    const [newScheme] = await db
      .insert(governmentSchemes)
      .values(scheme)
      .returning();
    return newScheme;
  }
}

export const storage = new DatabaseStorage();
