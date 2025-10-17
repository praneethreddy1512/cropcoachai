import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table with authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Farmer profiles with location and farm details
export const farmerProfiles = pgTable("farmer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  state: text("state").notNull(),
  district: text("district").notNull(),
  village: text("village"),
  phoneNumber: text("phone_number"),
  farmSize: text("farm_size"), // in acres/hectares
  soilType: text("soil_type"),
  primaryCrop: text("primary_crop"),
  preferredLanguage: text("preferred_language").notNull().default("en"), // en, hi, te, ta, kn
  createdAt: timestamp("created_at").defaultNow(),
});

// Disease detection history
export const diseaseDetections = pgTable("disease_detections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  imagePath: text("image_path").notNull(),
  diseaseName: text("disease_name"),
  confidence: text("confidence"),
  treatment: text("treatment"),
  aiResponse: jsonb("ai_response"), // full AI response
  createdAt: timestamp("created_at").defaultNow(),
});

// News articles (AI-generated based on state)
export const newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  state: text("state").notNull(),
  language: text("language").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // schemes, weather, market, technology
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat history
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  response: text("response").notNull(),
  language: text("language").notNull(),
  isVoice: boolean("is_voice").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Crop recommendations
export const cropRecommendations = pgTable("crop_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  soilType: text("soil_type").notNull(),
  climate: text("climate").notNull(),
  budget: text("budget").notNull(),
  state: text("state").notNull(),
  recommendedCrops: jsonb("recommended_crops").notNull(), // array of crop objects
  reasoning: text("reasoning").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Government schemes
export const governmentSchemes = pgTable("government_schemes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  state: text("state").notNull(),
  language: text("language").notNull(),
  schemeName: text("scheme_name").notNull(),
  description: text("description").notNull(),
  eligibility: text("eligibility").notNull(),
  benefits: text("benefits").notNull(),
  howToApply: text("how_to_apply").notNull(),
  category: text("category").notNull(), // subsidy, loan, insurance, training
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(farmerProfiles, {
    fields: [users.id],
    references: [farmerProfiles.userId],
  }),
  diseaseDetections: many(diseaseDetections),
  chatMessages: many(chatMessages),
  cropRecommendations: many(cropRecommendations),
}));

export const farmerProfilesRelations = relations(farmerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [farmerProfiles.userId],
    references: [users.id],
  }),
}));

export const diseaseDetectionsRelations = relations(diseaseDetections, ({ one }) => ({
  user: one(users, {
    fields: [diseaseDetections.userId],
    references: [users.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

export const cropRecommendationsRelations = relations(cropRecommendations, ({ one }) => ({
  user: one(users, {
    fields: [cropRecommendations.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFarmerProfileSchema = createInsertSchema(farmerProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertDiseaseDetectionSchema = createInsertSchema(diseaseDetections).omit({
  id: true,
  createdAt: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertCropRecommendationSchema = createInsertSchema(cropRecommendations).omit({
  id: true,
  createdAt: true,
});

export const insertGovernmentSchemeSchema = createInsertSchema(governmentSchemes).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFarmerProfile = z.infer<typeof insertFarmerProfileSchema>;
export type FarmerProfile = typeof farmerProfiles.$inferSelect;

export type InsertDiseaseDetection = z.infer<typeof insertDiseaseDetectionSchema>;
export type DiseaseDetection = typeof diseaseDetections.$inferSelect;

export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertCropRecommendation = z.infer<typeof insertCropRecommendationSchema>;
export type CropRecommendation = typeof cropRecommendations.$inferSelect;

export type InsertGovernmentScheme = z.infer<typeof insertGovernmentSchemeSchema>;
export type GovernmentScheme = typeof governmentSchemes.$inferSelect;

// Extended registration schema with profile data
export const registrationSchema = insertUserSchema.extend({
  fullName: z.string().min(2, "Full name is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  village: z.string().optional(),
  phoneNumber: z.string().optional(),
  farmSize: z.string().optional(),
  soilType: z.string().optional(),
  primaryCrop: z.string().optional(),
  preferredLanguage: z.string().default("en"),
});

export type RegistrationData = z.infer<typeof registrationSchema>;
